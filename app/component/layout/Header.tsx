import {
  Form,
  NavLink,
  useRouteLoaderData,
  useLoaderData,
  Link,
} from "@remix-run/react";
import { Dropdown } from "flowbite-react";
import { useState } from "react";
import { HiLogout } from "react-icons/hi";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import uselitteraTranlation from "../hooks/useLitteraTranslation";
import TranslationSwitcher from "../TranslationSwitcher";
import { IoMdGlobe } from "react-icons/io";
import DarkModeSwitcher from "../DarkModeSwitcher";
import { motion } from "framer-motion";
function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const { isEnglish, translation } = uselitteraTranlation();
  const data = useRouteLoaderData("root");
  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  };
  return (
    <nav
      className={`flex flex-col lg:flex-row  ${
        isEnglish ? "font-poppins" : "font-monlam"
      }`}
    >
      <div className="flex p-3 items-center justify-between  w-full bg-white dark:bg-slate-700 dark:text-gray-200 ">
        <NavLink
          className="flex items-center gap-2 text-xl"
          prefetch="intent"
          unstable_viewTransition
          to="/"
        >
          <img
            src="/assets/logo.png"
            width="40px"
            alt="Monalm AI"
            className="relative -top-1"
          />
          {translation.monlamAI}
        </NavLink>
        <button
          className="block lg:hidden z-50"
          onClick={() => setShowMenu((p) => !p)}
        >
          {showMenu ? <RxCross1 /> : <GiHamburgerMenu />}
        </button>
        <div className="hidden lg:flex gap-2 ml-8 flex-1 justify-between bg-white dark:bg-slate-700 dark:text-gray-200">
          <div className="flex items-center gap-8 text-sm ml-4">
            <AboutLink />
            {data?.isJobEnabled && <JobLink />}
            <TeamLink />
          </div>
          <div className="flex items-center gap-4 mr-7">
            <TranslationSwitcher />
            <Menu />
          </div>
        </div>
        {/* mobile view */}
        <motion.div
          animate={showMenu ? "open" : "closed"}
          variants={variants}
          className="absolute top-0 left-0 right-0 w-full h-full bg-white shadow-lg z-40"
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col gap-4 p-5">
            <NavLink
              className="flex items-center gap-2 text-xl"
              prefetch="intent"
              unstable_viewTransition
              to="/"
              onClick={() => setShowMenu((p) => !p)}
            >
              <img
                src="/assets/logo.png"
                width="40px"
                alt="Monalm AI"
                className="relative -top-1"
              />
              {translation.monlamAI}
            </NavLink>
            <AboutLink />
            <JobLink />
            <TeamLink />

            <TranslationSwitcher />
            <Menu />
          </div>
        </motion.div>
      </div>
    </nav>
  );
}

export default Header;

function Menu() {
  const { user } = useRouteLoaderData("root");
  const { translation, locale } = uselitteraTranlation();
  let isEnglish = locale === "en_US";
  if (!user) return null;
  return (
    <Dropdown
      label={user.email}
      dismissOnClick={false}
      className="bg-white"
      renderTrigger={() => (
        <img
          className="h-8 w-8 rounded-full cursor-pointer"
          src={user.picture}
          title={user.email}
          alt={user.email}
          referrerPolicy="no-referrer"
        />
      )}
    >
      <Dropdown.Header>
        <span className="block truncate text-sm font-medium font-poppins">
          {user.email}
        </span>
      </Dropdown.Header>
      <hr />
      <Dropdown.Item className="px-3 py-2">
        <DarkModeSwitcher />
      </Dropdown.Item>
      <hr />

      <Dropdown.Item icon={HiLogout} className="mt-2">
        <Form method="post" action="/logout">
          <button className={isEnglish ? "font-poppins" : "font-monlam"}>
            {translation.logout}
          </button>
        </Form>
      </Dropdown.Item>
    </Dropdown>
  );
}

function JobLink() {
  const { translation, locale } = uselitteraTranlation();
  return (
    <NavLink
      to="/jobs"
      className="text-base"
      prefetch="intent"
      unstable_viewTransition
    >
      {translation.jobs}
    </NavLink>
  );
}

function AboutLink() {
  const { translation, locale } = uselitteraTranlation();
  return (
    <NavLink
      to="/about"
      className="text-base"
      prefetch="intent"
      unstable_viewTransition
    >
      {translation.aboutUs}
    </NavLink>
  );
}

function TeamLink() {
  const { translation, locale } = uselitteraTranlation();
  return (
    <NavLink
      to="#"
      className="text-base capitalize text-gray-300 cursor-default"
      prefetch="intent"
      unstable_viewTransition
    >
      {translation.team}
    </NavLink>
  );
}
