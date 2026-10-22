// Client-side state of the voter's place: city switch (radio "city") + Bratislava district (select "mc").
// `place` is the effective district id: a Bratislava district, the town id (e.g. "stupava") or "".
export interface Place {
  city: string;
  mc: string;
  place: string;
}

const EVENT = 'placechange';

const radios = (form: HTMLFormElement) => [...form.querySelectorAll<HTMLInputElement>('input[name="city"]')];
const select = (form: HTMLFormElement) => form.querySelector<HTMLSelectElement>('select[name="mc"]')!;

// Show the district select only for Bratislava; picking a district implies Bratislava.
export function syncPicker(form: HTMLFormElement): Place {
  const sel = select(form);
  let city = radios(form).find((r) => r.checked)?.value ?? '';
  if (!city && sel.value) {
    city = 'bratislava';
    radios(form).forEach((r) => (r.checked = r.value === city));
  }
  const town = city !== '' && city !== 'bratislava';
  sel.closest('label')!.hidden = sel.disabled = town;
  return { city, mc: sel.value, place: town ? city : sel.value };
}

export function writePlace(form: HTMLFormElement, p: { city: string; mc: string }): Place {
  radios(form).forEach((r) => (r.checked = r.value === p.city));
  select(form).value = p.mc;
  return syncPicker(form);
}

export function loadPlace(): { city: string; mc: string } {
  const mc = localStorage.getItem('mc') ?? '';
  return { city: localStorage.getItem('city') || (mc ? 'bratislava' : ''), mc };
}

export function savePlace(form: HTMLFormElement): Place {
  const p = syncPicker(form);
  for (const k of ['city', 'mc'] as const) {
    if (p[k]) localStorage.setItem(k, p[k]);
    else localStorage.removeItem(k);
  }
  document.dispatchEvent(new CustomEvent(EVENT, { detail: { ...p, source: form } }));
  return p;
}

export function onPlaceChange(fn: (p: Place, source: HTMLFormElement) => void) {
  document.addEventListener(EVENT, (e) => {
    const { source, ...p } = (e as CustomEvent).detail;
    fn(p, source);
  });
}
