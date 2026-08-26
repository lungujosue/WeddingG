export type AttendanceStatus = 'present' | 'absent' | 'pending';

export interface WeddingGuest {
  id: string;
  name: string;
  email: string;
  phone: string;
  attendance: AttendanceStatus;
  partySize: number;
  dietaryNotes: string;
  accommodation: string;
  message: string;
  invitationCode: string;
  qrPayload: string;
  createdAt: string;
  updatedAt: string;
}

export interface GuestRegistrationInput {
  name: string;
  email?: string;
  phone?: string;
  attendance?: AttendanceStatus;
  partySize?: number;
  dietaryNotes?: string;
  accommodation?: string;
  message?: string;
}

export interface AdminStats {
  totalRegistered: number;
  totalConfirmed: number;
  totalAttendeesCount: number;
  totalDeclined: number;
  totalPending: number;
}
