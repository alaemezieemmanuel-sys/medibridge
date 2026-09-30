import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAsync } from '../lib/hooks';
import { Card, Empty, ErrorState, Skeleton } from '../components/ui';

export default function PatientPassport() {
  const { patientId = '' } = useParams(); const { data, loading, error, reload } = useAsync(() => api.patientPassport(patientId), [patientId]);
  const list = (a: string[]) => (a.length ? a.join(', ') : 'None recorded');
  return <><Link to="/">Back</Link>{loading && !data ? <Card><Skeleton rows={5} /></Card> : error && !data ? <Card><Empty title="Health Passport unavailable" hint={error} /><div className="row" style={{ justifyContent: 'center' }}><button className="btn alt sm" onClick={reload}>Try again</button></div></Card> : data && <>
    <h1>{data.patient?.user.fullName ?? 'Patient'}</h1>
    <Card><p><b>Blood group:</b> {data.healthPassport.bloodGroup ?? 'Not recorded'}</p><p><b>Genotype:</b> {data.healthPassport.genotype ?? 'Not recorded'}</p><p><b>Height / weight:</b> {data.healthPassport.height ?? '?'} cm / {data.healthPassport.weight ?? '?'} kg</p>
      <p><b>Allergies:</b> {list(data.allergies.map(a => `${a.allergen} (${a.severity.toLowerCase()})`))}</p><p><b>Conditions:</b> {list(data.medicalConditions.map(c => `${c.name} (${c.status.toLowerCase()})`))}</p><p><b>Medications:</b> {list(data.medications.map(m => `${m.name} ${m.dosage ?? ''}`.trim()))}</p>{data.healthPassport.notes && <p><b>Notes:</b> {data.healthPassport.notes}</p>}</Card></>}</>;
}
