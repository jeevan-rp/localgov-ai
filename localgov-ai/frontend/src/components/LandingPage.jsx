import { Landmark, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react'

export default function LandingPage({ onStart }) {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[80vh] animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-forest-700 p-6 rounded-3xl mb-8 shadow-xl text-white transform hover:scale-105 transition-transform duration-300">
        <Landmark size={64} />
      </div>
      
      <h1 className="text-5xl md:text-6xl font-extrabold text-stone-900 dark:text-white text-center tracking-tight mb-6">
        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-600 to-emerald-500">LocalGov AI</span>
      </h1>
      
      <p className="text-xl text-stone-600 dark:text-stone-300 text-center max-w-2xl mb-12 leading-relaxed">
        Your intelligent assistant for navigating government services. 
        Find the right documents, calculate fees, and get tailored guidance in seconds.
      </p>

      <button 
        onClick={onStart}
        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 font-bold text-white bg-forest-600 rounded-full overflow-hidden transition-all hover:bg-forest-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-forest-300 shadow-lg dark:focus:ring-forest-800"
      >
        <span className="relative z-10 text-lg">Get Started Now</span>
        <ArrowRight className="relative z-10 transition-transform group-hover:translate-x-1" size={20} />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-4xl w-full text-center">
        <div className="flex flex-col items-center p-6 glass rounded-2xl">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full text-emerald-600 dark:text-emerald-400 mb-4">
            <Zap size={28} />
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">Lightning Fast</h3>
          <p className="text-stone-600 dark:text-stone-400 text-sm">Instantly find exactly what documents you need without endless searching.</p>
        </div>
        
        <div className="flex flex-col items-center p-6 glass rounded-2xl">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400 mb-4">
            <ShieldCheck size={28} />
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">Accurate Info</h3>
          <p className="text-stone-600 dark:text-stone-400 text-sm">Up-to-date requirements dynamically fetched for your specific state and district.</p>
        </div>
        
        <div className="flex flex-col items-center p-6 glass rounded-2xl">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full text-purple-600 dark:text-purple-400 mb-4">
            <Globe size={28} />
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">Fully Online</h3>
          <p className="text-stone-600 dark:text-stone-400 text-sm">Access the platform from anywhere, on any device. Your profile syncs automatically.</p>
        </div>
      </div>
    </div>
  )
}
