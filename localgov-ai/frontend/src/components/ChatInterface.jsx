import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Send, MapPin, FileText, ChevronRight, Loader2 } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export default function ChatInterface({ onComplete }) {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Namaskara! Welcome to LocalGov AI. To get started, please select your state and district.' }
  ])
  const [step, setStep] = useState('region') // region, service, questions, loading
  const [regions, setRegions] = useState([])
  const [services, setServices] = useState([])
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  
  const [selectedStateStr, setSelectedStateStr] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [answers, setAnswers] = useState({})
  
  const endOfMessagesRef = useRef(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, step, regions, services, questions])

  useEffect(() => {
    // Fetch regions initially
    axios.get(`${API_BASE}/regions`)
      .then(res => setRegions(res.data))
      .catch(err => console.error(err))
  }, [])

  const addMessage = (msg) => setMessages(prev => [...prev, msg])

  const handleStateSelect = (stateName) => {
    addMessage({ type: 'user', text: stateName })
    setSelectedStateStr(stateName)
    addMessage({ type: 'bot', text: 'Which district are you located in?' })
  }

  const handleRegionSelect = (region) => {
    addMessage({ type: 'user', text: region.district })
    setSelectedRegion(region)
    setStep('loading')
    
    axios.get(`${API_BASE}/regions/${region.id}/services`)
      .then(res => {
        setServices(res.data)
        addMessage({ type: 'bot', text: 'Great. Which service do you need help with?' })
        setStep('service')
      })
      .catch(err => {
        console.error(err)
        setStep('error')
      })
  }

  const handleServiceSelect = (service) => {
    addMessage({ type: 'user', text: service.name })
    setSelectedService(service)
    setStep('loading')
    
    axios.get(`${API_BASE}/services/${service.id}/questions`)
      .then(res => {
        const qs = res.data
        if (qs.length === 0) {
          submitTriage(service.id, {})
        } else {
          setQuestions(qs)
          setCurrentQuestionIndex(0)
          addMessage({ type: 'bot', text: qs[0].text })
          setStep('questions')
        }
      })
      .catch(err => {
        console.error(err)
        setStep('error')
      })
  }

  const handleAnswerSelect = (answer) => {
    const currentQ = questions[currentQuestionIndex]
    addMessage({ type: 'user', text: answer })
    
    const newAnswers = { ...answers, [currentQ.field_name]: answer }
    setAnswers(newAnswers)
    
    if (currentQuestionIndex < questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIdx)
      addMessage({ type: 'bot', text: questions[nextIdx].text })
    } else {
      setStep('loading')
      submitTriage(selectedService.id, newAnswers)
    }
  }

  const submitTriage = (serviceId, userAnswers) => {
    addMessage({ type: 'bot', text: 'Analyzing your profile to generate a customized checklist...' })
    axios.post(`${API_BASE}/services/${serviceId}/triage`, { answers: userAnswers })
      .then(res => {
        setTimeout(() => {
          onComplete(res.data)
        }, 1000)
      })
      .catch(err => {
        console.error(err)
        addMessage({ type: 'bot', text: 'Sorry, I could not find a matching rule for your profile.' })
        setStep('error')
      })
  }

  return (
    <div className="glass rounded-3xl flex flex-col h-[600px] overflow-hidden w-full">
      <div className="bg-forest-600 dark:bg-forest-800 p-4 text-white flex items-center gap-3 shadow-md z-10">
        <div className="w-3 h-3 bg-green-400 dark:bg-green-500 rounded-full animate-pulse"></div>
        <h2 className="font-semibold text-lg">GovAssistant</h2>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-stone-50/50 dark:bg-stone-900/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
              m.type === 'user' 
                ? 'bg-forest-600 dark:bg-forest-700 text-white rounded-br-none' 
                : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-bl-none border border-stone-100 dark:border-stone-700'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {step === 'loading' && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 border border-stone-100 dark:border-stone-700">
              <Loader2 className="animate-spin text-forest-500 dark:text-forest-400" size={20} />
              <span className="text-stone-500 dark:text-stone-400 text-sm">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>
      
      <div className="p-4 bg-white dark:bg-stone-900/80 border-t border-stone-100 dark:border-stone-800 z-10 min-h-[100px] flex items-center justify-center">
        {step === 'region' && regions.length > 0 && !selectedStateStr && (
          <div className="flex flex-wrap gap-2 w-full">
            {[...new Set(regions.map(r => r.state))].map(stateName => (
              <button 
                key={stateName} 
                onClick={() => handleStateSelect(stateName)}
                className="flex items-center gap-2 px-4 py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-stone-100 border border-transparent rounded-xl transition-all font-medium text-stone-700 dark:text-stone-300 w-full md:w-auto active:scale-95"
              >
                <MapPin size={18} />
                {stateName}
              </button>
            ))}
          </div>
        )}

        {step === 'region' && selectedStateStr && (
          <div className="flex flex-wrap gap-2 w-full">
            {regions.filter(r => r.state === selectedStateStr).map(r => (
              <button 
                key={r.id} 
                onClick={() => handleRegionSelect(r)}
                className="flex items-center gap-2 px-4 py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-stone-100 border border-transparent rounded-xl transition-all font-medium text-stone-700 dark:text-stone-300 w-full md:w-auto active:scale-95"
              >
                <MapPin size={18} />
                {r.district}
              </button>
            ))}
          </div>
        )}

        {step === 'service' && services.length > 0 && (
          <div className="flex flex-col gap-2 w-full">
            {services.map(s => (
              <button 
                key={s.id} 
                onClick={() => handleServiceSelect(s)}
                className="flex items-center justify-between p-4 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-transparent rounded-xl transition-all text-left active:scale-95"
              >
                <div className="flex items-center gap-3 text-stone-700 dark:text-stone-300">
                  <div className="bg-white dark:bg-stone-700 p-2 rounded-lg shadow-sm text-forest-600 dark:text-forest-400">
                    <FileText size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-stone-900 dark:text-stone-100">{s.name}</div>
                    <div className="text-sm text-stone-500 dark:text-stone-400">{s.description}</div>
                  </div>
                </div>
                <ChevronRight className="text-stone-400 dark:text-stone-500" />
              </button>
            ))}
          </div>
        )}

        {step === 'questions' && questions.length > 0 && (
          <div className="flex flex-wrap gap-2 w-full">
            {questions[currentQuestionIndex].options.map(opt => (
              <button 
                key={opt}
                onClick={() => handleAnswerSelect(opt)}
                className="flex-1 px-6 py-3 bg-forest-600 dark:bg-forest-700 hover:bg-forest-700 dark:hover:bg-forest-600 text-white rounded-xl transition-all font-medium shadow-md hover:shadow-lg active:scale-95"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
        
        {step === 'error' && (
          <div className="text-red-500 font-medium">Please refresh to try again.</div>
        )}
      </div>
    </div>
  )
}
