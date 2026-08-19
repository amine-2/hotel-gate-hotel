
import HotelRevenueChart from "./HotelRevenueChart";
import HotelBookingsChart from "./HotelBookingsChart";
import Reveal from "../../../../hooks/Reveal"

const RevenueChartsSection = () => {
  return (
    <div className="w-[90%]  flex flex-col gap-12 pt-12 pbe-20 border-b border-zinc-300">
        <div className='w-full flex '>
        <h2 className="text-xl font-semibold">Revenue & Bookings Trends</h2>
        </div>
        <div className="flex flex-wrap w-full justify-center">
          
          <Reveal delay={0} className="w-1/2 min-w-110">
           <HotelRevenueChart/>
           </Reveal>
          <Reveal delay={0} className="w-1/2 min-w-110">
           <HotelBookingsChart/>
           </Reveal>
           
            
        </div>
    </div>
  )
}

export default RevenueChartsSection