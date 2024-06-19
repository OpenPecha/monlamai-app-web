import { Button } from "flowbite-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaFile } from "react-icons/fa";
import { formatBytes } from "~/component/utils/formatSize";
import { toast } from "react-toastify";
import { MAX_SIZE_SUPPORT_AUDIO } from "~/helper/const";

export function HandleAudioFile({ handleFileChange, reset }) {
  const [myFiles, setMyFiles] = useState(null);
  const maxSize = MAX_SIZE_SUPPORT_AUDIO.replace("MB", "");
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Do something with the files
      const file = acceptedFiles[0];

      if (!file) {
        toast.error(
          "Wrong file format. Please select an audio file (.mp3 or .wav).",
          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
        return;
      }

      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = () => {
        console.log(`Duration: ${audio.duration} seconds`);
        // if (audio.duration > 120) {
        //   // Example: Check if the audio is longer than 120 seconds
        //   toast.info("Audio is too long.");
        //   URL.revokeObjectURL(audio.src); // Clean up
        //   return;
        // }

        // If everything is fine, proceed with setting the file
        handleFileChange(file);
        setMyFiles(file); // Assuming setMyFiles is a state setter function
        URL.revokeObjectURL(audio.src); // Clean up
      };
    },
    [handleFileChange]
  );
  const removeFile = () => {
    reset();
    setMyFiles(null);
  };

  let { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav"],
    },
    multiple: false,
  });
  if (myFiles)
    return (
      <div className="flex flex-1 w-full items-center">
        <div className="bg-gray-200 py-2 w-full h-16 p-5 rounded-lg shadow-md inline-flex justify-between items-center">
          <div className="flex items-center gap-4">
            <FaFile size="20px" />
            <div className="flex flex-col">
              {myFiles?.name.slice(0, 20) + "..."}
              <p>{formatBytes(myFiles?.size)}</p>
            </div>
          </div>
          <Button size="sm" className="" pill onClick={removeFile}>
            X
          </Button>
        </div>
      </div>
    );
  return (
    <>
      <form className=" flex-1 flex cursor-pointer" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <>
            <p>Drop the files here ...</p>
          </>
        ) : (
          <div className="flex flex-1 flex-col justify-center items-center gap-2 hover:border-dotted hover:border-2 hover:border-gray-300">
            <img
              className="h-32 "
              src="/img/drag_and_drop.svg"
              alt="drag and drop"
            />
            <p className="rounded text-slate-300 p-3">
              click to select .mp3 or .wav files
            </p>
          </div>
        )}
      </form>
    </>
  );
}
