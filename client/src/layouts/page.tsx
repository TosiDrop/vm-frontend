import MobileMenu from "src/components/MobileMenu";
import Menu from "../components/Menu";

interface Props {
  children: JSX.Element;
}

const Page = ({ children }: Props) => {
  return (
    <div className="w-full max-w-8xl p-5 pt-14 flex flex-row gap-8">
      <Menu></Menu>
      <MobileMenu></MobileMenu>
      <div className="w-full flex flex-col gap-8">{children}</div>
    </div>
  );
};

export default Page;
