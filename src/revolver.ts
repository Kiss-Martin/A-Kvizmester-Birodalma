const töltény = document.getElementById('töltény');
        const lyukok = document.querySelectorAll('.lyuk');
        const revolver = document.getElementById('revolver')
        var töltények = 0;
        var halálEsély = 0;;

        
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
        
        

        revolver!.addEventListener('click', () => {
            if (töltények > 0) {
                    var halálEsély = töltények/6;
                    console.log(Math.random()<(halálEsély))
                    if (Math.random()<(halálEsély) == true){
                    alert('Meghaltál!');
                }
            else if (töltények == 0){
                alert('Nincs töltény a revolverben!')
            }
            else{
                alert('Túlélted!')
            }
        }})
