import { useTranslation } from 'react-i18next'
import BookingCards from '../../components/manager/Bookings/BookingCards'
import BookingsTable from '../../components/manager/Bookings/BookingsTable'
export default function ManagerDashboard() {
  const { t } = useTranslation("dashboard")

  return (
    <div className=" p-8 pt-16 pl-16 flex flex-col justify-center items-center ">
      <div className="w-[90%] flex p-4 border-b border-zinc-300 dark:border-zinc-100">

         <h1 className='text-2xl font-bold text-zinc-800 dark:text-zinc-300 '> Bookings Information</h1>
      </div >


    <BookingCards/>
    <div className="w-full flex flex-col gap-12 pt-12 pbe-20 border-b border-zinc-300 justify-center items-center">
    <BookingsTable/>

    </div>
      

    </div>
  )
}