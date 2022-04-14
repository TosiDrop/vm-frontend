import { Dropdown } from "react-bootstrap";
import useAddressList from "./useAddressList";
import "./index.scss";

const CLASS = "airdrop-page";

const Airdrop = () => {
    const { addressList } = useAddressList();

    return (
        <div className={CLASS}>
            <h1 className={`${CLASS}__title`}>Airdrop Tokens</h1>
            <div className={`${CLASS}__content ${CLASS}__select`}>
                <Dropdown className={`${CLASS}__dropdown`}>
                    <Dropdown.Toggle>Select Token</Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">
                            Another action
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-3">
                            Something else
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <button className={`${CLASS}__button`}>Add Addresses</button>
            </div>
            <div className={`${CLASS}__content ${CLASS}__address-list`}>
                <h1>Address List</h1>
                {addressList.map((addr) => {
                    return (
                        <div>
                            {addr.address}: {addr.amount}
                        </div>
                    );
                })}
            </div>
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
