import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { LuCopyCheck } from "react-icons/lu";
import { LuCopy } from "react-icons/lu";

let timer: any;

type CopyToClipboardProps = {
  textToCopy: string;
  onClick?: () => void;
};

const CopyToClipboard = ({ textToCopy, onClick }: CopyToClipboardProps) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setIsCopied(false);
    return () => {
      if (timer) clearTimeout(timer); //cleanup timer on unmount
    };
  }, [textToCopy]);

  const handleCopy = () => {
    if (onClick) {
      onClick();
    } else {
      navigator.clipboard.writeText(textToCopy);
    }

    setIsCopied(true);
    timer = setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div
      id="copyBtn"
      onClick={handleCopy}
      hidden={textToCopy === ""}
      title="copy"
      className="cursor-pointer"
    >
      {!isCopied ? (
        <LuCopy color="gray" size="20px" />
      ) : (
        <LuCopyCheck color="green" size="20px" />
      )}
    </div>
  );
};

export default CopyToClipboard;
