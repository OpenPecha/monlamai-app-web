import React, { useState, useEffect } from "react";

const getDeviceInfo = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone;
  const isPWA = isStandalone ? "PWA" : "Browser";

  const isAndroid = /android/i.test(userAgent) && !/windows/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent) && !isIOS;
  const isWindows = /Windows/.test(userAgent);

  let deviceType = "Desktop";
  if (isAndroid) {
    deviceType = "Android";
  } else if (isIOS) {
    deviceType = "iOS";
  } else if (isMac) {
    deviceType = "Mac";
  } else if (isWindows) {
    deviceType = "Windows";
  }

  return {
    userAgent,
    isPWA,
    deviceType,
  };
};

export default getDeviceInfo;
