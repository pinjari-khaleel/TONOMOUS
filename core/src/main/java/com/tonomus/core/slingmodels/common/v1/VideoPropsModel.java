package com.tonomus.core.slingmodels.common.v1;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.ResourceBundle;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.gson.annotations.SerializedName;
import com.tonomus.core.constants.Constants;
import com.tonomus.core.models.dmedia.DynamicMediaPropsModel;
import com.tonomus.core.utils.JsonUtils;
import com.tonomus.core.utils.LangUtils;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.i18n.ResourceBundleProvider;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import static com.day.cq.dam.api.DamConstants.DC_FORMAT;
import static com.tonomus.core.constants.Constants.ENTER_FULL_SCREEN;
import static com.tonomus.core.constants.Constants.EXIT_FULL_SCREEN;
import static com.tonomus.core.constants.Constants.MUTE_VIDEO;
import static com.tonomus.core.constants.Constants.PAUSE_VIDEO;
import static com.tonomus.core.constants.Constants.PLAY_VIDEO;
import static com.tonomus.core.constants.Constants.SLASH;
import static com.tonomus.core.constants.Constants.UNMUTE_VIDEO;
import static com.tonomus.core.utils.MediaUtils.METADATA_CHILD_RES_PATH;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

/**
 * Sling model for video config.
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Model(adaptables = {Resource.class},
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class VideoPropsModel {

  /**
   * Event tracking.
   */
  @ChildResource
  private VideoEventTrackingModel eventTracking;

  /**
   * Variable storing youtube id.
   */
  @Setter
  @ValueMapValue
  private String youtube;

  /**
   * Variable storing youtubeUrl.
   */
  @ValueMapValue
  private String youtubeUrl;

  /**
   * Fallback video.
   */
  private VideoSource video;

  /**
   * Video source.
   */
  @Setter
  private List<VideoSource> sources;

  /**
   * originalWidth.
   */
  @ValueMapValue
  private Integer originalWidth;

  /**
   * originalWidth.
   */
  @ValueMapValue
  private Integer originalHeight;

  /**
   * Variable storing autoplay.
   */
  @Setter
  @ValueMapValue
  private boolean autoplay;

  /**
   * Variable storing muted.
   */
  @Setter
  @ValueMapValue
  private boolean muted;

  /**
   * Variable storing loop.
   */
  @Setter
  @ValueMapValue
  private boolean loop;

  /**
   * Variable storing cover.
   */
  @ValueMapValue
  private boolean cover;

  /**
   * Variable storing disablePreload.
   */
  @Setter
  @ValueMapValue
  private boolean disablePreload;

  /**
   * Variable storing playsinline.
   */
  @Setter
  @ValueMapValue
  @SerializedName("playsinline")
  private boolean playsInline;

  /**
   * Video controls.
   */
  @Setter
  @ChildResource
  private VideoControls controls;

  /**
   * Cross Origin.
   */
  @ValueMapValue
  private String crossOrigin;

  /**
   * Video control buttons texts.
   */
  private ButtonsText copy;

  /**
   * Constructor.
   * @param i18nProvider i18n bundle provider
   * @param currentResource current resource
   * @param sources list of video sources
   * @param video video source
   */
  @Inject public VideoPropsModel(
      @OSGiService(filter = Constants.I18N_PROVIDER_SERVICE_TARGET)
      @Named("i18nProvider") final ResourceBundleProvider i18nProvider,
      @Self @Named("currentResource") final Resource currentResource,
      @ChildResource(name = "sources") final List<VideoSource> sources,
      @ChildResource(name = "video") final VideoSource video) {
    if (Objects.isNull(copy) && Objects.nonNull(currentResource) && Objects.nonNull(i18nProvider)) {
      Locale locale = LangUtils.getCurrentLocale(currentResource);
      ResourceBundle i18nBundle = i18nProvider.getResourceBundle(locale);
      copy = ButtonsText.builder().play(LangUtils.getI18nStringOrKey(i18nBundle, PLAY_VIDEO))
          .pause(LangUtils.getI18nStringOrKey(i18nBundle, PAUSE_VIDEO))
          .mute(LangUtils.getI18nStringOrKey(i18nBundle, MUTE_VIDEO))
          .unmute(LangUtils.getI18nStringOrKey(i18nBundle, UNMUTE_VIDEO))
          .enterFullScreen(LangUtils.getI18nStringOrKey(i18nBundle, ENTER_FULL_SCREEN))
          .exitFullScreen(LangUtils.getI18nStringOrKey(i18nBundle, EXIT_FULL_SCREEN)).build();
    }
    if (CollectionUtils.isNotEmpty(sources)) {
      this.sources = new ArrayList<>(sources);
    }
    if (nonNull(video) && StringUtils.isNotBlank(video.getSrc())) {
      this.video = video;
    }
    if (nonNull(currentResource)) {
      initializeVideos(currentResource);
    }
  }

  /**
   * getJson method for serialize this object.
   *
   * @return json representation.
   */
  @JsonIgnore public String getJson() {
    return JsonUtils.serialize(Map.of("props", this));
  }

  /**
   * init method for VideoConfigModel.
   */
  @PostConstruct private void init() {
    if (nonNull(eventTracking) && nonNull(eventTracking.getVideo())) {
      if (isNull(eventTracking.getEvent())) {
        eventTracking.setEvent("video_start");
      }
      if (nonNull(sources) && !sources.isEmpty()) {
        eventTracking.getVideo().setSrc(sources.get(0).getSrc());
      } else if (StringUtils.isNotEmpty(youtubeUrl)) {
        eventTracking.getVideo().setSrc(youtubeUrl);
      }
    }
  }

  /**
   * Method to initialize videos.
   *
   * @param currentResource currentResource.
   */
  private void initializeVideos(final Resource currentResource) {
    //for old components
    if (nonNull(sources) && sources.size() == 1 && isNull(sources.get(0).getMedia()) && isNull(
        video)) {
      setDmBareUrl(currentResource, sources.get(0));
    } else
      //auto-generate sources
      if (nonNull(video) && nonNull(sources) && sources.size() == 1 && isNull(
          sources.get(0).getMedia())) {
        DynamicMediaPropsModel props =
            DynamicMediaPropsModel.of(currentResource.getResourceResolver(),
                sources.get(0).getSrc());
        initializePredefinedSources(props);
      }
    if (nonNull(sources)) {
      sources.forEach(s -> setDmBareUrl(currentResource, s));
    }
    if (nonNull(video)) {
      setDmBareUrl(currentResource, video);
    }
    // reverse sorting. works ony for min-width media
    if (nonNull(sources) && sources.size() > 1) {
      Collections.sort(sources);
    }
  }

  /**
   * Method to set fallback video.
   *
   * @param currentResource resource.
   * @param source video source
   */
  private void setDmBareUrl(final Resource currentResource, VideoSource source) {
    Optional.ofNullable(
            DynamicMediaPropsModel.of(currentResource.getResourceResolver(), source.getSrc()))
        .map(DynamicMediaPropsModel::getDmBareUrl).ifPresent(source::setSrc);
  }

  /**
   * Initializes source list from path using predefined media.
   * Example of src: https://host.scene7.com/is/content/video-0x360-730k|(max-width: 640px)
   *
   * @param propsModel DynamicMediaPropsModel.
   */
  protected void initializePredefinedSources(final DynamicMediaPropsModel propsModel) {
    if (isNull(propsModel)) {
      return;
    }
    for (Map.Entry<String, String> rendition : getAllowedRenditions().entrySet()) {
      sources.add(VideoSource.builder().src(propsModel.getDmBareUrl() + rendition.getKey())
          .type(propsModel.getAssetMimeType()).media(rendition.getValue()).build());
    }
  }

  /**
   * Returns a list of renditions/crops for a video. Possible video crops are hard-coded now, can
   * be switched later to using some config, like ACS Commons Generic Lists or get directly from
   * the adaptive video configuration nodes /libs/settings/dam/dm/presets/video,
   * /conf/.../settings/dam/dm/presets/video.
   *
   * @return map rendition -> media, media can be null
   */
  private static Map<String, String> getAllowedRenditions() {
    // 16:9 aspect ratio sizes: 640x360 960x540 1280x720 1600x900
    //@formatter:off
    // Max sized video (1280x720) is displayed for all other widths, so media is empty here
    //@formatter:on
    return Map.of("-0x360-730k", "(max-width: 640px)",
        "-0x540-2000k", "(max-width: 960px)",
        "-0x720-3000k", StringUtils.EMPTY);
  }

  /**
   * Class for video source.
   */
  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  @EqualsAndHashCode(onlyExplicitlyIncluded = true)
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class VideoSource implements Serializable, Comparable<VideoSource> {

    /**
     * src.
     */
    @ValueMapValue
    @EqualsAndHashCode.Include
    private String src;

    /**
     * type.
     */
    @EqualsAndHashCode.Include
    private String type;

    /**
     * media.
     */
    @ValueMapValue
    @EqualsAndHashCode.Include
    private String media;

    /**
     * Flag to ignore dynamic media.
     */
    @ValueMapValue
    private boolean ignoreDynamicMedia;

    /**
     * The current component resource.
     */
    @JsonIgnore
    @Self
    private transient Resource currentResource;

    /**
     * init method for VideoSource.
     */
    @PostConstruct private void init() {
      if (StringUtils.isNotBlank(src) && nonNull(currentResource)) {
        ResourceResolver resolver = currentResource.getResourceResolver();
        Resource metadata = resolver.getResource(src + SLASH + METADATA_CHILD_RES_PATH);
        if (nonNull(metadata)) {
          type = metadata.getValueMap().get(DC_FORMAT, String.class);
        }
      }
    }

    @Override public int compareTo(final VideoSource o) {
      if (nonNull(media) && media.equals(o.getMedia())) {
        return 0;
      }
      if (getPxValueFromMedia(media) > getPxValueFromMedia(o.getMedia())) {
        return 1;
      } else {
        return -1;
      }
    }

    /**
     * Method to extract in pixel value.
     *
     * @param media media.
     * @return int value.
     */
    private int getPxValueFromMedia(String media) {
      if (isNull(media)) {
        return Integer.MAX_VALUE;
      }
      if (media.isEmpty()) {
        return Integer.MAX_VALUE - 1;
      }
      Pattern p = Pattern.compile("\\d+");
      Matcher m = p.matcher(media);
      int value = 0;
      while (m.find()) {
        value = Integer.valueOf(m.group());
      }
      return value;
    }
  }


  /**
   * Class for video controls.
   */
  @Getter
  @Setter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class VideoControls implements Serializable {
    /**
     * Variable storing playPause.
     */
    @ValueMapValue
    private boolean playPause;

    /**
     * Variable storing fullscreen.
     */
    @ValueMapValue
    private boolean fullscreen;

    /**
     * Variable storing seek.
     */
    @ValueMapValue
    private boolean seek;
  }


  /**
   * Event tracking model for Video.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class VideoEventTrackingModel extends EventTrackingModel {
    /**
     * Data Layer Titles.
     */
    @ChildResource
    private DataLayerInfoModel video;
  }


  /**
   * Control buttons texts.
   */
  @Getter
  @Builder
  public static class ButtonsText {
    /**
     * Control button text.
     */
    private String play;

    /**
     * Control button text.
     */
    private String pause;

    /**
     * Control button text.
     */
    private String mute;

    /**
     * Control button text.
     */
    private String unmute;

    /**
     * Control button text.
     */
    private String enterFullScreen;

    /**
     * Control button text.
     */
    private String exitFullScreen;
  }
}
