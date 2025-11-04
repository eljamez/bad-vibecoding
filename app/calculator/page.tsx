import Link from "next/link";

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-800 to-teal-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Back button */}
        <Link 
          href="/"
          className="inline-flex items-center text-teal-300 hover:text-teal-100 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-teal-500/30 rounded-3xl p-12 text-center">
          <div className="text-8xl mb-6">🔢</div>
          <h1 className="text-5xl font-bold text-white mb-4">Calculator</h1>
          <p className="text-2xl text-teal-300 mb-8">Coming Soon...</p>
          <p className="text-slate-400 mb-8">
            A sleek calculator for all your number-crunching needs!
          </p>
          
          <div className="bg-slate-700/50 rounded-xl p-6 text-left">
            <h3 className="text-xl font-semibold text-white mb-3">Features:</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start">
                <span className="text-teal-400 mr-2">✓</span>
                <span>Basic arithmetic operations</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-400 mr-2">✓</span>
                <span>Scientific calculator mode</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-400 mr-2">✓</span>
                <span>Keyboard support</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-400 mr-2">✓</span>
                <span>History of calculations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

