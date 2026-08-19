import { Moon, Languages, Power } from "lucide-react";
import { signOut } from "../services/authService";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/logo.svg";
import darkLogo from "../assets/dark-logo.svg";

export default function Navbar({ title = "Dashboard" }) {
  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className=" fixed h-14 w-screen
  bg-white text-zinc-900 border-zinc-200
  dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700
  flex items-center justify-between px-6 border-b z-50">
      {/* Left: Logo */}
      <div className="flex w-10 h-10 items-center">
  {/* Light logo */}
  <img
    src={logo}
    alt="logo"
    className="block dark:hidden w-full"
  />

  {/* Dark logo */}
  <img
    src={darkLogo}
    alt="logo"
    className="hidden dark:block w-full"
  />
</div>


      {/* Middle: Title */}
      <h1 className="text-lg font-extralight tracking-wide whitespace-nowrap text-zinc-500">
        {title}
      </h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Dark mode */}

        <ThemeToggle />

        {/* Language */}
        <LanguageSwitcher />

        {/* Sign out */}
        <div
          onClick={handleSignOut}
          className="p-2 rounded-lg  hover:bg-zinc-200 transition text-red-400"
          title="Sign out"
        >
          <Power size={18} />
        </div>
      </div>
    </div>
  );
}
