// @ts-ignore
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// @ts-ignore
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

interface IPromiseRes {
  resolve: (value: unknown) => void;
  reject: (err: string) => void;
}

export default class Voice {
  // @ts-ignore
  private _recognizer: SpeechRecognition;
  // @ts-ignore
  private _synth: speechSynthesis;
  private _speechUtterance: SpeechSynthesisUtterance;
  private _speechPromise: IPromiseRes | null;
  private _watchSpeak: ((value: string) => void) | undefined;

  constructor() {
    this._speechPromise = null;
    if (SpeechRecognition) {
      this._recognizer = new SpeechRecognition();
    } else {
      return;
    }

    if (SpeechGrammarList) {
      const speechRecognitionList = new SpeechGrammarList();
      this._recognizer.grammars = speechRecognitionList;
    }

    // Ставим опцию, чтобы распознавание началось ещё до того, как пользователь закончит говорить
    this._recognizer.interimResults = true;
    this._recognizer.lang = "ru-Ru";
    this._recognizer.maxAlternatives = 1;

    this._recognizer.onresult = (event: any) => {
      var result = event.results[event.resultIndex];
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

  isSpeach(): boolean {
    return this._speechPromise !== null;
  }

  speech(): Promise<unknown> {
    if (this.isSpeak()) {
      this.speakStop();
    }
    if (this.isSpeach()) {
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
