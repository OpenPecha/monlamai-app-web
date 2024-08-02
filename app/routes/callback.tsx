import { LoaderFunction, redirect } from "remix";
import { auth } from "~/services/auth.server";
import { returnToCookie } from "~/services/session.server";
import { commitSession, getSession } from "~/services/session.server";

export let loader: LoaderFunction = async ({ request }) => {
  // get the returnTo from the cookie
  let returnTo =
    (await returnToCookie.parse(request.headers.get("Cookie"))) ?? "/";

  // call authenticate to complete the login and set returnTo as the successRedirect
  return await auth.authenticate("auth0", request, {
    successRedirect: returnTo,
    failureRedirect: "/",
  });
};
