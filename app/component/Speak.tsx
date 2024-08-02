import { useFetcher } from "@remix-run/react";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { FaPause } from "react-icons/fa6";
import { ICON_SIZE } from "~/helper/const";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { Spinner } from "flowbite-react";
import useAudioPlayer from "./hooks/useAudioPlayer";

function Speak({
  text,
  getText,
}: {
  text: string | null;
  getText?: () => string;
}) {
  const fetcher = useFetcher();
  const audioRef = useRef<HTMLAudioElement>(null);

  const { isPlaying, pauseAudio } = useAudioPlayer(audioRef, fetcher.data);

  const handlePlayClick = () => {
    const url = "/api/tts";
    const sourceText = getText ? getText() : text;
    fetcher.submit({ sourceText }, { action: url, method: "POST" });
  };

  const audioSourceUrl = useMemo(() => {
    return fetcher.data ? fetcher.data?.data : undefined;
  }, [fetcher.data]);

  return (
    <>
      {isPlaying ? (
        <div onClick={pauseAudio} className="flex items-center ">
          <FaPause size={ICON_SIZE} className="dark:fill-primary-500" />
        </div>
      ) : (
        <>
          {fetcher.state !== "idle" ? (
            <Spinner
              size="md"
              className={"fill-secondary-500 dark:fill-primary-500"}
            />
          ) : (
            // <div className="speaker_loading  ml-2"></div>
            <div
              onClick={handlePlayClick}
              className="flex items-center cursor-pointer"
            >
              <HiMiniSpeakerWave
                size={ICON_SIZE}
                className="dark:fill-primary-500"
              />
            </div>
          )}
        </>
      )}
      {fetcher.data && (
        <audio
          src={audioSourceUrl}
          ref={audioRef}
          onEnded={() => pauseAudio()}
        ></audio>
      )}
    </>
  );
}

export default Speak;
