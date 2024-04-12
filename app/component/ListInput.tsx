import { useRouteLoaderData } from "@remix-run/react";
import { Button } from "flowbite-react";
import uselitteraTranlation from "./hooks/useLitteraTranslation";
import { ImTextColor } from "react-icons/im";
import { IoMdDocument } from "react-icons/io";
import { MdSpatialAudioOff } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa6";
import { FaFileZipper } from "react-icons/fa6";
import { FaImage } from "react-icons/fa";
type ListInputProps = {
  selectedTool: string;
  setSelectedTool: (tool: any) => void;
  options: string[];
};

let icons = {
  text: <ImTextColor />,
  document: <IoMdDocument />,
  recording: <MdSpatialAudioOff />,
  image: <FaImage />,
  zip: <FaFileZipper />,
  PDF: <FaFilePdf />,
  file: <IoMdDocument />,
};

export default function ListInput({
  selectedTool,
  setSelectedTool,
  options,
}: ListInputProps) {
  let { isFileUploadEnabled, user } = useRouteLoaderData("root");
  const { translation, locale } = uselitteraTranlation();
  const isTibetan = locale === "bo_TI";
  const isUserLoggedIn = !!user;
  const ShowList = ["text", "recording", "image"];

  return (
    <div className="flex gap-2 mt-2">
      {options.map((option, index) => {
        if (!isFileUploadEnabled) return null;
        let icon = icons[option] ?? null;
        let disabled = !isUserLoggedIn ? !ShowList.includes(option) : false;
        function handleSelection(option) {
          if (disabled) {
            return alert("login to use this feature");
          }
          setSelectedTool(option);
        }
        return (
          <Button
            color={option === selectedTool ? "blue" : "gray"}
            size={"xs"}
            key={option + index}
            onClick={() => handleSelection(option)}
            className={`capitalize flex items-center ${
              disabled && "  opacity-50 cursor-not-allowed  "
            }`}
          >
            <span className="mr-2 h-3 w-3">{icon}</span>
            <span className={isTibetan ? "pt-2" : ""}>
              {translation[option] ? translation[option] : option}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
