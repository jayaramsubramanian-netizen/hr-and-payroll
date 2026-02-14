import React from "react";
import AccessDenied from "./components/AccessDenied";

const DeniedPage: React.FC = () => (
  <AccessDenied onGoHome={() => window.history.back()} />
);

export default DeniedPage;
