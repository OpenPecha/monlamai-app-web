import { useLocation } from "@remix-run/react";
import { AiFillFacebook } from "react-icons/ai";
import instasvg from "~/styles/instagram.svg";
import twittersvg from "~/styles/twitter.svg";
import { AiFillInstagram } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
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
      color: "#b3b3b3",
    },
    {
      name: "instagram",
      link: "https://www.instagram.com/monlam_ai/",
      icon: <AiFillInstagram/>,
      color: "#b3b3b3",
    },
    {
      name: "twitter",
      link: "https://twitter.com/Monlam_AI",
      icon: <FaXTwitter/>,
      color: "#b3b3b3",
    },
  ];

  return (
    <footer
      className={` ${
        !isAboutPage ? "lg:fixed" : ""
      } bg-neutral-100 bottom-0 left-0 w-full p-3 dark:bg-[--card-bg] text-light_text-secondary dark:text-dark_text-tertiary shadow-md dark:shadow-none transition-all duration-500 `}
      style={{
        fontFamily: isEnglish ? "Inter" : "monlam",
        lineHeight: "normal",
      }}
    >
      <div className="mx-auto flex max-w-[1280px] flex-row items-center justify-between">
        <div className="text-sm   sm:text-center">
          <span className="flex md:hidden">
            <img src="/assets/logo.png" width="40px" alt="Monalm AI" />
          </span>
          <div className="hidden md:block hover:underline text-[1rem] cursor-default leading-relaxed text-center">
            {isEnglish ? "© Monlam AI 2024" : "© སྨོན་ལམ་རིག་ནུས། ༢༠༢༤"}
          </div>
        </div>
        <div className="flex flex-wrap items-center">
          <div className="text-[#b3b3b3] mr-3">Follow us on:</div>
          {logos.map((logo) => {
            return (
              <a
                key={logo.name}
                href={logo.link}
                target="_blank"
                rel="noreferrer"
                className={`mr-2 hover:underline md:mr-3 transition-all duration-500 `}
                style={{ color: logo.color, fontSize: 20 }}
                aria-label={logo.name}
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
