import { Button } from "flowbite-react";
import React, { useState } from "react";
import Webcam from "react-webcam";
import { TbCapture } from "react-icons/tb";
import { MdFlipCameraIos } from "react-icons/md";

const WebcamCapture = ({ setFile }) => {
  const webcamRef = React.useRef(null);
  const [facingMode, setFacingMode] = useState("environment");

  const capture = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const file = await base64ToFile(imageSrc, "capture-img");
    if (file) {
      setFile(file);
    }
  }, [webcamRef, setFile]);

  const toggleCamera = () => {
    if (facingMode === "user") {
      setFacingMode("environment");
    } else {
      setFacingMode("user");
    }
  };

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
      <div className="flex gap-4">
        <Button onClick={toggleCamera} color="dark">
          <MdFlipCameraIos className="mr-2" />
          Flip
        </Button>
        <Button onClick={capture} color="dark">
          <TbCapture className="mr-2" />
          Capture
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