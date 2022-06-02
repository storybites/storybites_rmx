import { useCallback, useRef } from "react";

const useDebouncedCallback = (func: any, wait: number) => {
    const timeout = useRef<any>();

    return useCallback(
        (...args) => {
            const later = () => {
                clearTimeout(timeout.current);
                func(...args);
            };

            clearTimeout(timeout.current);
            timeout.current = setTimeout(later, wait);
        },
        [func, wait]
    );
};

export default useDebouncedCallback;
