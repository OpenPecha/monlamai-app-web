import { useState, useEffect, forwardRef } from "react";

const AudioPlayerComponents = ({ audioUrl }, ref) => {
  const [audioSource, setAudioSource] = useState(null);

  useEffect(() => {
    // Fetch the audio file when the component mounts
    fetch(audioUrl)
      .then((response) => response.blob()) // Convert the response to a Blob
      .then((blob) => {
        // Create a local URL from the Blob and set it as the audio source
        const localUrl = URL.createObjectURL(blob);
        setAudioSource(localUrl);

        // Optional: Set a timeout to revoke the Blob URL after 2 minutes
        const timer = setTimeout(() => {
          URL.revokeObjectURL(localUrl);
          setAudioSource(null); // Clear the source after revocation
        }, 120000); // 120000 milliseconds = 2 minutes

        return () => clearTimeout(timer); // Clear the timeout if the component unmounts early
      })
      .catch((error) => console.error("Error fetching audio:", error));
  }, [audioUrl]);

  return (
    <div>
      {audioSource ? (
        <audio controls src={audioSource} ref={ref}>
          Your browser does not support the audio element.
        </audio>
      ) : (
        <p>Loading audio...</p>
      )}
    </div>
  );
};
export default forwardRef(AudioPlayerComponents);