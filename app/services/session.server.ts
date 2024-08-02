import { createCookieSessionStorage, createCookie } from "@remix-run/node";
import { getUser } from "~/modal/user.server";
import jwt from "jsonwebtoken";
// export the whole sessionStorage object

function getDate() {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  return expires;
}

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    maxAge: 604800, // one week (7 days * 24 hours * 60 minutes * 60 seconds)
    name: "_session_monlam", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [process.env.COOKIE_SECRET!], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

// you can also export the methods individually for your own usage
export async function getUserSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  let user = session.get("user");
  return user;
}

export async function getUserDetail(request: Request) {
  let userdata = await getUserSession(request);
  let user = null;
  if (userdata) {
    user = await getUser(userdata?._json.email);
  }
  return user;
}

export async function generateCSRFToken(request: Request, user: any) {
  let secretKey = process.env.API_ACCESS_KEY;
  let data = !!user ? user : {};
  const token = await jwt.sign(data, secretKey, { expiresIn: "1d" });
  return token;
}

export async function verify_token(token: string) {
  let secretKey = process.env.API_ACCESS_KEY;
  await jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      throw new Error("Failed to authenticate token");
    }
    // Save decoded information to request object
  });
  return true;
}

export let returnToCookie = createCookie("return-to", {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  maxAge: 60, // 1 minute because it makes no sense to keep it for a long time
  secure: process.env.NODE_ENV === "production",
});

export let { getSession, commitSession, destroySession } = sessionStorage;
