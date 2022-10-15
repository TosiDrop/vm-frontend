import { useSelector } from "react-redux";
import { RootState } from "src/store";

interface Props {
  children: JSX.Element;
}

export default function ThemeWrapper({ children }: Props) {
  const theme = useSelector((state: RootState) => state.global.theme);
  return (
    <div className={`app ${theme}`}>
      <div className="w-full text flex flex-col items-center">{children}</div>
    </div>
  );
}
