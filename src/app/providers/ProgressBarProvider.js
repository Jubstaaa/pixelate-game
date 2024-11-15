"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const ProgressBarProvider = ({ children }) => {
  return (
    <>
      {children}
      <ProgressBar color="#18181b" />
    </>
  );
};

export default ProgressBarProvider;
