import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import Main from "~/component/Mainpage";

export const meta: MetaFunction = () => {
  return [
    { title: "Monlam Ai Tools" },
    { name: "description", content: "Tools in MonlamAi" },
  ];
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "icon",
      href: "/assets/logo.png",
      type: "image/png",
    },
  ];
};
export const loader: LoaderFunction = async () => {
  return { user: null };
};

export default function Index() {
  return <Main />;
}
