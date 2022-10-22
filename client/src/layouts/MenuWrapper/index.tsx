import Menu from "src/components/Menu";

interface Props {
  children: JSX.Element;
}

export default function MenuWrapper({ children }: Props) {
  return (
    <div className="w-full max-w-8xl p-5 pt-14 flex flex-row gap-8">
      <Menu></Menu>
      <div className="w-full flex flex-col gap-8">{children}</div>
    </div>
  );
}
