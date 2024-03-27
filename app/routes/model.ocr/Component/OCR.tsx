import React, { useEffect } from "react";
import { useFetcher, useLoaderData, useRevalidator } from "@remix-run/react";
import { useState } from "react";
import { resetFetcher } from "~/component/utils/resetFetcher";
import ListInput from "~/component/ListInput";
import { MdDeleteForever, MdRefresh } from "react-icons/md";
import { FaDownload } from "react-icons/fa";
import timeSince from "~/component/utils/timeSince";
import SingleInputSection from "./SingleInputSection";
import PDFInputSection from "./PDFInputSection";
import FolderInputSection from "./FolderInputSection";

function OCR() {
  const [selectedTool, setSelectedTool] = useState("single");
  const SingleFilefetcher = useFetcher();
  const multipleFileFetcher = useFetcher();

  return (
    <div className="flex flex-col gap-2 w-full">
      <ListInput
        options={["single", "folder", "PDF"]}
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
      />
      {selectedTool === "single" && (
        <SingleInputSection fetcher={SingleFilefetcher} />
      )}
      {selectedTool === "folder" && <FolderInputSection />}
      {selectedTool === "PDF" && (
        <PDFInputSection fetcher={multipleFileFetcher} />
      )}
    </div>
  );
}

export default OCR;

let timer;

function EachInference({ inference }: any) {
  const { fileUploadUrl } = useLoaderData();
  const deleteFetcher = useFetcher();
  let filename = inference.input.split("/OCR/input/")[1];
  let updatedAt = new Date(inference.updatedAt);
  const revalidator = useRevalidator();
  let outputURL = inference.output;
  let isComplete = !!outputURL;

  function deleteHandler() {
    deleteFetcher.submit(
      { id: inference.id },
      {
        method: "DELETE",
        action: "/testupload",
      }
    );
  }

  return (
    <div className="rounded-lg font-poppins  flex  justify-between items-center px-1 mx-2 mb-2 pb-1 border-b-2 border-gray-400">
      <div>
        <span className="text-gray-800 truncate">
          {decodeURIComponent(filename)}
        </span>
        <span className="text-gray-500 text-xs block">
          {updatedAt ? timeSince(updatedAt) : ""}
        </span>
      </div>
      <div className="flex gap-5 items-center">
        {isComplete ? (
          <a
            href={outputURL}
            className="text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out"
          >
            <FaDownload />
          </a>
        ) : (
          <span>processing</span>
        )}
        <button onClick={deleteHandler} className=" hover:text-red-400">
          <MdDeleteForever />
        </button>
      </div>
    </div>
  );
}
