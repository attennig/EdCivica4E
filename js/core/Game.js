import { GAME_WIDTH, GAME_HEIGHT } from "./constants.js"; // imports the constants for the game width and height
import { Canvas } from "./Canvas.js"; // imports the Canvas class from the Canvas.js file
import { WORLDS, canvasColor } from "./worlds.js"; // imports the WORLDS array and the canvasColor function from the worlds.js file
import { RenderSystem } from "../systems/RenderSystem.js"; // imports the RenderSystem class from the RenderSystem.js file
import { DialogSystem } from "../systems/DialogSystem.js"; // imports the DialogSystem class from the DialogSystem.js file
import { Player } from "../entities/Player.js"; // imports the Player class from the Player.js file
import { NPC } from "../entities/NPC.js"; // imports the NPC class from the NPC.js file
import { toggleLang } from "../i18n/i18n.js"; // imports the toggleLang function from the i18n.js file

// Main class: owns the world (matrix of canvases), the player, input and the loop
export class Game {
    constructor(){
        // The page element that holds whichever canvas is currently shown
        this.container = document.getElementById("gameContainer");
        //  the state of the game: "menu" (world selection screen) or "playing"
        this.state = "menu";
        // World/level highlighted on the menu
        this.menuIndex = 0;
        // The world being played (set by startWorld)
        this.world = null;
        // Canvas used to draw the menu. It is not part of any world's matrix.
        this.menuCanvas = new Canvas(-1, -1, "#1a1a2e");
        // 2D array: this.canvases[row][col]. Empty until a world is chosen.
        this.canvases = [];
        // The canvas currently shown. We start on the menu.
        this.canvas = this.menuCanvas;
        this.renderSystem = new RenderSystem();
        this.dialogSystem = new DialogSystem();
        // The NPC close enough to talk to right now (or null)
        this.nearbyNpc = null;
        this.player = new Player();
        // Pressed keys, e.g. { w: true, a: false }
        this.keys = {};
        // Timestamp of the previous frame (set in init)
        this.lastTime;
 
        this.init();
    }
    // Build the rows x cols grid of Canvas objects for the given world
    createCanvasMatrix(world){
        const matrix = [];
        for (let row = 0; row < world.rows; row++){
            matrix[row] = [];
            for (let col = 0; col < world.cols; col++){
                const canvas = new Canvas(row, col, canvasColor(world, row, col));
                // Place the characters defined for this canvas (if any)
                for (const data of world.npcs[`${row},${col}`] ?? []){
                    canvas.addNpc(new NPC(data));
                }
                matrix[row][col] = canvas;
            }
        }
        return matrix;
    }
    // Leave the menu and start playing the world with the given index
    startWorld(index){
        this.world = WORLDS[index];
        this.canvases = this.createCanvasMatrix(this.world);
        // Fresh state for a new game
        this.player = new Player();
        this.dialogSystem.close();
        this.nearbyNpc = null;
        this.keys = {};
        // The new canvases need their on-screen size set before being shown
        this.resizeCanvas();
        this.state = "playing";
        const { row, col } = this.world.start;
        this.switchCanvas(this.canvases[row][col]);
    }
    // Leave the current world and show the menu again
    returnToMenu(){
        this.state = "menu";
        this.dialogSystem.close();
        this.nearbyNpc = null;
        this.keys = {};
        this.switchCanvas(this.menuCanvas);
    }
    init(){
        // Show the starting canvas (the menu) on the page
        this.container.appendChild(this.canvas.element);
        this.resizeCanvas();
        // Keep the canvases fitted to the window
        window.addEventListener('resize', () => this.resizeCanvas());
        this.setupInput();

        // start game loop
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }
    gameLoop(timestamp){
        // Seconds since last frame, capped at 0.1s so a lag spike
        // (or a background tab) doesn't make the player jump far
        const dt = Math.min((timestamp - this.lastTime)/1000, 0.1);
        //console.log(dt);
        this.lastTime = timestamp;
        this.update(dt);
        // Draw either the menu or the current world
        if (this.state === "menu"){
            this.renderSystem.renderMenu(this.canvas, WORLDS, this.menuIndex);
        } else {
            this.renderSystem.render(this.canvas, this.player, this.nearbyNpc, this.dialogSystem);
        }
        // Schedule the next frame
        requestAnimationFrame((t) => this.gameLoop(t));
    }
    update(dt){
        // Nothing to simulate on the menu
        if (this.state !== "playing") return;

        if (this.dialogSystem.isActive){
            // Conversation in progress: the player stands still
            this.dialogSystem.update(dt);
            return;
        }
        // Move the player; sides with a neighbouring canvas are left open
        this.player.update(dt, this.keys, this.getExits());
        // Then check whether the player walked into another canvas
        this.checkCanvasTransition();
        // Remember which character (if any) can be talked to from here
        this.nearbyNpc = this.findNearbyNpc();
    }
    // The closest NPC on the current canvas within talking range, or null
    findNearbyNpc(){
        let closest = null;
        let closestDist = Infinity;
        for (const npc of this.canvas.npcs){
            if (!npc.isNear(this.player)) continue;
            const dx = (npc.x + npc.width / 2) - (this.player.x + this.player.width / 2);
            const dy = (npc.y + npc.height / 2) - (this.player.y + this.player.height / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < closestDist){
                closest = npc;
                closestDist = dist;
            }
        }
        return closest;
    }
    // Interact key pressed: continue the current dialog, or start a new one
    handleInteract(){
        if (this.dialogSystem.isActive){
            this.dialogSystem.advance();
        } else if (this.nearbyNpc){
            this.dialogSystem.start(this.nearbyNpc);
        }
    }
    // Return the canvas at (row, col), or null if outside the matrix
    getCanvasAt(row, col){
        return this.canvases[row]?.[col] ?? null;
    }
    // Which sides of the current canvas lead to another canvas
    getExits(){
        const { row, col } = this.canvas;
        return {
            up: !!this.getCanvasAt(row - 1, col),
            down: !!this.getCanvasAt(row + 1, col),
            left: !!this.getCanvasAt(row, col - 1),
            right: !!this.getCanvasAt(row, col + 1),
        };
    }
    // When the player's center crosses an edge, move to the neighbouring canvas
    checkCanvasTransition(){
        const p = this.player;
        // Center of the player
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;
        // Direction of travel through the matrix (rows/columns)
        let dRow = 0, dCol = 0;

        // Also wrap the player's position to the opposite side, because
        // the new canvas uses the same coordinate system
        if (cx < 0) { dCol = -1; p.x += GAME_WIDTH; }
        else if (cx > GAME_WIDTH) { dCol = 1; p.x -= GAME_WIDTH; }
        else if (cy < 0) { dRow = -1; p.y += GAME_HEIGHT; }
        else if (cy > GAME_HEIGHT) { dRow = 1; p.y -= GAME_HEIGHT; }
        else return; // still inside the current canvas

        const next = this.getCanvasAt(this.canvas.row + dRow, this.canvas.col + dCol);
        if (next) this.switchCanvas(next);
    }
    // Swap the canvas element shown on the page
    switchCanvas(next){
        this.container.replaceChild(next.element, this.canvas.element);
        this.canvas = next;
    }
    // Keys on the world selection screen
    handleMenuKey(key){
        const count = WORLDS.length;
        if (key === 'arrowleft' || key === 'a'){
            this.menuIndex = (this.menuIndex - 1 + count) % count;
        } else if (key === 'arrowright' || key === 'd'){
            this.menuIndex = (this.menuIndex + 1) % count;
        } else if (key === 'e' || key === ' ' || key === 'enter'){
            this.startWorld(this.menuIndex);
        } else if (key === 'l'){
            // Switch to the next language (see i18n/i18n.js)
            toggleLang();
        } else if (/^[1-9]$/.test(key) && Number(key) <= count){
            // Number keys pick a world directly
            this.startWorld(Number(key) - 1);
        }
    }
    setupInput(){
        // Remember which keys are held down (lowercased so Shift/CapsLock don't matter)
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = true;

            // One-shot actions: ignore auto-repeat while a key is held down
            if (e.repeat) return;

            // On the menu, keys only choose a world
            if (this.state === "menu"){
                this.handleMenuKey(key);
                return;
            }
            if (key === 'e' || key === ' ' || key === 'enter'){
                this.handleInteract();
            } else if (key === 'backspace'){
                // backspace closes a dialog; with no dialog open it leaves the world
                if (this.dialogSystem.isActive) this.dialogSystem.close();
                else this.returnToMenu();
            }
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        // Clear all keys when context menu opens
        window.addEventListener('contextmenu', () => {
            this.keys = {};
        });
        // Clear all keys when window loses focus
        // (otherwise a missed keyup would leave a key "stuck")
        window.addEventListener('blur', () => {
            this.keys = {};
        });
    }
    // Every Canvas that exists: the menu plus all canvases of the current world
    getAllCanvases(){
        return [this.menuCanvas, ...this.canvases.flat()];
    }
    // Fit all canvases in the window while keeping a 16:9 aspect ratio
    resizeCanvas(){
        const ratio = 16/9;
        let w, h;
        const margin = 15;

        // Space left once the margins are removed
        const availableWidth = window.innerWidth - margin * 2;
        const availableHeight = window.innerHeight - margin * 2;

        // Window is wider than 16:9: height is the limit. Otherwise width is.
        if (availableWidth/availableHeight > ratio){
            h = availableHeight;
            w = h * ratio;
        } else {
            w = availableWidth;
            h = w / ratio;
        }

        // Resize every canvas, not just the visible one, so that a canvas
        // already has the right size when the player walks into it
        for (const canvas of this.getAllCanvases()){
            canvas.resize(w, h, margin);
        }
    }
}
