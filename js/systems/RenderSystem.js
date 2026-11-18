import { GAME_WIDTH, GAME_HEIGHT, GRID_SIZE } from "../core/constants.js";
import { canvasColor } from "../core/worlds.js";
import { t } from "../i18n/i18n.js";

// Draws everything. It owns no canvas of its own: each frame it is told
// which Canvas to draw on.
export class RenderSystem {
    constructor(){
        // Set at the start of every render() call
        this.canvas = null;
        this.ctx = null;
    }
    // Draw one full frame onto the given Canvas.
    // nearbyNpc: character the player can talk to (shows a prompt),
    // dialogSystem: current conversation (draws the dialog box when active)
    render(canvas, player, nearbyNpc, dialogSystem){
        this.canvas = canvas;
        this.ctx = canvas.ctx;
        // Background (also erases the previous frame)
        this.ctx.fillStyle = canvas.color;
        this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        // Draw order matters: later things appear on top
        this.renderGrid();
        this.renderLabel(canvas);
        this.renderNpcs(canvas.npcs, nearbyNpc);
        this.renderPlayer(player);
        // The dialog box goes last so it covers everything else
        if (dialogSystem.isActive) this.renderDialog(dialogSystem);
    }
    // Draw the world selection screen: one card per world, the chosen one highlighted
    renderMenu(canvas, worlds, selectedIndex){
        this.canvas = canvas;
        this.ctx = canvas.ctx;
        const ctx = this.ctx;

        // Background
        ctx.fillStyle = canvas.color;
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Title
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = "bold 56px 'Courier New', monospace";
        ctx.fillText(t("ui.chooseWorld"), GAME_WIDTH / 2, 130);

        // Cards are laid out side by side and centered as a group
        const cardW = 460, cardH = 420, gap = 60, cardY = 190;
        const totalW = worlds.length * cardW + (worlds.length - 1) * gap;
        const startX = (GAME_WIDTH - totalW) / 2;

        worlds.forEach((world, i) => {
            const x = startX + i * (cardW + gap);
            const cx = x + cardW / 2; // horizontal center of the card
            const selected = i === selectedIndex;

            // Card background and border (gold when selected)
            ctx.fillStyle = "rgba(255,255,255,0.06)";
            ctx.fillRect(x, cardY, cardW, cardH);
            ctx.strokeStyle = selected ? "#ffd166" : "rgba(255,255,255,0.2)";
            ctx.lineWidth = selected ? 6 : 2;
            ctx.strokeRect(x, cardY, cardW, cardH);

            // Number key that selects this world directly
            ctx.textAlign = "left";
            ctx.font = "20px 'Courier New', monospace";
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            ctx.fillText(`[${i + 1}]`, x + 16, cardY + 30);

            // World name
            ctx.textAlign = "center";
            ctx.font = "bold 36px 'Courier New', monospace";
            ctx.fillStyle = selected ? "#ffd166" : "white";
            ctx.fillText(t(`world.${world.id}.name`), cx, cardY + 70);

            // Description, wrapped to fit inside the card
            ctx.font = "22px 'Courier New', monospace";
            ctx.fillStyle = "rgba(255,255,255,0.85)";
            this.wrapText(t(`world.${world.id}.description`), cardW - 60).forEach((row, r) => {
                ctx.fillText(row, cx, cardY + 115 + r * 30);
            });

            // Preview of the matrix: one small rectangle per canvas
            const cellW = 56, cellH = 36, cellGap = 8;
            const previewW = world.cols * (cellW + cellGap) - cellGap;
            const previewX = cx - previewW / 2;
            const previewY = cardY + 225;
            for (let row = 0; row < world.rows; row++){
                for (let col = 0; col < world.cols; col++){
                    ctx.fillStyle = canvasColor(world, row, col);
                    const px = previewX + col * (cellW + cellGap);
                    const py = previewY + row * (cellH + cellGap);
                    ctx.fillRect(px, py, cellW, cellH);
                    // Mark where the player starts
                    if (row === world.start.row && col === world.start.col){
                        ctx.strokeStyle = "white";
                        ctx.lineWidth = 2;
                        ctx.strokeRect(px, py, cellW, cellH);
                    }
                }
            }

            // Size of the world
            ctx.font = "20px 'Courier New', monospace";
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.fillText(t("ui.canvasCount", { rows: world.rows, cols: world.cols }), cx, cardY + cardH - 24);
        });

        // Controls hint
        ctx.font = "22px 'Courier New', monospace";
        ctx.fillStyle = "#ffd166";
        ctx.fillText(t("ui.menuHelp"), GAME_WIDTH / 2, GAME_HEIGHT - 50);

        // Current language, top right
        ctx.textAlign = "right";
        ctx.font = "20px 'Courier New', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fillText(t("ui.currentLanguage"), GAME_WIDTH - 30, 40);
        ctx.textAlign = "left"; // restore the default
    }
    // Draw every character on the canvas, with a prompt over the one in range
    renderNpcs(npcs, nearbyNpc){
        this.ctx.textAlign = "center";
        for (const npc of npcs){
            if (npc.image){
                this.ctx.drawImage(npc.image, npc.x, npc.y, npc.width, npc.height);
            }
            else{
                this.ctx.fillStyle = npc.color;
                this.ctx.fillRect(npc.x, npc.y, npc.width, npc.height);
                this.ctx.strokeStyle = "white";
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(npc.x, npc.y, npc.width, npc.height);
            }
                
            // Name above the character
            this.ctx.fillStyle = "white";
            this.ctx.font = "20px 'Courier New', monospace";
            this.ctx.fillText(npc.name, npc.x + npc.width / 2, npc.y - 12);

            // "Press E" hint only for the character that can be talked to
            if (npc === nearbyNpc){
                this.ctx.fillStyle = "#ffd166";
                this.ctx.fillText(t("ui.talk"), npc.x + npc.width / 2, npc.y - 36);
            }
        }
        this.ctx.textAlign = "left"; // restore the default
    }
    // Draw the dialog box at the bottom of the canvas
    renderDialog(dialog){
        const margin = 40;
        const boxH = 180;
        const boxX = margin;
        const boxY = GAME_HEIGHT - boxH - margin;
        const boxW = GAME_WIDTH - margin * 2;
        const pad = 24;

        // Box
        this.ctx.fillStyle = "rgba(10, 10, 25, 0.92)";
        this.ctx.fillRect(boxX, boxY, boxW, boxH);
        this.ctx.strokeStyle = dialog.npc.color;
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(boxX, boxY, boxW, boxH);

        // Speaker's name, in the speaker's color
        this.ctx.font = "bold 28px 'Courier New', monospace";
        this.ctx.fillStyle = dialog.npc.color;
        this.ctx.fillText(dialog.npc.name, boxX + pad, boxY + pad + 20);

        // Text: wrap the FULL line first so words don't jump between rows
        // while it is being typed, then only draw the characters revealed so far
        this.ctx.font = "26px 'Courier New', monospace";
        this.ctx.fillStyle = "white";
        const rows = this.wrapText(dialog.currentLine, boxW - pad * 2);
        let remaining = Math.floor(dialog.charsShown);
        for (let i = 0; i < rows.length && remaining > 0; i++){
            const visible = rows[i].slice(0, remaining);
            remaining -= rows[i].length + 1; // +1 for the space removed by wrapping
            this.ctx.fillText(visible, boxX + pad, boxY + pad + 64 + i * 34);
        }

        // Hint in the corner once the line is fully shown
        if (dialog.isLineComplete){
            const last = dialog.lineIndex === dialog.npc.lines.length - 1;
            this.ctx.font = "20px 'Courier New', monospace";
            this.ctx.fillStyle = "#ffd166";
            this.ctx.textAlign = "right";
            this.ctx.fillText(t(last ? "ui.close" : "ui.next"), boxX + boxW - pad, boxY + boxH - pad + 4);
            this.ctx.textAlign = "left";
        }
    }
    // Split text into rows that fit in maxWidth pixels (uses the current font)
    wrapText(text, maxWidth){
        const words = text.split(" ");
        const rows = [];
        let row = "";
        for (const word of words){
            const test = row ? row + " " + word : word;
            if (row && this.ctx.measureText(test).width > maxWidth){
                rows.push(row);
                row = word;
            } else {
                row = test;
            }
        }
        if (row) rows.push(row);
        return rows;
    }
    // Show which canvas of the matrix we are in
    renderLabel(canvas){
        this.ctx.fillStyle = "rgba(255,255,255,0.5)";
        this.ctx.font = "24px 'Courier New', monospace";
        this.ctx.fillText(t("ui.canvasLabel", { row: canvas.row, col: canvas.col }), 20, 40);
        // Reminder of how to leave the world
        this.ctx.textAlign = "right";
        this.ctx.fillText(t("ui.backToMenu"), GAME_WIDTH - 20, 40);
        this.ctx.textAlign = "left";
    }
    // The player is a dark square with a white outline
    renderPlayer(player){
        /*
        this.ctx.fillStyle = "#1a1a2e";
        this.ctx.fillRect(player.x, player.y, player.width, player.height);
        this.ctx.strokeStyle = "white";
        this.ctx.strokeRect(player.x, player.y, player.width, player.height);
        */

        this.ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

    }
    // Faint grid lines every GRID_SIZE pixels
    renderGrid(){
        this.ctx.strokeStyle = "rgba(255,255,255,0.1)";
        this.ctx.lineWidth = 6;

        // Vertical lines
        for (let i = 0; i < GAME_WIDTH; i += GRID_SIZE){
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, GAME_HEIGHT);
            this.ctx.stroke();
        }
        // Horizontal lines
        for (let i = 0; i < GAME_HEIGHT; i += GRID_SIZE){
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(GAME_WIDTH, i);
            this.ctx.stroke();
        }
    }
}
