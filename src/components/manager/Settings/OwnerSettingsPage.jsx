import AccountInfoForm from "./AccountInfoForm";
import PasswordForm from "./PasswordForm";

export default function OwnerSettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <AccountInfoForm />
      <PasswordForm />
     
    </div>
  );
}