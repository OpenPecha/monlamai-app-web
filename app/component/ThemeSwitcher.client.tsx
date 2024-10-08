import { ICON_SIZE } from "~/helper/const";
import uselitteraTranlation from "./hooks/useLitteraTranslation";
import { Theme, useTheme } from "remix-themes";
import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";
import { useEffect } from "react";

function ThemeSwitcher() {
  const [theme, setTheme, { definedBy }] = useTheme();
  const { translation, isTibetan } = uselitteraTranlation();

  function handleClick() {
    if (theme === "dark") {
      setTheme(Theme.LIGHT);
    } else {
      setTheme(Theme.DARK);
    }
  }
  let isDarkMode = theme === Theme.DARK;
  return (
    <div
      onClick={handleClick}
      className="flex flex-1 gap-2 items-center text-[14px] text-light_text-secondary dark:text-dark_text-secondary  cursor-pointer"
    >
      {isDarkMode ? (
             <>
              <MdOutlineLightMode size={ICON_SIZE} />
              <span
                style={{ position: "relative", top: isTibetan ? "3px" : "0" }}
              >
                {translation.lightmode}
              </span>
        </>
      ) : (
        <>
              <MdDarkMode size={ICON_SIZE} />
              <span
                style={{ position: "relative", top: isTibetan ? "3px" : "0" }}
              >
                {translation.darkmode}
              </span>
        </>
      )}
    </div>
  );
}

export default ThemeSwitcher;
