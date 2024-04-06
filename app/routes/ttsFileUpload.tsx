import {
  ActionFunctionArgs,
  UploadHandler,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";

import { addFileInference, deleteInference } from "~/modal/inference.server";
import { getUser } from "~/modal/user.server";
import { auth } from "~/services/auth.server";
import { ttsUploadFile } from "~/services/ttsUploadFile.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method === "DELETE") {
    let formdata = await request.formData();
    let id = formdata.get("id") as string;
    if (request.method === "DELETE") {
      let delete_inference = await deleteInference({ id });
      return delete_inference;
    }
  }

  const uploadHandler: UploadHandler = unstable_composeUploadHandlers(
    ttsUploadFile,
    unstable_createMemoryUploadHandler()
  );

  let userdata = await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  let user = await getUser(userdata?._json.email);
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );
  const inputFileUrl = formData.get("file") as string;

  let inferenceData;
  try {
    var formdata = new FormData();
    formdata.append("link", inputFileUrl);
    const url =
      process.env.NODE_ENV === "development"
        ? process.env.FILE_SUBMIT_URL_DEV
        : process.env.FILE_SUBMIT_URL;
    let res = await fetch(url + `/tts/synthesis`, {
      method: "POST",
      body: formdata,
    });
    inferenceData = await res.json();
  } catch (e) {
    console.log(e);
  }

  let inference_new = await addFileInference({
    userId: user?.id,
    input: inputFileUrl,
    type: "file",
    model: "tts",
    jobId: inferenceData?.id,
  });
  return inference_new;
};