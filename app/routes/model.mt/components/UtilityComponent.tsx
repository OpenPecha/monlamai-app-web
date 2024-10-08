import { Button, Textarea } from "flowbite-react";
import TextComponent from "~/component/TextComponent";
import { motion } from "framer-motion";
import uselitteraTranlation from "~/component/hooks/useLitteraTranslation";
import { BsArrowRight } from "react-icons/bs";
import { FiFile } from "react-icons/fi";

type EditActionButtonsProps = {
  handleCancelEdit: () => void;
  handleEditSubmit: () => void;
  editfetcher: any;
  editText: string;
  outputText: any;
};

type OutputDisplayProps = {
  edit: boolean;
  editData: string;
  output: string;
  editText: string;
  setEditText: (p: string) => void;
};

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

export function OutputDisplay({
  edit,
  editData,
  output,
  animate,
  targetLang,
}: {
  edit: boolean;
  editData: string;
  output: string;
  animate: boolean;
  targetLang: string;
}) {
  if (edit) return null;
  let isEng = targetLang == "en";
  let isTib = targetLang == "bo";
  let fontSize =
    output?.length < 600
      ? "text-lg"
      : output?.length < 1000
      ? "text-base"
      : "text-sm";
  let show_text = editData ? editData : output;
  const textWithBrTags = show_text?.replace(/(\r\n|\r|\n)+/g, "<br />");
  return (
    <div
      id="translationOutput"
      className={`p-2 first-letter  
      ${fontSize}
      ${isEng && "font-poppins "} ${isTib && "leading-loose font-monlam"} ${
        !isEng && !isTib && "font-notosans"
      }`}
      dangerouslySetInnerHTML={{ __html: textWithBrTags }}
    ></div>
  );
}

export function EditActionButtons({
  handleCancelEdit,
  handleEditSubmit,
  editfetcher,
  editText,
  outputText,
}: EditActionButtonsProps) {
  const { translation, locale, isEnglish } = uselitteraTranlation();

  return (
    <>
      <div
        className={`${
          isEnglish ? "font-poppins" : "font-monlam"
        }  h-fit inline-flex m-2 text-xs`}
      >
        <div className="flex-1 px-2 bg-primary-200 dark:bg-[#454544] dark:text-[#afaeae] pt-[8px] pb-[6px] rounded-lg justify-start items-center gap-2.5 flex">
          {translation.contribution_message}
        </div>
      </div>
      <div
        className={`${
          isEnglish ? "font-poppins" : "font-monlam"
        } flex justify-between p-2 text-sm border-t border-t-dark_text-secondary dark:border-t-[--card-border]`}
      >
        <Button
          color="gray"
          size="sm"
          onClick={handleCancelEdit}
          className="px-1 py-0.5"
        >
          x
        </Button>
        <Button
          size="xs"
          color="blue"
          onClick={handleEditSubmit}
          isProcessing={editfetcher.state !== "idle"}
          disabled={editText === outputText}
          className={`p-0  bg-secondary-500 dark:bg-primary-500 hover:bg-secondary-400 dark:hover:bg-primary-400 
          enabled:hover:bg-secondary-400 enabled:dark:hover:bg-primary-400
             text-white dark:text-black 
         `}
        >
          <FiFile size={18} />{" "}
          <span className="pl-2 text-[12px]">{translation.save}</span>
        </Button>
      </div>
    </>
  );
}

export function SubmitButton({
  trigger,
  charCount,
  CHAR_LIMIT,
  disabled,
}: any) {
  const { translation, locale } = uselitteraTranlation();
  const exceedsLimit = charCount > CHAR_LIMIT;
  const isEmpty = charCount === 0;
  return (
    <Button
      disabled={disabled || exceedsLimit || isEmpty}
      size="xs"
      title={exceedsLimit ? "Character limit exceeded" : ""}
      onClick={trigger}
      className={` bg-secondary-500 dark:bg-primary-500 hover:bg-secondary-400 dark:hover:bg-primary-400 
      enabled:hover:bg-secondary-400 enabled:dark:hover:bg-primary-400
         text-white dark:text-black  
      ${locale !== "bo_TI" ? "font-poppins" : "font-monlam"}`}
    >
      <span className="pr-2">{translation["translate"]}</span>
      <BsArrowRight size={18} />
    </Button>
  );
}
