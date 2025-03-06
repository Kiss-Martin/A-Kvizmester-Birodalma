var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function saveScore(gameName, score, playerName) {
    return __awaiter(this, void 0, void 0, function* () {
        const newScore = {
            playerName,
            game: gameName,
            score: score,
            date: new Date().toISOString()
        };
        try {
            const response = yield fetch('http://localhost:3000/scores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newScore)
            });
            return yield response.json();
        }
        catch (error) {
            console.error('Error saving score:', error);
        }
    });
}
export function getHighScores() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('http://localhost:3000/scores');
        return yield response.json();
    });
}
