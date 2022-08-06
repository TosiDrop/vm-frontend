import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import useComponentVisible from "src/hooks/useComponentVisible";

const CatalystPopUp = () => {
    const CATALYST_LINK = "https://linktr.ee/tosidrop.catalystf9";
    const {visible, setVisible, ref} = useComponentVisible(false)

    useEffect(() => {
        setTimeout(() => {
            setVisible(true);
        }, 1500);
    }, []);

    return (
        <div
            className={`w-full max-w-md px-5 pb-5 absolute text bottom-0 left-0 duration-200 ${
                visible ? "translate-x-0" : "-translate-x-full"
            }`}
            ref={ref}
        >
            <div className={`body-background p-5 rounded-2xl shadow-xl`}>
                <div className="flex flex-row items-center">
                    <p className="text-2xl font-medium">
                        We’re on Catalyst F9!
                    </p>
                    <FontAwesomeIcon
                        className="ml-auto cursor-pointer"
                        icon={faXmark}
                        onClick={() => setVisible(false)}
                    ></FontAwesomeIcon>
                </div>
                <p className="mt-5">
                    TosiDrop is building cross-chain infrastructure for Ergo and
                    Cardano. Check out our catalyst proposals on Project
                    Catalyst F9 and vote for us! Let’s
                    build a better future together.
                </p>
                <div className="flex w-full mt-5">
                    <a
                        href={CATALYST_LINK}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto"
                    >
                        <button className="tosi-button px-5 py-2.5 rounded-lg">
                            Let's go!
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CatalystPopUp;
