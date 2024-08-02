import { ActionFunction, json } from "@remix-run/node";
import { API_ERROR_MESSAGE } from "~/helper/const";
import { saveInference } from "~/modal/inference.server";
import { getUserDetail } from "~/services/session.server";
import getIpAddressByRequest from "~/component/utils/getIpAddress";

export const action: ActionFunction = async ({ request }) => {
  let ip = getIpAddressByRequest(request);

  let user = await getUserDetail(request);
  const formData = await request.formData();
  const API_URL = process.env.FILE_SUBMIT_URL as string;

  let audioURL = formData.get("audioURL") as string;
  let selectedTool = formData.get("isFile") as string;
  let data;
  if (selectedTool === "audio") {
    try {
      let formData = new FormData();
      formData.append("audioURL", audioURL);
      let response = await fetch(API_URL + "/stt/playground", {
        method: "POST",
        body: formData,
        headers: {
          "x-api-key": process.env?.API_ACCESS_KEY!,
        },
      });
      data = await response.json();
    } catch (e) {
      return {
        error: API_ERROR_MESSAGE,
      };
    }
    const { output, responseTime } = data;

    if (output) {
      const { text } = output;
      // save inference to db
      const inferenceData = await saveInference({
        userId: user?.id,
        model: "stt",
        modelVersion: "wav2vec2_run10",
        input: audioURL,
        output: text,
        responseTime,
        jobId: data?.id,
        ip,
      });

      return json({ text, inferenceId: inferenceData?.id });
    } else {
      return json({ error_message: "Failed to send the audio to the server" });
    }
  }
  if (selectedTool === "file") {
    const inferenceData = await saveInference({
      userId: user?.id,
      model: "stt",
      modelVersion: "wav2vec2_run10",
      type: "file",
      input: audioURL,
      output: "",
      responseTime: null,
      jobId: null,
      ip,
    });
    try {
      let formData = new FormData();
      formData.append("link", audioURL);
      formData.append("inference_id", inferenceData?.id);
      let response = await fetch(API_URL + "/stt/synthesis", {
        method: "POST",
        body: formData,
        headers: {
          "x-api-key": process.env?.API_ACCESS_KEY!,
        },
      });
      data = await response.json();
    } catch (e) {
      return {
        error: API_ERROR_MESSAGE,
      };
    }

    // save inference to db

    return json({ text: "", inferenceId: inferenceData?.id });
  }
};
