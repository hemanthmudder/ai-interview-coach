import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Show,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

export default async function Home() {
  const { isAuthenticated } = await auth();

  // If already logged in, go directly to dashboard
  if (isAuthenticated) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">
          AI Interview Coach
        </h1>

        <p className="text-gray-400">
          Practice interviews and improve your resume using AI.
        </p>

        <div className="flex justify-center gap-4">
          <SignInButton
  mode="modal"
  forceRedirectUrl="/dashboard"
>
  <button className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700">
    Sign In
  </button>
</SignInButton>

<SignUpButton
  mode="modal"
  forceRedirectUrl="/dashboard"
>
  <button className="px-5 py-3 rounded-lg border border-gray-600">
    Sign Up
  </button>
</SignUpButton>
        </div>
      </div>
    </main>
  );
}