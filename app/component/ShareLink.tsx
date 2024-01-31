import React, { useState, useEffect, useMemo } from "react";
import { Button, Card, Dropdown, TextInput } from "flowbite-react";
import { FaFacebook, FaShare, FaTwitter, FaWhatsapp } from "react-icons/fa6";
import CopyToClipboard from "./CopyToClipboard";
import { useHref } from "@remix-run/react";

// Custom hook for getting share URLs
function useShareUrl(link: string) {
  const baseShareUrl = link;
  const shareText = "Visit this link ";

  const getPlatformShareUrl = (platformUrl: string) =>
    platformUrl
      .replace("{url}", encodeURIComponent(baseShareUrl))
      .replace("{text}", encodeURIComponent(shareText));

  return {
    whatsappUrl: getPlatformShareUrl(`whatsapp://send?text={text}%20{url}`),
    twitterUrl: getPlatformShareUrl(
      `https://twitter.com/share?url={url}&text={text}`
    ),
    facebookUrl: getPlatformShareUrl(
      `https://www.facebook.com/sharer/sharer.php?u={url}&t={text}`
    ),
  };
}

function SocialShareButton({ icon, onClick }) {
  return (
    <Button color="gray" onClick={onClick}>
      {icon}
    </Button>
  );
}

function ShareLink({ inferenceId }) {
  const [isOpen, setIsOpen] = useState(false);
  const link = inferenceId
    ? useMemo(
        () => window.location.origin + `/share/${inferenceId}`,
        [inferenceId]
      )
    : "";
  const { whatsappUrl, twitterUrl, facebookUrl } = useShareUrl(link);
  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setTimeout(() => setIsOpen(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  const openShareWindow = (url) => {
    window.open(url, "_blank");
    setIsOpen(false);
  };

  return (
    <Dropdown
      label="shareLink"
      placement="top"
      dismissOnClick={true}
      renderTrigger={() => (
        <div className="border-none cursor-pointer">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 15C16.9403 15 15.9662 15.3665 15.1973 15.9795L10.3933 12.9769C10.5356 12.3334 10.5356 11.6666 10.3933 11.023L15.1973 8.0205C15.9662 8.63348 16.9403 9 18 9C20.4853 9 22.5 6.98527 22.5 4.5C22.5 2.01473 20.4853 0 18 0C15.5147 0 13.5 2.01473 13.5 4.5C13.5 4.83553 13.537 5.16234 13.6067 5.47692L8.80266 8.47945C8.03377 7.86652 7.05975 7.5 6 7.5C3.51473 7.5 1.5 9.51473 1.5 12C1.5 14.4853 3.51473 16.5 6 16.5C7.05975 16.5 8.03377 16.1335 8.80266 15.5205L13.6067 18.5231C13.5357 18.8439 13.4999 19.1714 13.5 19.5C13.5 21.9853 15.5147 24 18 24C20.4853 24 22.5 21.9853 22.5 19.5C22.5 17.0147 20.4853 15 18 15Z"
              fill="black"
              fillOpacity="0.5"
            />
          </svg>
        </div>
      )}
      size="sm"
    >
      <Dropdown.Header>Share</Dropdown.Header>
      <div className="w-[15vw] md:max-w-[15vw] ">
        <div className="flex gap-2 justify-center mb-2 p-2 ">
          <TextInput type="text" value={link} readOnly />
          <CopyToClipboard textToCopy={link} />
        </div>
        <div className="flex justify-around">
          <SocialShareButton
            icon={<FaFacebook />}
            onClick={() => openShareWindow(facebookUrl)}
          />
          <SocialShareButton
            icon={<FaTwitter />}
            onClick={() => openShareWindow(twitterUrl)}
          />
          <SocialShareButton
            icon={<FaWhatsapp />}
            onClick={() => openShareWindow(whatsappUrl)}
          />
        </div>
      </div>
    </Dropdown>
  );
}

export default ShareLink;
