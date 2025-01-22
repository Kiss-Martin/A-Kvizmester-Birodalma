interface ValaszViszaly {
    questions: string;
    answers: string;
}

async function loadValaszViszaly() {
    const response = await fetch('http://localhost:3000/valaszviszaly');
    const data = await response.json();
    return data;
}

document.addEventListener('DOMContentLoaded', async () => {
    loadValaszViszaly();
});

document.getElementById("jatekgomb")?.addEventListener("click", () => {
    const menuBody = document.getElementById("menubody");
    if (menuBody) {
        menuBody.innerHTML = "";
    }
});