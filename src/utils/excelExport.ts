import * as XLSX from 'xlsx';
import type { WeddingGuest } from '../types';

export function exportGuestsToExcel(guests: WeddingGuest[]): boolean {
  if (!guests || guests.length === 0) {
    return false;
  }

  // Format attendance in human-friendly French
  const formatAttendance = (att: string) => {
    switch (att) {
      case 'present':
        return 'Présent';
      case 'absent':
        return 'Absent';
      case 'pending':
        return 'En attente';
      default:
        return att;
    }
  };

  // Format date nicely
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  // Map to the exact French columns specified
  const rows = guests.map(guest => ({
    'Nom': guest.name,
    'E-mail': guest.email || '-',
    'Téléphone': guest.phone || '-',
    'Présence': formatAttendance(guest.attendance),
    'Nombre de personnes': guest.partySize || 1,
    'Régime / allergies': guest.dietaryNotes || '-',
    'Hébergement': guest.accommodation || '-',
    'Message': guest.message || '-',
    'Code invitation': guest.invitationCode,
    'Date d\'inscription': formatDate(guest.createdAt)
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths for readability
  worksheet['!cols'] = [
    { wch: 24 }, // Nom
    { wch: 26 }, // E-mail
    { wch: 18 }, // Téléphone
    { wch: 14 }, // Présence
    { wch: 20 }, // Nombre de personnes
    { wch: 28 }, // Régime / allergies
    { wch: 24 }, // Hébergement
    { wch: 34 }, // Message
    { wch: 18 }, // Code invitation
    { wch: 20 }  // Date d'inscription
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Invités Mariage');

  const today = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `Mariage_Elodie_Gabriel_Registre_Invites_${today}.xlsx`);
  return true;
}
