// components/AudioPlayer.jsx
import React, { useEffect, useRef, useState } from "react";
import { MdPlayArrow, MdPause } from "react-icons/md";
import useLocalStorage from "~/component/hooks/useLocaleStorage";
import { amplifyMedia } from "~/component/utils/audioGain";
import { useWavesurfer } from "@wavesurfer/react";

const AudioPlayer = ({ audioURL }) => {
  const [playbackRate, setPlaybackRate] = useState(1); // 1, 1.25, 1.5, 2, 0.5 (default 1)
  const [volume, setVolume] = useLocalStorage("volume", 1);

  const containerRef = useRef(null);
  const setting = useRef(null);

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    url: audioURL,
    barHeight: 12,
    cursorWidth: 0,
    waveColor: "#5290F4",
    progressColor: "#1E3A8A",
    barGap: 4,
    barWidth: 4,
  });
  const maxDuration = wavesurfer?.getDuration();

  const changePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2, 0.5];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];
    setPlaybackRate(newRate);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  useEffect(() => {
    if (wavesurfer) {
      const media = wavesurfer?.getMediaElement();
      media.crossOrigin = "anonymous";
      amplifyMedia(media, volume * 20, setting);
    }
  }, [volume, wavesurfer]);

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.setPlaybackRate(playbackRate);
    }
  }, [playbackRate, wavesurfer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="px-3 py-2 w-full h-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg
            className="w-6 h-6 text-light_text-default dark:text-primary-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M15 6.037c0-1.724-1.978-2.665-3.28-1.562L7.638 7.933H6c-1.105 0-2 .91-2 2.034v4.066c0 1.123.895 2.034 2 2.034h1.638l4.082 3.458c1.302 1.104 3.28.162 3.28-1.562V6.037Z" />
            <path
              fillRule="evenodd"
              d="M16.786 7.658a.988.988 0 0 1 1.414-.014A6.135 6.135 0 0 1 20 12c0 1.662-.655 3.17-1.715 4.27a.989.989 0 0 1-1.414.014 1.029 1.029 0 0 1-.014-1.437A4.085 4.085 0 0 0 18 12a4.085 4.085 0 0 0-1.2-2.904 1.029 1.029 0 0 1-.014-1.438Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={handleVolumeChange}
            className="h-0.5 appearance-none bg-black dark:bg-primary-500 slider"
          />
          <svg
            className="w-6 h-6 text-light_text-default dark:text-primary-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M13 6.037c0-1.724-1.978-2.665-3.28-1.562L5.638 7.933H4c-1.105 0-2 .91-2 2.034v4.066c0 1.123.895 2.034 2 2.034h1.638l4.082 3.458c1.302 1.104 3.28.162 3.28-1.562V6.037Z" />
            <path
              fillRule="evenodd"
              d="M14.786 7.658a.988.988 0 0 1 1.414-.014A6.135 6.135 0 0 1 18 12c0 1.662-.655 3.17-1.715 4.27a.989.989 0 0 1-1.414.014 1.029 1.029 0 0 1-.014-1.437A4.085 4.085 0 0 0 16 12a4.085 4.085 0 0 0-1.2-2.904 1.029 1.029 0 0 1-.014-1.438Z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M17.657 4.811a.988.988 0 0 1 1.414 0A10.224 10.224 0 0 1 22 12c0 2.807-1.12 5.35-2.929 7.189a.988.988 0 0 1-1.414 0 1.029 1.029 0 0 1 0-1.438A8.173 8.173 0 0 0 20 12a8.173 8.173 0 0 0-2.343-5.751 1.029 1.029 0 0 1 0-1.438Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <button
          className="flex item-center text-lg p-2 font-semibold text-light_text-default dark:text-primary-500 rounded-md"
          onClick={changePlaybackRate}
        >
          <span>{playbackRate} X</span>
        </button>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2">
        {/* Placeholder for the waveform */}
        <div className="my-auto" ref={containerRef} />
        <div className="flex items-center justify-between gap-5">
          <button
            onClick={() => {
              wavesurfer?.playPause();
            }}
            className="text-dark_text-default dark:text-light_text-default rounded-full bg-secondary-700 dark:bg-primary-500"
          >
            {isPlaying ? <MdPause size={36} /> : <MdPlayArrow size={36} />}
          </button>
          <div className="flex flex-1 justify-center items-center">
            <div className="text-sm">{formatTime(currentTime)}</div>
            <input
              type="range"
              min="0"
              max={Math.floor(maxDuration) || 0}
              step="0.1"
              value={currentTime}
              onChange={(e) => {
                // update the current time of the audio per second and seek to the new time
                const newTime = parseFloat(e.target.value);
                wavesurfer?.seekTo(newTime / maxDuration);
              }}
              className="mx-2 h-1 w-full appearance-none bg-gray-300 dark:bg-primary-500 rounded-full"
            />
            <div className="text-sm">{formatTime(maxDuration)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
