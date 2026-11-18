// English strings.
// Every key in this file must also exist in it.js (and in any future language).
// Use {name} placeholders for values that the code inserts at runtime.
export default {
    // ---- Interface ----
    "ui.title": "JavaScript Game Starter Kit",
    "ui.currentLanguage": "Language: English",
    "ui.chooseWorld": "Choose your world",
    "ui.menuHelp": "A / D or arrow keys: choose     Enter: start     L: language",
    "ui.canvasCount": "{rows} x {cols} canvases",
    "ui.talk": "[E] Talk",
    "ui.next": "[E] Next ▼",
    "ui.close": "[E] Close",
    "ui.canvasLabel": "Canvas [{row}, {col}]",
    "ui.backToMenu": "Backspace: world selection",

    // ---- Worlds ----
    "world.1.name": "world 1",
    "world.1.description": "Topic 1",
    "world.2.name": "world 2",
    "world.2.description": "Topic 2",

    /***********
     * Add here new worlds/levels with name and description, and then add the world in js/core/worlds.js
     */

    // ---- Characters (name + dialog lines) ----
    "npc.cat.name": "Cat",
    "npc.cat.lines": [
        "Meow! I'm a cat.",
        "MEOW!"
    ],
    "npc.alienCat.name": "AlienCat",
    "npc.alienCat.lines": [
        "Meow! I'm an alien cat.",
        "MEOW!"
    ],
    "npc.merchant.name": "Merchant",
    "npc.merchant.lines": [
        "Fine wares for sale!",
        "...Well, they would be, if I had any. The road south is long.",
        "Come back when you have coins."
    ],
    "npc.fisher.name": "Fisher",
    "npc.fisher.lines": [
        "Shh! You'll scare the fish.",
        "Not that there is any water here. I'm very patient."
    ],
    "npc.hermit.name": "Hermit",
    "npc.hermit.lines": [
        "You walked all the way to the south-east corner?",
        "Few people do. I like the quiet here."
    ],
    "npc.smith.name": "Smith",
    "npc.smith.lines": [
        "Mind the heat, friend. The forge never goes out here.",
        "The islands stretch far to the east. Keep walking."
    ],
    "npc.sailor.name": "Sailor",
    "npc.sailor.lines": [
        "I sail between these islands... or I would, if the sea hadn't dried up.",
        "Don't ask me how I got here."
    ],
    "npc.alchemist.name": "Alchemist",
    "npc.alchemist.lines": [
        "Ah, a visitor! Hold this. No, not that way!",
        "Careful, it bubbles when it's happy.",
        "Now, where did I put my notes?"
    ],
    "npc.keeper.name": "Keeper",
    "npc.keeper.lines": [
        "You have reached the last island, at the edge of the world.",
        "Press Backspace to go back to the world selection, if you wish."
    ]

    /******
     * Add here new characters with name and dialog lines, and then add the character in js/core/worlds.js
     */
};
