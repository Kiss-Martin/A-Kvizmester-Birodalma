interface Kérdések {
    word: string,
    category: string,
}

async function fetchWords() : Promise<Kérdések[]> {
    const response = await fetch("http://localhost:3000/books")
    if(!response.ok) {
        throw new Error("Hiba van")
    }
    else {
        const data = await response.json()
        return data
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const megjelenitesDiv = document.getElementById("megjelenítés")!;
    const kartyak = document.querySelectorAll(".flex-container div");

    kartyak.forEach(kartya => {
        kartya.addEventListener("click", () => {
            megjelenitesDiv.style.display = "none";
        });
    });
});