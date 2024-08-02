import { Button } from "flowbite-react";
import { useState } from "react";
import { resetFetcher } from "~/component/utils/resetFetcher";
import TooltipComponent from "./Tooltip";
import CardComponent from "~/component/Card";
import { CancelButton } from "~/component/Buttons";
import { RxCross2 } from "react-icons/rx";
import { IoSend } from "react-icons/io5";
import FileUpload from "./FileUpload";
import { ErrorMessage } from "../../../component/ErrorMessage";
import { InferenceList } from "~/component/InferenceList";
import uselitteraTranlation from "~/component/hooks/useLitteraTranslation";
import Devider from "~/component/Devider";
import { ErrorBoundary } from "~/component/ErrorPages";

type props = {
  fetcher: any;
};

export default function FileInputSection({ fetcher }: props) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [filePath, setFilePath] = useState<string | null>();

  function handleClear() {
    resetFetcher(fetcher);
    setFile(null);
    setFilePath(null);
    setFileName("");
  }

  function handleStartJob() {
    let type = file?.type;
    if (type === "application/pdf") {
      let formData = new FormData();
      formData.append("pdf_file", filePath!);
      formData.append("file_name", fileName);
      fetcher.submit(formData, {
        method: "POST",
        action: "/api/ocr",
      });
    } else if (type === "application/x-zip-compressed") {
      fetcher.submit(
        { zip_input_url: filePath! },
        {
          method: "POST",
          action: "/api/ocr",
        }
      );
    } else {
      alert("Unsupported file type");
    }
  }
  let { translation, isTibetan } = uselitteraTranlation();

  let alldone = !!filePath;
  return (
    <div className="flex flex-col lg:flex-row overflow-hidden max-w-[100vw] ">
      <CardComponent
        className={`${isTibetan ? "font-monlam" : "font-poppins"}`}
      >
        <div className="w-full relative h-full  min-h-[30vh] md:min-h-[45vh] flex flex-col items-center  justify-center  gap-5">
          {/* <TooltipComponent /> */}
          <FileUpload
            file={file}
            setFile={setFile}
            inputUrl={filePath}
            setInputUrl={setFilePath}
            supported={[".pdf", ".zip", ".gz"]}
            setFilename={setFileName}
          />
          <CancelButton
            type="button"
            color="gray"
            onClick={handleClear}
            hidden={!file}
          >
            <RxCross2 size={20} />
          </CancelButton>
        </div>
        {file && (
          <div className="flex justify-end py-2 px-1 border-t border-t-dark_text-secondary dark:border-t-light_text-secondary">
            <Button
              type="button"
              size="xs"
              onClick={handleStartJob}
              disabled={!alldone}
              className="
              bg-secondary-500 dark:bg-primary-500 hover:bg-secondary-400 dark:hover:bg-primary-400 
              text-white dark:text-black 
              enabled:hover:bg-secondary-400 enabled:dark:hover:bg-primary-400
            "
            >
              <span className="pr-2">{translation?.scan}</span>
              <IoSend size={18} />
            </Button>
          </div>
        )}
      </CardComponent>
      <Devider />
      <CardComponent>
        <div className="w-full flex flex-1 max-h-[45vh] p-3 text-black bg-neutral dark:bg-[--card-bg] dark:text-neutral overflow-auto">
          {fetcher.data?.error && (
            <ErrorMessage
              message={fetcher.data?.error}
              handleClose={handleClear}
              type="warning"
            />
          )}
          <InferenceList />
        </div>
      </CardComponent>
    </div>
  );
}

export { ErrorBoundary };
