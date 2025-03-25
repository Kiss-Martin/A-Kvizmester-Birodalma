"use strict";
const töltény = document.getElementById('töltény');
const lyukok = document.querySelectorAll('.lyuk');
const revolver = document.getElementById('revolver');
const body = document.body;
let töltények = 0;
function removeAllTöltények() {
    lyukok.forEach(lyuk => {
        const töltényElem = lyuk.querySelector('.töltény-dob');
        if (töltényElem) {
            lyuk.removeChild(töltényElem);
        }
    });
}
function showEndScreen(message, color) {
    body.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: black; color: ${color}; font-size: 48px;">
            <p>${message}</p>
            <button onclick="window.location.reload()" style="background-color: ${color}; color: white; font-size: 24px; padding: 10px 20px; border: none; cursor: pointer;">Újra</button>
        </div>
    `;
}
function handleShoot() {
    if (töltények === 0) {
        alert('Nincs töltény a revolverben!');
        return;
    }
    const halálEsély = töltények / 6;
    const lövésEredmény = Math.random() < halálEsély;
    revolver.classList.add('spin');
    setTimeout(() => {
        revolver.classList.remove('spin');
        removeAllTöltények();
        töltények = 0;
        if (lövésEredmény) {
            showEndScreen('Meghaltál!', 'red');
        }
        else {
            showEndScreen('Túlélted!', 'green');
        }
    }, 1000);
}
function shootIfHasAmmo() {
    handleShoot();
}
töltény === null || töltény === void 0 ? void 0 : töltény.addEventListener('click', () => {
    if (töltények < 6) {
        for (let i = 0; i < lyukok.length; i++) {
            if (!lyukok[i].querySelector('.töltény-dob')) {
                const töltényElem = document.createElement('div');
                töltényElem.classList.add('töltény-dob');
                lyukok[i].appendChild(töltényElem);
                töltények++;
                break;
            }
        }
    }
});
revolver === null || revolver === void 0 ? void 0 : revolver.addEventListener('click', shootIfHasAmmo);
