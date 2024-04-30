import { Spinner } from "flowbite-react";
import { MetaFunction, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import ReactionButtons from "~/component/ReactionButtons";
import { amplifyMedia } from "~/component/utils/audioGain";
import useLocalStorage from "~/component/hooks/useLocaleStorage";
import AudioPlayerComponents from "~/routes/model.tts/components/AudioComponent";
import ToolWraper from "~/component/ToolWraper";
import { ErrorBoundary } from "../model.mt/route";
import InferenceWrapper from "~/component/layout/InferenceWrapper";
import { MAX_SIZE_SUPPORT_DOC } from "~/helper/const";
import ShareLink from "~/component/ShareLink";
import { resetFetcher } from "~/component/utils/resetFetcher";
import { RxCross2 } from "react-icons/rx";
import { CancelButton } from "~/component/Buttons";
import FileUpload from "~/component/FileUpload";
import TextComponent from "~/component/TextComponent";
import { CharacterOrFileSizeComponent } from "../model.mt/components/UtilityComponent";
import ErrorMessage from "~/component/ErrorMessage";
import CardComponent from "~/component/Card";
import { getUser } from "~/modal/user.server";
import { getUserFileInferences } from "~/modal/inference.server";
import {
  InferenceListTts,
  TtsSubmitButton,
} from "./components/UtilityComponents";
import { toast } from "react-toastify";
import { getUserSession } from "~/services/session.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { InferenceList } from "~/component/InferenceList";

export const meta: MetaFunction = ({ matches }) => {
  const parentMeta = matches.flatMap((match) => match.meta ?? []);
  parentMeta.shift(1);

  return [{ title: "Monlam | ཀློག་འདོན་རིག་ནུས།" }, ...parentMeta];
};

export async function loader({ request }: LoaderFunctionArgs) {
  let userdata = await getUserSession(request);
  let user = null;
  if (userdata) {
    user = await getUser(userdata?._json.email);
  }

  let inferences = await getUserFileInferences({
    userId: user?.id,
    model: "tts",
  });
  let CHAR_LIMIT = parseInt(process.env?.MAX_TEXT_LENGTH_TTS!);

  return {
    user,
    fileUploadUrl: process.env?.FILE_SUBMIT_URL,
    inferences,
    CHAR_LIMIT,
  };
}

export default function Index() {
  const [sourceText, setSourceText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [inputUrl, setInputUrl] = useState("");
  const [playbackRate, setPlaybackRate] = useState(1); // 1, 1.25, 1.5, 2, 0.5 (default 1)
  const [selectedTool, setSelectedTool] = useLocalStorage(
    "tts_selected_input",
    "text"
  );
  let { CHAR_LIMIT } = useLoaderData();
  const [volume, setVolume] = useLocalStorage("volume", 1);
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";
  const data = fetcher.data?.data;
  const inferenceId = fetcher.data?.inferenceData?.id;
  let sourceUrl = data;
  let setting = useRef();

  let charCount = sourceText?.length;

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
    amplify(e.target.value);
  };
  const handleReset = () => {
    setSourceText("");
    resetFetcher(fetcher);
  };
  useEffect(() => {
    setSourceText("");
  }, [selectedTool]);
  const audioRef = useRef<HTMLAudioElement>(null);
  let likeFetcher = useFetcher();
  useEffect(() => {
    if (audioRef.current && !setting.current && data) {
      setting.current = amplifyMedia(audioRef.current, volume);
    }
  }, [data, audioRef.current, setting.current]);

  function amplify(number) {
    if (setting.current) {
      setting.current?.amplify(number);
    }
  }

  const handleFileSubmit = () => {
    let formdata = new FormData();
    formdata.append("fileUrl", inputUrl);

    fetcher.submit(formdata, {
      method: "POST",
      action: "/ttsFileUpload",
    });
  };

  function submitHandler(e) {
    if (!sourceText || sourceText === "") {
      toast.info("Text is required for TTS");
    } else {
      fetcher.submit(
        {
          sourceText: sourceText,
        },
        {
          method: "POST",
          action: "/api/tts",
        }
      );
    }
  }
  let actionError = fetcher.data?.error as string;

  const changePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2, 0.5];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];
    if (audioRef.current) audioRef.current.playbackRate = newRate;
    setPlaybackRate(newRate);
  };

  useEffect(() => {
    if (sourceText === "") {
      resetFetcher(fetcher);
    }
  }, [sourceText]);
  return (
    <ToolWraper title="TTS">
      <InferenceWrapper
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        options={["text", "document"]}
      >
        <CardComponent>
          <div className="flex flex-col gap-2 flex-1 min-h-[30vh]">
            <div className="flex relative flex-col flex-1 justify-center">
              {selectedTool === "text" && (
                <TextComponent
                  setSourceText={setSourceText}
                  sourceText={sourceText}
                  sourceLang={"bo"}
                />
              )}
              {selectedTool === "document" && (
                <FileUpload
                  setFile={setFile}
                  setInputUrl={setInputUrl}
                  supported={[".txt", ".docx"]}
                  model="tts"
                />
              )}
              {selectedTool === "text" && (
                <CancelButton
                  onClick={handleReset}
                  hidden={!sourceText || sourceText === ""}
                >
                  <RxCross2 size={20} />
                </CancelButton>
              )}
            </div>
            <div className="flex justify-between items-center">
              <CharacterOrFileSizeComponent
                selectedTool={selectedTool}
                charCount={charCount}
                CHAR_LIMIT={CHAR_LIMIT}
                MAX_SIZE_SUPPORT={MAX_SIZE_SUPPORT_DOC}
              />
              <TtsSubmitButton
                charCount={charCount}
                CHAR_LIMIT={CHAR_LIMIT}
                trigger={submitHandler}
                selectedTool={selectedTool}
                submitFile={handleFileSubmit}
                disabled={!file || file.length === 0}
              />
            </div>
          </div>
        </CardComponent>
        <CardComponent>
          <div className="flex min-h-[15vh] lg:min-h-[30vh] h-auto w-full flex-1 flex-col gap-2 ">
            {actionError && (
              <ErrorMessage
                message={actionError}
                handleClose={() => resetFetcher(fetcher)}
              />
            )}

            {data && (
              <div className="flex justify-between mx-2">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">སྒྲ་ཤུགས་ཆེ་ཆུང་།</span>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    step={0.1}
                    value={volume}
                    onChange={handleVolumeChange}
                  />{" "}
                </div>
                <button
                  className="flex item-center text-lg p-2 font-semibold"
                  onClick={changePlaybackRate}
                >
                  <span>{playbackRate}X</span>
                </button>
              </div>
            )}
            {isLoading && selectedTool === "text" && (
              <div className="h-full flex justify-center items-center">
                <Spinner />
              </div>
            )}
            {!isLoading && selectedTool === "text" && data && (
              <div className="flex-1 h-full flex justify-center items-center">
                {data?.error ? (
                  <div className="text-red-400">{data?.error}</div>
                ) : (
                  <AudioPlayerComponents
                    audioUrl={sourceUrl}
                    playbackRate={playbackRate}
                    ref={audioRef}
                  />
                )}
              </div>
            )}
            {isLoading && selectedTool === "document" && (
              <div className="w-full flex justify-center">
                <Spinner />
              </div>
            )}
            {selectedTool === "document" && <InferenceList />}
          </div>
          <div className="flex justify-end">
            <div className="flex gap-3 md:gap-5 items-center p-2">
              <ReactionButtons
                fetcher={likeFetcher}
                output={data ? `data:audio/wav;base64,${data}` : null}
                sourceText={sourceText}
                inferenceId={inferenceId}
              />

              {inferenceId && <ShareLink inferenceId={inferenceId} />}
            </div>
          </div>
        </CardComponent>
      </InferenceWrapper>
    </ToolWraper>
  );
}

export { ErrorBoundary };
