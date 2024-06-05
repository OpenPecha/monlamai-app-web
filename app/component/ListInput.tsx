import { useRouteLoaderData } from "@remix-run/react";
import { Tabs, TabsRef } from "flowbite-react";
import uselitteraTranlation from "./hooks/useLitteraTranslation";
import { IoMdDocument } from "react-icons/io";
import { MdSpatialAudioOff } from "react-icons/md";
import { FaFileLines, FaFilePdf } from "react-icons/fa6";
import { FaFileZipper } from "react-icons/fa6";
import { FaImage } from "react-icons/fa";
import { useRef } from "react";
import { TbTextSize } from "react-icons/tb";
type ListInputProps = {
  selectedTool: string;
  setSelectedTool: (tool: any) => void;
  options: string[];
  reset: () => void;
};

let icons = {
  text: TbTextSize,
  document: FaFileLines,
  recording: MdSpatialAudioOff,
  image: FaImage,
  zip: FaFileZipper,
  PDF: FaFilePdf,
  file: IoMdDocument,
};

export default function ListInput({
  selectedTool,
  setSelectedTool,
  options,
  reset,
}: ListInputProps) {
  const tabsRef = useRef<TabsRef>(null);
  let { user } = useRouteLoaderData("root");
  const { translation, locale } = uselitteraTranlation();
  const isTibetan = locale === "bo_TI";
  const isUserLoggedIn = !!user;
  const ShowList = ["text", "recording", "image"];
  const BetaList = ["zip", "PDF", "document", "file"];
  function handleSelection(option) {
    let allowedTab = ShowList.includes(options[option]);
    let showMessage = !isUserLoggedIn && !allowedTab;
    if (showMessage) {
      tabsRef.current?.setActiveTab(0);
      alert("login to use this feature");
    } else {
      setSelectedTool(options[option]);
    }
    reset();
  }

  return (
    <Tabs.Group
      ref={tabsRef}
      theme={theme}
      aria-label="Tabs with underline"
      style="underline"
      onActiveTabChange={handleSelection}
      className={` w-fit ${isTibetan ? "font-monlam " : "font-poppins"}`}
    >
      {options.map((option, index) => {
        let icon = icons[option] ?? null;
        let allowedTab = ShowList.includes(options[option]);
        let disabled = !isUserLoggedIn && !allowedTab;

        let innerText = translation[option] ? translation[option] : option;
        let isBeta = BetaList.includes(option) ? " ( BETA )" : " ";
        let isActive = selectedTool === option;
        return (
          <Tabs.Item
            key={option + index}
            title={innerText + isBeta}
            icon={icon}
            active={isActive}
            className={`text-sm capitalize flex items-center ${
              disabled && "  opacity-50 cursor-not-allowed  "
            }  `}
          ></Tabs.Item>
        );
      })}
    </Tabs.Group>
  );
}

let theme = {
  base: "flex flex-col gap-2",
  tablist: {
    base: "flex text-center",
    styles: {
      default: "flex-wrap border-b border-gray-200 dark:border-gray-700",
      underline:
        "-mb-px flex-wrap border-b border-gray-200 dark:border-gray-700",
    },
    tabitem: {
      base: "flex items-center justify-center rounded-t-lg p-4 text-sm font-medium disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
      styles: {
        underline: {
          base: "rounded-t-lg py-0",
          active: {
            on: "active rounded-t-lg text-secondary-400 dark:text-primary-500 ",
            off: "border-b-2 border-transparent text-gray-500  ",
          },
        },
      },
      icon: "mr-2 h-5 w-5",
    },
  },
  tabitemcontainer: {
    base: "",
    styles: {
      default: "",
      underline: "",
      pills: "",
      fullWidth: "",
    },
  },
  tabpanel: "py-3",
};
