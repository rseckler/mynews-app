import { Article, CategoryInfo, TrendingTopic } from "@/types";

export const CATEGORIES: CategoryInfo[] = [
  { id: "for-you", label: "Für Dich", color: "#0EA5E9" },
  { id: "politik", label: "Politik", color: "#EF4444" },
  { id: "wirtschaft", label: "Wirtschaft", color: "#F59E0B" },
  { id: "sport", label: "Sport", color: "#22C55E" },
  { id: "tech", label: "Technologie", color: "#8B5CF6" },
  { id: "wissenschaft", label: "Wissenschaft", color: "#06B6D4" },
  { id: "unterhaltung", label: "Unterhaltung", color: "#EC4899" },
  { id: "gesundheit", label: "Gesundheit", color: "#14B8A6" },
  { id: "kultur", label: "Kultur", color: "#F97316" },
];

export const TRENDING_TOPICS: TrendingTopic[] = [
  { id: "t1", label: "Klimagipfel 2026", articleCount: 24, category: "politik" },
  { id: "t2", label: "Champions League", articleCount: 18, category: "sport" },
  { id: "t3", label: "Apple Vision Pro 2", articleCount: 15, category: "tech" },
  { id: "t4", label: "EZB Zinsentscheid", articleCount: 12, category: "wirtschaft" },
  { id: "t5", label: "Berlinale 2026", articleCount: 9, category: "kultur" },
];

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

