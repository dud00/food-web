import SignupWizard from "@/components/signup/SignupWizard";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <SignupWizard />
      </div>
    </main>
  );
}
