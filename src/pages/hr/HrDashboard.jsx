import { useAuth } from '../../auth/AuthContext'
import { useTranslation } from 'react-i18next'
import HRStatsCards from "../../components/hr/Overview/HRStatsCards";
import StaffOverview from "../../components/hr/Overview/StaffOverview";
import RecruitmentOverview from "../../components/hr/Overview/RecruitmentOverview";
import RecentCandidates from "../../components/hr/Overview/RecentCandidates";
import Reveal from "../../hooks/Reveal"




export default function HrDashboard() {
  const { user, profile } = useAuth()
  const { t } = useTranslation("dashboard")


  

  return (
    <div className=" p-8 pt-16 pl-16 flex flex-col justify-center items-center ">
      <h1 className="text-3xl font-bold mb-6 text-zinc-800 dark:text-zinc-300 ">
        {t("welcome")}, {profile?.full_name || 'HR'}
      </h1>

      <div className="w-[90%] flex p-4 border-b border-zinc-300 dark:border-zinc-100 mb-16">
         <h1 className='text-2xl font-bold text-zinc-800 dark:text-zinc-300 '>{t("overview")}</h1>
      </div >
      <div className="w-[90%] flex flex-col gap-16">
        <Reveal delay={0} className="w-full min-w-110">
         <HRStatsCards />
        </Reveal>

      <Reveal delay={0.2} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StaffOverview />
        <RecruitmentOverview />
      </Reveal>
      <Reveal delay={0.4} className="w-full min-w-110">
      <RecentCandidates />
      </Reveal>
     </div>
    </div>
  )
}