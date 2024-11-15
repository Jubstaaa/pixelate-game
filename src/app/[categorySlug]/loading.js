import React from "react";
import { Loader2 } from "lucide-react";

function Loading() {
  return (
    <div className="w-full h-64 flex items-center justify-center">
      <Loader2 className="w-20 h-20 animate-spin text-primary" />
    </div>
  );
}

export default Loading;
