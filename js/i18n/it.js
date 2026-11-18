// Stringhe in italiano.
// Ogni chiave di questo file deve esistere anche in en.js (e in ogni altra lingua).
// Usa i segnaposto {nome} per i valori inseriti dal codice durante il gioco.
export default {
    // ---- Interfaccia ----
    "ui.title": "Kit di partenza per giochi JavaScript",
    "ui.currentLanguage": "Lingua: Italiano",
    "ui.chooseWorld": "Scegli il tuo mondo",
    "ui.menuHelp": "A / D o frecce: scegli     Invio: inizia     L: lingua",
    "ui.canvasCount": "{rows} x {cols} canvas",
    "ui.talk": "[E] Parla",
    "ui.next": "[E] Avanti ▼",
    "ui.close": "[E] Chiudi",
    "ui.canvasLabel": "Canvas [{row}, {col}]",
    "ui.backToMenu": "Backspace: selezione del mondo",

    // ---- Mondi ----
    "world.1.name": "world 1",
    "world.1.description": "Argomento 1",
    "world.2.name": "world 2",
    "world.2.description": "Argomento 2",
    /***********
     * Aggiungi qui nuovi mondi/livelli con nome e descrizione, e poi aggiungi il mondo in js/core/worlds.js
     */

    // ---- Personaggi (nome + battute) ----
    "npc.cat.name": "Gatto",
    "npc.cat.lines": [
        "Miao! Sono un gatto.",
        "MIAO!"
    ],
    "npc.alienCat.name": "Gatto alieno",
    "npc.alienCat.lines": [
        "Miao! Sono un gatto alieno.",
        "MIAO!"
    ],
    "npc.merchant.name": "Mercante",
    "npc.merchant.lines": [
        "Merce pregiata in vendita!",
        "...Beh, lo sarebbe, se ne avessi. La strada verso sud è lunga.",
        "Torna quando avrai delle monete."
    ],
    "npc.fisher.name": "Pescatore",
    "npc.fisher.lines": [
        "Shh! Spaventerai i pesci.",
        "Non che qui ci sia dell’acqua. Sono molto paziente."
    ],
    "npc.hermit.name": "Eremita",
    "npc.hermit.lines": [
        "Hai camminato fino all’angolo sud-est?",
        "In pochi lo fanno. Mi piace il silenzio di questo posto."
    ],
    "npc.smith.name": "Fabbro",
    "npc.smith.lines": [
        "Attento al caldo, amico. Qui la forgia non si spegne mai.",
        "Le isole si estendono lontano, verso est. Continua a camminare."
    ],
    "npc.sailor.name": "Marinaio",
    "npc.sailor.lines": [
        "Navigo tra queste isole... o lo farei, se il mare non si fosse prosciugato.",
        "Non chiedermi come sono arrivato qui."
    ],
    "npc.alchemist.name": "Alchimista",
    "npc.alchemist.lines": [
        "Ah, un visitatore! Tieni questo. No, non così!",
        "Attento, ribolle quando è felice.",
        "Ora, dove ho messo i miei appunti?"
    ],
    "npc.keeper.name": "Custode",
    "npc.keeper.lines": [
        "Hai raggiunto l’ultima isola, ai confini del mondo.",
        "Premi Backspace per tornare alla selezione del mondo, se vuoi."
    ]
    /******
     * Aggiungi qui nuovi personaggi con nome e dialoghi, e poi aggiungi il personaggio in js/core/worlds.js
     */
};
