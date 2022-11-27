import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { PopUpInfo } from "src/entities/common.entities";
import useComponentVisible from "src/hooks/useComponentVisible";
import useErrorHandler from "src/hooks/useErrorHandler";
import { getPopUpInfo } from "src/services/common";

const PopUp = () => {
  const [popupInfo, setPopupInfo] = useState<PopUpInfo>({
    title: "",
    text: "",
    buttonText: "",
    buttonLink: "",
  });
  const { visible, setVisible, ref } = useComponentVisible(false);
  const { handleError } = useErrorHandler();

  const getPopUpInfoFromAPI = async () => {
    try {
      const popupInfoFromAPI = await getPopUpInfo();
      setPopupInfo(popupInfoFromAPI);
      setTimeout(() => {
        setVisible(true);
      }, 1000);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    getPopUpInfoFromAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setVisible]);

  return (
    <div
      className={`z-50 w-full max-w-md px-5 pb-5 absolute text bottom-0 left-0 duration-200 ${
        visible && popupInfo.title ? "translate-x-0" : "-translate-x-full"
      }`}
      ref={ref}
    >
      <div className={`body-background p-5 rounded-2xl shadow-xl`}>
        <div className="flex flex-row">
          <p className="text-2xl font-medium">{popupInfo.title}</p>
          <FontAwesomeIcon
            className="ml-auto cursor-pointer"
            icon={faXmark}
            onClick={() => setVisible(false)}
          ></FontAwesomeIcon>
        </div>
        <p className="mt-5">{popupInfo.text}</p>
        <div className="flex w-full mt-5">
          <a
            href={popupInfo.buttonLink}
            target="_blank"
            rel="noreferrer"
            className="ml-auto"
          >
            <button className="tosi-button px-5 py-2.5 rounded-lg">
              {popupInfo.buttonText}
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
