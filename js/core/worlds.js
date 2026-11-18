// Definition of every world the player can choose from the start screen.
// Each world is a matrix of canvases (rows x cols) with its own look and characters.
// Texts (world name, description, characters' names and dialogs) are NOT here:
// they live in i18n/*.js and are found through the ids used below.


export const WORLDS = [
    {
        id: "1",
        rows: 2,
        cols: 7,
        // Canvas where the player appears
        start: { row: 1, col: 1 },
        // Colors: canvas (row, col) gets hue + index * hueStep (see canvasColor)
        hue: 200, hueStep: 25, saturation: 60, lightness: 25,
        // Characters, keyed by "row,col" of the canvas they stand on.
        // Positions are in that canvas's own coordinates (0..GAME_WIDTH, 0..GAME_HEIGHT).
        npcs: {
            "1,1": [
                {
                    id: "cat",
                    x: 820, y: 300,
                    color: "#e9c46a",
                    imageB64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADuklEQVR4nNVbW4hNURj+jPsll8ml3MKQOWIoIpdSJkIZQqR4oZA0JcQwxLiMS8SY8TJiKImQFA+8kKHUTEbxYBSmcZ9yT2Q4+mutWnNm733WOWvvtf7z1dd5OP9e5/++2uus9a9/Ae4wBMAmALmG44wAsA3ASGQYHgOIA/gCYGKaY+QBaBLjvEAGoZ9IWvJzGiao4iWHI0OwICFx4lcA8zWfnylMSxxjBTIEBz2SJ/4DUCXeay8MBVAJ4K/P8yeRIbjnI0DlUwBnAJQDOA2gRhgU9EwdMgDtAfzUMCAdNgPoDuaYFJF4yXwwx4aIDdgB5rgUsQE3wRyNERtAf49ZYIpBEYuXjIEplloyYBWY4pglA06BKR5aMoAWUezQCcDvgKSfATgiPuOGcbRU7gVmmJZE2DARlxNS3Bwww2bLBpSAGa4mSbgewFHxGUbcbTDDO0sToOQ3AG3BBDmWxUuOBRMsd2TAWjBBhSMDzoIJHjky4DkYoCuAP44MiIsKtFPMcCieWODagGLHBpS6NuCGYwPuuhTfxuP0xjapAt3BlQG5jsVLTnBlwEoG4omFrgyoZCCeeMGVAU8YiCe+ciG+Z8AhpgsOsG3AbAaiVS62bcBuBqJVUh3RKm4xEK3ygU3xWaL3J86Iv0Rl2gryGAj24hRbBqxhINaLG20ZUMVArBcv2zKgnoFYL761Ib63RjOTS1KHaqSYx0BkEJdFbcB+BiKDWBa1AXcYiAwi9RtGhnYAvjMQGUSqUHeLyoDxDATqcHpUBqw3SIra5weKvv+GJDExw26zrVEZcD6kpMp8YoqUmBMGv3U9KgNeGiRFt0ckDmsY4BejwyZRsQ4V2YbvJXWQSBzyidml0XKvy8FBYroAGANgdAoz5jjDhLYoYx3QOOXxi9HlZC8RPUR//o+Ev41aAMdFoyNNQlGcAapzQKlPDLXGhLXganU7JVtcONB5uEFMePkh1gDo5pfEPp+YCo0YXU4NYwv7QZlMTKvA25Vc9vrE0DmDxB5DA/on7uCa0xxIva9Xa5BQsYa4cyEVXem8ogXmhtSHs9pgnJ0a4i6GdPGiVWVoYUibi74G45BoiRKfmGseW+9U9x6N4nVtgZhB4sQlIbTDVwPoKHjfJ6bOYwFTkMJvUKFmFnxQbWjCmxAqQe8Fg2KuCKPVM/8ajbFpgl6HAIwC8MlQgE3SOkCiPEnsRwCLgsSrJtjq6TclLYUlinxiXosVY6t3XuduX6FYbNAA3Egbp85Kvn3Ev4j8jjpTqTaRdMPzHzo2Nzq2qHRhAAAAAElFTkSuQmCC',
                }
            ],
            "0,0": [
                {
                    id: "alienCat",
                    x: 600, y: 200,
                    color: "#e76f51",
                    imageB64: 'data:image/png;base64,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',
                }
            ],
            "0,1": [
                {
                    id: "merchant",
                    x: 300, y: 450,
                    color: "#2a9d8f",
                }
            ],
            "1,2": [
                {
                    id: "fisher",
                    x: 900, y: 500,
                    color: "#8ecae6",
                }
            ],
            "2,2": [
                {
                    id: "hermit",
                    x: 500, y: 350,
                    color: "#b5838d",
                }
            ]
        }
    },
    {
        id: "2",
        rows: 4,
        cols: 4,
        start: { row: 0, col: 0 },
        hue: 0, hueStep: 12, saturation: 55, lightness: 22,
        npcs: {
            "0,0": [
                {
                    id: "smith",
                    x: 780, y: 300,
                    color: "#f4a261",
                }
            ],
            "0,2": [
                {
                    id: "sailor",
                    x: 400, y: 420,
                    color: "#a8dadc",
                }
            ],
            "1,1": [
                {
                    id: "alchemist",
                    x: 640, y: 200,
                    color: "#c77dff",
                }
            ],
            "1,3": [
                {
                    id: "keeper",
                    x: 900, y: 450,
                    color: "#ffb703",
                }
            ]
        }
    },
    /*{
        id: "nome_cognome",
        rows: 2,
        cols: 2,
        start: { row: 0, col: 0 },
        hue: 0, hueStep: 12, saturation: 55, lightness: 22,
        npcs: {
            "0,0": [
                {
                    id: "A",
                    x: 780, y: 300,
                    color: "#f4a261", // di default, il personaggio viene disegnato come un quadrato colorato. Se volete usare un'immagine, potete aggiungere la proprietà "imageB64" con l'immagine codificata in base64.
                    imageB64: '' // opzionale: immagine codificata in base64. Leggi la documentazione per sapere come generare un'immagine in base64 e usarla qui.
                }
            ],
            "0,1": [
                {
                    id: "B",
                    x: 400, y: 420,
                    color: "#a8dadc",
                }
            ],
            "1,1": [
                {
                    id: "C",
                    x: 640, y: 200,
                    color: "#c77dff",
                }
            ],
            "1,0": [
                {
                    id: "D",
                    x: 900, y: 450,
                    color: "#ffb703",
                }
            ]
        }
    }
    /* 
    * Aggiungi qui nuovi mondi/livelli
    * ISTRUZIONI PER STUDENTI: per aggiungere un nuovo mondo/livello, copiate e incollate il blocco qui sopra, cambiate l'id (deve essere unico, usate il vostro nome e cognome), le dimensioni (rows, cols), la posizione di partenza (start), i colori (hue, hueStep, saturation, lightness) e i personaggi (npcs). Assicuratevi che ogni personaggio abbia un id unico all'interno del mondo e che le coordinate siano corrette. 
    */
];

// Background color of canvas (row, col) in the given world
export function canvasColor(world, row, col){
    const hue = world.hue + (row * world.cols + col) * world.hueStep;
    return `hsl(${hue}, ${world.saturation}%, ${world.lightness}%)`;
}
