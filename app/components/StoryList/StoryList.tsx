import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

export default function Stories() {
  const fetcher = useFetcher();
  useEffect(() => {
    if (fetcher.type === "init") {
      fetcher.load("/stories?index");
    }
  }, [fetcher]);
  return <div>{JSON.stringify(fetcher.data)}</div>;
}
