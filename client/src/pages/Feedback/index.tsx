import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTelegram } from "@fortawesome/free-brands-svg-icons";

function Feedback() {
  return (
    <div className="px-5 py-14 flex flex-col items-center">
      <div className="text-3xl mb-5">Feedback</div>
      <div className="background p-5 rounded-2xl w-full sm:w-96 ">
        <a
          href="https://5c3i0k2q3p5.typeform.com/to/VIPV8H2l"
          target="_blank"
          rel="noreferrer"
        >
          <div className="tosi-button p-5 rounded-2xl text-center w-full">
            TosiDrop Feedback Form
          </div>
        </a>
        <a
          href="https://discord.gg/C32Mm3j4fG"
          target="_blank"
          rel="noreferrer"
        >
          <div className="tosi-button p-5 rounded-2xl text-center w-full mt-5">
            Discuss on Discord <FontAwesomeIcon icon={faDiscord} />
          </div>
        </a>
        <a
          href="https://t.me/+FdDUmLsW8jI0YmUx"
          target="_blank"
          rel="noreferrer"
        >
          <div className="tosi-button p-5 rounded-2xl text-center w-full mt-5">
            Discuss on Telegram <FontAwesomeIcon icon={faTelegram} />
          </div>
        </a>
        <a
          href="https://5c3i0k2q3p5.typeform.com/to/sJreyiJv"
          target="_blank"
          rel="noreferrer"
        >
          <div className="tosi-button p-5 rounded-2xl text-center w-full mt-5">
            Distribute Your Token
          </div>
        </a>
      </div>
    </div>
  );
}

export default Feedback;
