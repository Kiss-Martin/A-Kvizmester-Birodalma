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
    if (töltények === 0) {
        alert('Nincs töltény a revolverben!');
        return;
    }

    const halálEsély = töltények / 6;
    const lövésEredmény = Math.random() < halálEsély;

    revolver!.classList.add('spin');

    setTimeout(() => {
        revolver!.classList.remove('spin');

       
        removeAllTöltények();
        töltények = 0;

        if (lövésEredmény) {
            
            revolver!.classList.add('pulse');

            setTimeout(() => {
                revolver!.classList.remove('pulse');
                alert('Meghaltál!');
            }, 500);
        } else {
            alert('Túlélted!');
        }
    }, 1000); 
}

function shootIfHasAmmo() {
    handleShoot();
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
