
import RevenueByHotel from "./RevenueByHotel"
import OccupancyByHotel from "./OccupancyByHotel"
import RevenueByChannel from "./RevenueByChanel"
import PaymentSource from "./PaymentBySource"
import Reveal from "../../../hooks/Reveal"
import { useTranslation } from "react-i18next";

const RevenueChartsSection = () => {
  const { t } = useTranslation("dashboard");
  return (
    <div className="w-[90%]  flex flex-col gap-12 pt-12 pbe-20 border-b border-zinc-300">
        <div className='w-full flex '>
        <h2 className="text-xl font-semibold">{t("revenueOccupancyTrends")}</h2>
        </div>
        <div className="flex flex-wrap w-full justify-center">
          
          <Reveal delay={0} className="w-1/2 min-w-110">
           <RevenueByHotel/>
           </Reveal>
           <Reveal delay={0.2} className="w-1/2 min-w-110">
           <OccupancyByHotel/>
          </Reveal>
            <Reveal delay={0.4} className="w-1/2 min-w-110">
           <RevenueByChannel/>
           </Reveal>
            <Reveal delay={0.6} className="w-1/2 min-w-110">
           <PaymentSource/>
            </Reveal>
            
        </div>
    </div>
  )
}

export default RevenueChartsSection