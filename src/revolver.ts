const töltény = document.getElementById('töltény');
const lyukok = document.querySelectorAll('.lyuk');
const revolver = document.getElementById('revolver');

let töltények = 0;


function removeAllTöltények() {
    lyukok.forEach(lyuk => {
        const töltényElem = lyuk.querySelector('.töltény-dob');
        if (töltényElem) {
            lyuk.removeChild(töltényElem);
        }
    });
}


function handleShoot() {
    const halálEsély = töltények / 6;
    const lövésEredmény = Math.random() < halálEsély;

    if (lövésEredmény) {
        alert('Meghaltál!');
    } else {
        alert('Túlélted!');
    }


    removeAllTöltények();


    töltények = 0;
}


function shootIfHasAmmo() {
    if (töltények > 0) {
        handleShoot();
    } else {
        alert('Nincs töltény a revolverben!');
    }
}


töltény?.addEventListener('click', () => {
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

revolver?.addEventListener('click', shootIfHasAmmo);
