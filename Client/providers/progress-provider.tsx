"use client";

import React from "react";
import { Next13ProgressBar } from "next13-progressbar";

const ProgressProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Next13ProgressBar
        height="4px"
        color="#5045E5"
        options={{ showSpinner: false }}
        showOnShallow
      />
    </>
  );
};

export default ProgressProviders;
