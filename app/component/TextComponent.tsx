import { Textarea } from "flowbite-react";
import { useRef } from "react";
import uselitteraTranlation from "~/component/hooks/useLitteraTranslation";
import { CHAR_LIMIT } from "~/helper/const";

function TextComponent({ sourceText, setSourceText, sourceLang }) {
  let { translation, locale } = uselitteraTranlation();
  let isEnglish = locale === "en_US";
  let textRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Textarea
      name="sourceText"
      placeholder={!isEnglish ? "ཡི་གེ་གཏག་རོགས།..." : "Enter text here..."}
      className={`w-full p-2 overflow-auto resize-none flex-1 min-h-[5em] bg-transparent  border-0 focus:outline-none focus:ring-transparent  caret-slate-500 placeholder:text-slate-300 placeholder:font-monlam placeholder:text-lg ${
        sourceLang == "en" && "font-poppins text-xl"
      } ${sourceLang == "bo" && "text-lg leading-loose font-monlam"}`}
      required
      value={sourceText}
      onInput={(e) => {
        setSourceText((prev) => {
          let value = e.target?.value;
          if (value?.length <= CHAR_LIMIT) return value;
          return prev;
        });
      }}
      rows={6}
      autoFocus
      ref={textRef}
    />
  );
}

export default TextComponent;