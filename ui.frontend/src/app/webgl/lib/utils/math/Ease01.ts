export default class Ease01 {
  public static linear(t: number) {
    return t;
  }

  public static smoothstep(t: number) {
    return t * t * (3.0 - 2.0 * t);
  }

  public static smootherstep(x: number): number {
    return x * x * x * (x * (x * 6 - 15) + 10);
  }

  public static invsmoothstep(x: number): number {
    const s = x * x * (3 - 2 * x);
    return x + (x - s);
  }

  public static quadIn(t: number) {
    return t * t;
  }

  public static quadOut(t: number) {
    return t * (2.0 - t);
  }

  public static quadInOut(t: number) {
    return t <= 0.5 ? t * t * 2.0 : 1.0 - --t * t * 2.0;
  }

  public static quadOutIn(t: number) {
    return t < 0.5 ? -0.5 * (t = t * 2.0) * (t - 2.0) : 0.5 * (t = t * 2.0 - 1.0) * t + 0.5;
  }

  public static powIn(t: number) {
    return Math.pow(t, 5);
  }

  public static powOut(t: number) {
    return 1 - Math.pow(1 - t, 5);
  }

  public static sineIn(t: number) {
    return 1 - Math.cos(Math.PI * 0.5 * t);
  }

  public static sineOut(t: number) {
    return Math.sin(Math.PI * 0.5 * t);
  }

  public static sineInOut(t: number) {
    return 0.5 - Math.cos(Math.PI * t) / 2.0;
  }

  public static sineOutIn(t: number) {
    if (t == 0.0) return 0.0;
    else if (t == 1.0) return 1.0;
    else
      return t < 0.5
        ? 0.5 * Math.sin(t * 2.0 * Math.PI * 0.5)
        : -0.5 * Math.cos((t * 2.0 - 1.0) * Math.PI * 0.5) + 1.0;
  }

  public static circIn(t: number) {
    return 1.0 - Math.sqrt(1.0 - t * t);
  }

  public static circOut(t: number) {
    --t;
    return Math.sqrt(1.0 - t * t);
  }

  public static circInOut(t: number) {
    return t <= 0.5
      ? (Math.sqrt(1.0 - t * t * 4.0) - 1.0) / -2.0
      : (Math.sqrt(1.0 - (t * 2.0 - 2.0) * (t * 2.0 - 2.0)) + 1.0) / 2.0;
  }

  public static circOutIn(t: number) {
    return t < 0.5
      ? 0.5 * Math.sqrt(1.0 - (t = t * 2.0 - 1.0) * t)
      : -0.5 * (Math.sqrt(1.0 - (t = t * 2.0 - 1.0) * t) - 1.0 - 1.0);
  }

  public static cubeIn(t: number) {
    return t * t * t;
  }

  public static cubeOut(t: number) {
    return 1.0 + --t * t * t;
  }

  public static cubeInOut(t: number) {
    return t <= 0.5 ? t * t * t * 4.0 : 1.0 + --t * t * t * 4.0;
  }

  public static cubeOutIn(t: number) {
    return 0.5 * ((t = t * 2.0 - 1.0) * t * t + 1.0);
  }

  public static quartIn(t: number) {
    return t * t * t * t;
  }

  public static quartOut(t: number) {
    return 1.0 + --t * t * t * t;
  }

  public static quartInOut(t: number) {
    return t <= 0.5 ? t * t * t * t * 8.0 : (1.0 - (t = t * 2.0 - 2.0) * t * t * t) * 0.5 + 0.5;
  }

  public static quartOutIn(t: number) {
    return t < 0.5
      ? -0.5 * (t = t * 2.0 - 1.0) * t * t * t + 0.5
      : 0.5 * (t = t * 2.0 - 1.0) * t * t * t + 0.5;
  }

  public static quintIn(t: number) {
    return t * t * t * t * t;
  }

  public static quintOut(t: number) {
    return (t = t - 1) * t * t * t * t + 1.0;
  }

  public static quintInOut(t: number) {
    return (t *= 2.0) < 1.0 ? (t * t * t * t * t) / 2.0 : ((t -= 2.0) * t * t * t * t + 2.0) / 2.0;
  }

  public static quintOutIn(t: number) {
    return 0.5 * ((t = t * 2.0 - 1.0) * t * t * t * t + 1.0);
  }

  public static expoIn(t: number) {
    return Math.pow(2, 10.0 * (t - 1.0));
  }

  public static expoOut(t: number) {
    return -Math.pow(2, -10.0 * t) + 1.0;
  }

  public static expoInOut(t: number) {
    return t < 0.5
      ? Math.pow(2, 10.0 * (t * 2.0 - 1.0)) / 2.0
      : (-Math.pow(2, -10.0 * (t * 2.0 - 1.0)) + 2.0) / 2.0;
  }

  public static expoOutIn(t: number) {
    return t < 0.5
      ? 0.5 * (1.0 - Math.pow(2, -20.0 * t))
      : t == 0.5
      ? 0.5
      : 0.5 * (Math.pow(2, 20.0 * (t - 1.0)) + 1.0);
  }

  public static backIn(t: number) {
    return t * t * (5.0 * t - 4.0);
  }

  public static backOut(t: number) {
    return 1 - --t * t * (-5.0 * t - 4.0);
  }

  public static backInOut(t: number) {
    t *= 2.0;
    if (t < 1.0) return (t * t * (5.0 * t - 4.0)) / 2.0;
    t -= 2.0;
    return (1 - t * t * (-5.0 * t - 4.0)) / 2.0 + 0.5;
  }

  public static elasticIn(t: number, ELASTIC_AMPLITUDE: number = 1, ELASTIC_PERIOD: number = 0.4) {
    return -(
      ELASTIC_AMPLITUDE *
      Math.pow(2, 10 * (t -= 1)) *
      Math.sin(
        ((t - (ELASTIC_PERIOD / (Math.PI / 2)) * Math.asin(1 / ELASTIC_AMPLITUDE)) *
          (Math.PI * 2)) /
          ELASTIC_PERIOD,
      )
    );
  }

  public static elasticOut(t: number, ELASTIC_AMPLITUDE: number = 1, ELASTIC_PERIOD: number = 0.4) {
    return (
      ELASTIC_AMPLITUDE *
        Math.pow(2, -10 * t) *
        Math.sin(
          ((t - (ELASTIC_PERIOD / (Math.PI * 2)) * Math.asin(1 / ELASTIC_AMPLITUDE)) *
            (Math.PI * 2)) /
            ELASTIC_PERIOD,
        ) +
      1
    );
  }

  public static elasticInOut(
    t: number,
    ELASTIC_AMPLITUDE: number = 1,
    ELASTIC_PERIOD: number = 0.4,
  ) {
    if (t < 0.5)
      return (
        -0.5 *
        (Math.pow(2, 10.0 * (t -= 0.5)) *
          Math.sin(((t - ELASTIC_PERIOD / 4.0) * (Math.PI * 2)) / ELASTIC_PERIOD))
      );
    return (
      Math.pow(2, -10 * (t -= 0.5)) *
        Math.sin(((t - ELASTIC_PERIOD / 4) * (Math.PI * 2.0)) / ELASTIC_PERIOD) *
        0.5 +
      1.0
    );
  }
}
