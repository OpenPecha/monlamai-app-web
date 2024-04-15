import React, { useState } from "react";
import { Virtuoso } from "react-virtuoso";
import Papa from "papaparse";
import { DateRangePicker } from "react-date-range";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { useNavigation, useSearchParams } from "@remix-run/react";
import { Spinner } from "flowbite-react";

const InferenceList = ({ inferences }) => {
  const [params, setParam] = useSearchParams();
  const { startDate, endDate } = useValidDateRange();
  const navigation = useNavigation();
  let isLoading = navigation.state !== "idle";
  const [filterModel, setFilterModel] = useState("");

  const filterDates = [
    {
      startDate,
      endDate,
      key: "selection",
    },
  ];
  const [isDateModalOpen, setDateModalOpen] = useState(false);
  const handleSelect = (ranges) => {
    setParam((p) => {
      p.set("startDate", ranges.selection.startDate);
      p.set("endDate", ranges.selection.endDate);
      return p;
    });
  };

  const filteredInferences = inferences.filter((inference) => {
    return filterModel ? inference.model === filterModel : true;
  });

  const downloadCSV = () => {
    const csv = Papa.unparse(filteredInferences, {
      columns: [
        "id",
        "model",
        "modelVersion",
        "input",
        "output",
        "updatedAt",
        "userId",
      ],
    });

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "inferences.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openDateModal = () => setDateModalOpen(true);
  const closeDateModal = () => setDateModalOpen(false);
  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={openDateModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Date Filter
        </button>
        <Modal isOpen={isDateModalOpen} onClose={closeDateModal}>
          <DateRangePicker
            ranges={[filterDates[0]]}
            onChange={handleSelect}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
            direction="horizontal"
          />
        </Modal>

        <select
          className="border p-2"
          value={filterModel}
          onChange={(e) => setFilterModel(e.target.value)}
        >
          <option value="">All Models</option>
          <option value="mt">MT</option>
          <option value="stt">STT</option>
          <option value="tts">TTS</option>
          <option value="ocr">OCR</option>
        </select>
        <button
          onClick={downloadCSV}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Download CSV
        </button>
      </div>
      {isLoading && (
        <div>
          <Spinner />
        </div>
      )}

      <Virtuoso
        style={{ height: "600px", width: "100%" }}
        data={filteredInferences}
        itemContent={(index, inference) => (
          <div className="p-4 shadow mb-4">
            <h2 className="text-lg font-bold">Inference ID: {inference.id}</h2>
            <p>Model: {inference.model}</p>
            <p>Version: {inference.modelVersion}</p>
            <div className="flex">
              Input:
              <CheckOutput data={inference.input} />
            </div>
            <div className="flex">
              Output: <CheckOutput data={inference.output} />
            </div>
            {inference?.inputLang && (
              <div>
                From: {inference.inputLang} To: {inference.outputLang}
              </div>
            )}
            <p>
              Last Updated:{" "}
              {format(new Date(inference.updatedAt), "yyyy-MM-dd")}
            </p>
            <p>User ID: {inference.userId}</p>
          </div>
        )}
      />
    </div>
  );
};

export default InferenceList;

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg ">
        {children}
        <button
          onClick={onClose}
          className="mt-4 ml-2 px-4 py-2 bg-red-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const CheckOutput = ({ data }: any) => {
  const isAudioUrl = (url: string) => {
    return /(http[s]?:\/\/.*\.(?:mp3|wav|ogg|m4a))$/i.test(url);
  };
  if (!isAudioUrl(data)) {
    return <span>{data}</span>;
  }
  return (
    <audio controls src={data}>
      Your browser does not support the audio element.
    </audio>
  );
};

const getValidDate = (dateString, defaultDate) => {
  const parsedDate = new Date(dateString);
  return isNaN(parsedDate) ? defaultDate : parsedDate;
};

const useValidDateRange = () => {
  const [params] = useSearchParams();
  const startDateString = params.get("startDate");
  const endDateString = params.get("endDate");
  const currentDate = new Date();

  const startDate = startDateString
    ? new Date(startDateString)
    : startOfMonth(currentDate);
  const endDate = endDateString
    ? new Date(endDateString)
    : endOfMonth(currentDate);

  // Check if dates are valid, otherwise default to start or end of current month
  return {
    startDate: isNaN(startDate.getTime())
      ? startOfMonth(currentDate)
      : startDate,
    endDate: isNaN(endDate.getTime()) ? endOfMonth(currentDate) : endDate,
  };
};