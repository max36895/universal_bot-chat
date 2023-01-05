const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;

interface IPromiseRes {
  resolve: (value: unknown) => void;
  reject: (err: string) => void;
}

export default class Voice {
  private _recognizer: SpeechRecognition;
  private _synth: speechSynthesis;
  private _speechUtterance: SpeechSynthesisUtterance;
  private _speechPromise: IPromiseRes | null;
  private _watchSpeak: (value: string) => void;

  constructor() {
    this._speechPromise = null;
    this._recognizer = new SpeechRecognition();

    const speechRecognitionList = new SpeechGrammarList();
    // Ставим опцию, чтобы распознавание началось ещё до того, как пользователь закончит говорить
    this._recognizer.interimResults = true;
    this._recognizer.lang = "ru-Ru";
    this._recognizer.grammars = speechRecognitionList;
    this._recognizer.maxAlternatives = 1;

    // Используем колбек для обработки результатов
    this._recognizer.onresult = (event) => {
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
    this._speechUtterance.voice = voices[0];
  }

  setWatchSpeak(watchSpeak: (value: string) => void): void {
    this._watchSpeak = watchSpeak;
  }

  speak(say: string): void {
    if (this._synth.speaking) {
      this._synth.cancel();
    }
    this._speechUtterance.text = say;
    this._synth.speak(this._speechUtterance);
  }

  isSpeak(): boolean {
    return this._synth.speaking;
  }

  speakPause(): void {
    this._synth.pause();
  }

  speakStop(): void {
    this._synth.cancel();
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
  isSpeach(): boolean {
    return this._speechPromise !== null;
  }
  speechStop(): void {
    this._speechPromise = null;
    this._recognizer.stop();
  }
}
