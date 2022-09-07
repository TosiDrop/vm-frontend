import { useEffect, useRef } from "react";

const useClickOutside = (action: Function) => {
  const ref = useRef(null);

  const handleClickOutside = (event: any) => {
    if (ref.current && !(ref.current as any).contains(event.target)) {
      action();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return ref;
};

export default useClickOutside;
