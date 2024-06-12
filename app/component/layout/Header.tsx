import { Form, NavLink, useRouteLoaderData, Link } from "@remix-run/react";
import { Button, CustomFlowbiteTheme, Dropdown } from "flowbite-react";
import { useState } from "react";
import { HiBriefcase, HiLogout } from "react-icons/hi";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import uselitteraTranlation from "../hooks/useLitteraTranslation";
import TranslationSwitcher from "../TranslationSwitcher";
import DarkModeSwitcher from "../DarkModeSwitcher";
import { FaQuoteRight } from "react-icons/fa";
import { ICON_SIZE } from "~/helper/const";
import { FaArrowRightFromBracket } from "react-icons/fa6";
function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const { isEnglish, translation } = uselitteraTranlation();
  const data = useRouteLoaderData("root");

  return (
    <nav
      className={`flex p-4 md:p-[24px] bg-neutral-100 dark:bg-surface-dark justify-center  flex-col lg:flex-row  ${
        isEnglish ? "font-poppins" : "font-monlam"
      } `}
    >
      <div className="flex  items-center justify-between  max-w-[1280px] w-full  ">
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
          className="block lg:hidden z-50 pr-2"
          onClick={() => setShowMenu((p) => !p)}
        >
          {showMenu ? <RxCross1 /> : <GiHamburgerMenu />}
        </button>
        <div className="hidden lg:flex gap-2 ml-8 flex-1 justify-between ">
          <div className="flex items-center gap-8 text-sm ml-4">
            <AboutLink />
            {data?.isJobEnabled && <JobLink />}
            <TeamLink />
          </div>
          <div className="flex items-center gap-4 mr-7">
            <DarkModeSwitcher />
            <TranslationSwitcher />
            <Menu />
          </div>
        </div>
        {/* mobile view */}
        <div
          className="hidden absolute bg-surface-light  top-0 left-0 right-0 w-full h-full  dark:bg-secondary-900 shadow-lg z-40"
          style={{ display: showMenu ? "block" : "" }}
        >
          <NavLink
            className="flex bg-neutral-100 dark:bg-secondary-900 items-center gap-2 text-xl min-h-[84px] p-4"
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
          <div className="flex flex-col gap-4 text-light_text-secondary dark:text-dark_text-secondary">
            <div onClick={() => setShowMenu((p) => !p)} className="px-3 pt-3 ">
              <AboutLink />
            </div>
            <Devider />
            <div onClick={() => setShowMenu((p) => !p)} className="px-3 ">
              {data?.isJobEnabled && <JobLink />}
            </div>
            {/* <div className="Separator self-stretch h-px bg-stone-300" />
            <div onClick={() => setShowMenu((p) => !p)} className="px-3">
              <TeamLink />
            </div> */}
            <Devider />
            <div onClick={() => setShowMenu((p) => !p)} className="px-3">
              <DarkModeSwitcher />
            </div>
            <Devider />
            <div className="px-3">
              <TranslationSwitcher />
            </div>
            <Devider />
            <Menu />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;

function Devider() {
  return (
    <div className="Separator self-stretch h-px bg-stone-300 dark:bg-secondary-700" />
  );
}

function Menu() {
  const { user } = useRouteLoaderData("root");
  const { translation, locale } = uselitteraTranlation();
  let isEnglish = locale === "en_US";
  const isTibetan = locale === "bo_TI";
  const customTheme: CustomFlowbiteTheme["button"] = {
    color: {
      primary: "bg-primary-500 hover:bg-primary-600",
      secondary: "bg-secondary-500 hover:bg-secondary-600 text-white",
    },
  };
  if (!user)
    return (
      <Form method="post" action="/auth0">
        <Button
          type="submit"
          className={`w-full ${isEnglish ? "font-poppins " : "font-monlam"}`}
          color="secondary"
          pill
          theme={customTheme}
        >
          {translation.login}
        </Button>
      </Form>
    );
  return (
    <>
      <Dropdown
        label={user.email}
        dismissOnClick={false}
        className="bg-white hidden md:block"
        renderTrigger={() => (
          <img
            className="h-8 w-8 rounded-full hidden md:block  cursor-pointer"
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
        <Dropdown.Item icon={HiLogout} className="mt-2">
          <Form method="post" action="/logout">
            <button className={isEnglish ? "font-poppins" : "font-monlam"}>
              {translation.logout}
            </button>
          </Form>
        </Dropdown.Item>
      </Dropdown>
      <Form method="post" action="/logout" className="md:hidden">
        <button
          className={`flex gap-2 px-3 text-secondary-500 dark:text-primary-500 ${
            isEnglish ? "font-poppins" : "font-monlam"
          }`}
        >
          <FaArrowRightFromBracket /> {translation.logout}
        </button>
      </Form>
    </>
  );
}

function JobLink() {
  const { translation, locale } = uselitteraTranlation();
  return (
    <NavLink
      to="/jobs"
      className="text-base  flex gap-2"
      prefetch="intent"
      unstable_viewTransition
    >
      <HiBriefcase size={ICON_SIZE} /> {translation.jobs}
    </NavLink>
  );
}

function AboutLink() {
  const { translation, locale } = uselitteraTranlation();
  return (
    <NavLink
      to="/about"
      className="text-base flex gap-2 "
      prefetch="intent"
      unstable_viewTransition
    >
      <FaQuoteRight size={ICON_SIZE} /> {translation.aboutUs}
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
      {/* {translation.team} */}
    </NavLink>
  );
}
