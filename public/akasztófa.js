"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetchWords() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("http://localhost:3000/szavak");
        if (!response.ok) {
            throw new Error("Hiba van");
        }
        else {
            const data = yield response.json();
            return data;
        }
    });
}
document.addEventListener("DOMContentLoaded", () => {
    const megjelenitesDiv = document.getElementById("megjelenítés");
    const kartyak = document.querySelectorAll(".flex-container div");
    kartyak.forEach(kartya => {
        kartya.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
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
            let count = 1; //itt most próba miatt van egy. majd 3 kell
            const intervalId = setInterval(() => {
                count--;
                countdownDiv.textContent = count.toString();
                if (count === 0) {
                    clearInterval(intervalId);
                    countdownDiv.remove();
                    megjelenítBillentyuzetet(kartya);
                    megjelenitesKilépés();
                }
            }, 1000);
        }));
    });
});
function megjelenítBillentyuzetet(kartya) {
    return __awaiter(this, void 0, void 0, function* () {
        const abc = "aábcdeéfghiíjklmnoóöőpqrstuúüűvwxyz".split("");
        const keyboardContainer = document.createElement("div");
        const TemaId = kartya.id;
        const kérdések = yield fetchWords();
        const kategoriak = kérdések.filter(kérdés => kérdés.category === TemaId);
        console.log(kategoriak);
        const szó = kategoriak[Math.floor(Math.random() * kategoriak.length)];
        console.log(szó);
        const divszó = document.createElement('div');
        divszó.innerText = szó.word;
        divszó.style.position = "absolute";
        divszó.style.bottom = "500px"; // A billentyűzet felett jelenjen meg
        divszó.style.left = "50%";
        divszó.style.transform = "translateX(-50%)";
        divszó.style.backgroundColor = "#8B4513"; // Azonos szín, mint a billentyűzet
        divszó.style.color = "#FFD700"; // Kontrasztos betűszín
        divszó.style.padding = "10px 20px";
        divszó.style.borderRadius = "20px";
        divszó.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.5)";
        divszó.style.fontSize = "2rem";
        divszó.style.fontWeight = "bold";
        keyboardContainer.style.display = "flex";
        keyboardContainer.style.flexWrap = "wrap";
        keyboardContainer.style.justifyContent = "center";
        keyboardContainer.style.gap = "10px";
        keyboardContainer.style.position = "absolute";
        keyboardContainer.style.bottom = "200px";
        keyboardContainer.style.left = "50%";
        keyboardContainer.style.transform = "translateX(-50%)";
        keyboardContainer.style.padding = "20px";
        keyboardContainer.style.backgroundColor = "#8B4513";
        keyboardContainer.style.borderRadius = "20px";
        keyboardContainer.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.5)";
        keyboardContainer.style.maxWidth = "95vw";
        keyboardContainer.style.maxHeight = "30vh"; // max magasság majd ez állítjuk hgy megjelenejn az asló vonal  
        keyboardContainer.style.overflowY = "auto";
        abc.forEach(betu => {
            const betuCard = document.createElement("div");
            betuCard.textContent = betu;
            betuCard.style.backgroundColor = "#FFD700";
            betuCard.style.color = "#8B4513";
            betuCard.style.display = "flex";
            betuCard.style.justifyContent = "center";
            betuCard.style.alignItems = "center";
            betuCard.style.width = "50px";
            betuCard.style.height = "50px";
            betuCard.style.borderRadius = "10px";
            betuCard.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.3)";
            betuCard.style.cursor = "pointer";
            betuCard.style.fontSize = "xx-large";
            keyboardContainer.appendChild(betuCard);
        });
        document.body.appendChild(divszó);
        document.body.appendChild(keyboardContainer);
    });
}
function megjelenitesKilépés() {
    const kilepesButton = document.createElement("button");
    kilepesButton.textContent = "Vissza";
    kilepesButton.style.position = "absolute";
    kilepesButton.style.bottom = "100px"; // Billentyűzet alatt
    kilepesButton.style.left = "47.5%";
    // kilepesButton.style.transform = "translateX(-100%)";
    kilepesButton.style.backgroundColor = "#8B4513";
    kilepesButton.style.color = "#FFD700";
    kilepesButton.style.fontSize = "18px";
    kilepesButton.style.padding = "10px 20px";
    kilepesButton.style.border = "2px solid #A0522D";
    kilepesButton.style.borderRadius = "5px";
    kilepesButton.style.cursor = "pointer";
    kilepesButton.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.5)";
    kilepesButton.style.fontFamily = "'Georgia', serif";
    kilepesButton.addEventListener("mouseover", () => {
        kilepesButton.style.backgroundColor = "#A0522D";
        kilepesButton.style.color = "#FFF8DC";
        kilepesButton.style.transform = "scale(1.1)";
        kilepesButton.style.boxShadow = "4px 4px 10px rgba(0, 0, 0, 0.7)";
    });
    kilepesButton.addEventListener("mouseout", () => {
        kilepesButton.style.backgroundColor = "#8B4513";
        kilepesButton.style.color = "#FFD700";
        kilepesButton.style.transform = "scale(1)";
        kilepesButton.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.5)";
    });
    kilepesButton.addEventListener("click", () => {
        location.reload();
    });
    document.body.appendChild(kilepesButton);
}
