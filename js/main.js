// Entry point: loaded by index.html as an ES module.
// This file is the main entry point for the game.
import { Game } from './core/Game.js'; // import the Game class from the core module

import { findMissingKeys } from './i18n/i18n.js'; // import the function to find missing translation keys

// Warn in the console if a language lacks some of the keys another one has
const missing = findMissingKeys();
if (Object.keys(missing).length) console.warn('Missing translations:', missing);

// Creating the Game builds the canvases, sets up input and starts the game loop
const game = new Game();
console.log(game);

console.log("Game starter kit LOADED!");
