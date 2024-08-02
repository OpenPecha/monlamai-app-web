import type {
  ActionFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  useFetcher,
  useLoaderData,
  useSearchParams,
  useRouteLoaderData,
} from "@remix-run/react";
import { useState, useRef, useEffect } from "react";
import useDebounce from "~/component/hooks/useDebounceState";
import { ErrorMessage } from "~/component/ErrorMessage";
import ToolWraper from "~/component/ToolWraper";
import {
  getTodayInferenceByUserIdCountModel,
  getUserFileInferences,
  saveInference,
  updateEdit,
} from "~/modal/inference.server";
import ListInput from "~/component/ListInput";
import { MAX_SIZE_SUPPORT_DOC } from "~/helper/const";
import {
  CharacterOrFileSizeComponent,
  EditActionButtons,
  OutputDisplay,
  SubmitButton,
  TextOrDocumentComponent,
} from "./components/UtilityComponent";
import { NonEditButtons, NonEditModeActions } from "~/component/ActionButtons";
import EditDisplay from "~/component/EditDisplay";
import CardComponent from "~/component/Card";
import { getUser } from "~/modal/user.server";
import { resetFetcher } from "~/component/utils/resetFetcher";
import LanguageInput from "./components/LanguageInput";
import { CancelButton } from "~/component/Buttons";
import { RxCross2 } from "react-icons/rx";
import useTranslate from "./lib/useTranslate";
import { getUserSession } from "~/services/session.server";
import { InferenceList } from "~/component/InferenceList";
import Devider from "~/component/Devider";
import { Spinner } from "flowbite-react";
import getIpAddressByRequest from "~/component/utils/getIpAddress";
import { ErrorBoundary } from "~/component/ErrorPages";

export const meta: MetaFunction<typeof loader> = ({ matches }) => {
  const parentMeta = matches.flatMap((match) => match.meta ?? []);
  parentMeta.shift(1);
  return [{ title: "Monlam | ཡིག་སྒྱུར་རིག་ནུས།" }, ...parentMeta];
};

export const shouldFetchInferenceList = async ({
  request,
  user,
  model,
}: {
  request: Request;
  user: any;
  model: string;
}) => {
  let tool = new URL(request.url).searchParams.get("tool");
  const fileList = ["document", "file"];
  let fetchInferenceList = fileList.includes(tool!);

  return user && fetchInferenceList
    ? await getUserFileInferences({
        userId: user?.id,
        model,
      })
    : null;
};

export async function loader({ request }: LoaderFunctionArgs) {
  let userdata = await getUserSession(request);
  let user = await getUser(userdata?._json.email);
  let model = "mt";
  let checkNumberOfInferenceToday = user
    ? await getTodayInferenceByUserIdCountModel(user?.id, model)
    : null;
  let checkLimit = checkNumberOfInferenceToday
    ? checkNumberOfInferenceToday >= parseInt(process.env?.API_HIT_LIMIT!)
    : false;
  let CHAR_LIMIT = parseInt(process.env?.MAX_TEXT_LENGTH_MT!);
  let limitMessage =
    "You have reached the daily limit of translation. Please try again tomorrow.";

  const userAgent = request.headers.get("User-Agent") || "";
  const inferences = await shouldFetchInferenceList({
    request,
    user,
    model,
  });
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );
  return {
    user: userdata,
    limitMessage: checkLimit ? limitMessage : null,
    fileUploadUrl: process.env?.FILE_SUBMIT_URL,
    inferences,
    CHAR_LIMIT,
    isMobile,
  };
}

export const action: ActionFunction = async ({ request }) => {
  let formdata = await request.formData();
  let userdata = await getUserSession(request);
  let ip = getIpAddressByRequest(request);
  let user = await getUser(userdata?._json?.email);
  let method = request.method;
  if (method === "PATCH") {
    let edited = formdata.get("edited") as string;
    let inferenceId = formdata.get("inferenceId") as string;
    let updated = await updateEdit(inferenceId, edited);
    return updated;
  }
  if (method === "POST") {
    let source = formdata.get("source") as string;
    let translation = formdata.get("translation") as string;
    let responseTime = formdata.get("responseTime") as string;
    let inputLang = formdata.get("inputLang") as string;
    let outputLang = formdata.get("targetLang") as string;
    const inferenceData = await saveInference({
      userId: user?.id,
      model: "mt",
      input: source,
      output: translation,
      responseTime: parseInt(responseTime),
      inputLang: inputLang,
      outputLang: outputLang,
      ip,
    });
    return { id: inferenceData?.id };
  }
};

