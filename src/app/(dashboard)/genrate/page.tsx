"use client";

import AiSummary from "@/src/componets/ai/AiSummary.Pannel";
import Nav from "../../../componets/layout/Nav"


const page = () => {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Nav/>
      <AiSummary />
    </div>
  );
};

export default page;
