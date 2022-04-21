import { useRef } from "react";
import { csvToArray, splitAmountArray } from "../utils";

const useFile = ({ handleAddressList }: { handleAddressList: Function }) => {
    const fileRef = useRef<any>(null);

    const parseFile = () => {
        try {
            const uploadedFile = fileRef.current.files[0];
            const reader = new FileReader();
            reader.readAsText(uploadedFile);
            reader.onload = function () {
                const addressAmountParsed = csvToArray(reader.result as string);
                const addressAmountArray =
                    splitAmountArray(addressAmountParsed);
                handleAddressList(addressAmountArray);
            };
        } catch (e) {
            // setPopUpError("File format is incorrect");
        }
    };

    return {
        fileRef,
        parseFile,
    };
};

export default useFile;
