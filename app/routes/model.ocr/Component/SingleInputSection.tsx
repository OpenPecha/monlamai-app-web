import {
  Button,
  Card,
  FileInput,
  Label,
  Spinner,
  ToggleSwitch,
} from "flowbite-react";
import { useState } from "react";
import { resetFetcher } from "~/component/utils/resetFetcher";
import { useFetcher, useLoaderData } from "@remix-run/react";
import axios from "axios";
import { EditActionButtons } from "~/routes/model.mt/components/UtilityComponent";
import EditDisplay from "~/component/EditDisplay";
import CardComponent from "~/component/Card";
import { NonEditButtons } from "~/component/ActionButtons";
import { ImageCropper } from "~/routes/model.ocr/Component/ImageCropper";
import Devider from "~/component/Devider";
import uselitteraTranlation from "~/component/hooks/useLitteraTranslation";
import { ErrorMessage } from "~/component/ErrorMessage";
import { ErrorBoundary } from "~/component/ErrorPages";
import applyReplacements from "../utils/replacements";

function SingleInptSection({ fetcher }: any) {
  const [ImageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [edit, setEdit] = useState(false);
  const [editText, setEditText] = useState("");
  const [isOrginalText, setOrginalText] = useState(false);
  const { isTibetan } = uselitteraTranlation();

  const likeFetcher = useFetcher();
  const editfetcher = useFetcher();

  const editData = editfetcher.data?.edited;
  const data = fetcher?.data;
  // Replace non-Tibetan characters with an empty string
  const tibetanRegex = /[\u0F00-\u0FFF]/;
  let text = data?.text;

  if (!tibetanRegex.test(data?.text)) {
    text = "";
  }

  const inferenceId = fetcher.data?.inferenceId;
  const isActionSubmission = fetcher.state !== "idle";
  const errorMessage = data?.error_message;

  const handleFormClear = () => {
    setImageUrl(null);
    handleCancelEdit();
    resetFetcher(fetcher);
    resetFetcher(editfetcher);
  };
  const handleSubmit = () => {
    fetcher.submit(
      { imageUrl: ImageUrl },
      {
        method: "POST",
        action: "/api/ocr",
      }
    );
  };
  const uploadFile = async (file: File) => {
    try {
      let formData = new FormData();
      let uniqueFilename = Date.now() + "-" + file.name;
      formData.append("filename", uniqueFilename);
      formData.append("filetype", file.type);
      formData.append("bucket", "/OCR/input");

      const response = await axios.post("/api/get_presigned_url", formData);
      const { url } = response.data;
      // Use Axios to upload the file to S3
      const uploadStatus = await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent?.total
          );
          console.log(percentCompleted);
          setUploadProgress(percentCompleted);
        },
      });

      if (uploadStatus.status === 200) {
        const uploadedFilePath = uploadStatus.request.responseURL;
        const baseUrl = uploadedFilePath?.split("?")[0]!;
        setImageUrl(baseUrl!);
        console.log(`File ${file.name} uploaded successfully.`, uploadStatus);
      }
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
    }
  };

  function handleCancelEdit() {
    setEdit(false);
    setEditText("");
  }

  function handleEditSubmit() {
    let edited = editText;
    editfetcher.submit(
      {
        inferenceId,
        edited,
      },
      {
        method: "PATCH",
      }
    );
    setEdit(false);
  }

  function handleCopy() {
    let textToCopy = editData ?? text;
    navigator.clipboard.writeText(textToCopy);
  }

  const changeOrginalText = () => {
    setOrginalText(!isOrginalText);
  };

  const formatText = (text) => {
    // Replace multiple consecutive new lines with a single <br> tag
    // and replace single new lines with <br> tags
    text = text.replace(/\n+/g, "<br>");
    return text;
  };

  return (
    <div className="flex flex-col lg:flex-row overflow-hidden max-w-[100vw]">
      <CardComponent
        className={`${isTibetan ? "font-monlam" : "font-poppins"}`}
      >
        <div className="w-full relative h-full min-h-[30vh] md:min-h-[45vh] flex flex-col items-center justify-center  gap-5">
          <div className="w-full h-full flex flex-col flex-1">
            {ImageUrl && (
              <img src={ImageUrl} onLoad={handleSubmit} className="hidden" />
            )}
            <ImageCropper
              uploadFile={uploadFile}
              handleReset={handleFormClear}
              uploadProgress={uploadProgress}
              scaning={!!ImageUrl && fetcher?.state !== "idle"}
            />
          </div>
        </div>
      </CardComponent>
      <Devider />
      <CardComponent>
        <div
          className={`w-full flex flex-1 flex-col gap-1 min-h-[150px] md:min-h-[15vh] lg:max-h-full p-3 text-black bg-neutral dark:bg-[--card-bg] dark:text-neutral overflow-auto ${
            ImageUrl ? "block" : "hidden"
          }`}
        >
          {isActionSubmission ? (
            <div className="w-full flex flex-1 justify-center items-center">
              <Spinner
                size="lg"
                className={"fill-secondary-300 dark:fill-primary-500"}
              />
            </div>
          ) : (
            <>
              {!edit && text && (
                <ToggleSwitch
                  checked={isOrginalText}
                  label="Orginal lines"
                  onChange={changeOrginalText}
                />
              )}
              <div className="text-lg tracking-wide leading-loose">
                {errorMessage && (
                  <ErrorMessage
                    message={errorMessage}
                    handleClose={handleFormClear}
                    type="info"
                  />
                )}
                {!edit && text && !editData && (
                  <div
                    className="text-xl font-monlam leading-[normal] max-h-[50vh]"
                    dangerouslySetInnerHTML={{
                      __html:
                        // text?.replaceAll("\n", "<br>"),
                        isOrginalText
                          ? formatText(text)
                          : formatText(applyReplacements(text)),
                    }}
                  />
                )}
                {!errorMessage && !text && inferenceId && (
                  <div className="text-red-500">
                    Provide image with tibetan text
                  </div>
                )}
              </div>
              {edit && (
                <EditDisplay
                  targetLang="bo"
                  editText={editText}
                  setEditText={setEditText}
                />
              )}
              {!edit && editData && (
                <p className="text-xl font-monlam">{editData}</p>
              )}
            </>
          )}
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
        {!edit && inferenceId && (
          <NonEditButtons
            selectedTool="text"
            likefetcher={likeFetcher}
            sourceText={ImageUrl || ""}
            inferenceId={inferenceId}
            setEdit={setEdit}
            text={editData ?? text}
            handleCopy={handleCopy}
            setEditText={setEditText}
            sourceLang="en"
          />
        )}
      </CardComponent>
    </div>
  );
}

export default SingleInptSection;

export { ErrorBoundary };
