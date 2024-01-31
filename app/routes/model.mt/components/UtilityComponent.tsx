import { Button, Textarea } from "flowbite-react";
import TextComponent from "../../../component/TextComponent";
import { motion } from "framer-motion";
import EditDisplay from "~/component/EditDisplay";
import FileUpload from "~/component/FileUpload";
import { MAX_SIZE_SUPPORT_AUDIO } from "~/helper/const";
import { useEffect, useState } from "react";
type TextOrDocumentComponentProps = {
  selectedTool: string;
  sourceText: string;
  setSourceText: (text: string) => void;
  sourceLang: string;
};

type CharacterOrFileSizeComponentProps = {
  selectedTool: string;
  charCount: number;
  CHAR_LIMIT: number | undefined;
  MAX_SIZE_SUPPORT: number;
};

type EditActionButtonsProps = {
  handleCancelEdit: () => void;
  handleEditSubmit: () => void;
  editfetcher: any;
  editText: string;
  translated: any;
};

type OutputDisplayProps = {
  edit: boolean;
  editData: string;
  output: string;
  editText: string;
  setEditText: (p: string) => void;
};

export function TextOrDocumentComponent({
  selectedTool,
  sourceText,
  setSourceText,
  sourceLang,
}: TextOrDocumentComponentProps) {
  if (selectedTool === "text") {
    return (
      <TextComponent
        sourceText={sourceText}
        setSourceText={setSourceText}
        sourceLang={sourceLang}
      />
    );
  } else if (selectedTool === "document") {
    return (
      <FileUpload
        sourceText={sourceText}
        setSourceText={setSourceText}
        reset={() => {}}
      />
    );
  }
  return null;
}

export function CharacterOrFileSizeComponent({
  selectedTool,
  charCount,
  CHAR_LIMIT,
  MAX_SIZE_SUPPORT,
}: CharacterOrFileSizeComponentProps) {
  if (selectedTool === "Recording") return <div />;
  if (selectedTool === "text") {
    return (
      <div className="text-gray-400 text-xs">
        {charCount} / {CHAR_LIMIT}
      </div>
    );
  } else {
    return (
      <div className="text-gray-400 text-xs">
        max size: {MAX_SIZE_SUPPORT}KB
      </div>
    );
  }
}

export function LoadingAnimation() {
  return (
    <div role="status" className="max-w-sm animate-pulse">
      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function OutputDisplay({ edit, editData, output, animate }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (edit) {
      return;
    }
    let timer;
    if (output && animate) {
      timer = setInterval(() => {
        setDisplayedText((prev) => prev + output[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 50); // adjust time interval as needed

      if (currentIndex >= output?.length) {
        clearInterval(timer);
      }
    }

    return () => clearInterval(timer);
  }, [currentIndex, output, edit, animate]);

  if (edit) return null;
  return (
    <div
      className="font-monlam p-2 text-[1.2rem]"
      style={{ lineHeight: "1.8" }}
    >
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {editData ? editData : animate ? displayedText : output}
      </motion.p>
    </div>
  );
}

export function EditActionButtons({
  handleCancelEdit,
  handleEditSubmit,
  editfetcher,
  editText,
  translated,
}: EditActionButtonsProps) {
  return (
    <>
      <p className="px-2 py-1 bg-[#F5F6B0] rounded-md text-sm">
        Your contribution will be used to improve translation quality.
      </p>
      <div className="flex justify-between">
        <Button color="gray" onClick={handleCancelEdit}>
          cancel
        </Button>
        <Button
          color="blue"
          onClick={handleEditSubmit}
          isProcessing={editfetcher.state !== "idle"}
          disabled={editText === translated?.translation}
        >
          submit
        </Button>
      </div>
    </>
  );
}