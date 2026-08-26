import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Search, 
  Download, 
  Trash2, 
  Edit3, 
  X, 
  Users, 
  CheckCircle2, 
  UserX, 
  Clock, 
  AlertCircle, 
  Loader2, 
  LogOut, 
  RefreshCw,
  Eye,
  KeyRound
} from 'lucide-react';
import type { WeddingGuest, AttendanceStatus } from '../types';
import { exportGuestsToExcel } from '../utils/excelExport';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  adminToken: string | null;
  onLogin: (token: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  adminToken,
  onLogin,
  onLogout
}) => {
  // Login states
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Guests data
  const [guests, setGuests] = useState<WeddingGuest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent' | 'pending'>('all');

  // Edit Modal State
  const [editingGuest, setEditingGuest] = useState<WeddingGuest | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete Confirmation State
  const [deletingGuest, setDeletingGuest] = useState<WeddingGuest | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Stats calculation
  const totalRegistered = guests.length;
  const confirmedGuests = guests.filter(g => g.attendance === 'present');
  const totalConfirmed = confirmedGuests.length;
  const totalAttendeesCount = confirmedGuests.reduce((sum, g) => sum + (g.partySize || 1), 0);
  const totalDeclined = guests.filter(g => g.attendance === 'absent').length;
  const totalPending = guests.filter(g => g.attendance === 'pending').length;

  // Fetch guests from API
  const fetchGuests = async () => {
    if (!adminToken) return;
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch('/api/admin/guests', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'x-admin-token': adminToken
        }
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          onLogout();
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        throw new Error(data.error || 'Erreur lors du chargement des invités.');
      }
      setGuests(data.guests || []);
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : 'Erreur de connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && adminToken) {
      fetchGuests();
    }
  }, [isOpen, adminToken]);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Mot de passe administrateur incorrect.');
      }

      onLogin(data.token);
      setPassword('');
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Erreur de connexion.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Edit Save
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest || !adminToken) return;

    setIsSavingEdit(true);
    setEditError(null);

    try {
      const res = await fetch(`/api/admin/guests/${editingGuest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
          'x-admin-token': adminToken
        },
        body: JSON.stringify(editingGuest)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour.');
      }

      // Update local state
      setGuests(guests.map(g => (g.id === editingGuest.id ? data.guest : g)));
      setEditingGuest(null);
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deletingGuest || !adminToken) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/guests/${deletingGuest.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'x-admin-token': adminToken
        }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression.');
      }

      setGuests(guests.filter(g => g.id !== deletingGuest.id));
      setDeletingGuest(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erreur de suppression.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Excel Export
  const handleExcelExport = () => {
    if (guests.length === 0) {
      alert("Aucun invité à exporter pour le moment.");
      return;
    }
    exportGuestsToExcel(filteredGuests);
  };

  // Filtered guests
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.phone.includes(searchQuery) ||
      guest.invitationCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ? true : guest.attendance === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1a1a1a]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      
      <div className="bg-[#fdfbf7] border border-[#1a1a1a]/15 rounded-[24px] shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#fdfbf7] border-b border-[#1a1a1a]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#1a1a1a] bg-[#fdfbf7] flex items-center justify-center text-[#d4a373]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1a1a1a]">
                Registre des Invités
              </h2>
              <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#d4a373] font-semibold">
                Espace Privé · Mariage Élodie &amp; Gabriel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {adminToken && (
              <button
                onClick={onLogout}
                className="p-2 text-[#1a1a1a]/70 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-xs flex items-center gap-1.5 cursor-pointer font-sans"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#1a1a1a]/70 hover:text-[#1a1a1a] hover:bg-[#1a1a1a]/5 rounded-lg transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Unauthenticated View: Login Form */}
        {!adminToken ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full my-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#f7f3eb] border border-[#1a1a1a]/20 flex items-center justify-center text-[#d4a373]">
              <KeyRound className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1a1a1a]">
                Accès Administrateur
              </h3>
              <p className="font-sans text-xs text-[#1a1a1a]/70">
                Veuillez saisir le mot de passe confidentiel pour consulter et gérer le registre des invités.
              </p>
            </div>

            {loginError && (
              <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[#1a1a1a] font-bold">
                  Mot de passe
                </label>
                <input
                  id="admin-password-input"
                  type="password"
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe secret..."
                  className="w-full px-4 py-2.5 bg-white border border-[#1a1a1a]/15 rounded-xl text-sm text-[#1a1a1a] focus:outline-hidden focus:border-[#1a1a1a]"
                />
                <p className="text-[10px] text-[#1a1a1a]/60 italic font-sans">
                  Indice de démonstration : <code>provence2026</code> ou <code>elodie-gabriel-2026</code>
                </p>
              </div>

              <button
                id="admin-login-btn"
                type="submit"
                disabled={!password.trim() || isLoggingIn}
                className="w-full py-3 rounded-full bg-[#1a1a1a] text-[#fdfbf7] hover:bg-[#d4a373] hover:text-[#1a1a1a] disabled:opacity-50 transition-all font-sans text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#d4a373]" />
                    <span>Vérification...</span>
                  </>
                ) : (
                  <span>Se connecter</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            
            {/* Top Stat Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="p-4 bg-[#fdfbf7] border border-[#1a1a1a]/10 rounded-[18px]">
                <div className="flex items-center justify-between text-[#1a1a1a]/60 mb-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold">Total Inscrits</span>
                  <Users className="w-4 h-4 text-[#d4a373]" />
                </div>
                <div className="font-serif text-3xl font-bold tracking-tight text-[#1a1a1a]">
                  {totalRegistered}
                </div>
                <span className="text-[10px] text-[#1a1a1a]/60 font-sans">invitations émises</span>
              </div>

              <div className="p-4 bg-[#fdfbf7] border border-[#1a1a1a]/10 rounded-[18px]">
                <div className="flex items-center justify-between text-[#1a1a1a]/60 mb-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold">Présences</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-serif text-3xl font-bold tracking-tight text-emerald-800">
                  {totalConfirmed}
                </div>
                <span className="text-[10px] text-emerald-700 font-sans font-semibold">confirmés avec joie</span>
              </div>

              <div className="p-4 bg-[#fdfbf7] border border-[#1a1a1a]/10 rounded-[18px]">
                <div className="flex items-center justify-between text-[#1a1a1a]/60 mb-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold">Personnes Attendues</span>
                  <Users className="w-4 h-4 text-[#d4a373]" />
                </div>
                <div className="font-serif text-3xl font-bold tracking-tight text-[#d4a373]">
                  {totalAttendeesCount}
                </div>
                <span className="text-[10px] text-[#1a1a1a]/60 font-sans">places au dîner</span>
              </div>

              <div className="p-4 bg-[#fdfbf7] border border-[#1a1a1a]/10 rounded-[18px]">
                <div className="flex items-center justify-between text-[#1a1a1a]/60 mb-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold">Absents / Attente</span>
                  <Clock className="w-4 h-4 text-[#1a1a1a]/50" />
                </div>
                <div className="font-serif text-3xl font-bold tracking-tight text-[#1a1a1a]">
                  {totalDeclined} <span className="text-sm font-sans font-normal text-[#1a1a1a]/50">/ {totalPending} att.</span>
                </div>
                <span className="text-[10px] text-[#1a1a1a]/60 font-sans">réponses enregistrées</span>
              </div>

            </div>

            {/* Actions Bar: Search + Filter Tabs + Excel Export */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
              
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1a1a1a]/40" />
                <input
                  id="admin-search-query"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom, email, téléphone ou code..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[#1a1a1a]/15 rounded-xl text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#1a1a1a]"
                />
              </div>

              {/* Attendance Filter Buttons & Excel CTA */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded-xl border border-[#1a1a1a]/15 bg-white p-0.5 text-xs">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-sans text-xs ${
                      statusFilter === 'all' ? 'bg-[#1a1a1a] text-[#fdfbf7] font-semibold' : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
                    }`}
                  >
                    Tous ({guests.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('present')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-sans text-xs ${
                      statusFilter === 'present' ? 'bg-emerald-800 text-white font-semibold' : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
                    }`}
                  >
                    Présents ({totalConfirmed})
                  </button>
                  <button
                    onClick={() => setStatusFilter('absent')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-sans text-xs ${
                      statusFilter === 'absent' ? 'bg-[#1a1a1a]/60 text-white font-semibold' : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
                    }`}
                  >
                    Absents ({totalDeclined})
                  </button>
                  <button
                    onClick={() => setStatusFilter('pending')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-sans text-xs ${
                      statusFilter === 'pending' ? 'bg-[#d4a373] text-[#1a1a1a] font-bold' : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
                    }`}
                  >
                    En attente ({totalPending})
                  </button>
                </div>

                <button
                  id="admin-refresh-btn"
                  onClick={fetchGuests}
                  disabled={isLoading}
                  className="p-2 bg-white border border-[#1a1a1a]/15 text-[#1a1a1a]/70 hover:text-[#1a1a1a] rounded-xl transition-colors cursor-pointer"
                  title="Rafraîchir"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  id="export-excel-btn"
                  onClick={handleExcelExport}
                  disabled={guests.length === 0}
                  className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#d4a373] hover:text-[#1a1a1a] text-[#fdfbf7] text-[11px] font-sans font-bold uppercase tracking-widest rounded-full transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exporter Excel</span>
                </button>
              </div>

            </div>

            {/* Error banner */}
            {fetchError && (
              <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fetchError}</span>
              </div>
            )}

            {/* Responsive Table of Guests */}
            <div className="border border-[#1a1a1a]/12 rounded-[20px] bg-white overflow-hidden shadow-xs">
              {isLoading ? (
                <div className="p-12 text-center text-[#1a1a1a]/60 space-y-2 font-sans">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#d4a373]" />
                  <p className="text-xs">Chargement du registre des invités...</p>
                </div>
              ) : filteredGuests.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full border border-[#1a1a1a]/15 bg-[#fdfbf7] flex items-center justify-center mx-auto text-[#1a1a1a]/50">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl font-bold tracking-tight text-[#1a1a1a]">
                    {searchQuery ? 'Aucun résultat trouvé' : 'Aucun invité enregistré pour le moment'}
                  </h4>
                  <p className="text-xs font-sans text-[#1a1a1a]/60 max-w-sm mx-auto">
                    {searchQuery
                      ? 'Essayez de modifier votre terme de recherche.'
                      : 'Les invités apparaîtront ici automatiquement dès qu’ils valideront leur faire-part sur la page publique.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans border-collapse">
                    <thead>
                      <tr className="bg-[#f7f3eb] border-b border-[#1a1a1a]/10 text-[#1a1a1a] uppercase tracking-wider font-bold text-[10px]">
                        <th className="py-3 px-4">Nom de l&apos;invité</th>
                        <th className="py-3 px-3">Présence</th>
                        <th className="py-3 px-3">Groupe</th>
                        <th className="py-3 px-3">Contact</th>
                        <th className="py-3 px-3">Régime / Allergies</th>
                        <th className="py-3 px-3">Hébergement</th>
                        <th className="py-3 px-3">Message</th>
                        <th className="py-3 px-3">Code</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1a]/8">
                      {filteredGuests.map((guest) => (
                        <tr key={guest.id} className="hover:bg-[#fdfbf7] transition-colors">
                          
                          {/* Name */}
                          <td className="py-3 px-4">
                            <span className="font-serif text-sm font-bold text-[#1a1a1a] block">
                              {guest.name}
                            </span>
                            <span className="text-[10px] text-[#1a1a1a]/50">
                              Inscrit le {new Date(guest.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                          </td>

                          {/* Attendance */}
                          <td className="py-3 px-3">
                            {guest.attendance === 'present' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                Présent
                              </span>
                            ) : guest.attendance === 'absent' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-200 text-stone-700">
                                Absent
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                                En attente
                              </span>
                            )}
                          </td>

                          {/* Party size */}
                          <td className="py-3 px-3 font-semibold text-[#1a1a1a]">
                            {guest.attendance === 'absent' ? '-' : `${guest.partySize || 1} pers.`}
                          </td>

                          {/* Contact */}
                          <td className="py-3 px-3 text-[#1a1a1a]/80">
                            <div className="space-y-0.5">
                              {guest.email && <div className="text-[11px]">{guest.email}</div>}
                              {guest.phone && <div className="text-[11px] text-[#1a1a1a]/60">{guest.phone}</div>}
                              {!guest.email && !guest.phone && <span className="text-[#1a1a1a]/40">-</span>}
                            </div>
                          </td>

                          {/* Dietary Notes */}
                          <td className="py-3 px-3 text-[#1a1a1a]/70 max-w-[140px] truncate" title={guest.dietaryNotes}>
                            {guest.dietaryNotes || '-'}
                          </td>

                          {/* Accommodation */}
                          <td className="py-3 px-3 text-[#1a1a1a]/70 max-w-[130px] truncate" title={guest.accommodation}>
                            {guest.accommodation || '-'}
                          </td>

                          {/* Message */}
                          <td className="py-3 px-3 text-[#1a1a1a]/80 max-w-[150px] truncate" title={guest.message}>
                            {guest.message ? `« ${guest.message} »` : '-'}
                          </td>

                          {/* Invitation Code */}
                          <td className="py-3 px-3">
                            <span className="font-mono text-[11px] font-bold text-[#1a1a1a] bg-[#f7f3eb] px-2 py-0.5 rounded-md border border-[#1a1a1a]/15">
                              {guest.invitationCode}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingGuest({ ...guest })}
                                className="p-1.5 text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:bg-[#1a1a1a]/5 rounded-lg transition-colors cursor-pointer"
                                title="Modifier"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingGuest(guest)}
                                className="p-1.5 text-[#1a1a1a]/60 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Edit Guest Modal */}
      {editingGuest && (
        <div className="fixed inset-0 z-60 bg-[#1a1a1a]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fdfbf7] border border-[#1a1a1a]/15 rounded-[24px] p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-3">
              <h3 className="font-serif text-2xl font-bold tracking-tight text-[#1a1a1a]">
                Modifier l&apos;invité
              </h3>
              <button
                onClick={() => setEditingGuest(null)}
                className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] p-1 rounded-lg hover:bg-[#1a1a1a]/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-2.5 bg-red-50 text-red-700 text-xs border border-red-200 rounded-xl">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs font-sans">
              
              <div className="space-y-1">
                <label className="font-bold text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a]">
                  Nom &amp; Prénom
                </label>
                <input
                  type="text"
                  required
                  value={editingGuest.name}
                  onChange={(e) => setEditingGuest({ ...editingGuest, name: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#1a1a1a]/15 rounded-xl text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#1a1a1a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a]/70 font-semibold">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={editingGuest.email}
                    onChange={(e) => setEditingGuest({ ...editingGuest, email: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#1a1a1a]/15 rounded-xl text-xs text-[#1a1a1a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a]/70 font-semibold">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={editingGuest.phone}
                    onChange={(e) => setEditingGuest({ ...editingGuest, phone: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#1a1a1a]/15 rounded-xl text-xs text-[#1a1a1a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a]/70 font-semibold">
                    Présence
                  </label>
                  <select
                    value={editingGuest.attendance}
                    onChange={(e) => setEditingGuest({ ...editingGuest, attendance: e.target.value as AttendanceStatus })}
                    className="w-full p-2.5 bg-white border border-[#1a1a1a]/15 rounded-xl text-xs text-[#1a1a1a]"
                  >
                    <option value="present">Présent</option>
                    <option value="absent">Absent</option>
                    <option value="pending">En attente</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a]/70 font-semibold">
                    Nombre de personnes
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={editingGuest.partySize}
                    onChange={(e) => setEditingGuest({ ...editingGuest, partySize: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white border border-[#1a1a1a]/15 rounded-xl text-xs text-[#1a1a1a]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a]/70 font-semibold">
                  Régime / Allergies
                </label>
                <input
                  type="text"
                  value={editingGuest.dietaryNotes}
                  onChange={(e) => setEditingGuest({ ...editingGuest, dietaryNotes: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#1a1a1a]/15 rounded-xl text-xs text-[#1a1a1a]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a]/70 font-semibold">
                  Hébergement
                </label>
                <input
                  type="text"
                  value={editingGuest.accommodation}
                  onChange={(e) => setEditingGuest({ ...editingGuest, accommodation: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#1a1a1a]/15 rounded-xl text-xs text-[#1a1a1a]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a]/70 font-semibold">
                  Message
                </label>
                <textarea
                  rows={2}
                  value={editingGuest.message}
                  onChange={(e) => setEditingGuest({ ...editingGuest, message: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#1a1a1a]/15 rounded-xl text-xs text-[#1a1a1a]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#1a1a1a]/10">
                <button
                  type="button"
                  onClick={() => setEditingGuest(null)}
                  className="px-4 py-2 text-[#1a1a1a]/70 hover:bg-[#1a1a1a]/5 rounded-full text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2 bg-[#1a1a1a] hover:bg-[#d4a373] hover:text-[#1a1a1a] text-[#fdfbf7] rounded-full font-bold uppercase tracking-widest text-[11px] flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isSavingEdit ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Enregistrer'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingGuest && (
        <div className="fixed inset-0 z-60 bg-[#1a1a1a]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fdfbf7] border border-red-300 rounded-[24px] p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-serif text-xl font-bold tracking-tight text-[#1a1a1a]">
              Confirmer la suppression
            </h3>
            <p className="text-xs text-[#1a1a1a]/70 font-sans">
              Êtes-vous certain de vouloir supprimer définitivement l&apos;invitation de <strong>{deletingGuest.name}</strong> ({deletingGuest.invitationCode}) ?
            </p>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingGuest(null)}
                className="px-4 py-2 text-xs text-[#1a1a1a]/70 hover:bg-[#1a1a1a]/5 rounded-full font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
