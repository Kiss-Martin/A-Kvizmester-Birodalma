interface QuizQuestion {
    kategoria: string;
    nehezseg: 'konnyu' | 'kozepes' | 'nehez';
    kerdes: string;
    valaszlehetosegek: string[];
    helyesValasz: string;
  }

  async function kerdesekBetoltese(fajlNev: string): Promise<QuizQuestion[]> {
    const response = await fetch(fajlNev);
    if (!response.ok) {
      throw new Error(`Nem sikerült betölteni a fájlt: ${fajlNev}`);
    }
    return await response.json() as QuizQuestion[];
  }

  function kerdesekSzurtese(kerdesek: QuizQuestion[], nehezseg: 'konnyu' | 'kozepes' | 'nehez'): QuizQuestion[] {
    return kerdesek.filter((k) => k.nehezseg === nehezseg);
  }

  function renderQuiz(kerdesek: QuizQuestion[]) {
    const quizContainer = document.getElementById('quiz-container') as HTMLElement;
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
          } else {
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

  async function quizFuttatas(fajlNev: string, nehezseg: 'konnyu' | 'kozepes' | 'nehez') {
    try {
      const kerdesek = await kerdesekBetoltese(fajlNev);
      const szurtKerdesek = kerdesekSzurtese(kerdesek, nehezseg);

      if (szurtKerdesek.length === 0) {
        document.getElementById('quiz-container')!.innerHTML = '<p class="text-center">Nem található kérdés a kiválasztott nehézségi szinthez.</p>';
        return;
      }

      renderQuiz(szurtKerdesek);
    } catch (error) {
      document.getElementById('quiz-container')!.innerHTML = '<p class="text-danger">Hiba történt a kérdések betöltésekor.</p>';
      console.error(error);
    }
  }

  quizFuttatas('Kérdések.json', 'kozepes');