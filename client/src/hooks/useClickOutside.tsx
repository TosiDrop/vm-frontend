import { useCallback } from "react";
import { useEffect, useRef } from "react";

const useClickOutside = (action: Function) => {
  const ref = useRef(null);

  const handleClickOutside = useCallback(
    (event: any) => {
      if (ref.current && !(ref.current as any).contains(event.target)) {
        action();
      }
    },
    [action],
  );

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  return ref;
};

export default useClickOutside;
