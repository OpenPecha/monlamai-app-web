import { useState, useEffect } from "react";
import { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  MetaFunction,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { ErrorMessage } from "~/component/ErrorMessage";
import ToolWraper from "~/component/ToolWraper";
import CardComponent from "~/component/Card";
import InferenceWrapper from "~/component/layout/InferenceWrapper";
import {
  CharacterOrFileSizeComponent,
  EditActionButtons,
  LoadingAnimation,
  OutputDisplay,
} from "../model.mt/components/UtilityComponent";
import { NonEditButtons, NonEditModeActions } from "~/component/ActionButtons";
import { getUserFileInferences, updateEdit } from "~/modal/inference.server";
import EditDisplay from "~/component/EditDisplay";
import { resetFetcher } from "~/component/utils/resetFetcher";
import { RxCross2 } from "react-icons/rx";
import { CancelButton } from "~/component/Buttons";
import { MAX_SIZE_SUPPORT_AUDIO } from "~/helper/const";
import { HandleAudioFile } from "./components/FileUpload";
import { auth } from "~/services/auth.server";
import { getUserSession } from "~/services/session.server";
import AudioRecorder from "./components/AudioRecorder";
import axios from "axios";
import { getUser } from "~/modal/user.server";
import { InferenceList } from "~/component/InferenceList";
import HeaderComponent from "~/component/HeaderComponent";
import { Spinner, Progress } from "flowbite-react";
import Devider from "~/component/Devider";
import { ErrorBoundary } from "~/component/ErrorPages";
import uselitteraTranlation from "~/component/hooks/useLitteraTranslation";
import { shouldFetchInferenceList } from "../model.mt/route";

export const meta: MetaFunction<typeof loader> = ({ matches }) => {
  const parentMeta = matches.flatMap((match) => match.meta ?? []);
  parentMeta.shift(1);

  return [{ title: "Monlam | སྒྲ་འཛིན་རིག་ནུས།" }, ...parentMeta];
};

export async function loader({ request }: LoaderFunctionArgs) {
  let userdata = await getUserSession(request);
  let user = null;
  if (userdata) {
    user = await getUser(userdata?._json.email);
  }
  let model = "stt";
  let inferences = await shouldFetchInferenceList({
    request,
    user,
    model,
  });
  return { user, fileUploadUrl: process.env?.FILE_SUBMIT_URL, inferences };
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
  const [params, setParams] = useSearchParams();

  const selectedTool = params.get("tool") || "recording";
  const setSelectedTool = (tool: string) => {
    setParams((p) => {
      p.set("tool", tool);
      return p;
    });
  };

  const [uploadProgress, setUploadProgress] = useState(0);

  const [audio, setAudio] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [editText, setEditText] = useState("");
  const { isTibetan, translation } = uselitteraTranlation();

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
    if (!audioURL || audioURL === "") return;
    const form = new FormData();
    form.append("audioURL", audioURL);
    form.append("isFile", selectedTool === "file" ? "file" : "audio");
    fetcher.submit(form, { method: "POST", action: "/api/stt" });
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

  useEffect(() => {
    if (audioURL && audioURL !== "") {
      handleSubmit();
    }
  }, [audioURL]);

  const handleFileChange = (file) => {
    if (file) {
      setAudio(file);
      uploadFile(file);
    }
  };
  let text = fetcher.data?.text;
  let inferenceId = fetcher.data?.inferenceId;
  let RecordingSelected = selectedTool === "recording";
  let fileSelected = selectedTool === "file";

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
  useEffect(() => {
    if (fetcher.data) {
      resetFetcher(fetcher);
      resetFetcher(editfetcher);
    }
  }, [selectedTool]);
  const errorMessage = fetcher.data?.error_message;
  const actionError = fetcher.data?.error ?? errorMessage;

  const uploadFile = async (file: File) => {
    try {
      let formData = new FormData();
      let filename = file?.name ? file?.name : "recording";

      let uniqueFilename = Date.now() + "-" + filename + ".mp3";
      formData.append("filename", uniqueFilename);
      formData.append("filetype", file.type);
      formData.append("bucket", "/STT/input");

      const response = await axios.post("/api/get_presigned_url", formData);
      const { url } = response.data;
      // Use Axios to upload the file to S3
      const uploadStatus = await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      if (uploadStatus.status === 200) {
        const uploadedFilePath = uploadStatus.request.responseURL;
        const baseUrl = uploadedFilePath?.split("?")[0]!;
        setAudioURL(baseUrl!);
      }
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
    }
  };
  let isUploading = uploadProgress > 0 && uploadProgress < 99;
  const handleClose = () => {
    resetFetcher(fetcher);
    resetFetcher(editfetcher);
  };
  return (
    <ToolWraper title="STT">
      <InferenceWrapper
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        options={["recording", "file"]}
        reset={handleReset}
      >
        {actionError && (
          <ErrorMessage
            message={actionError}
            handleClose={handleClose}
            type="warning"
          />
        )}

        <div className=" rounded-[10px]  overflow-hidden border dark:border-[--card-border] border-dark_text-secondary">
          <HeaderComponent model="STT" selectedTool={selectedTool} />
          <div className="flex flex-col  lg:flex-row">
            <CardComponent
              focussed={true}
              className="flex-1  border-b lg:border-b-0 dark:border-[--card-border] border-dark_text-secondary"
            >
              <div className="flex w-full flex-1 flex-col justify-center relative min-h-[150px] lg:min-h-[45vh]">
                {isUploading && (
                  <div className="px-3">
                    <Progress
                      progress={uploadProgress}
                      progressLabelPosition="inside"
                      className={isTibetan ? "font-monlam" : "font-poppins"}
                      textLabel={translation?.uploading_audio_message}
                      textLabelPosition="outside"
                      size="lg"
                      labelProgress
                      labelText
                    />
                  </div>
                )}
                {RecordingSelected && (
                  <AudioRecorder
                    audioURL={audioURL}
                    uploadAudio={uploadFile}
                    isLoading={isLoading}
                    isUploading={isUploading}
                  />
                )}

                {fileSelected && (
                  <HandleAudioFile
                    handleFileChange={handleFileChange}
                    reset={handleReset}
                  />
                )}

                {RecordingSelected && (
                  <CancelButton onClick={handleReset} hidden={!audioURL}>
                    <RxCross2 size={20} />
                  </CancelButton>
                )}
                {!isUploading && (
                  <div className="flex justify-between">
                    <CharacterOrFileSizeComponent
                      selectedTool={selectedTool}
                      charCount={"2 min "}
                      CHAR_LIMIT={undefined}
                      MAX_SIZE_SUPPORT={MAX_SIZE_SUPPORT_AUDIO}
                    />
                  </div>
                )}
              </div>
            </CardComponent>
            <Devider />
            <CardComponent>
              <div className="w-full flex flex-1 min-h-[150px] lg:min-h-[30vh] text-black dark:text-gray-200 rounded-lg overflow-auto">
                {RecordingSelected && isLoading && (
                  <div className="flex flex-1 justify-center items-center">
                    <Spinner
                      size="xl"
                      className={"fill-secondary-500 dark:fill-primary-500"}
                    />
                  </div>
                )}
                {edit && (
                  <EditDisplay
                    editText={editText}
                    setEditText={setEditText}
                    targetLang="bo"
                  />
                )}
                {RecordingSelected && !isLoading && (
                  <OutputDisplay
                    edit={edit}
                    editData={editData}
                    output={text}
                    animate={false}
                    targetLang="bo"
                  />
                )}
                {fileSelected && <InferenceList />}
              </div>
              {edit && (
                <EditActionButtons
                  handleCancelEdit={handleCancelEdit}
                  handleEditSubmit={handleEditSubmit}
                  editfetcher={editfetcher}
                  editText={editText}
                  outputText={text}
                />
              )}
              {!edit && inferenceId && audioURL && (
                <NonEditButtons
                  selectedTool={selectedTool}
                  likefetcher={likefetcher}
                  sourceText={audioURL}
                  inferenceId={inferenceId}
                  setEdit={setEdit}
                  text={newText ?? text}
                  handleCopy={handleCopy}
                  setEditText={setEditText}
                  sourceLang="bo"
                />
              )}
            </CardComponent>
          </div>
        </div>
      </InferenceWrapper>
    </ToolWraper>
  );
}

export { ErrorBoundary };
