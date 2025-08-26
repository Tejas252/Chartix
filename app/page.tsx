import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-8">
      <SignedIn>
        <div className="text-center space-y-6 max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Welcome to Your Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            You're successfully signed in! Start exploring your personalized dashboard.
          </p>
          <div className="pt-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </SignedIn>
      
      <SignedOut>
        <div className="text-center space-y-6 max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Welcome to Our App
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Sign in to access your personalized dashboard and start your journey with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/sign-in"
              className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </SignedOut>
    </main>
  );
}
