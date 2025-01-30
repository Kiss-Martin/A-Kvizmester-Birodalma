function Lövés() {

    const töltény = document.getElementById('töltény');
    const lyukok = document.querySelectorAll('.lyuk');
    var töltények = 0;

    töltény!.addEventListener('click', () => {
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

    Lövés()

}
