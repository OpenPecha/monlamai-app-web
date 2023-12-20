import { Link } from "@remix-run/react";

import { motion } from "framer-motion";
import uselitteraTranlation from "~/component/hooks/useLitteraTranslation";
import { ModalType, models } from "~/helper/models";

type EachProps = {
  model: ModalType;
};

function Tools() {
  let { translation, locale } = uselitteraTranlation();
  return (
    <main>
      <div className="py-5 md:pt-[40px]">
        <div className="text-center max-w-7xl mx-auto">
          <div
            className="px-3 mb-10 md:mb-20 leading-[normal] "
            style={{ fontSize: locale === "en_US" ? "2rem" : "2.7rem" }}
          >
            {translation.homepageHeading}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mx-10">
            {models.map((model, index) => (
              <EachModel key={model.name} model={model} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function EachModel({ model }: EachProps) {
  const { name, desc, icon, link, color } = model;
  const { translation, locale } = uselitteraTranlation();
  return (
    <Link prefetch="intent" to={"/model/" + link}>
      <motion.div
        whileHover={{ scale: 0.95 }}
        className="rounded-lg flex flex-col border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-lg hover:border-blue-600 hover:border-2 h-full gap-5 p-6 cursor-pointer"
      >
        <div
          style={{ fontSize: 35, color: color }}
          className="flex justify-center dark:mix-blend-exclusion dark:rounded-lg h-32"
        >
          {icon}
        </div>
        <div className="flex flex-col justify-between flex-1 gap-5">
          <h2
            className=" content-start"
            style={{ fontSize: locale === "en_US" ? "1.6rem" : "2.3rem" }}
          >
            {translation[name]}
          </h2>
          <p
            className="text-gray-400 "
            style={{ fontSize: locale === "en_US" ? "1rem" : "1.2rem" }}
          >
            {translation[desc]}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

export default Tools;