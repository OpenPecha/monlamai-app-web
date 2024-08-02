import { ActionFunction, json } from "@remix-run/node";
import { base64ToBuffer } from "~/component/utils/base64ToBuffer";
import inputReplace from "~/component/utils/ttsReplace.server";
import { API_ERROR_MESSAGE } from "~/helper/const";
import { checkIfInferenceExist, saveInference } from "~/modal/inference.server";
import { getUserDetail } from "~/services/session.server";
import getIpAddressByRequest from "~/component/utils/getIpAddress";

export const action: ActionFunction = async ({ request }) => {
  let ip = getIpAddressByRequest(request);
  let AMPLIFICATION_LEVEL = 5; //1-5 value is safe
  let user = await getUserDetail(request);

  const formdata = await request.formData();
  // const voiceType = formdata.get("voice") as string;
  const userInput = formdata.get("sourceText") as string;
  const API_URL = process.env.FILE_SUBMIT_URL as string;

  let data;
  try {
    let formData = new FormData();
    formData.append("input", inputReplace(userInput));

    formData.append("amplify", AMPLIFICATION_LEVEL.toString());

    let response = await fetch(API_URL + "/tts/playground", {
      method: "POST",
      body: formData,
      headers: {
        "x-api-key": process.env?.API_ACCESS_KEY!,
      },
    });
    data = await response.json();
  } catch (e) {
    return {
      error: API_ERROR_MESSAGE,
    };
  }
  const { output, responseTime } = data;

  const checkifModelExist = await checkIfInferenceExist(
    userInput,
    "tts",
    user?.id
  );

  if (!checkifModelExist) {
    const inferenceData = await saveInference({
      userId: user?.id,
      model: "tts",
      modelVersion: "v1",
      input: userInput,
      output,
      responseTime,
      ip,
    });
    return { data: output, inferenceData };
  } else {
    return { data: output, inferenceData: checkifModelExist };
  }
};
