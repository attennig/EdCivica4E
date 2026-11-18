import { t } from "../i18n/i18n.js";

// A non-player character that lives on one Canvas and can be talked to.
export class NPC {
    // id: key used to look up the character's texts, e.g. "cat" ->
    // "npc.cat.name" and "npc.cat.lines" in the language files (i18n/*.js)
    constructor({ id, x, y, color, imageB64 = null }){
        this.id = id;
        // Position (top-left corner), same coordinate system as the player
        this.x = x;
        this.y = y;
        this.width = 56;
        this.height = 56;
        this.color = color;
        // How close (center to center, in pixels) the player must be to talk
        this.interactRange = 110;
        if (imageB64){
            this.image = new Image();
            this.image.src = imageB64;
        }
        else{
            this.image = null;
        }
    }
    // Texts are looked up each time they are needed, so they always
    // follow the language currently selected
    get name(){
        return t(`npc.${this.id}.name`);
    }
    // Array of strings, shown one after another in the dialog box
    get lines(){
        const lines = t(`npc.${this.id}.lines`);
        return Array.isArray(lines) ? lines : [lines];
    }
    // True when the player is close enough to start a conversation
    isNear(player){
        const dx = (player.x + player.width / 2) - (this.x + this.width / 2);
        const dy = (player.y + player.height / 2) - (this.y + this.height / 2);
        return Math.sqrt(dx * dx + dy * dy) <= this.interactRange;
    }
}