export const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Bundesregierung beschließt historisches Klimaschutzpaket mit weitreichenden Folgen",
    description:
      "Das Kabinett hat ein umfassendes Klimaschutzgesetz verabschiedet, das CO₂-Emissionen bis 2035 um 65% senken soll. Industrie und Umweltverbände reagieren gespalten auf die Maßnahmen.",
    url: "https://example.com/klimaschutz",
    imageUrl:
      "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&q=80",
    sourceName: "Spiegel",
    author: "Anna Müller",
    publishedAt: hoursAgo(2),
    category: "politik",
    aiSummary:
      'Die Bundesregierung hat ein historisches Klimaschutzpaket beschlossen, das eine Reduktion der CO₂-Emissionen um 65% bis 2035 vorsieht. Das Paket umfasst einen CO₂-Preis von 85€ pro Tonne, massive Investitionen in erneuerbare Energien und Förderungen für klimafreundliche Technologien. Während Umweltverbände die Maßnahmen als „überfällig" begrüßen, warnt die Industrie vor steigenden Produktionskosten.',
    sentiment: "neutral",
    language: "de",
    readTimeMinutes: 5,
    tags: ["Klimaschutz", "Deutschland"],
    feedReason: "interest",
  },
  {
    id: "2",
    title: "Bayern München sichert sich Tabellenführung nach Spektakel-Sieg",
    description:
      "Mit einem 4:2-Sieg gegen Borussia Dortmund übernimmt der FC Bayern die Bundesliga-Spitze. Harry Kane erzielt einen Hattrick.",
    url: "https://example.com/bayern-bvb",
    imageUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    sourceName: "Sport1",
    author: "Marcus Weber",
    publishedAt: hoursAgo(1),
    category: "sport",
    aiSummary:
      "Bayern München hat das Topspiel gegen Borussia Dortmund mit 4:2 gewonnen und die Tabellenführung übernommen. Harry Kane war mit drei Toren der überragende Spieler. BVB-Trainer reagierte enttäuscht auf die Defensivfehler seiner Mannschaft.",
    sentiment: "positive",
    language: "de",
    readTimeMinutes: 3,
    tags: ["Bundesliga", "Bayern München"],
    feedReason: "interest",
  },
  {
    id: "3",
    title: "OpenAI stellt GPT-5 vor: Neues Sprachmodell soll menschliches Denken simulieren",
    description:
      "Das neue Modell zeigt erstmals echtes logisches Schlussfolgern und übertrifft menschliche Experten in wissenschaftlichen Benchmarks.",
    url: "https://example.com/gpt5",
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    sourceName: "t3n",
    author: "Lisa Chen",
    publishedAt: hoursAgo(3),
    category: "tech",
    aiSummary:
      "OpenAI hat GPT-5 vorgestellt, das laut Unternehmensangaben einen Durchbruch beim logischen Schlussfolgern darstellt. In wissenschaftlichen Tests übertrifft es menschliche Experten in Mathematik, Physik und Programmierung. Kritiker warnen vor überzogenen Erwartungen und fordern unabhängige Evaluation.",
    sentiment: "neutral",
    language: "de",
    readTimeMinutes: 6,
    tags: ["KI", "OpenAI"],
    feedReason: "trending",
  },
  {
    id: "4",
    title: "EZB senkt Leitzins auf 2,5% – Märkte reagieren positiv",
    description:
      "Die Europäische Zentralbank hat den Leitzins wie erwartet um 0,25 Prozentpunkte gesenkt. Der DAX steigt auf ein neues Allzeithoch.",
    url: "https://example.com/ezb-zinsen",
    imageUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    sourceName: "Handelsblatt",
    author: "Thomas Berg",
    publishedAt: hoursAgo(4),
    category: "wirtschaft",
    aiSummary:
      "Die EZB hat den Leitzins um 25 Basispunkte auf 2,5% gesenkt – die dritte Senkung in Folge. EZB-Präsidentin Lagarde signalisierte weitere mögliche Schritte. Der DAX reagierte mit einem Plus von 1,8% und erreichte ein Allzeithoch bei 21.450 Punkten.",
    sentiment: "positive",
    language: "de",
    readTimeMinutes: 4,
    tags: ["EZB", "Finanzmärkte"],
    feedReason: "interest",
  },
  {
    id: "5",
    title: "Durchbruch in der Krebsforschung: Neuer mRNA-Impfstoff zeigt vielversprechende Ergebnisse",
    description:
      "Forscher der Charité haben einen personalisierten mRNA-Impfstoff gegen Bauchspeicheldrüsenkrebs entwickelt, der in Phase-2-Studien bemerkenswerte Erfolge zeigt.",
    url: "https://example.com/krebs-mrna",
    imageUrl:
      "https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=800&q=80",
    sourceName: "Süddeutsche Zeitung",
    author: "Dr. Sarah Koch",
    publishedAt: hoursAgo(5),
    category: "wissenschaft",
    aiSummary:
      "Ein Team der Charité Berlin hat einen personalisierten mRNA-Impfstoff gegen Bauchspeicheldrüsenkrebs entwickelt. In Phase-2-Studien zeigten 62% der Patienten eine signifikante Tumorverkleinerung. Die Forscher planen ab 2027 Phase-3-Studien mit über 1.000 Teilnehmern.",
    sentiment: "positive",
    language: "de",
    readTimeMinutes: 7,
    tags: ["Medizin", "Forschung"],
    feedReason: "discover",
  },
  {
    id: "6",
    title: "Berlinale 2026: Deutscher Film gewinnt Goldenen Bären",
    description:
      'Der Debütfilm „Stille Wasser" von Regisseurin Lea Hartmann wurde mit dem Goldenen Bären der 76. Berlinale ausgezeichnet.',
    url: "https://example.com/berlinale",
    imageUrl:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
    sourceName: "Zeit Online",
    publishedAt: hoursAgo(6),
    category: "kultur",
    aiSummary:
      'Der deutsche Film „Stille Wasser" von Nachwuchsregisseurin Lea Hartmann hat den Goldenen Bären der 76. Berlinale gewonnen. Die Jury lobte den „einfühlsamen Blick auf ländliche Gemeinschaften". Es ist der erste deutsche Hauptpreis seit 2019.',
    sentiment: "positive",
    language: "de",
    readTimeMinutes: 3,
    tags: ["Berlinale", "Film"],
    feedReason: "trending",
  },
  {
    id: "7",
    title: "Apple kündigt Vision Pro 2 mit revolutionärem Display an",
    description:
      "Die zweite Generation des Mixed-Reality-Headsets soll leichter, günstiger und mit Micro-OLED-Displays ausgestattet sein.",
    url: "https://example.com/vision-pro-2",
    imageUrl:
      "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&q=80",
    sourceName: "Heise",
    author: "Jan Becker",
    publishedAt: hoursAgo(7),
    category: "tech",
    aiSummary:
      "Apple hat die Vision Pro 2 angekündigt: 40% leichter als der Vorgänger, neues Micro-OLED-Display mit 8K-Auflösung pro Auge und ein Startpreis von 2.499€ statt 3.999€. Marktexperten sehen darin den Durchbruch für Mixed Reality im Mainstream.",
    sentiment: "positive",
    language: "de",
    readTimeMinutes: 5,
    tags: ["Apple", "Mixed Reality"],
    feedReason: "trending",
  },
  {
    id: "8",
    title: "Neue Studie: Vier-Tage-Woche steigert Produktivität um 20%",
    description:
      "Eine großangelegte Studie mit 200 deutschen Unternehmen bestätigt die positiven Effekte der verkürzten Arbeitswoche auf Leistung und Gesundheit.",
    url: "https://example.com/vier-tage-woche",
    sourceName: "FAZ",
    author: "Michael Richter",
    publishedAt: hoursAgo(8),
    category: "wirtschaft",
    aiSummary:
      "Eine Studie der Universität Mannheim mit 200 Unternehmen und 15.000 Mitarbeitern zeigt: Die 4-Tage-Woche steigert die Produktivität um 20% und reduziert Krankheitstage um 35%. 87% der teilnehmenden Firmen wollen das Modell dauerhaft beibehalten.",
    sentiment: "positive",
    language: "de",
    readTimeMinutes: 4,
    tags: ["Arbeit", "Wirtschaft"],
    feedReason: "interest",
  },
  {
    id: "9",
    title: "Champions League: Dortmund schlägt Real Madrid im Viertelfinal-Hinspiel",
    description:
      "Borussia Dortmund gewinnt überraschend 2:1 im Santiago Bernabéu und verschafft sich eine gute Ausgangsposition für das Rückspiel.",
    url: "https://example.com/bvb-real",
    imageUrl:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
    sourceName: "Kicker",
    publishedAt: hoursAgo(1),
    category: "sport",
    aiSummary:
      "Dortmund hat Real Madrid im CL-Viertelfinal-Hinspiel 2:1 besiegt. Treffer von Adeyemi und Brandt sorgten für die Überraschung im Bernabéu. Das Rückspiel in Dortmund findet in zwei Wochen statt.",
    sentiment: "positive",
    language: "de",
    readTimeMinutes: 3,
    tags: ["Champions League", "BVB"],
    feedReason: "interest",
    isBreaking: true,
  },
  {
    id: "10",
    title: "WHO warnt vor neuer Virusvariante in Südostasien",
    description:
      "Die Weltgesundheitsorganisation beobachtet eine neue Variante eines Atemwegsvirus in Thailand und Vietnam. Experten mahnen zur Vorsicht, sehen aber keinen Grund zur Panik.",
    url: "https://example.com/who-virus",
    sourceName: "Tagesschau",
    publishedAt: hoursAgo(3),
    category: "gesundheit",
    aiSummary:
      'Die WHO beobachtet eine neue Atemwegsvirus-Variante in Südostasien mit erhöhter Übertragbarkeit. Bisherige Impfungen bieten laut ersten Daten teilweisen Schutz. Die WHO stuft das Risiko als „moderat" ein und empfiehlt erhöhte Wachsamkeit.',
    sentiment: "negative",
    language: "de",
    readTimeMinutes: 4,
    tags: ["WHO", "Gesundheit"],
    feedReason: "discover",
  },
  {
    id: "11",
    title: "EU-Parlament verabschiedet umstrittenes Lieferkettengesetz",
    description:
      "Nach monatelangen Verhandlungen hat das EU-Parlament das Lieferkettengesetz mit knapper Mehrheit beschlossen. Unternehmen müssen künftig Menschenrechtsverletzungen in ihrer Lieferkette dokumentieren.",
    url: "https://example.com/lieferkettengesetz",
    sourceName: "Reuters",
    publishedAt: hoursAgo(5),
    category: "politik",
    aiSummary:
      "Das EU-Parlament hat das Lieferkettengesetz verabschiedet: Unternehmen ab 500 Mitarbeitern müssen Menschenrechtsverletzungen und Umweltschäden in Lieferketten dokumentieren und verhindern. Verstöße können mit bis zu 5% des Jahresumsatzes bestraft werden.",
    sentiment: "neutral",
    language: "de",
    readTimeMinutes: 5,
    tags: ["EU", "Lieferkette"],
    feedReason: "interest",
  },
  {
    id: "12",
    title: "Netflix kündigt interaktive KI-Serien an – Zuschauer beeinflussen Handlung in Echtzeit",
    description:
      "Der Streamingdienst plant eine neue Generation interaktiver Inhalte, bei denen KI die Story dynamisch an Zuschauerpräferenzen anpasst.",
    url: "https://example.com/netflix-ki",
    imageUrl:
      "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80",
    sourceName: "The Verge",
    author: "Emily Park",
    publishedAt: hoursAgo(9),
    category: "unterhaltung",
    aiSummary:
      "Netflix plant KI-gesteuerte interaktive Serien, bei denen die Handlung sich in Echtzeit an Zuschauerpräferenzen anpasst. Erste Pilotprojekte starten Q3 2026. Kritiker sehen darin das Ende klassischen Storytellings, Befürworter eine Revolution der Unterhaltung.",
    sentiment: "neutral",
    language: "de",
    readTimeMinutes: 5,
    tags: ["Netflix", "KI"],
    feedReason: "discover",
  },
];

export function getCategoryColor(categoryId: string): string {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  return cat?.color ?? "#64748B";
}

export function getCategoryLabel(categoryId: string): string {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  return cat?.label ?? categoryId;
}

export function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return "gerade eben";
  if (diffMin < 60) return `vor ${diffMin} Min.`;
  if (diffHours < 24) return `vor ${diffHours} Std.`;
  if (diffDays < 7) return `vor ${diffDays} Tagen`;
  return date.toLocaleDateString("de-DE", { day: "numeric", month: "short" });
}

export function getFeedReasonLabel(reason: string): string {
  switch (reason) {
    case "interest":
      return "Basierend auf deinen Interessen";
    case "trending":
      return "Gerade im Trend";
    case "discover":
      return "Entdecken – erweitere deinen Horizont";
    default:
      return "";
  }
}
