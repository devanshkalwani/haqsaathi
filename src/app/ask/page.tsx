import { Suspense } from "react";
import AskClient from "./AskClient";

// The client part reads the URL (?q=...), so it is wrapped in Suspense.
export default function Page() {
  return (
    <Suspense>
      <AskClient />
    </Suspense>
  );
}
