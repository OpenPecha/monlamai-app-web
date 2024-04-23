import axios from "axios";
import { Button } from "flowbite-react";
import React, { useRef, useState } from "react";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { BsFillMicFill, BsFillStopFill } from "react-icons/bs";
import { getBrowser } from "~/component/utils/getBrowserDetail";

let stopRecordingTimeout: any;

type AudioRecordProps = {
  audioURL: string | null;
};

function AudioRecorder({ audioURL }: AudioRecordProps) {
  let mediaRecorder: any = useRef();

  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);

  const toggleRecording = () => {
    if (!recording) {
      startRecording();
    } else {
      stopRecording();
    }
  };
  const getMicrophonePermission = async () => {
    let permissionStatus = await navigator.permissions.query({
      name: "microphone",
    });
    if (permissionStatus.state === "prompt") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          // Use the audio stream
        })
        .catch((error) => {
          // Handle the error or guide the user to enable permissions
        });
      alert("Please provide the required permission from browser settings");
    } else if (permissionStatus.state === "denied") {
      // The user has denied permission - guide them to enable it manually
      alert("Please enable microphone permissions in your browser settings.");
    } else if (permissionStatus.state === "granted") {
      // Permission was already granted
      return await navigator.mediaDevices.getUserMedia({ audio: true });
    }
  };
  const startRecording = async () => {
    let stream = await getMicrophonePermission();
    if (stream) {
      try {
        let localAudioChunks: [] = [];
        setRecording(true);
        let browserName = getBrowser();
        const media = new MediaRecorder(stream, {
          mimeType: browserName !== "Safari" ? "audio/webm" : "audio/mp4",
        });
        mediaRecorder.current = media;
        mediaRecorder.current.start();

        stopRecordingTimeout = setTimeout(() => {
          stopRecording();
        }, 120000);

        mediaRecorder.current.ondataavailable = (event: any) => {
          if (typeof event.data === "undefined") return;
          if (event.data.size === 0) return;
          localAudioChunks.push(event?.data);
        };
        setAudioChunks(localAudioChunks);
      } catch (error) {
        console.error("Error accessing the microphone:", error);
      }
    }
  };
  const stopRecording = () => {
    if (stopRecordingTimeout) {
      clearTimeout(stopRecordingTimeout);
    }

    setRecording(false);
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks);
      uploadFile(audioBlob);
      setAudioChunks([]);

      const reader = new FileReader();

      // Define a callback function to handle the result
      reader.onload = function () {
        const base64String = reader.result;
      };

      // Read the Blob as a data URL (Base64)
      reader.readAsDataURL(audioBlob);
    };
  };

  return (
    <div className="flex flex-col items-center gap-5 flex-1 justify-center md:min-h-[30vh]">
      {recording && mediaRecorder.current && getBrowser() !== "Safari" && (
        <LiveAudioVisualizer
          mediaRecorder={mediaRecorder.current}
          width={200}
          height={75}
        />
      )}
      {!audioURL && (
        <Button size="lg" color="gray" onClick={toggleRecording}>
          {recording ? (
            <BsFillStopFill className="w-[25px] h-[25px] md:w-[50px] md:h-[50px]" />
          ) : (
            <BsFillMicFill className="w-[25px] h-[25px] md:w-[50px] md:h-[50px]" />
          )}
        </Button>
      )}

      {audioURL && (
        <audio controls className="mt-4 md:mt-0">
          <source src={audioURL} type="audio/mpeg"></source>
          <source src={audioURL} type="audio/ogg"></source>
        </audio>
      )}
    </div>
  );
}

export default AudioRecorder;