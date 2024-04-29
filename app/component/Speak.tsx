import { useFetcher } from "@remix-run/react";
import { Button } from "flowbite-react";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { BiPause } from "react-icons/bi";
import { RxSpeakerLoud } from "react-icons/rx";
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
        <div onClick={pauseAudio} className="flex items-center text-[20px]">
          <BiPause />
        </div>
      ) : (
        <div
          color="white"
          onClick={handlePlayClick}
          className={`flex items-center cursor-pointer text-[20px] ${
            fetcher.state !== "idle" ? "animate-pulse" : ""
          }`}
        >
          <RxSpeakerLoud />
          {fetcher.state !== "idle" && (
            <div className="speaker_loading ml-2"></div>
          )}
        </div>
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
