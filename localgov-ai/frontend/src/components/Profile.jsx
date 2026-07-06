import { useState } from 'react'
import { User, Mail, Phone, MapPin, Edit3, Save, X } from 'lucide-react'

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, Karnataka'
  })
  const [editForm, setEditForm] = useState({ ...profileData })

  const handleSave = () => {
    setProfileData(editForm)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm({ ...profileData })
    setIsEditing(false)
  }

  return (
    <div className="glass rounded-3xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8 border-b border-stone-200 dark:border-stone-700 pb-4">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-3">
          <User className="text-forest-600 dark:text-forest-400" />
          My Profile
        </h2>
        
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-stone-500 hover:text-forest-600 dark:text-stone-400 dark:hover:text-forest-400 flex items-center gap-2 text-sm font-medium transition-colors active:scale-95"
          >
            <Edit3 size={16} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button 
              onClick={handleCancel}
              className="text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-300 flex items-center gap-1 text-sm font-medium transition-colors active:scale-95"
            >
              <X size={16} /> Cancel
            </button>
            <button 
              onClick={handleSave}
              className="text-forest-600 hover:text-forest-700 dark:text-forest-400 dark:hover:text-forest-300 flex items-center gap-1 text-sm font-medium transition-colors active:scale-95"
            >
              <Save size={16} /> Save
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4 bg-stone-50 dark:bg-stone-800 p-4 rounded-2xl border border-stone-100 dark:border-stone-700">
          <div className="w-16 h-16 bg-forest-100 dark:bg-forest-900 rounded-full flex items-center justify-center text-forest-700 dark:text-forest-300 text-2xl font-bold uppercase">
            {profileData.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <input 
                type="text" 
                value={editForm.name}
                onChange={e => setEditForm({...editForm, name: e.target.value})}
                className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-600 rounded-lg px-3 py-1 text-lg font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            ) : (
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">{profileData.name}</h3>
            )}
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">Citizen Account</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/80 dark:bg-stone-900/50 p-4 rounded-xl border border-stone-100 dark:border-stone-700">
            <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 mb-1 text-sm">
              <Mail size={16} /> Email Address
            </div>
            {isEditing ? (
              <input 
                type="email" 
                value={editForm.email}
                onChange={e => setEditForm({...editForm, email: e.target.value})}
                className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-lg px-3 py-1 font-medium text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            ) : (
              <div className="font-medium text-stone-900 dark:text-stone-100">{profileData.email}</div>
            )}
          </div>
          
          <div className="bg-white/80 dark:bg-stone-900/50 p-4 rounded-xl border border-stone-100 dark:border-stone-700">
            <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 mb-1 text-sm">
              <Phone size={16} /> Phone Number
            </div>
            {isEditing ? (
              <input 
                type="tel" 
                value={editForm.phone}
                onChange={e => setEditForm({...editForm, phone: e.target.value})}
                className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-lg px-3 py-1 font-medium text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            ) : (
              <div className="font-medium text-stone-900 dark:text-stone-100">{profileData.phone}</div>
            )}
          </div>
          
          <div className="bg-white/80 dark:bg-stone-900/50 p-4 rounded-xl border border-stone-100 dark:border-stone-700 md:col-span-2">
            <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 mb-1 text-sm">
              <MapPin size={16} /> Location
            </div>
            {isEditing ? (
              <input 
                type="text" 
                value={editForm.location}
                onChange={e => setEditForm({...editForm, location: e.target.value})}
                className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-lg px-3 py-1 font-medium text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            ) : (
              <div className="font-medium text-stone-900 dark:text-stone-100">{profileData.location}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
