import { useLocation } from "@remix-run/react";
import { AiFillFacebook } from "react-icons/ai";
import instasvg from "~/styles/instagram.svg";
import twittersvg from "~/styles/twitter.svg";

import uselitteraTranlation from "../hooks/useLitteraTranslation";
function Footer() {
  let location = useLocation();
  let isAboutPage = location.pathname.includes("about");
  const { translation, locale } = uselitteraTranlation();
  let isEnglish = locale === "en_US";

  const logos = [
    {
      name: "facebook",
      link: "https://www.facebook.com/profile.php?id=100092133731838",
      icon: <AiFillFacebook />,
      color: "#3b5998",
    },
    {
      name: "instagram",
      link: "https://www.instagram.com/monlam_ai/",
      icon: <img src={instasvg} style={{ height: 34, objectFit: "contain" }} />,
      color: "#e4405f",
    },
    {
      name: "twitter",
      link: "https://twitter.com/Monlam_AI",
      icon: (
        <img src={twittersvg} style={{ height: 26, objectFit: "contain" }} />
      ),
      color: "#55acee",
    },
  ];

  return (
    <footer
      className={` ${
        !isAboutPage ? "lg:fixed" : ""
      } bottom-0 w-full p-3 bg-white dark:bg-gray-800 shadow-md dark:shadow-none transition-all duration-500 `}
      style={{
        fontFamily: isEnglish ? "Inter" : "monlam",
        lineHeight: "normal",
      }}
    >
      <div className="mx-auto max-w-screen-xl flex flex-col md:flex-row items-center md:justify-between">
        <div className="text-sm text-gray-400 sm:text-center">
          <div className="hover:underline text-[1rem] cursor-default leading-relaxed text-center">
            {isEnglish
              ? "© Monlam AI 2024"
              : "བདག་དབང་། © སྨོན་ལམ་བརྡ་འཕྲིན་ཞིབ་འཇུག་ཁང་། ༢༠༢༤"}
          </div>
        </div>
        <div className="flex flex-wrap items-center mt-3 sm:mt-2">
          {logos.map((logo) => {
            return (
              <a
                key={logo.name}
                href={logo.link}
                target="_blank"
                rel="noreferrer"
                className={`mr-2 hover:underline md:mr-3 transition-all duration-500 `}
                style={{ color: logo.color, fontSize: 26 }}
              >
                {logo.icon}
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
