import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import useComponentVisible from "src/hooks/useComponentVisible";

const AppPopUp = () => {
  const MINSWAP_ADA_CTOSI_LINK =
    "https://app.minswap.org/swap?currencySymbolA=&tokenNameA=&currencySymbolB=a8a1dccea2e378081f2d500d98d022dd3c0bd77afd9dbc7b55a9d21b&tokenNameB=63544f5349";
  const { visible, setVisible, ref } = useComponentVisible(false);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 1500);
  }, [setVisible]);

  return (
    <div
      className={`z-50 w-full max-w-md px-5 pb-5 absolute text bottom-0 left-0 duration-200 ${visible ? "translate-x-0" : "-translate-x-full"
        }`}
      ref={ref}
    >
      <div className={`body-background p-5 rounded-2xl shadow-xl`}>
        <div className="flex flex-row">
          <p className="text-2xl font-medium">
            Support and Decide Tosi's Future!
          </p>
          <FontAwesomeIcon
            className="ml-auto cursor-pointer"
            icon={faXmark}
            onClick={() => setVisible(false)}
          ></FontAwesomeIcon>
        </div>
        <p className="mt-5">
          You can govern the future of the TosiDrop platform and benefit from
          generated revenue use when you hold cTOSI, the TosiDrop platform
          token. cTOSI is available now on Minswap!
        </p>
        <div className="flex w-full mt-5">
          <a
            href={MINSWAP_ADA_CTOSI_LINK}
            target="_blank"
            rel="noreferrer"
            className="ml-auto"
          >
            <button className="tosi-button px-5 py-2.5 rounded-lg">
              Buy cTOSI
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AppPopUp;