export const clientLoader = async ({
  request,
  params,
  serverLoader,
}: ClientLoaderFunctionArgs) => {
  // call the server loader
  const serverData = await serverLoader();
  // And/or fetch data on the client
  // Return the data to expose through useLoaderData()

  return serverData;
};

export default function Index() {
  const [params, setParams] = useSearchParams();

  const target_lang = params.get("target") || "bo";
  const source_lang = params.get("source") || "en";
  const [sourceText, setSourceText] = useState("");
  const selectedTool = params.get("tool") || "text";
  const setSelectedTool = (tool: string) => {
    setParams((p) => {
      p.set("tool", tool);
      return p;
    });
  };

  const [file, setFile] = useState<File | null>(null);
  const { limitMessage, CHAR_LIMIT, user } = useLoaderData();

  const [edit, setEdit] = useState(false);
  const [editText, setEditText] = useState("");
  const [inputUrl, setInputUrl] = useState("");

  const debounceSourceText = useDebounce(sourceText, 1000);
  const likefetcher = useFetcher();
  const editfetcher = useFetcher();
  const translationFetcher = useFetcher();

  const savefetcher = useFetcher();
  const editData = editfetcher.data?.edited;

  let charCount = sourceText?.length;

  function handleCopy() {
    navigator.clipboard.writeText(data);
  }

  useEffect(() => {
    setSourceText("");
  }, [selectedTool]);

  let TextSelected = selectedTool === "text";
  let newText = editfetcher.data?.edited;

  function handleEditSubmit() {
    let edited = editText;
    editfetcher.submit(
      {
        inferenceId,
        edited,
      },
      {
        method: "PATCH",
      }
    );
    setEdit(false);
  }

  function handleCancelEdit() {
    setEdit(false);
    setEditText("");
  }
  const [data, setData] = useState("");

  let { isLoading, error, done, trigger, responseTime } = useTranslate({
    target: target_lang,
    text: sourceText,
    data,
    setData,
  });
  useEffect(() => {
    if (done === true && data) {
      savefetcher.submit(
        {
          source: sourceText,
          translation: data,
          responseTime: responseTime,
          inputLang: source_lang,
          targetLang: target_lang,
        },
        {
          method: "POST",
        }
      );
      resetFetcher(editfetcher);
    }
  }, [done]);
  useEffect(() => {
    if (charCount === 0) {
      resetFetcher(editfetcher);
      setData("");
    }
  }, [charCount]);
  let inferenceId = savefetcher.data?.id;

  const handleReset = () => {
    setData("");
    setSourceText("");
    resetFetcher(translationFetcher);
    resetFetcher(editfetcher);
    setEdit(false);
  };

  const handleFileSubmit = () => {
    let formdata = new FormData();
    formdata.append("fileUrl", inputUrl);
    formdata.append("target_lang", target_lang as string);
    formdata.append("source_lang", source_lang as string);

    translationFetcher.submit(formdata, {
      method: "POST",
      action: "/mtFileUpload",
    });
  };

  function handleErrorClose() {
    resetFetcher(translationFetcher);
    resetFetcher(editfetcher);
  }
  let outputRef = useRef<HTMLDivElement>();

  return (
    <ToolWraper title="MT">
      <ListInput
        options={["text", "document"]}
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        reset={handleReset}
      />
      {error && (
        <ErrorMessage
          message={error}
          handleClose={handleErrorClose}
          type="info"
        />
      )}
      <div className="rounded-[10px] overflow-hidden border dark:border-[--card-border] border-dark_text-secondary">
        <LanguageInput
          setSourceText={setSourceText}
          data={data}
          setTranslated={setData}
          likefetcher={likefetcher}
          sourceText={debounceSourceText}
        />

        {(selectedTool === "text" || selectedTool === "document") && (
          <div className="flex flex-col lg:flex-row ">
            <CardComponent focussed={true}>
              {limitMessage ? (
                <div className="text-gray-500">
                  {limitMessage} <br /> thank you for using MonlamAI
                </div>
              ) : (
                <>
                  <div className="flex relative h-auto min-h-[100px] lg:min-h-[40vh] w-full flex-1 flex-col justify-center">
                    <TextOrDocumentComponent
                      selectedTool={selectedTool}
                      sourceText={sourceText}
                      setSourceText={setSourceText}
                      sourceLang={source_lang}
                      setFile={setFile}
                      setInputUrl={setInputUrl}
                    />
                    {selectedTool === "text" && (
                      <CancelButton
                        onClick={handleReset}
                        hidden={!sourceText || sourceText === ""}
                      >
                        <RxCross2 size={16} />
                      </CancelButton>
                    )}
                  </div>
                  {charCount > 0 && sourceText?.trim() !== "" && !edit && (
                    <div className="flex justify-between py-1.5 px-1 border-t border-t-dark_text-secondary dark:border-t-[--card-border]">
                      <CharacterOrFileSizeComponent
                        selectedTool={selectedTool}
                        charCount={charCount}
                        CHAR_LIMIT={CHAR_LIMIT}
                        MAX_SIZE_SUPPORT={MAX_SIZE_SUPPORT_DOC}
                      />
                      <SubmitButton
                        charCount={charCount}
                        CHAR_LIMIT={CHAR_LIMIT}
                        trigger={() => {
                          trigger();
                          outputRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }}
                        selectedTool={selectedTool}
                        submitFile={handleFileSubmit}
                        disabled={!file || file?.length === 0}
                      />
                    </div>
                  )}
                </>
              )}
            </CardComponent>
            <Devider />
            <CardComponent>
              <div
                ref={outputRef}
                className={`flex flex-1 min-h-[150px] md:min-h-[15vh] lg:min-h-[30vh] h-auto w-full flex-col gap-2
              ${
                target_lang === "bo"
                  ? "leading-loose tracking-wide"
                  : "font-poppins"
              } text-lg`}
              >
                {translationFetcher?.data?.error && (
                  <ErrorMessage
                    message={translationFetcher?.data?.error}
                    handleClose={handleReset}
                    type="warning"
                  />
                )}
                {TextSelected && edit && (
                  <EditDisplay
                    editText={editText}
                    setEditText={setEditText}
                    targetLang={target_lang}
                  />
                )}
                {TextSelected && sourceText !== "" && (
                  <OutputDisplay
                    edit={edit}
                    editData={editData}
                    output={data}
                    animate={true}
                    targetLang={target_lang}
                  />
                )}
                {isLoading && (
                  <div className="flex flex-1 items-center justify-center">
                    <Spinner
                      size="xl"
                      className={"fill-secondary-500 dark:fill-primary-500"}
                    />
                  </div>
                )}
                {selectedTool === "document" && <InferenceList />}
                {selectedTool === "document" && sourceText !== "" && (
                  <DownloadDocument source={sourceText} lang={source_lang} />
                )}
              </div>
              {edit && (
                <EditActionButtons
                  handleCancelEdit={handleCancelEdit}
                  handleEditSubmit={handleEditSubmit}
                  editfetcher={editfetcher}
                  editText={editText}
                  outputText={data}
                />
              )}
              {!edit && inferenceId && sourceText !== "" && (
                <NonEditButtons
                  selectedTool={selectedTool}
                  likefetcher={likefetcher}
                  sourceText={sourceText}
                  inferenceId={inferenceId}
                  setEdit={setEdit}
                  text={newText ?? data}
                  handleCopy={handleCopy}
                  setEditText={setEditText}
                  sourceLang={source_lang}
                />
              )}
            </CardComponent>
          </div>
        )}
      </div>

      <div className="font-poppins mt-3 mb-20 w-full text-center text-[0.7rem] text-xs text-slate-400 md:float-right md:w-fit">
        Monlam-MITRA{" "}
        <span className="font-monlam">ཡིག་སྒྱུར་རིག་ནུས་དཔེ་གཞི་ཐོན་རིམ་</span>{" "}
        <small>v</small>10-16
      </div>
    </ToolWraper>
  );
}

export { ErrorBoundary };
