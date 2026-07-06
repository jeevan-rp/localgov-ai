import { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import ChecklistView from './components/ChecklistView'
import Profile from './components/Profile'
import Settings from './components/Settings'
import LandingPage from './components/LandingPage'
import { Landmark, Home, User, Settings as SettingsIcon } from 'lucide-react'

function App() {
  const [triageData, setTriageData] = useState(null)
  const [activeTab, setActiveTab] = useState('landing') // landing, home, profile, settings
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [language, setLanguage] = useState('English')

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const renderContent = () => {
    if (activeTab === 'landing') return <LandingPage onStart={() => setActiveTab('home')} />
    if (activeTab === 'profile') return <Profile />
    if (activeTab === 'settings') {
      return (
        <Settings 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          language={language} 
          setLanguage={setLanguage} 
        />
      )
    }
    
    return !triageData ? (
      <ChatInterface onComplete={setTriageData} />
    ) : (
      <ChecklistView data={triageData} onReset={() => setTriageData(null)} />
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* Navigation */}
      {activeTab !== 'landing' && (
        <>
          <nav className="w-full max-w-4xl mb-8 flex justify-center">
            <div className="glass dark:glass-dark rounded-full px-6 py-3 flex items-center gap-6 md:gap-12 shadow-sm">
              <button 
                onClick={() => setActiveTab('home')}
                className={`flex items-center gap-2 font-medium transition-colors ${activeTab === 'home' ? 'text-forest-600 dark:text-forest-400' : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'}`}
              >
                <Home size={18} /> <span className="hidden md:inline">Home</span>
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 font-medium transition-colors ${activeTab === 'profile' ? 'text-forest-600 dark:text-forest-400' : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'}`}
              >
                <User size={18} /> <span className="hidden md:inline">Profile</span>
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 font-medium transition-colors ${activeTab === 'settings' ? 'text-forest-600 dark:text-forest-400' : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'}`}
              >
                <SettingsIcon size={18} /> <span className="hidden md:inline">Settings</span>
              </button>
            </div>
          </nav>

          <header className="mb-8 text-center flex flex-col items-center">
            <div className="bg-forest-700 p-3 rounded-full mb-3 shadow-lg text-white">
              <Landmark size={32} />
            </div>
            <h1 className="text-4xl font-bold text-forest-900 dark:text-forest-100 tracking-tight transition-colors">LocalGov AI</h1>
            <p className="text-stone-500 dark:text-stone-400 mt-2 font-medium transition-colors">Navigating government services with ease.</p>
          </header>
        </>
      )}

      <main className="w-full max-w-4xl transition-all duration-500 ease-in-out flex justify-center">
        {renderContent()}
      </main>
      
      <footer className="mt-12 text-sm text-stone-400 dark:text-stone-500 transition-colors">
        &copy; {new Date().getFullYear()} LocalGov AI. Built for citizens.
      </footer>
    </div>
  )
}

export default App
