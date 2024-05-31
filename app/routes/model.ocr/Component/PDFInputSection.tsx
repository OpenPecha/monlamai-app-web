import { Button } from "flowbite-react";
import { useState } from "react";
import { resetFetcher } from "~/component/utils/resetFetcher";
import TooltipComponent from "./Tooltip";
import { useLoaderData } from "@remix-run/react";
import CardComponent from "~/component/Card";
import { CancelButton } from "~/component/Buttons";
import { RxCross2 } from "react-icons/rx";
import { IoSend } from "react-icons/io5";
import FileUpload from "./FileUpload";
import ErrorMessage from "../../../component/ErrorMessage";
import { InferenceList } from "~/component/InferenceList";
import uselitteraTranlation from "~/component/hooks/useLitteraTranslation";

type props = {
  fetcher: any;
};

export default function PDFInputSection({ fetcher }: props) {
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
  let { translation } = uselitteraTranlation();

  let alldone = !!filePath;
  return (
    <div className="flex flex-col lg:flex-row overflow-hidden max-w-[100vw] ">
      <CardComponent>
        <div className="w-full relative min-h-[45vh] flex flex-col items-center justify-center gap-5">
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
            >
              <span className="pr-2">{translation?.scan}</span>
              <IoSend size={18} />
            </Button>
          </div>
        )}
      </CardComponent>
      <CardComponent>
        <div className="w-full h-[50vh] p-3 text-black bg-neutral dark:bg-secondary-700   overflow-auto">
          {fetcher.data?.error && (
            <ErrorMessage
              message={fetcher.data?.error}
              handleClose={handleClear}
            />
          )}
          <InferenceList />
        </div>
      </CardComponent>
    </div>
  );
}
