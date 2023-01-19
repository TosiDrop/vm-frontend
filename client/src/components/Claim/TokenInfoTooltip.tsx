import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  price: string;
  total: string;
}

export default function TokenInfoTooltip({ price, total }: Props) {
  return (
    <span className="tooltip-activator">
      <FontAwesomeIcon className="cursor-help" icon={faInfoCircle} />
      <div className="tooltip w-fit p-3.5 rounded-2xl right-5 bottom-5 absolute whitespace-nowrap">
        <div>{`Price: ${price}`}</div>
        <div>{`Total: ${total}`}</div>
      </div>
    </span>
  );
}
