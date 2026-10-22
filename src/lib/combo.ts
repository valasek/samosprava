export const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

// House number specs look like "1, 3, 5A" or "1-29", "4-62 párne", "nepárne 1-29"; `cd` is upper-case without spaces.
export function houseMatches(spec: string, cd: string): boolean {
  const n = parseInt(cd, 10);
  return spec.split(',').some((raw) => {
    const tok = raw.trim().toUpperCase();
    if (tok.replace(/[\s/]/g, '') === cd) return true;
    const m = tok.match(/(\d+)\s*-\s*(\d+)/);
    if (!m || Number.isNaN(n) || n < +m[1] || n > +m[2]) return false;
    if (/NEPÁRNE/.test(tok)) return n % 2 === 1;
    if (/PÁRNE/.test(tok)) return n % 2 === 0;
    return true;
  });
}

// Wires up a `.combo` element (combobox input, toggle button, listbox) to suggest from `names`.
export function setupCombo(combo: HTMLElement, names: string[]) {
  const input = combo.querySelector<HTMLInputElement>('input[role="combobox"]')!;
  const list = combo.querySelector<HTMLUListElement>('.combo-list')!;
  const toggle = combo.querySelector<HTMLButtonElement>('.combo-toggle')!;
  const toItems = (n: string[]) => [...new Set(n)].sort((a, b) => a.localeCompare(b, 'sk')).map((x) => ({ n: x, k: norm(x) }));
  let items = toItems(names);
  let active = -1;
  let blurTimer = 0;

  const close = () => {
    clearTimeout(blurTimer);
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    active = -1;
  };
  const highlight = (i: number) => {
    const options = list.children;
    if (!options.length) return;
    active = (i + options.length) % options.length;
    [...options].forEach((li, j) => li.setAttribute('aria-selected', String(j === active)));
    input.setAttribute('aria-activedescendant', options[active].id);
    options[active].scrollIntoView({ block: 'nearest' });
  };
  const choose = (name: string) => {
    input.value = name;
    close();
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.blur();
  };
  const render = (all = false) => {
    clearTimeout(blurTimer);
    const q = all ? '' : norm(input.value);
    const words = q.split(/\s+/).filter(Boolean);
    if ((!all && !words.length) || items.some((x) => x.k === q)) return close();
    const hits = items
      .filter((x) => words.every((w) => x.k.includes(w)))
      .sort((a, b) => Number(!a.k.startsWith(q)) - Number(!b.k.startsWith(q)));
    list.replaceChildren(
      ...hits.map((x, i) =>
        Object.assign(document.createElement('li'), {
          id: `${list.id}-${i}`,
          role: 'option',
          textContent: x.n,
        }),
      ),
    );
    active = -1;
    list.hidden = !hits.length;
    input.setAttribute('aria-expanded', String(hits.length > 0));
  };

  input.addEventListener('input', () => render());
  input.addEventListener('focus', () => render());
  // iOS blurs the input before the tap's click fires, so closing right away would swallow the selection.
  input.addEventListener('blur', () => {
    blurTimer = window.setTimeout(close, 300);
  });
  input.addEventListener('keydown', (e) => {
    if (list.hidden) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      highlight(active + (e.key === 'ArrowDown' ? 1 : -1));
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault();
      choose(list.children[active].textContent!);
    } else if (e.key === 'Escape') {
      close();
    }
  });
  // Keep focus on the input so blur doesn't close the list before the tap registers.
  list.addEventListener('pointerdown', (e) => e.preventDefault());
  list.addEventListener('click', (e) => {
    const li = (e.target as HTMLElement).closest('li');
    if (li) choose(li.textContent!);
  });
  toggle.addEventListener('pointerdown', (e) => e.preventDefault());
  toggle.addEventListener('click', () => {
    if (!list.hidden) return close();
    render(true);
  });
  document.addEventListener('click', (e) => {
    if (!list.hidden && !combo.contains(e.target as Node)) close();
  });
  return {
    setNames(n: string[]) {
      items = toItems(n);
    },
  };
}
