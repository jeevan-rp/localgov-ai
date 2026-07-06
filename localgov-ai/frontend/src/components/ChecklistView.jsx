import { useState } from 'react'
import axios from 'axios'
import { CheckCircle2, Download, MapPin, IndianRupee, Phone, Loader2, RefreshCcw } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export default function ChecklistView({ data, onReset }) {
  const [phone, setPhone] = useState('')
  const [notifyStatus, setNotifyStatus] = useState('idle') // idle, loading, success, error

  const handleNotify = (e) => {
    e.preventDefault()
    if (!phone || phone.length < 10) return
    
    setNotifyStatus('loading')
    axios.post(`${API_BASE}/notify`, { phone })
      .then(() => {
        setNotifyStatus('success')
      })
      .catch(err => {
        console.error(err)
        setNotifyStatus('error')
      })
  }

  const totalFee = data.processing_fee + data.convenience_fee

  return (
    <div className="glass rounded-3xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8 border-b border-stone-200 dark:border-stone-700 pb-4">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Your Action Plan</h2>
        <button onClick={onReset} className="text-stone-500 hover:text-forest-600 dark:text-stone-400 dark:hover:text-forest-400 flex items-center gap-2 text-sm font-medium transition-colors">
          <RefreshCcw size={16} /> Start Over
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 dark:bg-stone-900/50 p-5 rounded-2xl border border-stone-100 dark:border-stone-700 shadow-sm col-span-1 md:col-span-2">
          <h3 className="font-semibold text-lg text-stone-800 dark:text-stone-100 flex items-center gap-2 mb-4">
            <CheckCircle2 className="text-forest-500 dark:text-forest-400" /> Mandatory Documents
          </h3>
          <ul className="space-y-3">
            {data.documents.map(doc => (
              <li key={doc.id} className="flex items-start gap-3 bg-stone-50 dark:bg-stone-800 p-3 rounded-xl border border-stone-100 dark:border-stone-700">
                <div className="mt-0.5">
                  <div className={`w-4 h-4 rounded-full border-2 ${doc.is_mandatory ? 'border-forest-500 bg-forest-50 dark:bg-forest-900/30 dark:border-forest-400' : 'border-stone-300 dark:border-stone-600'}`}></div>
                </div>
                <div>
                  <div className="font-medium text-stone-800 dark:text-stone-200">{doc.name}</div>
                  {!doc.is_mandatory && <div className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-semibold mt-1">Optional</div>}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="bg-forest-50 dark:bg-forest-900/20 p-5 rounded-2xl border border-forest-100 dark:border-forest-800/50 shadow-sm">
            <h3 className="font-semibold text-forest-900 dark:text-forest-100 flex items-center gap-2 mb-3">
              <IndianRupee className="text-forest-600 dark:text-forest-400" size={20} /> Official Fees
            </h3>
            <div className="text-3xl font-bold text-forest-700 dark:text-forest-300 mb-2">₹{totalFee}</div>
            <div className="text-sm text-forest-600 dark:text-forest-400 space-y-1">
              <div className="flex justify-between">
                <span>Processing:</span> <span>₹{data.processing_fee}</span>
              </div>
              <div className="flex justify-between">
                <span>Convenience:</span> <span>₹{data.convenience_fee}</span>
              </div>
            </div>
          </div>

          <div className="bg-stone-800 p-5 rounded-2xl shadow-lg text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <MapPin size={64} />
            </div>
            <h3 className="font-semibold flex items-center gap-2 mb-2 relative z-10">
               Where to go
            </h3>
            <p className="text-stone-300 text-sm relative z-10 leading-relaxed">
              {data.office_guidance}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/60 dark:bg-stone-900/40 p-6 rounded-2xl border border-stone-100 dark:border-stone-700 shadow-sm">
        <a 
          href={data.download_link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-white px-6 py-3 rounded-xl font-medium transition-colors w-full md:w-auto shadow-md active:scale-95"
        >
          <Download size={18} /> Download Forms
        </a>

        <div className="w-full md:w-auto">
          {notifyStatus === 'success' ? (
            <div className="bg-forest-100 text-forest-800 px-6 py-3 rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 size={20} /> Updates enabled for {phone}
            </div>
          ) : (
            <form onSubmit={handleNotify} className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" size={18} />
                <input 
                  type="tel" 
                  placeholder="Enter phone for status updates" 
                  className="pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-forest-500 w-full md:w-64 bg-white/80 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  disabled={notifyStatus === 'loading'}
                />
              </div>
              <button 
                type="submit"
                disabled={notifyStatus === 'loading'}
                className="bg-forest-600 hover:bg-forest-700 dark:bg-forest-700 dark:hover:bg-forest-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-70 active:scale-95"
              >
                {notifyStatus === 'loading' ? <Loader2 size={18} className="animate-spin" /> : 'Get Updates'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
