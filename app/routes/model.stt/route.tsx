import { Button, Card, Label, Spinner } from "flowbite-react";
import { BsFillStopFill, BsFillMicFill } from "react-icons/bs";
import { useState, useRef, useCallback, useEffect } from "react";
import { type LoaderFunction, ActionFunction, json } from "@remix-run/node";
import { MetaFunction, useFetcher } from "@remix-run/react";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { getBrowser } from "~/component/utils/getBrowserDetail";
import ErrorMessage from "~/component/ErrorMessage";
import ToolWraper from "~/component/ToolWraper";
import CardComponent from "~/component/Card";
import InferenceWrapper from "~/component/layout/InferenceWrapper";
import {
  CharacterOrFileSizeComponent,
  EditActionButtons,
  LoadingAnimation,
  OutputDisplay,
} from "../model.mt/components/UtilityComponent";
import { ErrorBoundary } from "../model.mt/route";
import { NonEditModeActions } from "~/component/ActionButtons";
import { saveInference, updateEdit } from "~/modal/inference.server";
import EditDisplay from "~/component/EditDisplay";
import { resetFetcher } from "~/component/utils/resetFetcher";
import { RxCross2 } from "react-icons/rx";
import { CancelButton, SubmitButton } from "~/component/Buttons";
import { formatBytes } from "~/component/utils/formatSize";
import { API_ERROR_MESSAGE, MAX_SIZE_SUPPORT_AUDIO } from "~/helper/const";
import { HandleAudioFile } from "./components/FileUpload";
import uselitteraTranlation from "~/component/hooks/useLitteraTranslation";
import { auth } from "~/services/auth.server";

export const meta: MetaFunction<typeof loader> = ({ matches }) => {
  const parentMeta = matches.flatMap((match) => match.meta ?? []);
  parentMeta.shift(1);

  return [{ title: "Monlam | སྒྲ་འཛིན་རིག་ནུས།" }, ...parentMeta];
};

export async function loader({ request }: LoaderFunctionArgs) {
  let userdata = await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return { user: userdata };
}

export const action: ActionFunction = async ({ request }) => {
  let formdata = await request.formData();
  let edited = formdata.get("edited") as string;
  let inferenceId = formdata.get("inferenceId") as string;
  let updated = await updateEdit(inferenceId, edited);

  return updated;
};

