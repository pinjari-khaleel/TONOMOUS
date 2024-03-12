import AbstractComponent from '../../AbstractComponent';
import O01Video from './O01Video';
import VideoEvent, { VideoEventType } from './event/VideoEvent';

export interface IVideo extends AbstractComponent {
  // Getters
  duration: () => Promise<number | undefined>;
  currentTime: () => Promise<number | undefined>;

  // Setters
  setCurrentTime: (time: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;

  // Actions
  play: () => Promise<void>;
  pause: () => Promise<void>;
}

export default abstract class AbstractVideo extends AbstractComponent implements IVideo {
  protected video: O01Video | null = null;

  constructor(el: HTMLElement) {
    super(el);
  }

  protected async forwardEvent(event: VideoEventType) {
    this.video?.dispatcher.dispatchEvent(new VideoEvent(event));
  }

  public adopted() {
    this.video = this.getClosestComponent<O01Video>(`o01-video`);
  }

  // Getters
  public abstract duration(): Promise<number | undefined>;
  public abstract currentTime(): Promise<number | undefined>;
  public abstract paused(): Promise<boolean>;
  public abstract volume(): Promise<number>;

  // Setters
  public abstract setCurrentTime(time: number): Promise<void>;
  public abstract setVolume(volume: number): Promise<void>;

  // Actions
  public abstract play(): Promise<void>;
  public abstract pause(): Promise<void>;
  public clearTimeupdateInterval(): void {}
}
