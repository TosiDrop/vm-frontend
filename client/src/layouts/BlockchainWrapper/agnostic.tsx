interface Props {
  children: JSX.Element;
}

export default function Agnostic({ children }: Props) {
  return <>{children}</>;
}
