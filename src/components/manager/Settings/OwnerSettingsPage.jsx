import AccountInfoForm from "./AccountInfoForm";
import PasswordForm from "./PasswordForm";
import ExchangeRates from "./ExchangeRates";
import AddOwnerForm from "./AddOwnerForm";

export default function OwnerSettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <AccountInfoForm />
      <PasswordForm />
      <AddOwnerForm />
      <ExchangeRates />
    </div>
  );
}