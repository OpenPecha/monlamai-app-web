import type {
  ActionFunction,
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { ErrorBoundary, shouldFetchInferenceList } from "../model.mt/route";
import ToolWraper from "~/component/ToolWraper";
import OCR from "./Component/OCR";
import { getUserFileInferences, updateEdit } from "~/modal/inference.server";
import { getUser } from "~/modal/user.server";
import { getUserSession } from "~/services/session.server";
import crop_style from "react-advanced-cropper/dist/style.css";

export const meta: MetaFunction<typeof loader> = ({ matches }) => {
  const parentMeta = matches.flatMap((match) => match.meta ?? []);
  parentMeta.shift(1);
  return [...parentMeta, { title: "Monlam | ཡིག་འཛིན་རིག་ནུས།" }];
};
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: crop_style },
];
export async function loader({ request }: LoaderFunctionArgs) {
  let userdata = await getUserSession(request);
  let model = "ocr";
  let user = null;
  if (userdata) {
    user = await getUser(userdata?._json.email);
  }
  let inferenceList = await shouldFetchInferenceList({
    request,
    model,
    user,
  });
  const userAgent = request.headers.get("User-Agent") || "";
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );
  let fileUploadUrl = process.env?.FILE_SUBMIT_URL as string;
  return { user: userdata, inferences: inferenceList, fileUploadUrl, isMobile };
}

export const action: ActionFunction = async ({ request }) => {
  let formdata = await request.formData();

  let method = request.method;
  if (method === "PATCH") {
    let edited = formdata.get("edited") as string;
    let inferenceId = formdata.get("inferenceId") as string;
    let updated = await updateEdit(inferenceId, edited);
    return updated;
  }
};

export default function Index() {
  return (
    <ToolWraper title="OCR">
      <div className="flex flex-col md:flex-row gap-2">
        <OCR />
      </div>
    </ToolWraper>
  );
}

export { ErrorBoundary };
