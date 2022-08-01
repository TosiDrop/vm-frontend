import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faInfoCircle,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { hideModal } from "src/reducers/globalSlice";
import { RootState } from "src/store";
import { InfoModalTypes } from "src/entities/common.entities";

export const InfoModal = () => {
    const dispatch = useDispatch();
    const { text, type } = useSelector(
        (state: RootState) => state.global.infoModalDetails
    );

    const renderIcon = () => {
        switch (type) {
            case InfoModalTypes.failure:
                return (
                    <div className="m-auto text-center text-failure">
                        <FontAwesomeIcon className="text-3xl" icon={faXmark} />
                    </div>
                );
            case InfoModalTypes.success:
                return (
                    <div className="m-auto text-center text-success">
                        <FontAwesomeIcon className="text-3xl" icon={faCheck} />
                    </div>
                );
            case InfoModalTypes.info:
            default:
                return (
                    <div className="m-auto text-center text">
                        <FontAwesomeIcon
                            className="text-3xl"
                            icon={faInfoCircle}
                        />
                    </div>
                );
        }
    };

    return (
        <>
            {renderIcon()}
            <div className="mt-5 text-center">{text}</div>
            <button
                className="tosi-button py-2.5 px-6 rounded-lg text-center mt-5 w-fit"
                onClick={() => dispatch(hideModal())}
            >
                Ok
            </button>
        </>
    );
};
