import type { LoaderFunctionArgs } from "@remix-run/node";
import { userPrefs } from "../services/cookies.server";
import { eng_languagesOptions } from "~/helper/const";
import { getHeaders } from "~/component/utils/getHeaders.server";
import { auth } from "~/services/auth.server";
import inputReplace from "~/component/utils/ttsReplace.server";
import {validateInput} from "~/lib/inputValidator.server";


export async function loader({ request }: LoaderFunctionArgs) {
  let url = new URL(request.url);
  let text = url.searchParams.get("text") as string;
  let user = await auth.isAuthenticated(request);
  const API_URL = process.env?.API_URL;
  let api_url = API_URL + "/api/v1/tts/stream";
  const validation = validateInput(text);
  const body = JSON.stringify({
    input: inputReplace(text),
  });
  let headers = await getHeaders(request,user);
  return fetch(api_url, {
    method: "POST",
    body,
    headers,
  });
}
