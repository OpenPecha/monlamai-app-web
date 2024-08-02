import { LinksFunction, LoaderFunction, redirect } from "@remix-run/node";

import { useSearchParams } from "@remix-run/react";
import { getInferences, getInferencesCount } from "~/modal/inference.server";
import InferenceList from "./component/inferencesList";
import { startOfMonth, endOfMonth } from "date-fns";
import DateStyle from "react-date-range/dist/styles.css"; // default style
import DateStyleDefault from "react-date-range/dist/theme/default.css";
import { getUsersCount } from "~/modal/user.server";
import UserCount from "./component/UserCount";
import InferenceCount from "./component/InferenceCount";
import { SelectionList } from "./component/SelectionList";
import LeafLetStyle from "leaflet/dist/leaflet.css";
import { getUserSession } from "~/services/session.server";
import { returnToCookie } from "~/services/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: DateStyle },
  { rel: "stylesheet", href: DateStyleDefault },
  { rel: "stylesheet", href: LeafLetStyle },
];

function isAdmin(user) {
  const adminDomains = process.env?.ADMIN_USERS_LIST?.split(",");
  const userEmail = user._json.email;

  return adminDomains.some((domain) => userEmail.includes(domain));
}

export const loader: LoaderFunction = async ({ request }) => {
  let userdata = await getUserSession(request);
  let url = new URL(request.url);
  let returnTo = "/admin";
  const check = url.searchParams.get("check");
  let headers = new Headers();
  if (returnTo) {
    headers.append("Set-Cookie", await returnToCookie.serialize(returnTo));
  }

  if (!userdata) return redirect("/login", { headers });
  if (!isAdmin(userdata)) return redirect("/");

  if (!check || check === "user") {
    let usercount = await getUsersCount();
    return { usercount };
  }
  if (check === "inferenceCount") {
    let inferenceCount = await getInferencesCount();
    return { inferenceCount };
  }
  if (check === "inferenceList") {
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    let inferences = await getInferences({
      startDate: startDate ?? startOfMonth(new Date()),
      endDate: endDate ?? endOfMonth(new Date()),
    });

    return { inferences };
  }
  return null;
};

function admin() {
  let [params, setParams] = useSearchParams();
  let check = params.get("check") || "user";
  function onChange(data) {
    setParams((prev) => {
      prev.set("check", data);
      return prev;
    });
  }
  return (
    <>
      <SelectionList handleSelect={onChange} currentState={check} />
      <div>
        {check === "user" && <UserCount />}
        {check === "inferenceCount" && <InferenceCount />}
        {check === "inferenceList" && <InferenceList />}
      </div>
    </>
  );
}

export default admin;
