// Keeps track of the current conversation: who is talking, which line is
// showing and how much of it has been revealed (typewriter effect).
// It only holds state; drawing the dialog box is done by RenderSystem.
export class DialogSystem {
    constructor(){
        // The NPC being talked to; null means no conversation is happening
        this.npc = null;
        // Index of the current line in npc.lines
        this.lineIndex = 0;
        // How many characters of the current line are visible (can be fractional)
        this.charsShown = 0;
        // Typewriter speed
        this.charsPerSecond = 45;
    }
    get isActive(){
        return this.npc !== null;
    }
    get currentLine(){
        return this.npc ? this.npc.lines[this.lineIndex] : "";
    }
    // True once the whole current line is visible
    get isLineComplete(){
        return this.charsShown >= this.currentLine.length;
    }
    // Begin a conversation at the first line
    start(npc){
        this.npc = npc;
        this.lineIndex = 0;
        this.charsShown = 0;
    }
    // Reveal more of the current line as time passes
    update(dt){
        if (!this.isActive || this.isLineComplete) return;
        this.charsShown = Math.min(
            this.currentLine.length,
            this.charsShown + this.charsPerSecond * dt
        );
    }
    // Player pressed the interact key: finish the line if it is still being
    // typed, otherwise go to the next line (or end the conversation)
    advance(){
        if (!this.isActive) return;
        if (!this.isLineComplete){
            this.charsShown = this.currentLine.length;
        } else if (this.lineIndex < this.npc.lines.length - 1){
            this.lineIndex++;
            this.charsShown = 0;
        } else {
            this.close();
        }
    }
    // End the conversation immediately
    close(){
        this.npc = null;
        this.lineIndex = 0;
        this.charsShown = 0;
    }
}
