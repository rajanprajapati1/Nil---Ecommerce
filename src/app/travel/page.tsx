import { Suspense } from "react";
import TravelPage from "./TravelPage";

export default function TravelRoute() {
  return (
    <Suspense fallback={<div style={{ padding: "120px 64px", fontSize: "0.75rem", letterSpacing: "2px" }}>LOADING...</div>}>
      <TravelPage />
    </Suspense>
  );
}
