/** Extended article content for the detail page (mock). */
export const ARTICLE_CONTENT: Record<string, string[]> = {
  "1": [
    `Berlin – Die Bundesregierung hat am Mittwoch ein umfassendes Klimaschutzpaket verabschiedet, das als das ambitionierteste in der Geschichte der Bundesrepublik gilt. Das Gesetzespaket sieht vor, die CO₂-Emissionen Deutschlands bis 2035 um 65 Prozent gegenüber dem Niveau von 1990 zu senken.`,
    `Kernstück des Pakets ist eine Anhebung des CO₂-Preises auf 85 Euro pro Tonne ab 2027. Gleichzeitig sollen die Einnahmen vollständig in einen Klimafonds fließen, der Investitionen in erneuerbare Energien, Gebäudesanierung und klimafreundliche Mobilität finanziert.`,
    `Bundesumweltministerin betonte bei der Pressekonferenz: „Dieses Paket ist ein Meilenstein. Wir schaffen den Rahmen für eine klimaneutrale Wirtschaft, ohne die soziale Balance zu verlieren." Der Sozialausgleich sieht ein Klimageld von 180 Euro pro Person und Jahr vor.`,
    `Die Industrieverbände reagierten zurückhaltend. BDI-Präsident warnte vor „erheblichen Belastungen für den Standort Deutschland" und forderte Ausnahmeregelungen für energieintensive Branchen. Besonders die Chemie- und Stahlindustrie sieht sich durch die höheren CO₂-Kosten unter Druck.`,
    `Umweltverbände begrüßten das Paket grundsätzlich, kritisierten jedoch einzelne Punkte. Greenpeace forderte einen schnelleren Ausstieg aus fossilen Energieträgern, während der BUND die Ausnahmen für die Landwirtschaft als „zu weitreichend" bezeichnete.`,
  ],
  "2": [
    `München – In einem packenden Bundesliga-Topspiel hat der FC Bayern München Borussia Dortmund mit 4:2 besiegt und damit die Tabellenführung übernommen. Vor 75.000 Zuschauern in der ausverkauften Allianz Arena war Harry Kane mit einem Hattrick der überragende Spieler.`,
    `Kane eröffnete bereits in der 12. Minute den Torreigen, als er nach einem Steilpass von Musiala eiskalt vollstreckte. Dortmund kam durch Adeyemi zum Ausgleich (28.), doch Kane stellte noch vor der Pause per Kopf auf 2:1 (39.).`,
    `In der zweiten Halbzeit erhöhte Sané auf 3:1 (58.), bevor Brandt für den BVB verkürzte (72.). Kane machte mit seinem dritten Treffer in der 81. Minute den Deckel drauf und feierte seinen insgesamt 25. Saisontreffer.`,
    `Bayern-Trainer lobte seine Mannschaft: „Das war eine reife Leistung gegen einen starken Gegner. Harry Kane ist in der Form seines Lebens." Mit dem Sieg zieht Bayern drei Punkte an Dortmund vorbei an die Tabellenspitze.`,
  ],
  "3": [
    `San Francisco – OpenAI hat mit GPT-5 die nächste Generation seines Sprachmodells vorgestellt. Das neue Modell soll erstmals echtes logisches Schlussfolgern beherrschen und übertrifft laut Unternehmensangaben menschliche Experten in mehreren wissenschaftlichen Disziplinen.`,
    `In standardisierten Benchmarks erreichte GPT-5 eine Genauigkeit von 96,3% bei mathematischen Aufgaben auf Universitätsniveau, verglichen mit 89,1% bei GPT-4o. Bei Programmieraufgaben konnte das Modell 94% der Probleme auf der Plattform Codeforces lösen.`,
    `CEO Sam Altman bezeichnete GPT-5 als „den bedeutendsten Fortschritt seit der Gründung von OpenAI". Das Modell nutze eine neuartige Architektur, die mehrere spezialisierte Subsysteme kombiniere – darunter Module für Logik, Faktenwissen und kreatives Denken.`,
    `Kritiker mahnen zur Vorsicht. KI-Forscher betont, dass Benchmark-Ergebnisse nicht mit echtem Verständnis gleichzusetzen seien: „Wir sehen beeindruckende Mustererkennung, aber die Frage nach echtem Reasoning bleibt offen." Unabhängige Evaluationen stehen noch aus.`,
    `GPT-5 soll zunächst über die API verfügbar sein, ein Rollout für ChatGPT-Plus-Nutzer ist für Q2 2026 geplant. Die Kosten pro Token liegen laut OpenAI etwa 30% unter denen von GPT-4o bei deutlich besserer Leistung.`,
  ],
  "9": [
    `Madrid – Borussia Dortmund hat im Viertelfinal-Hinspiel der Champions League eine Sensation geschafft und Real Madrid im Santiago Bernabéu mit 2:1 besiegt. Die Treffer von Karim Adeyemi und Julian Brandt bescheren dem BVB eine hervorragende Ausgangslage für das Rückspiel.`,
    `Dortmund begann mutig und setzte Real früh unter Druck. In der 23. Minute belohnte Adeyemi die couragierte Leistung mit dem 1:0 nach einem schnellen Konter über die rechte Seite. Der Treffer schockte die Gastgeber sichtlich.`,
    `Real Madrid kam zwar durch Vinícius Júnior zum Ausgleich (52.), doch Dortmund zeigte sich unbeeindruckt. Brandt erzielte in der 67. Minute nach einer Ecke den erneuten Führungstreffer und brachte die mitgereisten BVB-Fans zum Jubeln.`,
    `BVB-Trainer zeigte sich nach dem Spiel begeistert: „Die Jungs haben alles gegeben. Gegen Real Madrid hier zu gewinnen, das ist etwas ganz Besonderes." Das Rückspiel im Signal Iduna Park findet in zwei Wochen statt.`,
  ],
};

/** Fallback content for articles without extended content. */
export function getArticleContent(id: string): string[] {
  return ARTICLE_CONTENT[id] ?? [];
}
