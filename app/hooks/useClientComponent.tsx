import React, { useEffect, useState } from "react";

export default function useClientComponent(Component: React.ReactNode): any {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? Component : PlaceHolder;
}

function PlaceHolder() {
  return null;
}
