import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTelegram } from "@fortawesome/free-brands-svg-icons";
import "./index.scss";

const CLASS = "feedback-page";

function Feedback() {
    return (
        <div className={`${CLASS}`}>
            <h1 className={`${CLASS}__title`}>Feedback</h1>
            <div className={`${CLASS}__content ${CLASS}__address-list`}>
                <a
                    href="https://5c3i0k2q3p5.typeform.com/to/VIPV8H2l"
                    target="_blank"
                    rel="noreferrer"
                >
                    <div className={`${CLASS}__content-btn`}>
                        TosiDrop Feedback Form
                    </div>
                </a>
                <a
                    href="https://discord.gg/S85CKeyHTc"
                    target="_blank"
                    rel="noreferrer"
                >
                    <div className={`${CLASS}__content-btn`}>
                        Discuss on Discord <FontAwesomeIcon icon={faDiscord} />
                    </div>
                </a>
                <a
                    href="http://t.me/anetabtc"
                    target="_blank"
                    rel="noreferrer"
                >
                    <div className={`${CLASS}__content-btn`}>
                        Discuss on Telegram{" "}
                        <FontAwesomeIcon icon={faTelegram} />
                    </div>
                </a>
                <a
                    href="https://5c3i0k2q3p5.typeform.com/to/sJreyiJv"
                    target="_blank"
                    rel="noreferrer"
                >
                    <div
                        className={`${CLASS}__content-btn ${CLASS}__content-btn-last`}
                    >
                        Distribute Your Token
                    </div>
                </a>
            </div>
        </div>
    );
}

export default Feedback;
