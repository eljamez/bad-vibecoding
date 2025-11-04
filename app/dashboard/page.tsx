import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto py-12 px-4">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text mb-4">
            Welcome to your Dashboard! 🎉
          </h1>
          
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
            <p className="text-green-400 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              You are successfully authenticated!
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-b border-slate-700 pb-6">
              <h2 className="text-2xl font-semibold text-slate-200 mb-4">
                Your Profile
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">👤</span>
                  <span className="font-medium text-slate-400">Name:</span>
                  <span className="text-slate-200">
                    {session.user?.name || "Not provided"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">📧</span>
                  <span className="font-medium text-slate-400">Email:</span>
                  <span className="text-slate-200">
                    {session.user?.email}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">🔑</span>
                  <span className="font-medium text-slate-400">User ID:</span>
                  <span className="text-slate-200 font-mono text-sm">
                    {session.user?.id}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-slate-200 mb-4">
                What's Next?
              </h2>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start">
                  <span className="text-indigo-400 mr-2">•</span>
                  <span>Explore other pages and mini-apps from the <Link href="/" className="text-indigo-400 hover:text-indigo-300 underline">homepage</Link></span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-400 mr-2">•</span>
                  <span>Your session is protected by NextAuth.js</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-400 mr-2">•</span>
                  <span>Try logging out and accessing this page again</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-400 mr-2">•</span>
                  <span>Check out the AUTH_SETUP.md for more features</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

