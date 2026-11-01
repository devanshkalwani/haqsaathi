import { Suspense } from "react";
import SchemesClient from "./SchemesClient";

// The client part reads the URL (?category=...), so it is wrapped in Suspense.
export default function Page() {
  return (
    <Suspense>
      <SchemesClient />
    </Suspense>
  );
}
