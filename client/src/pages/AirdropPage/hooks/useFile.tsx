import { useRef } from "react";
import { AirdropAddress } from "src/entities/common.entities";

const useFile = ({ setAddressList }: { setAddressList: Function }) => {
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
                setAddressList(addressAmountArray);
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

export const csvToArray = (csv: string): string[] => {
    csv = csv.replaceAll("\r", ""); // for windows line ending
    const parsedCsv = csv.split("\n");
    if (parsedCsv[parsedCsv.length - 1] === "") parsedCsv.pop();
    return parsedCsv;
};

export const splitAmountArray = (
    addressAmountParsed: string[]
): AirdropAddress[] => {
    const res: AirdropAddress[] = [];
    let temp: string[] = [];
    for (let addressAmountInfo of addressAmountParsed) {
        temp = addressAmountInfo.split(",");
        res.push({
            address: temp[0],
            amount: Number(Number(temp[1])),
        });
    }
    return res;
};
