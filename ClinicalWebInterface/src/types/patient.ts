export type Gender = 'Male' | 'Female' | 'Other';

export type PatientStatus = 'Admitted' | 'Pre-admission' | 'Discharged' | 'In-OR' | 'Post-Op';

export interface Patient {
  /** Unique patient identifier (hospital number) */
  hn: string;
  /** Admission number, when applicable */
  an?: string;
  name: string;
  gender: Gender;
  age: number;
  status: PatientStatus;
  surgeon?: string;
  caseType?: string;
  procedure?: string;
  diagnosis?: string;
  allergies?: string[];
  precautions?: string[];
}

export interface Bed {
  id: string;
  name: string;
  /** Bed occupancy status - true if a patient is assigned */
  occupied: boolean;
  /** Assigned patient details if occupied */
  patient?: Patient;
  /** Discharge flag for quick indicator toggle in UI */
  dischargePlanned?: boolean;
  /** Lock indicator for administrative holds */
  locked?: boolean;
}
