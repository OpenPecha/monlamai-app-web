import { Button } from "flowbite-react";
import { useRef, useState } from "react";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { BsFillMicFill, BsFillStopFill } from "react-icons/bs";
import { getBrowser } from "~/component/utils/getBrowserDetail";
import AudioPlayer from "~/routes/model.tts/components/AudioPlayer";
import RecordingAnimation from "./RecordingAnimation";
import Timer from "./Timer";
let stopRecordingTimeout: any;

type AudioRecordProps = {
  audioURL: string | null;
  uploadAudio: (file: File) => void;
  isLoading: boolean;
  isUploading: boolean;
};

function AudioRecorder({
  audioURL,
  uploadAudio,
  isLoading,
  isUploading,
}: AudioRecordProps) {
  let mediaRecorder: any = useRef();
  const [tempAudioURL, setTempAudioURL] = useState<string | null>(null);
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
    let permissionStatus = await navigator?.permissions.query({
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
      return await navigator?.mediaDevices.getUserMedia({ audio: true });
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

        mediaRecorder.current.ondataavailable = (event: any) => {
          if (typeof event.data === "undefined") return;
          if (event.data.size === 0) return;
          localAudioChunks.push(event?.data);
        };

        setAudioChunks(localAudioChunks);
        stopRecordingTimeout = setTimeout(() => {
          stopRecording();
        }, 120000);
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
    mediaRecorder.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks);

      uploadAudio(audioBlob);
      setTempAudioURL(URL.createObjectURL(audioBlob));
      setAudioChunks([]);

      // const reader = new FileReader();

      // // Define a callback function to handle the result
      // reader.onload = function () {
      //   const base64String = reader.result;
      // };

      // // Read the Blob as a data URL (Base64)
      // reader.readAsDataURL(audioBlob);
    };
  };

  return (
    <div className="flex flex-col items-center gap-5 flex-1 justify-center">
      {recording && <Timer start={recording} stop={!recording} />}
      {recording && mediaRecorder.current && getBrowser() !== "Safari" && (
        <LiveAudioVisualizer
          mediaRecorder={mediaRecorder.current}
          width={200}
          height={75}
        />
      )}
      {recording && mediaRecorder.current && getBrowser() === "Safari" && (
        <RecordingAnimation />
      )}
      {!audioURL && !isUploading && !isLoading && (
        <Button
          size="lg"
          color="gray"
          onClick={toggleRecording}
          className="border-secondary-500 dark:border-primary-500 text-secondary-500 dark:text-primary-500 enabled:hover:bg-neutral dark:enabled:hover:bg-[--card-bg] enabled:hover:text-secondary-600  dark:enabled:hover:text-primary-600"
        >
          {recording ? (
            <BsFillStopFill className="w-[32px] h-[34px] md:w-[50px] md:h-[50px]" />
          ) : (
            <BsFillMicFill className="w-[32px] h-[34px] md:w-[50px] md:h-[50px]" />
          )}
        </Button>
      )}

      {audioURL && !isUploading && (
        <div className="pt-8 w-full h-full">
          <AudioPlayer audioURL={audioURL} />
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;
