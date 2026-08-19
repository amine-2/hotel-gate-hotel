import { useAuth } from '../../auth/AuthContext'
import SummarySection from '../../components/manager/Overview/SummerySection'
import RevenueChartsSection from '../../components/manager/Overview/RevenueChartsSection'
import { useTranslation } from 'react-i18next'



export default function ManagerDashboard() {
  const { user, profile } = useAuth()
  const { t } = useTranslation("dashboard")


  

  return (
    <div className=" p-8 pt-16 pl-16 flex flex-col justify-center items-center ">
      <h1 className="text-3xl font-bold mb-6 text-zinc-800 dark:text-zinc-300 ">
        {t("welcome")}, {profile?.full_name || 'Manager'}
      </h1>

      <div className="w-[90%] flex p-4 border-b border-zinc-300 dark:border-zinc-100">
         <h1 className='text-2xl font-bold text-zinc-800 dark:text-zinc-300 '>{t("overview")}</h1>
      </div >

      <SummarySection/>
      <RevenueChartsSection/>
      

    </div>
  )
}