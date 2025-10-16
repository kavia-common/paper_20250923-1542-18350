import { Bed, Patient } from '../types/patient';

export const registeredPatients: Patient[] = [
  {
    hn: 'HN001234',
    an: 'AN567890',
    name: 'John Doe',
    gender: 'Male',
    age: 45,
    status: 'Admitted',
    surgeon: 'Dr. Smith',
    caseType: 'Elective',
    procedure: 'Knee Replacement',
    diagnosis: 'Osteoarthritis',
    allergies: ['Penicillin'],
    precautions: ['Fall risk'],
  },
  {
    hn: 'HN001235',
    an: 'AN567891',
    name: 'Jane Smith',
    gender: 'Female',
    age: 60,
    status: 'In-OR',
    surgeon: 'Dr. Patel',
    caseType: 'Emergency',
    procedure: 'Appendectomy',
    diagnosis: 'Appendicitis',
    allergies: [],
    precautions: [],
  },
  {
    hn: 'HN001236',
    name: 'Raj Kumar',
    gender: 'Male',
    age: 33,
    status: 'Pre-admission',
    surgeon: 'Dr. Rao',
    caseType: 'Elective',
    procedure: 'Hernia Repair',
    diagnosis: 'Inguinal Hernia',
    allergies: ['Latex'],
    precautions: [],
  },
];

export const beds: Bed[] = [
  {
    id: 'B1',
    name: 'Bed A1',
    occupied: true,
    dischargePlanned: false,
    locked: false,
    patient: registeredPatients[0],
  },
  {
    id: 'B2',
    name: 'Bed A2',
    occupied: true,
    dischargePlanned: true,
    locked: false,
    patient: registeredPatients[1],
  },
];
