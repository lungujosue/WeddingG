import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import type { WeddingGuest } from '../types';

/**
 * Generate a high-resolution QR code data URL
 */
export async function generateQRCodeDataUrl(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 400,
      color: {
        dark: '#1a1a1a',
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}

/**
 * Export Invitation as high-quality printable A5 PDF
 */
export async function downloadInvitationPDF(guest: WeddingGuest): Promise<void> {
  const qrDataUrl = await generateQRCodeDataUrl(guest.qrPayload);
  
  // A5 dimensions in mm: 148 x 210
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5'
  });

  const pageWidth = 148;
  const pageHeight = 210;
  const margin = 10;

  // Background color: Ivory (#fdfbf7)
  doc.setFillColor(253, 251, 247);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Double border frame
  // Outer border: Charcoal (#1a1a1a)
  doc.setDrawColor(26, 26, 26);
  doc.setLineWidth(0.8);
  doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

  // Inner border: Ochre accent (#d4a373)
  doc.setDrawColor(212, 163, 115);
  doc.setLineWidth(0.3);
  doc.rect(margin + 2.5, margin + 2.5, pageWidth - (margin + 2.5) * 2, pageHeight - (margin + 2.5) * 2);

  // Corner decorative marks
  const cornerSize = 4;
  doc.setDrawColor(212, 163, 115);
  doc.setLineWidth(0.5);
  // Top-left
  doc.line(margin + 5, margin + 5, margin + 5 + cornerSize, margin + 5);
  doc.line(margin + 5, margin + 5, margin + 5, margin + 5 + cornerSize);
  // Top-right
  doc.line(pageWidth - margin - 5, margin + 5, pageWidth - margin - 5 - cornerSize, margin + 5);
  doc.line(pageWidth - margin - 5, margin + 5, pageWidth - margin - 5, margin + 5 + cornerSize);
  // Bottom-left
  doc.line(margin + 5, pageHeight - margin - 5, margin + 5 + cornerSize, pageHeight - margin - 5);
  doc.line(margin + 5, pageHeight - margin - 5, margin + 5, pageHeight - margin - 5 - cornerSize);
  // Bottom-right
  doc.line(pageWidth - margin - 5, pageHeight - margin - 5, pageWidth - margin - 5 - cornerSize, pageHeight - margin - 5);
  doc.line(pageWidth - margin - 5, pageHeight - margin - 5, pageWidth - margin - 5, pageHeight - margin - 5 - cornerSize);

  // Top Monogram seal "EG"
  doc.setDrawColor(26, 26, 26);
  doc.setFillColor(253, 251, 247);
  doc.circle(pageWidth / 2, 28, 7, 'FD');
  doc.setTextColor(212, 163, 115);
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(11);
  doc.text('É · G', pageWidth / 2, 29.5, { align: 'center' });

  // Subtitle
  doc.setTextColor(212, 163, 115);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('VOUS ÊTES CORDIALEMENT INVITÉ(E)', pageWidth / 2, 45, { align: 'center' });

  // Guest Name (Highlight)
  doc.setTextColor(26, 26, 26);
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(20);
  doc.text(guest.name, pageWidth / 2, 57, { align: 'center' });

  // Connecting phrase
  doc.setTextColor(115, 98, 90);
  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.text('à célébrer le mariage de', pageWidth / 2, 67, { align: 'center' });

  // Couple names
  doc.setTextColor(26, 26, 26);
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  doc.text('Élodie & Gabriel', pageWidth / 2, 80, { align: 'center' });

  // Subtle separator line
  doc.setDrawColor(212, 163, 115);
  doc.setLineWidth(0.4);
  doc.line(pageWidth / 2 - 25, 87, pageWidth / 2 + 25, 87);

  // Date & Place
  doc.setTextColor(212, 163, 115);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('12 OCTOBRE 2026', pageWidth / 2, 95, { align: 'center' });

  doc.setTextColor(74, 59, 53);
  doc.setFont('times', 'italic');
  doc.setFontSize(11.5);
  doc.text('À quinze heures trente', pageWidth / 2, 101, { align: 'center' });

  doc.setTextColor(26, 26, 26);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('La Bastide des Oliviers', pageWidth / 2, 108, { align: 'center' });
  doc.setTextColor(115, 98, 90);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Route des Lavandes · Provence', pageWidth / 2, 113, { align: 'center' });

  // Additional RSVP info (party size & status)
  doc.setFillColor(247, 243, 235);
  doc.roundedRect(pageWidth / 2 - 45, 120, 90, 14, 2, 2, 'F');
  doc.setTextColor(26, 26, 26);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  const statusLabel = guest.attendance === 'present' ? 'Présence confirmée' : guest.attendance === 'absent' ? 'Ne peut être présent' : 'En attente';
  const partyLabel = guest.partySize > 1 ? `Réservation pour ${guest.partySize} personnes` : 'Réservation pour 1 personne';
  doc.text(`${statusLabel} · ${partyLabel}`, pageWidth / 2, 128.5, { align: 'center' });

  // QR Code
  if (qrDataUrl) {
    const qrSize = 34;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(212, 163, 115);
    doc.setLineWidth(0.3);
    doc.roundedRect(pageWidth / 2 - qrSize / 2 - 2, 140, qrSize + 4, qrSize + 4, 1.5, 1.5, 'FD');
    doc.addImage(qrDataUrl, 'PNG', pageWidth / 2 - qrSize / 2, 142, qrSize, qrSize);
  }

  // Invitation unique code
  doc.setTextColor(26, 26, 26);
  doc.setFont('courier', 'bold');
  doc.setFontSize(9.5);
  doc.text(`CODE : ${guest.invitationCode}`, pageWidth / 2, 185, { align: 'center' });

  // Entry instruction
  doc.setTextColor(115, 98, 90);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Présentez ce code ou ce QR code à l\'entrée', pageWidth / 2, 191, { align: 'center' });
  doc.text('Maison de famille · Provence', pageWidth / 2, 196, { align: 'center' });

  // Sanitize filename
  const cleanName = guest.name.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`Invitation_Mariage_Elodie_Gabriel_${cleanName}.pdf`);
}

