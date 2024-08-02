import { initialize } from "unleash-client";

const unleash =
  process.env.NODE_ENV === "production"
    ? initialize({
        url: process.env.UNLEASH_FLAG_URL!,
        appName: "Default",
        customHeaders: { Authorization: process.env.UNLEASH_FLAG_KEY! },
      })
    : null;

const isJobEnabled = unleash?.isEnabled("isJobEnabled");
const enable_replacement_mt = unleash?.isEnabled("enable_replacement_mt");
const show_about_lama = unleash?.isEnabled("show_about_lama");
const file_upload_enable = unleash?.isEnabled("file_upload_enable");

export {
  isJobEnabled,
  enable_replacement_mt,
  show_about_lama,
  file_upload_enable,
};

export default unleash;
