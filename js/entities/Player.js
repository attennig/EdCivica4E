import { GAME_WIDTH, GAME_HEIGHT } from "../core/constants.js";

export class Player {
    constructor(){
        // Position (top-left corner), starting in the center of the canvas
        this.x = GAME_WIDTH / 2;
        this.y = GAME_HEIGHT / 2;
        this.width = 64;
        this.height = 64;
        // Base speed in pixels per second
        this.speed = 200;

        // Multipliers (for upgrades)
        this.speedMultiplier = 1;

        this.image = new Image();
        this.image.src = "data:image/png;base64,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";

    }
    // dt: seconds since last frame, keys: pressed keys,
    // exits: which sides lead to another canvas, e.g. { left: true, ... }
    update(dt, keys, exits = {}){
        // Movement direction from input (-1, 0 or 1 on each axis)
        let dx = 0, dy = 0;

        if (keys['w'] || keys['arrowup']) dy -= 1;
        if (keys['s'] || keys['arrowdown']) dy += 1;
        if (keys['a'] || keys['arrowleft']) dx -= 1;
        if (keys['d'] || keys['arrowright']) dx += 1;

        // Normalize diagonal movement
        // (so moving diagonally isn't faster than moving straight)
        if (dx || dy){
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;

            // Multiplying by dt makes speed independent of the frame rate
            this.x += dx * this.speed * this.speedMultiplier * dt;
            this.y += dy * this.speed * this.speedMultiplier * dt;
        }
        // Keep player in bounds, except on sides that lead to another canvas
        const minX = exits.left ? -Infinity : 0;
        const maxX = exits.right ? Infinity : GAME_WIDTH - this.width;
        const minY = exits.up ? -Infinity : 0;
        const maxY = exits.down ? Infinity : GAME_HEIGHT - this.height;
        this.x = Math.max(minX, Math.min(maxX, this.x));
        this.y = Math.max(minY, Math.min(maxY, this.y));

    }
}
