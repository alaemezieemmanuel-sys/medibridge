export type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN';
export type ConsultationStatus = 'REQUESTED' | 'PAID' | 'SCHEDULED' | 'COMPLETED' | 'DECLINED' | 'CANCELLED';
export type Verification = 'PENDING' | 'VERIFIED' | 'REJECTED';
export interface User { id: string; fullName: string; email: string; phone?: string; role: Role; status: string }
export interface Session { user: User; token: string }
export interface NamedUser { id: string; fullName: string }
export interface Doctor { id: string; specialty: string; qualifications: string; consultationPrice: number; verificationStatus: Verification; user: NamedUser }
export interface Consultation {
  id: string; patientId: string; doctorId: string; reason: string; symptoms: string | null;
  status: ConsultationStatus; paymentStatus: 'UNPAID' | 'PAID'; scheduledAt: string | null;
  doctorNotes: string | null; referral: string | null; createdAt: string;
  doctor?: Doctor; patient?: { id: string; user: NamedUser };
}
export interface Message { id: string; consultationId: string; senderId: string; body: string; createdAt: string }
export type Direction = 'PIDGIN_TO_ENGLISH' | 'ENGLISH_TO_PIDGIN';
export interface PatientRegistration {
  fullName: string; email: string; phone: string; password: string; dateOfBirth: string; gender: 'MALE' | 'FEMALE'; location: string;
  emergencyContact: { name: string; phone: string; relationship: string };
}
export interface DoctorRegistration {
  fullName: string; email: string; phone: string; password: string; specialty: string; qualifications: string; medicalLicenseNumber: string; consultationPrice: number;
}
export interface HealthPassport { id: string; bloodGroup: string | null; genotype: string | null; height: number | null; weight: number | null; notes: string | null }
export interface Allergy { id: string; allergen: string; reaction: string | null; severity: 'MILD' | 'MODERATE' | 'SEVERE'; notes: string | null }
export interface Condition { id: string; name: string; diagnosedAt: string | null; status: 'ACTIVE' | 'RESOLVED' | 'MANAGED'; notes: string | null }
export interface Medication { id: string; name: string; dosage: string | null; frequency: string | null; startDate: string | null; endDate: string | null; status: 'ACTIVE' | 'COMPLETED' | 'DISCONTINUED'; notes: string | null }
export interface PassportData { healthPassport: HealthPassport; allergies: Allergy[]; medicalConditions: Condition[]; medications: Medication[]; patient?: { id: string; user: { id: string; fullName: string; email: string } } }
export interface AccessGrant { id: string; doctorId: string; status: string; doctor: Doctor & { user: { id: string; fullName: string; email: string } } }
export type PassportInput = Partial<Pick<HealthPassport, 'bloodGroup' | 'genotype' | 'notes'>> & { height?: number; weight?: number };
