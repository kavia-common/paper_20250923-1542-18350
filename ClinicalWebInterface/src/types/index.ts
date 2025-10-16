export type Gender = 'Male' | 'Female' | 'Other' | 'Unknown';

export interface Alerts {
  allergy: boolean;
  precaution: boolean;
  locked: boolean;
  discharged: boolean;
}

export interface Patient {
  id: string; // unique id
  hospitalNumber: string; // HN
  admissionNumber?: string; // AN
  firstName: string;
  lastName: string;
  gender: Gender;
  age: number; // in years for simplicity
  status: 'Admitted' | 'Discharged' | 'Pre-Admission' | 'Registered' | 'In-OR' | 'ICU' | 'Unknown';
  caseType?: 'Elective' | 'Emergency' | 'Day-care' | 'Other';
  surgeon?: string;
  procedure?: string;
  diagnosis?: string;
  alerts?: Alerts;
}

export interface Bed {
  id: string;
  name: string;
  occupancy: 'Occupied' | 'Vacant' | 'Reserved';
  patient?: Patient | null;
  alerts?: Alerts;
  location?: string; // ward/room
}
