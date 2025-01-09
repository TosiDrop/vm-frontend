import network from "src/network";
import version from "src/version";

const Footer = () => {
  return (
    <div className="mt-auto w-full flex flex-col items-center opacity-50 p-5 text-xxs sm:text-sm">
      <div className="break-all text-center">Network: {network}</div>
      <div className="break-all text-center">UI version: {version}</div>
    </div>
  );
};

export default Footer;
