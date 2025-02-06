"use strict";
const töltény = document.getElementById('töltény');
const lyukok = document.querySelectorAll('.lyuk');
const revolver = document.getElementById('revolver');
var töltények = 0;
var halálEsély = 0;
töltény.addEventListener('click', () => {
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
revolver.addEventListener('click', () => {
    if (töltények == 0) {
        alert("Hé! Üres tárral nem ér!");
    }
    else if (töltények == 6) {
        alert("Meghaltál");
    }
    else if (töltények == 5) {
    }
    else if (töltények == 4) {
    }
    else if (töltények == 3) {
    }
    else if (töltények == 2) {
    }
    else if (töltények == 1) {
    }
});
