import useAddressList from "./hooks/useAddressList";
import useFile from "./hooks/useFile";
import { AirdropAddress } from "src/entities/common.entities";
import "./index.scss";
import useToken from "./hooks/useToken";
import Select from "./components/Select";

const CLASS = "airdrop-page";

const Airdrop = () => {
    const { addressList, setAddressList, shortenAddr } = useAddressList();
    const { fileRef, parseFile } = useFile({ setAddressList });
    const { tokens, selectedToken, setSelectedToken } = useToken();

    return (
        <div className={CLASS}>
            <h1 className={`${CLASS}__title`}>Airdrop Tokens</h1>
            <div className={`${CLASS}__content ${CLASS}__select`}>
                <Select></Select>
                <input
                    ref={fileRef}
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={() => parseFile()}
                    hidden
                />
                <label className={`${CLASS}__button`} htmlFor="file-upload">
                    Upload Addresses
                </label>
            </div>
            {addressList.length ? (
                <div className={`${CLASS}__content ${CLASS}__address-list`}>
                    <div className={`${CLASS}__address-list-header`}>
                        <h1>Address List</h1>
                        <span>{addressList.length} address added</span>
                    </div>
                    {addressList.map((addr: AirdropAddress, i: number) => {
                        return (
                            <div
                                key={i}
                                className={`${CLASS}__address-list-address`}
                            >
                                {shortenAddr(addr.address)}: {addr.amount}
                            </div>
                        );
                    })}
                </div>
            ) : null}
            <div className={`${CLASS}__content ${CLASS}__info`}>
                <h1>Airdrop Breakdown</h1>
                <div className={`${CLASS}__detail-row`}>Total token</div>
                <div className={`${CLASS}__detail-row`}>Total ADA to spend</div>
                <div className={`${CLASS}__detail-row`}>Estimated fee</div>
            </div>
            <button className={`${CLASS}__button ${CLASS}__button-airdrop`}>
                Send Airdrop
            </button>
        </div>
    );
};

export default Airdrop;

// npx prettier --write ./client/src/pages/AirdropPage --tab-width 4