/**
 * Export Invitation as high-resolution PNG image
 */
export async function downloadInvitationPNG(guest: WeddingGuest): Promise<void> {
  const qrDataUrl = await generateQRCodeDataUrl(guest.qrPayload);

  const canvas = document.createElement('canvas');
  const scale = 2; // 2x retina clarity
  const width = 600 * scale;
  const height = 850 * scale;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(scale, scale);
  const w = 600;
  const h = 850;

  // Background
  ctx.fillStyle = '#fdfbf7';
  ctx.fillRect(0, 0, w, h);

  // Subtle background grain/lines
  ctx.strokeStyle = 'rgba(212, 163, 115, 0.12)';
  ctx.lineWidth = 1;
  for (let i = 0; i < h; i += 40) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(w, i);
    ctx.stroke();
  }

  // Outer border
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(30, 30, w - 60, h - 60);

  // Inner subtle ochre border
  ctx.strokeStyle = '#d4a373';
  ctx.lineWidth = 1;
  ctx.strokeRect(38, 38, w - 76, h - 76);

  // Monogram circle
  ctx.beginPath();
  ctx.arc(w / 2, 90, 26, 0, Math.PI * 2);
  ctx.fillStyle = '#fdfbf7';
  ctx.fill();
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Monogram text
  ctx.font = 'italic 700 20px "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = '#d4a373';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('É · G', w / 2, 91);

  // Subtitle
  ctx.font = '700 11px "Manrope", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillStyle = '#d4a373';
  ctx.fillText('VOUS ÊTES CORDIALEMENT INVITÉ(E)', w / 2, 145);

  // Guest Name
  ctx.font = 'italic 700 36px "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = '#1a1a1a';
  ctx.fillText(guest.name, w / 2, 195);

  // Connector
  ctx.font = 'italic 16px "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = '#73625A';
  ctx.fillText('à célébrer le mariage de', w / 2, 235);

  // Couple names
  ctx.font = '700 44px "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = '#1a1a1a';
  ctx.fillText('Élodie & Gabriel', w / 2, 285);

  // Divider
  ctx.strokeStyle = '#d4a373';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 80, 315);
  ctx.lineTo(w / 2 + 80, 315);
  ctx.stroke();

  // Date
  ctx.font = '700 15px "Manrope", sans-serif';
  ctx.fillStyle = '#d4a373';
  ctx.fillText('12 OCTOBRE 2026 · 15H30', w / 2, 345);

  // Venue
  ctx.font = '700 18px "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = '#1a1a1a';
  ctx.fillText('La Bastide des Oliviers', w / 2, 380);

  ctx.font = '400 13px "Manrope", sans-serif';
  ctx.fillStyle = '#73625A';
  ctx.fillText('Route des Lavandes · Provence', w / 2, 405);

  // RSVP Status Badge
  ctx.fillStyle = '#f7f3eb';
  ctx.beginPath();
  ctx.roundRect(w / 2 - 160, 440, 320, 36, 10);
  ctx.fill();
  ctx.strokeStyle = '#d4a373';
  ctx.stroke();

  ctx.font = '700 12px "Manrope", sans-serif';
  ctx.fillStyle = '#1a1a1a';
  const statusStr = guest.attendance === 'present' ? 'Présence confirmée' : guest.attendance === 'absent' ? 'Ne peut être présent' : 'En attente';
  const guestsStr = guest.partySize > 1 ? `${guest.partySize} personnes` : '1 personne';
  ctx.fillText(`${statusStr} · ${guestsStr}`, w / 2, 462);

  // Draw QR Code
  if (qrDataUrl) {
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.src = qrDataUrl;
    await new Promise((resolve) => {
      qrImg.onload = () => {
        const qrSize = 130;
        // Background card for QR
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#d4a373';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(w / 2 - qrSize / 2 - 8, 510, qrSize + 16, qrSize + 16, 12);
        ctx.fill();
        ctx.stroke();

        ctx.drawImage(qrImg, w / 2 - qrSize / 2, 518, qrSize, qrSize);
        resolve(true);
      };
    });
  }

  // Invitation Code
  ctx.font = '700 16px "Courier New", monospace';
  ctx.fillStyle = '#1a1a1a';
  ctx.fillText(`CODE : ${guest.invitationCode}`, w / 2, 700);

  // Bottom Notice
  ctx.font = '400 12px "Manrope", sans-serif';
  ctx.fillStyle = '#73625A';
  ctx.fillText('Présentez ce code ou ce QR code à l’entrée', w / 2, 735);

  ctx.font = 'italic 13px "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = '#d4a373';
  ctx.fillText('Maison de famille · Provence', w / 2, 765);

  // Download trigger
  const link = document.createElement('a');
  const cleanName = guest.name.replace(/[^a-zA-Z0-9_-]/g, '_');
  link.download = `Invitation_Mariage_Elodie_Gabriel_${cleanName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
