import React, { useEffect, useState } from "react";

export default function useClientComponent<T>(Component: T): T {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted ? Component : (PlaceHolder as any as T);
}

function PlaceHolder() {
    return <></>;
}