export default function Index() {
  const fetcher = useFetcher();
  const [audioChunks, setAudioChunks] = useState([]);
  const [selectedTool, setSelectedTool] = useState<"Recording" | "File">(
    "Recording"
  );
  const [audio, setAudio] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  let mediaRecorder: any = useRef();
  const [audioBase64, setBase64] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editText, setEditText] = useState("");

  let likefetcher = useFetcher();
  const editfetcher = useFetcher();

  let editData = editfetcher.data?.edited;
  let liked = likefetcher.data?.liked;
  function handleCopy() {
    let textToCopy = text;
    navigator.clipboard.writeText(textToCopy);
  }

  useEffect(() => {
    setAudioURL(null);
  }, [selectedTool]);
  const handleSubmit = async () => {
    const form = new FormData();
    const reader = new FileReader();
    reader.readAsDataURL(audio as Blob);
    reader.addEventListener(
      "loadend",
      () => {
        if (typeof reader.result === "string") {
          form.append("audio", reader.result);
          fetcher.submit(form, { method: "POST", action: "/api/stt" });
        }
      },
      { once: true }
    );
    resetFetcher(editfetcher);
  };
  const isLoading = fetcher.state !== "idle";

  const handleReset = () => {
    // reset the audio element and the transcript
    setAudio(null);
    setAudioURL(null);
    setEdit(false);
    resetFetcher(editfetcher);
    resetFetcher(fetcher);
  };

  const toggleRecording = () => {
    if (!recording) {
      startRecording();
    } else {
      stopRecording();
    }
  };
  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        return streamData;
      } catch (err) {
        alert(err.message);
        return false;
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = async () => {
    let stream = await getMicrophonePermission();
    if (stream) {
      try {
        let localAudioChunks: [] = [];
        setAudio(null);
        setRecording(true);
        let browserName = getBrowser();
        const media = new MediaRecorder(stream, {
          mimeType: browserName !== "Safari" ? "audio/webm" : "audio/mp4",
        });
        mediaRecorder.current = media;
        mediaRecorder.current.start();
        mediaRecorder.current.ondataavailable = (event: any) => {
          if (typeof event.data === "undefined") return;
          if (event.data.size === 0) return;
          localAudioChunks.push(event?.data);
        };
        setAudioChunks(localAudioChunks);
      } catch (error) {
        console.error("Error accessing the microphone:", error);
      }
    }
  };

  const stopRecording = () => {
    setRecording(false);
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks);
      setAudio(audioBlob);
      setAudioURL(window.URL.createObjectURL(audioBlob));
      setAudioChunks([]);

      const reader = new FileReader();

      // Define a callback function to handle the result
      reader.onload = function () {
        const base64String = reader.result;
        setBase64(base64String);
      };

      // Read the Blob as a data URL (Base64)
      reader.readAsDataURL(audioBlob);
    };
  };

  const handleFileChange = (file) => {
    if (file) {
      setAudio(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setAudioURL(reader.result);
      };
      reader.onerror = (error) => {
        console.error("Error: ", error);
      };
    }
  };
  let { translation } = uselitteraTranlation();
  let isDisabled = !audioURL;
  let text = fetcher.data?.text;
  let inferenceId = fetcher.data?.inferenceId;
  let RecordingSelected = selectedTool === "Recording";

  function handleEditSubmit() {
    let edited = editText;
    editfetcher.submit(
      {
        inferenceId,
        edited,
      },
      {
        method: "POST",
      }
    );
    setEdit(false);
  }
  let newText = editfetcher.data?.edited;

  function handleCancelEdit() {
    setEdit(false);
    setEditText("");
  }

  const errorMessage = fetcher.data?.error_message;
  const actionError = fetcher.data?.error ?? errorMessage;
  return (
    <ToolWraper title="STT">
      <InferenceWrapper
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        options={["Recording", "File"]}
      >
        {actionError && <ErrorMessage error={actionError} />}

        <CardComponent>
          <div className="flex flex-col relative gap-2 flex-1 min-h-[30vh]">
            {selectedTool === "Recording" && (
              <div className="flex flex-col items-center gap-5 flex-1 justify-center md:min-h-[30vh]">
                {recording &&
                  mediaRecorder.current &&
                  getBrowser() !== "Safari" && (
                    <LiveAudioVisualizer
                      mediaRecorder={mediaRecorder.current}
                      width={200}
                      height={75}
                    />
                  )}
                {!audioURL && (
                  <Button size="md" color="gray" onClick={toggleRecording}>
                    {recording ? <BsFillStopFill /> : <BsFillMicFill />}
                  </Button>
                )}
                {audioURL && (
                  <audio controls className="mt-4 md:mt-0">
                    <source src={audioURL} type="audio/mpeg"></source>
                    <source src={audioURL} type="audio/ogg"></source>
                  </audio>
                )}
              </div>
            )}
            {selectedTool === "File" && (
              <HandleAudioFile
                handleFileChange={handleFileChange}
                reset={handleReset}
              />
            )}
            {selectedTool === "Recording" && (
              <CancelButton onClick={handleReset} hidden={!audioURL}>
                <RxCross2 size={20} />
              </CancelButton>
            )}

            <div className="flex justify-between">
              <CharacterOrFileSizeComponent
                selectedTool={selectedTool}
                charCount={0}
                CHAR_LIMIT={undefined}
                MAX_SIZE_SUPPORT={MAX_SIZE_SUPPORT_AUDIO}
              />
              <SubmitButton
                onClick={handleSubmit}
                disabled={isDisabled}
                outline
                isProcessing={fetcher.state !== "idle"}
                size="xs"
              >
                {translation.submit}
              </SubmitButton>
            </div>
          </div>
        </CardComponent>
        <CardComponent>
          <div className="w-full flex-1 min-h-[30vh] lp-3 text-black  dark:text-gray-200 dark:bg-slate-700 rounded-lg overflow-auto">
            {RecordingSelected && isLoading && <LoadingAnimation />}
            {edit && (
              <EditDisplay editText={editText} setEditText={setEditText} />
            )}
            {!isLoading && (
              <OutputDisplay
                edit={edit}
                editData={editData}
                output={text}
                animate={false}
              />
            )}
          </div>
          {edit && (
            <EditActionButtons
              handleCancelEdit={handleCancelEdit}
              handleEditSubmit={handleEditSubmit}
              editfetcher={editfetcher}
              editText={editText}
              translated={text}
            />
          )}
          {!edit && (
            <NonEditModeActions
              sourceLang=""
              selectedTool={selectedTool}
              likefetcher={likefetcher}
              sourceText={audioBase64 || ""}
              inferenceId={inferenceId}
              setEdit={setEdit}
              text={newText ?? text}
              handleCopy={handleCopy}
              setEditText={setEditText}
            />
          )}
        </CardComponent>
      </InferenceWrapper>
    </ToolWraper>
  );
}

export { ErrorBoundary };
