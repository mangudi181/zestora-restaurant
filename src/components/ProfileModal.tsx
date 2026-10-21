import React, { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      if (user.address) {
        setHouseNumber(user.address.houseNumber || '');
        setStreet(user.address.street || '');
        setCity(user.address.city || '');
        setPincode(user.address.pincode || '');
        setLandmark(user.address.landmark || '');
      }
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    const success = await updateProfile({
      name,
      phone,
      address: {
        houseNumber,
        street,
        city,
        pincode,
        landmark
      }
    });

    setSaving(false);
    if (success) {
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
      }, 2500);
    } else {
      setError('Failed to update profile details.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#1C1917] border border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-stone-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-stone-900 px-6 py-5 border-b border-stone-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-serif-luxury text-amber-400">
              User Profile & Preferences
            </h3>
            <p className="text-xs text-stone-400">
              Manage your personal info and default delivery address
            </p>
          </div>
          <button
            id="close-profile-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-700 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  id="profile-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  id="profile-phone-input"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-400 mb-1">
              Registered Email (Immutable)
            </label>
            <input
              type="text"
              disabled
              value={user.email}
              className="w-full px-3 py-2 bg-stone-900/50 border border-stone-800 rounded-xl text-sm text-stone-400 cursor-not-allowed"
            />
          </div>

          <div className="pt-3 border-t border-stone-800">
            <h4 className="text-sm font-semibold text-amber-300 flex items-center gap-1.5 mb-3">
              <MapPin className="w-4 h-4" /> Default Delivery Address
            </h4>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-400 mb-1">House / Flat No.</label>
                  <input
                    id="profile-house-input"
                    type="text"
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    placeholder="e.g. Flat 402, Lotus Tower"
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Street / Area</label>
                  <input
                    id="profile-street-input"
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. 100ft Road, Indiranagar"
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-stone-400 mb-1">City</label>
                  <input
                    id="profile-city-input"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Pincode</label>
                  <input
                    id="profile-pincode-input"
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="560038"
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Landmark</label>
                  <input
                    id="profile-landmark-input"
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Near Metro"
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-stone-300 hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              id="profile-save-btn"
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 font-semibold text-sm transition-all shadow-md"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
