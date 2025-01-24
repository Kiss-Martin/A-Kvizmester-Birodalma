interface Kérdések {
    word: string,
    category: string,
}

async function fetchWords(): Promise<Kérdések[]> {
    const response = await fetch("http://localhost:3000/books")
    if (!response.ok) {
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



            const countdownDiv = document.createElement("div");
            countdownDiv.id = "countdown";
            countdownDiv.textContent = "3";


            countdownDiv.style.position = "absolute";
            countdownDiv.style.top = "50%";
            countdownDiv.style.left = "50%";
            countdownDiv.style.transform = "translate(-50%, -50%)";
            countdownDiv.style.fontSize = "3rem";
            countdownDiv.style.color = "#FFD700";
            countdownDiv.style.backgroundColor = "#8B4513";
            countdownDiv.style.width = "250px";
            countdownDiv.style.height = "250px";
            countdownDiv.style.borderRadius = "50%";
            countdownDiv.style.display = "flex";
            countdownDiv.style.justifyContent = "center";
            countdownDiv.style.alignItems = "center";
            countdownDiv.style.fontWeight = "bold";

            document.body.appendChild(countdownDiv);

            let count = 3;
            const intervalId = setInterval(() => {
                count--;
                countdownDiv.textContent = count.toString();

                if (count === 0) {
                    clearInterval(intervalId);
                    countdownDiv.textContent = "Elindult!";
                }
            }, 1000);
        });
    });
});