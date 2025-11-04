import Link from "next/link";

export default function TodoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-800 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Back button */}
        <Link 
          href="/"
          className="inline-flex items-center text-blue-300 hover:text-blue-100 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-12 text-center">
          <div className="text-8xl mb-6">✅</div>
          <h1 className="text-5xl font-bold text-white mb-4">Todo List</h1>
          <p className="text-2xl text-blue-300 mb-8">Coming Soon...</p>
          <p className="text-slate-400 mb-8">
            Manage your tasks with style and keep those vibes productive!
          </p>
          
          <div className="bg-slate-700/50 rounded-xl p-6 text-left">
            <h3 className="text-xl font-semibold text-white mb-3">Features:</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">✓</span>
                <span>Add, edit, and delete tasks</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">✓</span>
                <span>Mark tasks as complete</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">✓</span>
                <span>Filter by status (all, active, completed)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">✓</span>
                <span>Persistent storage with database</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

