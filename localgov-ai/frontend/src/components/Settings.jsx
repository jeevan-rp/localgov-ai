import { Settings as SettingsIcon, Moon, Sun, Globe, ChevronDown } from 'lucide-react'

export default function Settings({ isDarkMode, setIsDarkMode, language, setLanguage }) {
  const languages = ['English', 'Hindi', 'Kannada', 'Tamil']

  return (
    <div className="glass rounded-3xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-8 border-b border-stone-200 dark:border-stone-700 pb-4">
        <SettingsIcon className="text-forest-600 dark:text-forest-400" />
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Appearance Toggle */}
        <div className="bg-white/80 dark:bg-stone-900/50 p-5 rounded-2xl border border-stone-100 dark:border-stone-700 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              {isDarkMode ? <Moon size={18} /> : <Sun size={18} />} Appearance
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Toggle between light and dark themes.
            </p>
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-14 h-8 rounded-full p-1 transition-colors relative ${isDarkMode ? 'bg-forest-600' : 'bg-stone-300'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>

        {/* Language Selection */}
        <div className="bg-white/80 dark:bg-stone-900/50 p-5 rounded-2xl border border-stone-100 dark:border-stone-700">
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-1">
            <Globe size={18} /> Language
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
            Select your preferred language for the interface.
          </p>
          <div className="relative">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full appearance-none bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 font-medium"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" size={18} />
          </div>
        </div>
      </div>
    </div>
  )
}
