import { GAME_WIDTH, GAME_HEIGHT } from "./constants.js";

// One "room" of the world: owns a real <canvas> element and its 2D context.
// The world is a matrix of these; only one is attached to the page at a time.
export class Canvas {
    constructor(row, col, color){
        // Position of this canvas in the matrix
        this.row = row;
        this.col = col;
        // Background color, so each canvas looks different
        this.color = color;
        // Characters standing on this canvas
        this.npcs = [];

        // Create the DOM element (not yet attached to the page)
        this.element = document.createElement("canvas");
        this.element.className = "gameCanvas"; // used by the CSS
        // Internal drawing resolution (independent of its displayed size)
        this.element.width = GAME_WIDTH;
        this.element.height = GAME_HEIGHT;

        // Drawing context used by the RenderSystem
        this.ctx = this.element.getContext("2d");
        // Keep pixels sharp instead of blurry when scaling images
        this.ctx.imageSmoothingEnabled = false;
    }
    addNpc(npc){
        this.npcs.push(npc);
    }
    // Set the displayed (CSS) size and margin; w and h are in CSS pixels
    resize(w, h, margin){
        // Re-assert the internal resolution. Assigning width/height resets
        // the context state, so smoothing has to be turned off again.
        this.element.width = GAME_WIDTH;
        this.element.height = GAME_HEIGHT;
        this.ctx.imageSmoothingEnabled = false;

        // Scale the canvas on screen with CSS
        this.element.style.width = w + 'px';
        this.element.style.height = h + 'px';
        this.element.style.margin = `${margin}px`;
    }
}
