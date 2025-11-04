import Link from "next/link";

const miniApps = [
  {
    name: "Snake Game",
    path: "/snake",
    emoji: "🐍",
    description: "Classic snake game with a twist",
    color: "from-green-400 to-emerald-600",
    hoverColor: "hover:from-green-500 hover:to-emerald-700"
  },
  {
    name: "Todo List",
    path: "/todo",
    emoji: "✅",
    description: "Get things done, vibes edition",
    color: "from-blue-400 to-cyan-600",
    hoverColor: "hover:from-blue-500 hover:to-cyan-700"
  },
  {
    name: "Whack-A-Mole",
    path: "/whack-a-mole",
    emoji: "🔨",
    description: "Smash those moles!",
    color: "from-orange-400 to-red-600",
    hoverColor: "hover:from-orange-500 hover:to-red-700"
  },
  {
    name: "Memory Game",
    path: "/memory",
    emoji: "🧠",
    description: "Test your memory skills",
    color: "from-pink-400 to-rose-600",
    hoverColor: "hover:from-pink-500 hover:to-rose-700"
  },
  {
    name: "Drawing Board",
    path: "/draw",
    emoji: "🎨",
    description: "Unleash your creativity",
    color: "from-yellow-400 to-amber-600",
    hoverColor: "hover:from-yellow-500 hover:to-amber-700"
  },
  {
    name: "Calculator",
    path: "/calculator",
    emoji: "🔢",
    description: "Crunch those numbers",
    color: "from-teal-400 to-cyan-600",
    hoverColor: "hover:from-teal-500 hover:to-cyan-700"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-16 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-green-400 to-orange-400 text-transparent bg-clip-text animate-gradient">
            Bad Vibecoding
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-4">
            Where code meets vibes ✨
          </p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            A collection of mini-apps and games built with good vibes only. 
            Pick your adventure below!
          </p>
        </div>

        {/* Mini Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {miniApps.map((app, index) => (
            <Link 
              key={app.path}
              href={app.path}
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-slate-500">
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {app.emoji}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-slate-300">
                    {app.name}
                  </h3>
                  <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                    {app.description}
                  </p>
                  
                  {/* Arrow indicator */}
                  <div className="mt-4 flex items-center text-slate-500 group-hover:text-white transition-colors">
                    <span className="text-sm font-medium">Launch</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-slate-500">
          <p className="mb-2">Built with Next.js, React, and TailwindCSS</p>
          <p className="text-sm">More mini-apps coming soon... 🚀</p>
        </div>
      </main>
    </div>
  );
}
