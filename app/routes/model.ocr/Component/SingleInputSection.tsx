import { Button, Card, FileInput, Label, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { resetFetcher } from "~/component/utils/resetFetcher";
import { useFetcher, useLoaderData } from "@remix-run/react";
import axios from "axios";
import { EditActionButtons } from "~/routes/model.mt/components/UtilityComponent";
import EditDisplay from "~/component/EditDisplay";
import CardComponent from "~/component/Card";
import { NonEditButtons } from "~/component/ActionButtons";
import TooltipComponent from "./Tooltip";
import { ImageCropper } from "~/routes/model.ocr/Component/ImageCropper";
import Devider from "~/component/Devider";
import uselitteraTranlation from "~/component/hooks/useLitteraTranslation";

function SingleInptSection({ fetcher }: any) {
  const [ImageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [edit, setEdit] = useState(false);
  const [editText, setEditText] = useState("");
  const { isTibetan } = uselitteraTranlation();

  const likeFetcher = useFetcher();
  const editfetcher = useFetcher();

  const editData = editfetcher.data?.edited;
  const data = fetcher?.data;
  // Replace non-Tibetan characters with an empty string
  const nonTibetanRegex = /[^\u0F00-\u0FFF\s]/g;
  const text = data?.text?.replace(nonTibetanRegex, "");
  const inferenceId = fetcher.data?.inferenceId;
  const isActionSubmission = fetcher.state !== "idle";
  const errorMessage = data?.error_message;

  const handleFormClear = () => {
    setImageUrl(null);
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

  return (
    <div className="flex flex-col lg:flex-row overflow-hidden max-w-[100vw] ">
      <CardComponent
        className={`${isTibetan ? "font-monlam" : "font-poppins"}`}
      >
        <div className="w-full relative h-full  min-h-[30vh] md:min-h-[45vh] flex flex-col items-center  justify-center  gap-5">
          {/* <TooltipComponent /> */}
          <div className="w-full h-full flex flex-col">
            {ImageUrl && (
              <img src={ImageUrl} onLoad={handleSubmit} className="hidden" />
            )}
            <ImageCropper
              uploadFile={uploadFile}
              handleReset={handleFormClear}
              uploadProgress={uploadProgress}
            />
          </div>
        </div>
      </CardComponent>
      <Devider />
      <CardComponent>
        <div className="w-full  flex flex-1  p-3 text-black bg-neutral dark:bg-secondary-700 dark:text-neutral  overflow-auto">
          {isActionSubmission ? (
            <div className="w-full flex justify-center items-center">
              <Spinner
                size="lg"
                className={"fill-secondary-300 dark:fill-primary-500"}
              />
            </div>
          ) : (
            <>
              <div className="text-lg tracking-wide leading-loose">
                {errorMessage && (
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                  >
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{errorMessage}</span>
                  </div>
                )}
                {!edit && text && !editData && (
                  <div
                    className="text-xl font-monlam leading-[normal] max-h-[50vh]"
                    dangerouslySetInnerHTML={{
                      __html: text?.replaceAll("\n", "<br>"),
                    }}
                  />
                )}
                {text === "" && (
                  <div className="text-red-500">
                    {" "}
                    provide image with tibetan text
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
