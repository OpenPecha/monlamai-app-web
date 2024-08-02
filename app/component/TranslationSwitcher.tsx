import { useLitteraMethods } from "@assembless/react-littera";
import useLocalStorage from "./hooks/useLocaleStorage";
import uselitteraTranlation from "./hooks/useLitteraTranslation";
import { IoMdGlobe } from "react-icons/io";

function TranslationSwitcher() {
  const [current, setCurrent] = useLocalStorage("language", "bo_TI");
  const methods = useLitteraMethods();
  const { isTibetan } = uselitteraTranlation();

  const SwitchLanguage = () => {
    const code = isTibetan ? "en_US" : "bo_TI";
    setCurrent(code);
    methods.setLocale(code);
  };

  return (
    <div
      onClick={SwitchLanguage}
      className="cursor-pointer text-[14px] mr-2 text-light_text-secondary dark:text-dark_text-secondary"
    >
      {isTibetan ? (
        <span className=" flex gap-2 font-monlam rounded-full ">
          <IoMdGlobe size={20} />
          <div>དབྱིན་ཡིག</div>
        </span>
      ) : (
        <span className=" flex gap-2 font-monlam rounded-full ">
          <IoMdGlobe size={20} />
          <div>བོད་ཡིག</div>
        </span>
      )}
    </div>
  );
}

export default TranslationSwitcher;
