import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Download, 
  FileText, 
  Copy, 
  Check, 
  AlertCircle, 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  Users, 
  Utensils, 
  Home, 
  MessageSquare,
  Search,
  CheckCircle2,
  RefreshCw,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { WeddingGuest, AttendanceStatus } from '../types';
import { generateQRCodeDataUrl, downloadInvitationPDF, downloadInvitationPNG } from '../utils/invitationGenerator';

export const InvitationSection: React.FC = () => {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [attendance, setAttendance] = useState<AttendanceStatus>('present');
  const [partySize, setPartySize] = useState<number>(1);
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [accommodation, setAccommodation] = useState('');
  const [message, setMessage] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentGuest, setCurrentGuest] = useState<WeddingGuest | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isPngGenerating, setIsPngGenerating] = useState(false);

  // Search by code state
  const [searchCode, setSearchCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Generate QR Code data URL when guest is set
  useEffect(() => {
    if (currentGuest) {
      generateQRCodeDataUrl(currentGuest.qrPayload).then(url => {
        setQrDataUrl(url);
      });
    }
  }, [currentGuest]);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          attendance,
          partySize: Number(partySize) || 1,
          dietaryNotes: dietaryNotes.trim(),
          accommodation: accommodation.trim(),
          message: message.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Impossible d'enregistrer l'invitation. Veuillez réessayer.");
      }

      setCurrentGuest(data.guest);
      setSuccessMessage(data.message || "Votre invitation a été générée avec succès !");

      // Trigger festive subtle confetti
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#d4a373', '#1a1a1a', '#e6c5a5', '#fdfbf7', '#b88656']
      });

    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setIsLoading(false);
    }
  };

  // Lookup existing code
  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const res = await fetch(`/api/guests/lookup?code=${encodeURIComponent(searchCode.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Aucune invitation trouvée pour ce code.");
      }

      setCurrentGuest(data.guest);
      // Pre-fill form
      setName(data.guest.name);
      setEmail(data.guest.email || '');
      setPhone(data.guest.phone || '');
      setAttendance(data.guest.attendance || 'present');
      setPartySize(data.guest.partySize || 1);
      setDietaryNotes(data.guest.dietaryNotes || '');
      setAccommodation(data.guest.accommodation || '');
      setMessage(data.guest.message || '');
      setSearchCode('');
    } catch (err: unknown) {
      setSearchError(err instanceof Error ? err.message : "Code introuvable.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleCopyCode = () => {
    if (!currentGuest) return;
    navigator.clipboard.writeText(currentGuest.invitationCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadPDF = async () => {
    if (!currentGuest) return;
    setIsPdfGenerating(true);
    try {
      await downloadInvitationPDF(currentGuest);
    } catch (err) {
      console.error('PDF error:', err);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleDownloadPNG = async () => {
    if (!currentGuest) return;
    setIsPngGenerating(true);
    try {
      await downloadInvitationPNG(currentGuest);
    } catch (err) {
      console.error('PNG error:', err);
    } finally {
      setIsPngGenerating(false);
    }
  };

  const handleReset = () => {
    setCurrentGuest(null);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  return (
    <section id="invitation" className="py-20 md:py-28 bg-[#fdfbf7] relative">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">

        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="flex items-center justify-center gap-2">
            <span className="h-[1px] w-8 bg-[#d4a373]/60" />
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#d4a373] font-semibold">
              Invitation Officielle
            </span>
            <span className="h-[1px] w-8 bg-[#d4a373]/60" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1a1a1a]">
            Votre invitation <span className="italic font-light text-[#d4a373]">vous attend</span>.
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#1a1a1a]/70 max-w-xl mx-auto">
            Renseignez votre nom pour dévoiler votre invitation personnalisée et obtenir votre code d&apos;accès avec QR code pour le grand jour.
          </p>
        </div>

        {/* Search existing invitation bar */}
        {!currentGuest && (
          <div className="max-w-md mx-auto mb-10 p-2.5 bg-[#fdfbf7] border border-[#1a1a1a]/15 rounded-[16px] shadow-2xs">
            <form onSubmit={handleLookup} className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#1a1a1a]/50 ml-2 shrink-0" />
              <input
                id="search-code-input"
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Déjà invité(e) ? Ex: EG-2026-XXXX"
                className="w-full text-xs font-sans bg-transparent text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-hidden uppercase tracking-wider"
              />
              <button
                type="submit"
                disabled={!searchCode.trim() || isSearching}
                className="px-4 py-2 bg-[#1a1a1a] text-[#fdfbf7] text-[10px] font-sans font-bold uppercase tracking-widest rounded-full hover:bg-[#d4a373] hover:text-[#1a1a1a] disabled:opacity-40 transition-colors shrink-0"
              >
                {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Retrouver'}
              </button>
            </form>
            {searchError && (
              <p className="text-[11px] text-red-600 mt-1.5 text-center font-sans">
                {searchError}
              </p>
            )}
          </div>
        )}

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Form / Controls */}
          <div className={`${currentGuest ? 'lg:col-span-5' : 'lg:col-span-8 lg:col-start-3'} transition-all`}>
            
            <div className="bg-[#fdfbf7] border border-[#1a1a1a]/12 p-6 sm:p-8 rounded-[24px] shadow-sm">
              
              <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4 mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-[#1a1a1a]">
                    {currentGuest ? 'Modifier mes informations' : 'Compléter ma venue'}
                  </h3>
                  <p className="text-xs text-[#1a1a1a]/60 mt-0.5 font-sans">
                    {currentGuest ? 'Vos modifications seront enregistrées en temps réel.' : 'Faire-part & confirmation RSVP'}
                  </p>
                </div>
                {currentGuest && (
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 text-xs text-[#d4a373] hover:text-[#1a1a1a] font-semibold uppercase tracking-wider font-sans"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Nouveau</span>
                  </button>
                )}
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div role="alert" className="mb-6 p-3.5 bg-red-50/80 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Alert */}
              {successMessage && (
                <div className="mb-6 p-3.5 bg-emerald-50/80 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name field (Mandatory) */}
                <div className="space-y-1.5">
                  <label htmlFor="guest-name" className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[#1a1a1a] font-bold">
                    Prénom &amp; Nom <span className="text-[#d4a373]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1a1a1a]/40" />
                    <input
                      id="guest-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Camille de Montmirail"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#1a1a1a]/15 rounded-xl text-sm text-[#1a1a1a] focus:outline-hidden focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                    />
                  </div>
                </div>

                {/* Email & Phone (Row) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="guest-email" className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[#1a1a1a]/70 font-medium">
                      Adresse e-mail
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1a1a1a]/40" />
                      <input
                        id="guest-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nom@exemple.com"
                        className="w-full pl-10 pr-3 py-2 bg-white border border-[#1a1a1a]/15 rounded-xl text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#1a1a1a]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="guest-phone" className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[#1a1a1a]/70 font-medium">
                      Téléphone
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1a1a1a]/40" />
                      <input
                        id="guest-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="06 00 00 00 00"
                        className="w-full pl-10 pr-3 py-2 bg-white border border-[#1a1a1a]/15 rounded-xl text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#1a1a1a]"
                      />
                    </div>
                  </div>
                </div>

                {/* Attendance choice */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[#1a1a1a] font-bold">
                    Votre présence <span className="text-[#d4a373]">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setAttendance('present')}
                      className={`py-2.5 px-2 text-xs font-sans rounded-xl border text-center transition-all cursor-pointer ${
                        attendance === 'present'
                          ? 'bg-[#1a1a1a] text-[#fdfbf7] border-[#1a1a1a] font-semibold shadow-xs'
                          : 'bg-white text-[#1a1a1a]/80 border-[#1a1a1a]/15 hover:border-[#1a1a1a]'
                      }`}
                    >
                      Présent(e)
                    </button>

                    <button
                      type="button"
                      onClick={() => setAttendance('absent')}
                      className={`py-2.5 px-2 text-xs font-sans rounded-xl border text-center transition-all cursor-pointer ${
                        attendance === 'absent'
                          ? 'bg-[#1a1a1a] text-[#fdfbf7] border-[#1a1a1a] font-semibold shadow-xs'
                          : 'bg-white text-[#1a1a1a]/80 border-[#1a1a1a]/15 hover:border-[#1a1a1a]'
                      }`}
                    >
                      Empêché(e)
                    </button>

                    <button
                      type="button"
                      onClick={() => setAttendance('pending')}
                      className={`py-2.5 px-2 text-xs font-sans rounded-xl border text-center transition-all cursor-pointer ${
                        attendance === 'pending'
                          ? 'bg-[#1a1a1a] text-[#fdfbf7] border-[#1a1a1a] font-semibold shadow-xs'
                          : 'bg-white text-[#1a1a1a]/80 border-[#1a1a1a]/15 hover:border-[#1a1a1a]'
                      }`}
                    >
                      En attente
                    </button>
                  </div>
                </div>

                {/* Party size (only if present or pending) */}
                {attendance !== 'absent' && (
                  <div className="space-y-1.5">
                    <label htmlFor="guest-party" className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[#1a1a1a]/70 font-medium">
                      Nombre de personnes (vous inclus)
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1a1a1a]/40" />
                      <select
                        id="guest-party"
                        value={partySize}
                        onChange={(e) => setPartySize(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-[#1a1a1a]/15 rounded-xl text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#1a1a1a]"
                      >
                        <option value={1}>1 personne</option>
                        <option value={2}>2 personnes (Couple / Accompagnant)</option>
                        <option value={3}>3 personnes</option>
                        <option value={4}>4 personnes</option>
                        <option value={5}>5 personnes</option>
                        <option value={6}>6 personnes</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Dietary notes & Accommodation (Row) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="guest-diet" className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[#1a1a1a]/70 font-medium">
                      Allergies &amp; Régime
                    </label>
                    <div className="relative">
                      <Utensils className="w-4 h-4 absolute left-3.5 top-3 text-[#1a1a1a]/40" />
                      <input
                        id="guest-diet"
                        type="text"
                        value={dietaryNotes}
                        onChange={(e) => setDietaryNotes(e.target.value)}
                        placeholder="Végétarien, sans gluten..."
                        className="w-full pl-10 pr-3 py-2 bg-white border border-[#1a1a1a]/15 rounded-xl text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#1a1a1a]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="guest-accomm" className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[#1a1a1a]/70 font-medium">
                      Hébergement
                    </label>
                    <div className="relative">
                      <Home className="w-4 h-4 absolute left-3.5 top-3 text-[#1a1a1a]/40" />
                      <input
                        id="guest-accomm"
                        type="text"
                        value={accommodation}
                        onChange={(e) => setAccommodation(e.target.value)}
                        placeholder="Hôtel à proximité, etc."
                        className="w-full pl-10 pr-3 py-2 bg-white border border-[#1a1a1a]/15 rounded-xl text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#1a1a1a]"
                      />
                    </div>
                  </div>
                </div>

                {/* Message for couple */}
                <div className="space-y-1.5">
                  <label htmlFor="guest-message" className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[#1a1a1a]/70 font-medium">
                    Un mot doux pour Élodie &amp; Gabriel
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 absolute left-3.5 top-3 text-[#1a1a1a]/40" />
                    <textarea
                      id="guest-message"
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Votre message personnalisé..."
                      className="w-full pl-10 pr-3 py-2 bg-white border border-[#1a1a1a]/15 rounded-xl text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#1a1a1a]"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2 space-y-3">
                  <button
                    id="submit-rsvp-btn"
                    type="submit"
                    disabled={!name.trim() || isLoading}
                    className="w-full py-3.5 px-6 rounded-full bg-[#1a1a1a] text-[#fdfbf7] hover:bg-[#d4a373] hover:text-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-sans text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#d4a373]" />
                        <span>Génération en cours...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#d4a373]" />
                        <span>{currentGuest ? 'Mettre à jour mon invitation' : 'Révéler mon invitation'}</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/50 text-center font-sans">
                    Vos informations restent privées et servent uniquement à personnaliser votre invitation.
                  </p>
                </div>

              </form>

            </div>

          </div>

          {/* Right Column: Personalized Invitation View (Shown if currentGuest exists) */}
          {currentGuest && (
            <div className="lg:col-span-7 space-y-6">
              
              {/* Luxury A5 Proportion Invitation Card */}
              <div 
                id="invitation-card"
                className="relative p-8 sm:p-10 bg-[#fdfbf7] border border-[#d4a373] shadow-2xl rounded-[28px] text-center space-y-6 invitation-gold-frame"
              >
                
                {/* Top Monogram Seal */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full border border-[#1a1a1a] bg-[#fdfbf7] flex items-center justify-center shadow-xs">
                    <span className="font-serif italic text-xl text-[#1a1a1a] font-bold">
                      É · G
                    </span>
                  </div>
                  <span className="text-[10px] font-sans font-semibold tracking-[0.3em] text-[#d4a373] uppercase">
                    Invitation Personnelle
                  </span>
                </div>

                {/* Guest Name Highlight */}
                <div className="space-y-1 py-1">
                  <h3 className="font-serif italic text-3xl sm:text-4xl text-[#1a1a1a] font-bold tracking-tight">
                    {currentGuest.name}
                  </h3>
                  <p className="font-serif italic text-sm text-[#1a1a1a]/60">
                    est convié(e) à célébrer le mariage de
                  </p>
                </div>

                {/* Couple Names Headline */}
                <div className="space-y-2">
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#1a1a1a]">
                    Élodie <span className="italic font-light text-[#d4a373]">&amp;</span> Gabriel
                  </h2>
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-[1px] w-12 bg-[#d4a373]/60" />
                    <span className="font-serif italic font-semibold text-lg text-[#d4a373] tracking-widest">
                      12 Octobre 2026
                    </span>
                    <div className="h-[1px] w-12 bg-[#d4a373]/60" />
                  </div>
                </div>

                {/* Venue Details */}
                <div className="text-xs font-sans text-[#1a1a1a]/70 space-y-0.5">
                  <p className="font-medium text-[#1a1a1a] uppercase tracking-widest text-[11px]">
                    La Bastide des Oliviers · Route des Lavandes
                  </p>
                  <p className="font-serif italic text-[#d4a373] text-sm">
                    Maison de famille · Provence
                  </p>
                </div>

                {/* RSVP Details Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1a1a1a]/5 border border-[#1a1a1a]/15 text-xs font-sans text-[#1a1a1a]">
                  <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
                  <span className="font-medium">
                    {currentGuest.attendance === 'present' 
                      ? `Présence confirmée (${currentGuest.partySize} pers.)`
                      : currentGuest.attendance === 'absent'
                      ? 'Absence signalée'
                      : `En attente (${currentGuest.partySize} pers.)`
                    }
                  </span>
                </div>

                {/* Unique QR Code Card */}
                <div className="flex flex-col items-center justify-center space-y-2.5 pt-2">
                  <div className="p-3 bg-white border border-[#1a1a1a]/15 rounded-2xl shadow-xs">
                    {qrDataUrl ? (
                      <img 
                        src={qrDataUrl} 
                        alt="QR Code d'invitation" 
                        className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
                      />
                    ) : (
                      <div className="w-28 h-28 flex items-center justify-center bg-gray-50 text-[#1a1a1a]/40">
                        <QrCode className="w-8 h-8 animate-pulse" />
                      </div>
                    )}
                  </div>
                  
                  {/* Unique Code display */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#1a1a1a] tracking-wider px-3 py-1 bg-white border border-[#1a1a1a]/15 rounded-lg">
                      {currentGuest.invitationCode}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="p-1.5 text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:bg-[#1a1a1a]/5 rounded-lg transition-colors cursor-pointer"
                      title="Copier mon code"
                      aria-label="Copier le code d'invitation"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <p className="text-[10px] uppercase tracking-widest font-sans text-[#1a1a1a]/50">
                    Présentez ce QR Code à l&apos;entrée
                  </p>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  id="download-png-btn"
                  onClick={handleDownloadPNG}
                  disabled={isPngGenerating}
                  className="w-full sm:flex-1 py-3 px-4 rounded-full bg-[#1a1a1a] text-[#fdfbf7] hover:bg-[#d4a373] hover:text-[#1a1a1a] transition-all text-[11px] font-sans uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isPngGenerating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5 text-[#d4a373]" />
                  )}
                  <span>Télécharger l&apos;image PNG</span>
                </button>

                <button
                  id="download-pdf-btn"
                  onClick={handleDownloadPDF}
                  disabled={isPdfGenerating}
                  className="w-full sm:flex-1 py-3 px-4 rounded-full border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#fdfbf7] transition-all text-[11px] font-sans uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isPdfGenerating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-[#d4a373]" />
                  )}
                  <span>Télécharger le PDF A5</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
