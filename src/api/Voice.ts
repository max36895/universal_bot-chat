// @ts-ignore
const SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition;
// @ts-ignore
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

interface IPromiseRes {
    resolve: (value: unknown) => void;
    reject: (err: string) => void;
}

export default class Voice {
    // @ts-ignore
    private readonly _recognizer: SpeechRecognition;
    // @ts-ignore
    private readonly _synth: speechSynthesis;
    private readonly _speechUtterance: SpeechSynthesisUtterance;
    private _speechPromise: IPromiseRes | null;
    private _watchSpeak: ((value: string) => void) | undefined;

    constructor() {
        this._speechPromise = null;
        if (SpeechRecognition) {
            this._recognizer = new SpeechRecognition();
        }

        if (SpeechGrammarList) {
            this._recognizer.grammars = new SpeechGrammarList();
        }

        // Ставим опцию, чтобы распознавание началось ещё до того, как пользователь закончит говорить
        this._recognizer.interimResults = true;
        this._recognizer.lang = "ru-Ru";
        this._recognizer.maxAlternatives = 1;

        this._recognizer.onresult = (event: any) => {
            const result = event.results[event.resultIndex];
            if (result.isFinal) {
                if (this._speechPromise) {
                    this._speechPromise.resolve(result[0].transcript);
                }
                this._speechPromise = null;
            } else {
                if (this._watchSpeak && result[0]) {
                    this._watchSpeak(result[0].transcript);
                }
            }
        };

        this._recognizer.onend = () => {
            if (this._speechPromise) {
                this._speechPromise.resolve("");
                this._speechPromise = null;
            }
        };

        this._synth = speechSynthesis;
        this._speechUtterance = new SpeechSynthesisUtterance("");
        const voices = this._synth.getVoices();
        let index = 0;
        for (let i = 0; i < voices.length; i++) {
            if (voices[i].lang === 'ru-RU') {
                index = i;
                break;
            }
        }
        this._speechUtterance.voice = voices[index];
    }

    setWatchSpeak(watchSpeak: (value: string) => void): void {
        this._watchSpeak = watchSpeak;
    }

    isSpeak(): boolean {
        return this._synth.speaking;
    }

    speak(say: string): void {
        if (this._synth.speaking) {
            this._synth.cancel();
        }
        this._speechUtterance.text = say;
        this._synth.speak(this._speechUtterance);
    }

    speakPause(): void {
        this._synth.pause();
    }

    speakStop(): void {
        this._synth.cancel();
    }

    isSpeech(): boolean {
        return this._speechPromise !== null;
    }

    speech(): Promise<unknown> {
        if (this.isSpeak()) {
            this.speakStop();
        }
        if (this.isSpeech()) {
            this.speechStop();
        }
        this._recognizer.stop();
        this._recognizer.start();

        return new Promise((resolve, reject) => {
            this._speechPromise = {
                resolve,
                reject
            };
        });
    }

    speechStop(): void {
        this._speechPromise = null;
        this._recognizer.stop();
    }
}
