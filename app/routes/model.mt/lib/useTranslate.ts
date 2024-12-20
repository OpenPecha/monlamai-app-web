import { useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { useCallback, useState } from "react";
import {
  en_bo_english_replaces,
  en_bo_tibetan_replaces,
} from "~/component/utils/replace";
import { resetFetcher } from "~/component/utils/resetFetcher";
import { toast } from "react-toastify";
import { API_ERROR_MESSAGE } from "~/helper/const";

type useTranslateType = {
  target_lang: string;
  source_lang: string;
  text: string;
  data: string;
  setData: (data: string) => void;
  editfetcher: any;
  model:string;
};

function handleEventStream(
  setInferenceId,
  text: string,
  direction: string,
  onData: (data: string) => void,
  isToasted: boolean,
  setIsToasted: (value: boolean) => void,
  model:string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(
      `/api/translation/stream?text=${encodeURIComponent(
        text
      )}&target=${encodeURIComponent(direction)}&model=${model}`
    );

    eventSource.onmessage = (event) => {
      let data = JSON.parse(event.data);
      if (data?.generated_text) {
        let text = data?.generated_text;
        if(data?.id) setInferenceId(data?.id)

        let replaced_text = text
        if(model!=='MONLAM-MELONG'){
         replaced_text= en_bo_tibetan_replaces(text);
        }
        onData(replaced_text);
        eventSource.close();
        resolve("done"); // Resolve the promise when data is received
      } else {
        let content = cleanData(data.text);
        if (content) {
          onData((p) => {
            let newChunk = p + content?.replace("</s>", "");
            let replaced_text =newChunk;
            if(model!=='MONLAM-MELONG'){
            replaced_text=  en_bo_tibetan_replaces(newChunk);
            }
            return replaced_text;
          });
        }
      }
    };

    eventSource.onerror = (event) => {
      eventSource.close();
      if (!isToasted) {
        toast(API_ERROR_MESSAGE, {
          position: toast.POSITION.BOTTOM_CENTER,
          closeOnClick: true,
          onClose: () => setIsToasted(false),
        });
        setIsToasted(true);
      }
      resolve("done");
    };
  });
}

function cleanData(content) {
  if (!content) return content;

  // Check and remove quotes from the first, second, last, or second-last positions
  if (
    (content[0] === '"' || content[0] === "'") &&
    (content[1] === '"' || content[1] === "'")
  ) {
    content = content.slice(2);
  } else if (content[0] === '"' || content[0] === "'") {
    content = content.slice(1);
  }

  if (
    (content[content.length - 1] === '"' ||
      content[content.length - 1] === "'") &&
    (content[content.length - 2] === '"' || content[content.length - 2] === "'")
  ) {
    content = content.slice(0, -2);
  } else if (
    content[content.length - 1] === '"' ||
    content[content.length - 1] === "'"
  ) {
    content = content.slice(0, -1);
  }

  return content;
}

const useTranslate = ({
  inferenceId,
  setInferenceId,
  source_lang,
  target_lang,
  text,
  data,
  setData,
  savefetcher,
  editfetcher,
  model
}: useTranslateType) => {
  const [responseTime, setResponseTime] = useState(0);
  const [done, setDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isToasted, setIsToasted] = useState(false);

  const trigger = async () => {
    setResponseTime(0);
    if (!text || !text.trim()) {
      // Avoid fetching if text is empty or not provided
      setData("");
      setError("Please enter some text for translation.");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setDone(false);
      setError(null);
      setData("");

      let input =text;
      if(model!=='MONLAM-MELONG'){
        input = en_bo_english_replaces(text);
      }

      const startTime = performance.now(); // Record start time
      try {
        await handleEventStream(
          setInferenceId,
          input,
          target_lang,
          setData,
          isToasted,
          setIsToasted,
          model
        );
      } catch (error) {
        setError(error.message);
      } finally {
        const endTime = performance.now(); // Record end time
        setResponseTime(endTime - startTime); // Calculate response time
        setIsLoading(false);
        resetFetcher(editfetcher);
        setDone(true);
      }
    };

    await fetchData();
  };

  return { data, isLoading, error, done, trigger, responseTime };
};

export default useTranslate;
