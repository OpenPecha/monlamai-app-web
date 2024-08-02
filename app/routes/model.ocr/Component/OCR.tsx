import { useFetcher, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import ListInput from "~/component/ListInput";
import SingleInputSection from "./SingleInputSection";
import FileInputSection from "./FileInputSection";
import { resetFetcher } from "~/component/utils/resetFetcher";
import HeaderComponent from "~/component/HeaderComponent";

function OCR() {
  const [params, setParams] = useSearchParams();
  const selectedTool = params.get("tool") || "image";
  const SingleFilefetcher = useFetcher();
  const fileFetcher = useFetcher();

  const reset = () => {
    resetFetcher(SingleFilefetcher);
    resetFetcher(fileFetcher);
  };

  useEffect(() => {
    if (selectedTool !== "image") {
      reset();
    }
  }, [selectedTool]);
  const setSelectedTool = (tool: string) => {
    setParams((p) => {
      p.set("tool", tool);
      return p;
    });
  };
  return (
    <div className="flex flex-col w-full mb-20">
      <ListInput
        reset={reset}
        options={["image", "file"]}
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
      />
      <div className="rounded-lg overflow-hidden">
        <HeaderComponent model="OCR" selectedTool={selectedTool} />
        {selectedTool === "image" && (
          <SingleInputSection fetcher={SingleFilefetcher} />
        )}
        {selectedTool === "file" && <FileInputSection fetcher={fileFetcher} />}
      </div>
    </div>
  );
}

export default OCR;
