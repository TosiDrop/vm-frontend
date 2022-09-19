import { useState } from "react";
import copy from "copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

interface Props {
  text: string;
}

const Copyable = ({ text }: Props) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const triggerTooltip = () => {
    copy(text);
    setIsTooltipOpen(true);
    setTimeout(() => {
      setIsTooltipOpen(false);
    }, 1000);
  };

  return (
    <div className="w-full flex flex-row items-center relative">
      <FontAwesomeIcon
        className="mr-2.5 cursor-pointer"
        onClick={() => triggerTooltip()}
        icon={faCopy}
      />
      <input
        className={`w-full rounded-lg bg-transparent border-gray-400 border p-1`}
        type="text"
        value={text}
        disabled={true}
      ></input>
      <div
        className={`p-2.5 left-8 rounded-lg absolute tooltip ${
          isTooltipOpen ? "visible" : "invisible"
        }`}
      >
        copied!
      </div>
    </div>
  );
};

export default Copyable;
