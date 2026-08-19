import React from "react";
import TopHotelsChart from "./TopHotelsChart";
import VisitorsChart from "./VisitorsChart";
import Reveal from "../../../hooks/Reveal";

function ChartSection() {
  return (
    <div className="w-[90%]  flex flex-col gap-12 pt-12 pbe-20 border-b border-zinc-300">

     <div className='w-full flex '>
      <h2 className="text-xl font-semibold ">Trends and Insights</h2>
     </div>
 
      <div className=" flex flex-wrap w-full justify-center ">
        <Reveal delay={0} className="w-1/2 min-w-110">
         <TopHotelsChart />
        </Reveal>
        <Reveal delay={0.3} className="w-1/2 min-w-110">
          <VisitorsChart />
        </Reveal>
      </div>
    </div>
  );
}

export default ChartSection;
