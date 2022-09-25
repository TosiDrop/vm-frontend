import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import useComponentVisible from "src/hooks/useComponentVisible";

const AppPopUp = () => {
  const { visible, setVisible, ref } = useComponentVisible(false);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 1500);
  }, []);

  return (
    <div
      className={`z-50 w-full max-w-md px-5 pb-5 absolute text bottom-0 left-0 duration-200 ${
        visible ? "translate-x-0" : "-translate-x-full"
      }`}
      ref={ref}
    >
      <div className={`body-background p-5 rounded-2xl shadow-xl`}>
        <div className="flex flex-row items-center">
          <p className="text-2xl font-medium">We’ve moved TosiDrop!</p>
          <FontAwesomeIcon
            className="ml-auto cursor-pointer"
            icon={faXmark}
            onClick={() => setVisible(false)}
          ></FontAwesomeIcon>
        </div>
        <p className="mt-5">
          The TosiDrop application has moved to a new home at{" "}
          <b>app.tosidrop.io</b>! Please, update any bookmarks and authorize
          your wallet to the app and check that the site is{" "}
          <b>app.tosidrop.io</b> in your browser. Bookmark it to be safe.
        </p>
      </div>
    </div>
  );
};

export default AppPopUp;
