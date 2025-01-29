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
function kerdesekBetoltese(fajlNev) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(fajlNev);
        if (!response.ok) {
            throw new Error(`Nem sikerült betölteni a fájlt: ${fajlNev}`);
        }
        return yield response.json();
    });
}
function kerdesekSzurtese(kerdesek, nehezseg) {
    return kerdesek.filter((k) => k.nehezseg === nehezseg);
}
function renderQuiz(kerdesek) {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';
    let pontszam = 0;
    kerdesek.forEach((kerdes, index) => {
        const kerdesElem = document.createElement('div');
        kerdesElem.className = 'mb-4';
        const kerdesSzoveg = document.createElement('h5');
        kerdesSzoveg.textContent = `${index + 1}. ${kerdes.kerdes}`;
        kerdesElem.appendChild(kerdesSzoveg);
        const kategoriaElem = document.createElement('p');
        kategoriaElem.className = 'text-muted';
        kategoriaElem.textContent = `Kategória: ${kerdes.kategoria}`;
        kerdesElem.appendChild(kategoriaElem);
        const valaszokElem = document.createElement('div');
        kerdes.valaszlehetosegek.forEach((valasz, i) => {
            const valaszElem = document.createElement('button');
            valaszElem.className = 'btn btn-outline-primary d-block w-100 mb-2';
            valaszElem.textContent = valasz;
            valaszElem.onclick = () => {
                if (valasz === kerdes.helyesValasz) {
                    alert('Helyes válasz!');
                    pontszam++;
                }
                else {
                    alert(`Helytelen válasz! A helyes válasz: ${kerdes.helyesValasz}`);
                }
                valaszElem.disabled = true;
            };
            valaszokElem.appendChild(valaszElem);
        });
        kerdesElem.appendChild(valaszokElem);
        quizContainer.appendChild(kerdesElem);
    });
    const pontszamElem = document.createElement('p');
    pontszamElem.className = 'fw-bold mt-3';
    pontszamElem.textContent = `Összesített pontszám: ${pontszam}`;
    quizContainer.appendChild(pontszamElem);
}
function quizFuttatas(fajlNev, nehezseg) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const kerdesek = yield kerdesekBetoltese(fajlNev);
            const szurtKerdesek = kerdesekSzurtese(kerdesek, nehezseg);
            if (szurtKerdesek.length === 0) {
                document.getElementById('quiz-container').innerHTML = '<p class="text-center">Nem található kérdés a kiválasztott nehézségi szinthez.</p>';
                return;
            }
            renderQuiz(szurtKerdesek);
        }
        catch (error) {
            document.getElementById('quiz-container').innerHTML = '<p class="text-danger">Hiba történt a kérdések betöltésekor.</p>';
            console.error(error);
        }
    });
}
quizFuttatas('Kérdések.json', 'kozepes');
