import { Button } from "flowbite-react";
import React, { useState } from "react";
import Webcam from "react-webcam";
import { TbCapture } from "react-icons/tb";

const WebcamCapture = ({ setImageUrl }) => {
  const webcamRef = React.useRef(null);
  const [facingMode, setFacingMode] = useState("user");

  const capture = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const file = await base64ToFile(imageSrc, "capture-img");
    if (file) {
      setImageUrl(file);
    }
  }, [webcamRef, setImageUrl]);

  return (
    <>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        screenshotQuality={1}
        width="100%"
        videoConstraints={{
          facingMode: facingMode,
        }}
      />
      <div className="w-full flex justify-center absolute bottom-2">
        <Button onClick={capture} color="dark" className="rounded-full">
          <TbCapture />
        </Button>
      </div>
    </>
  );
};

export default WebcamCapture;

async function base64ToFile(base64String, filename) {
  // Split the base64 string into the data URL header and the base64 data
  const [header, base64Data] = base64String.split(",");

  // Decode the base64 data to binary string
  const response = await fetch(`data:${header},${base64Data}`);
  const blob = await response.blob();

  // Create a file from the blob
  const file = new File([blob], filename, { type: blob.type });
  return file;
}
