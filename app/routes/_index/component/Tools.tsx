import { NavLink } from "@remix-run/react";
import { Card } from "flowbite-react";

import { motion } from "framer-motion";
import uselitteraTranlation from "~/component/hooks/useLitteraTranslation";
import { ModalType, models } from "~/helper/models";

type EachProps = {
  model: ModalType;
};

function Tools() {
  return (
    <main className="flex lg:h-[80vh] justify-center md:pt-[100px]">
      <div className="text-center w-full lg:max-w-7xl mx-auto p-2 md:p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
          {models.map((model, index) => (
            <EachModel key={model.name} model={model} />
          ))}
        </div>
      </div>
    </main>
  );
}

function EachModel({ model }: EachProps) {
  const { name, desc, icon, link } = model;
  const { translation, locale } = uselitteraTranlation();
  const isEnglish = locale === "en_US";
  return (
    <NavLink
      prefetch="intent"
      to={"/model/" + link}
      className="w-full"
      unstable_viewTransition
    >
      {({ isTransitioning }) => (
        <motion.div whileHover={{ scale: 0.98 }}>
          <Card
            theme={{
              root: {
                base: "flex rounded-lg border border-neutral-200 bg-shadow-md dark:border-secondary-700 bg-neutral dark:bg-secondary-800",
                children: `flex flex-col justify-start items-start gap-2 md:gap-3 ${
                  isEnglish ? "font-poppins" : "font-monlam"
                }`,
              },
            }}
            className="h-full w-full  flex flex-col p-6"
            renderImage={() => (
              <div
                className="flex justify-start mb-2 md:mb-3 text-secondary-700 dark:text-secondary-400"
                style={
                  isTransitioning
                    ? {
                        viewTransitionName: "icon-transition",
                      }
                    : undefined
                }
              >
                {icon}
              </div>
            )}
          >
            <h2
              className={`text-neutral-900 ${
                isEnglish
                  ? "text-2xl md:text-3xl font-[500]"
                  : "text-xl md:text-2xl  mt-2 md:mt-3"
              }`}
            >
              {translation[name]}
            </h2>
            <p
              className={`text-gray-400 ${
                isEnglish ? "text-base font-normal" : "text-[0.7rem]"
              }`}
            >
              {translation[desc]}
            </p>
          </Card>
        </motion.div>
      )}
    </NavLink>
  );
}

export default Tools;
