export default class NormalizedEnvelope {
  private _attack: number;
  private _decay: number;
  private _sustain: number;
  private _release: number;
  private _sustainLevel: number;

  constructor(
    attack: number,
    decay: number,
    sustain: number,
    release: number,
    sustainLevel: number,
  ) {
    const sum: number = attack + decay + sustain + release;
    this._attack = attack / sum;
    this._decay = decay / sum;
    this._sustain = sustain / sum;
    this._release = release / sum;
    this._sustainLevel = sustainLevel;
  }

  private static lerp(a: number, b: number, i: number): number {
    return (1 - i) * a + i * b;
  }

  public getValue(phase: number) {
    let value: number = 0;

    if (phase < this._attack) {
      value = phase / this._attack;
    } else if (phase < this._decay) {
      const p = (phase - this._attack) / (this._decay - this._attack);
      value = NormalizedEnvelope.lerp(1, this._sustainLevel, p);
    } else if (phase < this._sustain) {
      value = this._sustainLevel;
    } else if (phase < this._release) {
      const p = (phase - this._sustain) / (this._release - this._sustain);
      value = this._sustainLevel * (1 - p);
    }
    return value;
  }
}
