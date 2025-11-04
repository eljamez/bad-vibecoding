import Link from "next/link";

export default function DrawPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-amber-800 to-yellow-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Back button */}
        <Link 
          href="/"
          className="inline-flex items-center text-yellow-300 hover:text-yellow-100 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-yellow-500/30 rounded-3xl p-12 text-center">
          <div className="text-8xl mb-6">🎨</div>
          <h1 className="text-5xl font-bold text-white mb-4">Drawing Board</h1>
          <p className="text-2xl text-yellow-300 mb-8">Coming Soon...</p>
          <p className="text-slate-400 mb-8">
            Unleash your creativity with a digital canvas and drawing tools!
          </p>
          
          <div className="bg-slate-700/50 rounded-xl p-6 text-left">
            <h3 className="text-xl font-semibold text-white mb-3">Features:</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">✓</span>
                <span>Multiple brush sizes and colors</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">✓</span>
                <span>Eraser and clear canvas</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">✓</span>
                <span>Save and download your artwork</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">✓</span>
                <span>Smooth drawing experience</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

