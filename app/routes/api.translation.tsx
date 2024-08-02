import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  defer,
  json,
} from "@remix-run/node";
import {
  bo_en_english_replaces,
  bo_en_tibetan_replaces,
  en_bo_english_replaces,
  en_bo_tibetan_replaces,
} from "~/component/utils/replace";
import { API_ERROR_MESSAGE } from "~/helper/const";
import { saveInference } from "~/modal/inference.server";
import { getUser } from "~/modal/user.server";
import { auth } from "~/services/auth.server";
import { fetchGPTData } from "~/services/fetchGPTData.server";
import { getUserDetail } from "~/services/session.server";
import getIpAddressByRequest from "~/component/utils/getIpAddress";

type Lang = "bo" | "en";

export async function translate(
  text: string,
  sourceLang: Lang,
  direction: string
) {
  const url = process.env?.MT_API_URL;
  if (direction !== "" && direction) {
    let newdirection = "<2" + direction.toLowerCase() + ">";
    text = newdirection + text;
  } else if (sourceLang === "bo") {
    text = "<2en>" + text;
  } else if (sourceLang === "en") {
    text = "<2bo>" + text;
  }
  const data = { inputs: en_bo_english_replaces(text) };
  let response;
  const startTime = Date.now(); // Start time for measuring response time
  let receivedData = "";

  let modelToken = process.env?.MODEL_API_AUTH_TOKEN;
  if (!modelToken) throw new Error(API_ERROR_MESSAGE);
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: modelToken,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(API_ERROR_MESSAGE);
    }
    let response_data = await postRequestAndHandleResponse(response);
    receivedData = response_data;
  } catch (e) {
    throw new Error(API_ERROR_MESSAGE);
  }

  const translation = receivedData;
  const responseTime = Date.now() - startTime; // Calculate response time

  const disclaimer = "";
  return {
    translation:
      sourceLang === "en"
        ? en_bo_tibetan_replaces(translation)
        : bo_en_english_replaces(translation),
    disclaimer,
    responseTime: responseTime, // Include response time in milliseconds
  };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  let userdata = await getUserDetail(request);

  let ip = getIpAddressByRequest(request);

  let user = await getUser(userdata?._json.email);
  let formdata = await request.formData();
  const sourceLang = formdata.get("sourceLang") as "bo" | "en";
  let source = formdata.get("input") as string | null;
  let direction = formdata.get("direction") as string;
  let original_source = source;
  let targetLang: Lang = sourceLang === "en" ? "bo" : "en";
  if (sourceLang === "en") {
    source = en_bo_english_replaces(source!);
    let prompt = `replace all the abbreviations with full form and preserve newlines, "${source}"  `;
    try {
      source = await fetchGPTData(prompt);
    } catch (e) {
      console.log("chatGPT Error", e);
    }
  }
  if (sourceLang === "bo") {
    source = bo_en_tibetan_replaces(source!);
  }
  if (source) {
    let result;
    try {
      result = await translate(source, sourceLang, direction);
    } catch (e) {
      return { error: e?.message };
    }
    let responseTime = result.responseTime;

    // if (result.translation) console.log(result.translation);
    // save the data to the database

    const inferenceData = await saveInference({
      userId: user?.id,
      model: "mt",
      input: original_source,
      output: result.translation,
      responseTime: responseTime,
      inputLang: sourceLang,
      outputLang: targetLang,
      ip,
    });
    return json({
      translation: result,
      inferenceData: inferenceData,
    });
  }
};

async function postRequestAndHandleResponse(response) {
  try {
    // Make a POST request to the API

    // Check the content type of the response
    const contentType = response.headers.get("Content-Type");

    if (contentType && contentType.includes("application/json")) {
      // Handle JSON response
      let data = await response.json();
      return data[0].generated_text;
    } else if (contentType && contentType.includes("text")) {
      // Handle text stream
      const reader = response.body.getReader();
      let translation = "";

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunkText = new TextDecoder("utf-8")
          .decode(value)
          .replace(/^data:/, "");
        const chunkData = JSON.parse(chunkText);
        if (chunkData.generated_text !== null) {
          translation = chunkData.generated_text;
        }
      }

      return translation;
    } else {
      throw new Error("Unsupported content type");
    }
  } catch (error) {
    console.error("Error in postRequestAndHandleResponse:", error);
    throw error;
  }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let url = new URL(request.url);
  let query = url.searchParams;
  let text = query.get("text");
  let direction = query.get("direction") || "en";
  let data = translate(text!, "bo", direction);
  return data;
};
