import candidatesJson from '../data/candidates.json';
import districtsJson from '../data/districts.json';
import obvodyJson from '../data/obvody.json';

export type BodyId = 'primator' | 'msz' | 'starosta' | 'mz' | 'predseda-bsk' | 'zastupitelstvo-bsk';

export interface Candidate {
  id: string;
  body: BodyId;
  district: string | null;
  obvod: number | null;
  number: number;
  firstName: string;
  lastName: string;
  titlesBefore: string;
  titlesAfter: string;
  age: number;
  occupation: string;
  parties: string[];
  independent: boolean;
  residence?: string;
}

export interface District {
  id: string;
  name: string;
  mszObvod: number;
  bskObvod: number;
  url: string;
  mzObvody: { obvod: number; seats: number; okrsky: number[] }[] | null;
}

export interface Ballot {
  key: string;
  body: BodyId;
  district: string | null;
  obvod: number | null;
  seats: number;
  districts: string[];
  okrsky?: number[];
  candidates: Candidate[];
}

export const candidates = candidatesJson as Candidate[];
export const districts = districtsJson as District[];
const obvody = obvodyJson as Record<'msz' | 'zastupitelstvo-bsk', { obvod: number; seats: number; districts: string[] }[]>;

// Order of ballots as handed out: white envelope (city) first, then blue (region).
export const bodyOrder: BodyId[] = ['primator', 'msz', 'starosta', 'mz', 'predseda-bsk', 'zastupitelstvo-bsk'];
export const envelope: Record<BodyId, 'white' | 'blue'> = {
  primator: 'white',
  msz: 'white',
  starosta: 'white',
  mz: 'white',
  'predseda-bsk': 'blue',
  'zastupitelstvo-bsk': 'blue',
};

export const districtById = Object.fromEntries(districts.map((d) => [d.id, d]));
const allDistricts = districts.map((d) => d.id);

function pick(body: BodyId, district: string | null = null, obvod: number | null = null): Candidate[] {
  return candidates
    .filter((c) => c.body === body && c.district === district && c.obvod === obvod)
    .sort((a, b) => a.number - b.number);
}

export function buildBallots(): Ballot[] {
  const out: Ballot[] = [];
  out.push({ key: 'primator', body: 'primator', district: null, obvod: null, seats: 1, districts: allDistricts, candidates: pick('primator') });
  for (const o of obvody.msz) {
    out.push({ key: `msz-${o.obvod}`, body: 'msz', district: null, obvod: o.obvod, seats: o.seats, districts: o.districts, candidates: pick('msz', null, o.obvod) });
  }
  for (const d of districts) {
    out.push({ key: `starosta-${d.id}`, body: 'starosta', district: d.id, obvod: null, seats: 1, districts: [d.id], candidates: pick('starosta', d.id) });
    for (const o of d.mzObvody ?? []) {
      out.push({ key: `mz-${d.id}-${o.obvod}`, body: 'mz', district: d.id, obvod: o.obvod, seats: o.seats, districts: [d.id], okrsky: o.okrsky, candidates: pick('mz', d.id, o.obvod) });
    }
  }
  out.push({ key: 'predseda-bsk', body: 'predseda-bsk', district: null, obvod: null, seats: 1, districts: allDistricts, candidates: pick('predseda-bsk') });
  for (const o of obvody['zastupitelstvo-bsk']) {
    out.push({ key: `bsk-${o.obvod}`, body: 'zastupitelstvo-bsk', district: null, obvod: o.obvod, seats: o.seats, districts: o.districts, candidates: pick('zastupitelstvo-bsk', null, o.obvod) });
  }
  return out;
}

export const parties: string[] = (() => {
  const count = new Map<string, number>();
  for (const c of candidates) for (const p of c.parties) count.set(p, (count.get(p) ?? 0) + 1);
  return [...count.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'sk')).map(([p]) => p);
})();

export function fullName(c: Candidate): string {
  const name = [c.titlesBefore, c.firstName, c.lastName].filter(Boolean).join(' ');
  return c.titlesAfter ? `${name}, ${c.titlesAfter}` : name;
}

export function initials(c: Candidate): string {
  return (c.firstName[0] ?? '') + (c.lastName[0] ?? '');
}

export function normalize(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
