import { Spinner } from "@nextui-org/react";
import React from "react";

function loading() {
  return (
    <div className="w-full h-64 flex items-center justify-center">
      <Spinner classNames={{ wrapper: "w-20 h-20" }} />
    </div>
  );
}

export default loading;
