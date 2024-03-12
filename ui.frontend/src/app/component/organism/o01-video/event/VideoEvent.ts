import { AbstractEvent } from 'seng-event';
import { EVENT_TYPE_PLACEHOLDER, generateEventTypes } from 'seng-event/lib/util/eventTypeUtils';

export type VideoEventType =
  | typeof VideoEvent.ABORT
  | typeof VideoEvent.CANPLAY
  | typeof VideoEvent.CANPLAYTHROUGH
  | typeof VideoEvent.DURATIONCHANGE
  | typeof VideoEvent.EMPTIED
  | typeof VideoEvent.ENDED
  | typeof VideoEvent.ERROR
  | typeof VideoEvent.LOADEDDATA
  | typeof VideoEvent.LOADEDMETADATA
  | typeof VideoEvent.LOADSTART
  | typeof VideoEvent.PAUSE
  | typeof VideoEvent.PLAY
  | typeof VideoEvent.PLAYING
  | typeof VideoEvent.PROGRESS
  | typeof VideoEvent.RATECHANGE
  | typeof VideoEvent.SEEKED
  | typeof VideoEvent.SEEKING
  | typeof VideoEvent.STALLED
  | typeof VideoEvent.SUSPEND
  | typeof VideoEvent.TIMEUPDATE
  | typeof VideoEvent.VOLUMECHANGE
  | typeof VideoEvent.WAITING;

export type VideoEventData = {
  currentTime?: number;
};

class VideoEvent extends AbstractEvent {
  /**
   * Sent when playback is aborted; for example, if the media is playing and is
   * restarted from the beginning, this event is sent.
   */
  public static readonly ABORT: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * Sent when enough data is available that the media can be played, at least
   * for a couple of frames.  This corresponds to the HAVE_FUTURE_DATA
   * readyState.
   */
  public static readonly CANPLAY: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * Sent when the readyState changes to HAVE_ENOUGH_DATA, indicating that the
   * entire media can be played without interruption, assuming the download rate
   * remains at least at the current level. It will also be fired when playback
   * is toggled between paused and playing. Note: Manually setting the
   * currentTime will eventually fire a canplaythrough event in firefox. Other
   * browsers might not fire this event.
   */
  public static readonly CANPLAYTHROUGH: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * The metadata has loaded or changed, indicating a change in duration of the
   * media.  This is sent, for example, when the media has loaded enough that
   * the duration is known.
   */
  public static readonly DURATIONCHANGE: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * The media has become empty; for example, this event is sent if the media
   * has already been loaded (or partially loaded), and the load() method is
   * called to reload it.
   */
  public static readonly EMPTIED: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * Sent when playback completes.
   */
  public static readonly ENDED: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * Sent when an error occurs.  The element's error attribute contains more
   * information. See HTMLMediaElement.error for details.
   */
  public static readonly ERROR: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * The first frame of the media has finished loading.
   */
  public static readonly LOADEDDATA: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * The media's metadata has finished loading; all attributes now contain as
   * much useful information as they're going to.
   */
  public static readonly LOADEDMETADATA: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * Sent when loading of the media begins.
   */
  public static readonly LOADSTART: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * Sent when the playback state is changed to paused (paused property is true).
   */
  public static readonly PAUSE: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * Sent when the playback state is no longer paused, as a result of the play
   * method, or the autoplay attribute.
   */
  public static readonly PLAY: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * Sent when the media has enough data to start playing, after the play event,
   * but also when recovering from being stalled, when looping media restarts,
   * and after seeked, if it was playing before seeking.
   */
  public static readonly PLAYING: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * Sent periodically to inform interested parties of progress downloading the
   * media. Information about the current amount of the media that has been
   * downloaded is available in the media element's buffered attribute.
   */
  public static readonly PROGRESS: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * Sent when the playback speed changes.
   */
  public static readonly RATECHANGE: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * Sent when a seek operation completes.
   */
  public static readonly SEEKED: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * Sent when a seek operation begins.
   */
  public static readonly SEEKING: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * Sent when the user agent is trying to fetch media data, but data is unexpectedly not forthcoming.
   */
  public static readonly STALLED: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * Sent when loading of the media is suspended; this may happen either because the download has completed or because it has been paused for any other reason.
   */
  public static readonly SUSPEND: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * The time indicated by the element's currentTime attribute has changed.
   */
  public static readonly TIMEUPDATE: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * Sent when the audio volume changes (both when the volume is set and when the muted attribute is changed).
   */
  public static readonly VOLUMECHANGE: string = EVENT_TYPE_PLACEHOLDER;

  /**
   * Sent when the requested operation (such as playback) is delayed pending the completion of another operation (such as a seek).
   */
  public static readonly WAITING: string = EVENT_TYPE_PLACEHOLDER;

  constructor(type: string, bubbles?: boolean, cancelable?: boolean, setTimeStamp?: boolean) {
    super(type, bubbles, cancelable, setTimeStamp);
  }

  public clone(): VideoEvent {
    return new VideoEvent(this.type, this.bubbles, this.cancelable);
  }
}

generateEventTypes({ VideoEvent });

export default VideoEvent;
