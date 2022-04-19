import { useState, useEffect, useRef } from "react";

const useComponentVisible = (initialIsVisible: boolean) => {
    const [visible, setVisible] = useState(initialIsVisible);
    const ref = useRef(null);

    const handleClickOutside = (event: any) => {
        if (ref.current && !(ref.current as any).contains(event.target)) {
            setVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    return { ref, visible, setVisible };
};

export default useComponentVisible;
