import { Spinner } from "flowbite-react";
import {
  MetaFunction,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import ReactionButtons from "~/component/ReactionButtons";
import ToolWraper from "~/component/ToolWraper";
import InferenceWrapper from "~/component/layout/InferenceWrapper";
import { MAX_SIZE_SUPPORT_DOC } from "~/helper/const";
import ShareLink from "~/component/ShareLink";
import { resetFetcher } from "~/component/utils/resetFetcher";
import { RxCross2 } from "react-icons/rx";
import { CancelButton } from "~/component/Buttons";
import FileUpload from "~/component/FileUpload";
import TextComponent from "~/component/TextComponent";
import { CharacterOrFileSizeComponent } from "../model.mt/components/UtilityComponent";
import { ErrorMessage } from "~/component/ErrorMessage";
import CardComponent from "~/component/Card";
import { getUser } from "~/modal/user.server";
import { TtsSubmitButton } from "./components/UtilityComponents";
import { toast } from "react-toastify";
import { getUserSession } from "~/services/session.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { InferenceList } from "~/component/InferenceList";
import HeaderComponent from "../../component/HeaderComponent";
import Devider from "~/component/Devider";
import AudioPlayer from "./components/AudioPlayer";
import { ErrorBoundary } from "~/component/ErrorPages";
import { shouldFetchInferenceList } from "../model.mt/route";

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

  let model = "tts";
  let inferences = await shouldFetchInferenceList({
    request,
    user,
    model,
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
  const [params, setParams] = useSearchParams();

  const selectedTool = params.get("tool") || "text";
  const setSelectedTool = (tool: string) => {
    setParams((p) => {
      p.set("tool", tool);
      return p;
    });
  };

  let { CHAR_LIMIT } = useLoaderData();
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";
  const data = fetcher.data?.data;
  const inferenceId = fetcher.data?.inferenceData?.id;
  let sourceUrl = data;

  let charCount = sourceText?.length;

  const handleReset = () => {
    setSourceText("");
    resetFetcher(fetcher);
  };
  useEffect(() => {
    setSourceText("");
  }, [selectedTool]);
  let likeFetcher = useFetcher();

  const handleFileSubmit = () => {
    let formdata = new FormData();
    formdata.append("fileUrl", inputUrl);

    fetcher.submit(formdata, {
      method: "POST",
      action: "/ttsFileUpload",
    });
  };

  function submitHandler(e) {
    if (!sourceText || !sourceText.trim()) {
      toast.info("Text input is required for text-to-speech.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
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
        reset={handleReset}
      >
        <div className="rounded-[10px] overflow-hidden border dark:border-[--card-border] border-dark_text-secondary">
          <HeaderComponent model="TTS" selectedTool={selectedTool} />
          <div className="flex flex-col lg:flex-row">
            <CardComponent focussed={true}>
              <div className="flex relative h-full min-h-[100px] lg:min-h-[40vh] w-full flex-1 flex-col justify-center">
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
              {charCount > 0 && sourceText?.trim() !== "" && (
                <div className="flex justify-between p-2 border-t border-t-dark_text-secondary dark:border-t-[--card-border]">
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
              )}
            </CardComponent>
            <Devider />
            <CardComponent>
              <div className="flex min-h-[156px] lg:min-h-[30vh] h-full w-full flex-1 flex-col gap-2">
                {actionError && (
                  <ErrorMessage
                    message={actionError}
                    handleClose={() => resetFetcher(fetcher)}
                    type="warning"
                  />
                )}
                {isLoading && (
                  <div className="flex flex-1 justify-center items-center">
                    <Spinner
                      size="xl"
                      className={"fill-secondary-500 dark:fill-primary-500"}
                    />
                  </div>
                )}
                {!isLoading && selectedTool === "text" && data && (
                  <div className="flex-1 h-full flex justify-center items-center">
                    {data?.error ? (
                      <div className="text-red-400">{data?.error}</div>
                    ) : (
                      <AudioPlayer audioURL={sourceUrl} />
                    )}
                  </div>
                )}
                {selectedTool === "document" && <InferenceList />}
              </div>
              {data && (
                <div className="flex justify-end py-3 px-5 border-t border-t-dark_text-secondary dark:border-t-[--card-border]">
                  <div className="flex gap-3 justify-end md:gap-5 items-center p-1">
                    <ReactionButtons
                      fetcher={likeFetcher}
                      output={data ? `data:audio/wav;base64,${data}` : null}
                      sourceText={sourceText}
                      inferenceId={inferenceId}
                      clickEdit={undefined}
                    />

                    {inferenceId && <ShareLink inferenceId={inferenceId} />}
                  </div>
                </div>
              )}
            </CardComponent>
          </div>
        </div>
      </InferenceWrapper>
    </ToolWraper>
  );
}

export { ErrorBoundary };
