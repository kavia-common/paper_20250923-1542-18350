import { Bed, Patient } from '../types';

const makePatient = (overrides: Partial<Patient> = {}): Patient => ({
  id: overrides.id || crypto.randomUUID(),
  hospitalNumber: overrides.hospitalNumber || `HN${Math.floor(Math.random() * 90000 + 10000)}`,
  admissionNumber: overrides.admissionNumber || `AN${Math.floor(Math.random() * 90000 + 10000)}`,
  firstName: overrides.firstName || 'John',
  lastName: overrides.lastName || 'Doe',
  gender: overrides.gender || 'Male',
  age: overrides.age ?? 45,
  status: overrides.status || 'Admitted',
  caseType: overrides.caseType || 'Elective',
  surgeon: overrides.surgeon || 'Dr. Smith',
  procedure: overrides.procedure || 'Appendectomy',
  diagnosis: overrides.diagnosis || 'Appendicitis',
  alerts: overrides.alerts || { allergy: false, precaution: false, locked: false, discharged: false },
});

export const mockBeds: Bed[] = [
  {
    id: 'bed-1',
    name: 'Bed A1',
    occupancy: 'Occupied',
    location: 'Ward 1',
    patient: makePatient({ firstName: 'Aarav', lastName: 'Sharma', gender: 'Male', age: 34, status: 'Admitted' }),
    alerts: { allergy: true, precaution: false, locked: false, discharged: false },
  },
  {
    id: 'bed-2',
    name: 'Bed A2',
    occupancy: 'Vacant',
    location: 'Ward 1',
    patient: null,
    alerts: { allergy: false, precaution: false, locked: false, discharged: false },
  },
  {
    id: 'bed-3',
    name: 'Bed B1',
    occupancy: 'Occupied',
    location: 'Ward 2',
    patient: makePatient({ firstName: 'Priya', lastName: 'Iyer', gender: 'Female', age: 28, status: 'In-OR' }),
    alerts: { allergy: false, precaution: true, locked: false, discharged: false },
  },
  {
    id: 'bed-4',
    name: 'Bed B2',
    occupancy: 'Reserved',
    location: 'Ward 2',
    patient: makePatient({ firstName: 'Rahul', lastName: 'Verma', gender: 'Male', age: 51, status: 'Registered' }),
    alerts: { allergy: false, precaution: false, locked: true, discharged: false },
  },
];
