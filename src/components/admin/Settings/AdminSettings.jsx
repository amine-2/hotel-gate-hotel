import AccountInfoForm from "../../manager/Settings/AccountInfoForm";
import PasswordForm from "../../manager/Settings/PasswordForm";


export default function AdminSettings() {
  return (
    <div className="space-y-6 p-6">
      <AccountInfoForm />
      <PasswordForm />
    </div>
  );
}