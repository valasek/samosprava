export const languages = { sk: 'Slovensky', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const langs = Object.keys(languages) as Lang[];

export const ui = {
  sk: {
    'site.title': 'Voľby do samosprávy 2026 – Bratislava',
    'site.description':
      'Jednoduchý sprievodca pre voličov v Bratislave: koho, kedy, kde a ako voliť 24. októbra 2026.',
    'nav.home': 'Domov',
    'nav.feedback': 'Spätná väzba',
    'home.headline': 'Voľby do samosprávy 2026',
    'home.date': 'Sobota 24. októbra 2026, 7:00 – 20:00',
    'home.poc':
      'Stránka sa pripravuje. Čoskoro tu nájdete zoznam kandidátov a návod, ako správne voliť.',
    'footer.credit': 'Pripravil',
    'footer.feedback': 'Napíšte nám spätnú väzbu',
    'footer.disclaimer':
      'Neoficiálny sprievodca. Záväzné informácie nájdete na stránkach MV SR a hlavného mesta.',
    'feedback.title': 'Spätná väzba',
    'feedback.intro': 'Našli ste chybu alebo vám niečo chýba? Dajte mi vedieť.',
    'feedback.message': 'Správa',
    'feedback.email': 'E-mail (nepovinné, ak chcete odpoveď)',
    'feedback.submit': 'Odoslať',
    'thanks.title': 'Ďakujem!',
    'thanks.text': 'Vaša spätná väzba bola odoslaná.',
    'thanks.back': 'Späť na úvod',
  },
  en: {
    'site.title': 'Self-Government Elections 2026 – Bratislava',
    'site.description':
      'A simple guide for voters in Bratislava: who, when, where and how to vote on 24 October 2026.',
    'nav.home': 'Home',
    'nav.feedback': 'Feedback',
    'home.headline': 'Self-Government Elections 2026',
    'home.date': 'Saturday 24 October 2026, 7:00 – 20:00',
    'home.poc':
      'This site is under construction. Candidate lists and a guide to voting correctly are coming soon.',
    'footer.credit': 'Made by',
    'footer.feedback': 'Send feedback',
    'footer.disclaimer':
      'Unofficial guide. For binding information see the Ministry of Interior and City of Bratislava websites.',
    'feedback.title': 'Feedback',
    'feedback.intro': 'Found a mistake or missing something? Let me know.',
    'feedback.message': 'Message',
    'feedback.email': 'E-mail (optional, if you want a reply)',
    'feedback.submit': 'Send',
    'thanks.title': 'Thank you!',
    'thanks.text': 'Your feedback has been sent.',
    'thanks.back': 'Back to home',
  },
} as const;

export type UiKey = keyof (typeof ui)['sk'];

export function t(lang: Lang, key: UiKey): string {
  return ui[lang][key];
}

export const slugs = {
  feedback: { sk: 'spatna-vazba', en: 'feedback' },
  thanks: { sk: 'dakujem', en: 'thank-you' },
} as const;
