import { useRef } from "react";
import { useDispatch } from "react-redux";
import { csvToArray, splitAmountArray } from "../utils";
import { showModal } from "src/reducers/globalSlice";
import { ModalTypes, InfoModalTypes } from "src/entities/common.entities";

const useFile = ({ handleAddressList }: { handleAddressList: Function }) => {
    const fileRef = useRef<any>(null);
    const dispatch = useDispatch();

    const parseFile = () => {
        const uploadedFile = fileRef.current.files[0];
        const reader = new FileReader();
        reader.readAsText(uploadedFile);
        reader.onload = function () {
            try {
                const addressAmountParsed = csvToArray(reader.result as string);
                const addressAmountArray =
                    splitAmountArray(addressAmountParsed);
                handleAddressList(addressAmountArray);
            } catch (e) {
                dispatch(
                    showModal({
                        modalType: ModalTypes.info,
                        details: {
                            text: "Invalid CSV file. Please refer to the documentation for the correct format.",
                            type: InfoModalTypes.failure,
                        },
                    })
                );
            }
        };
    };

    return {
        fileRef,
        parseFile,
    };
};

export default useFile;
