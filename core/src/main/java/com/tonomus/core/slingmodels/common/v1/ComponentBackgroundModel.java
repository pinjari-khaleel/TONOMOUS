package com.tonomus.core.slingmodels.common.v1;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;
import java.util.Optional;

import javax.inject.Inject;

import com.tonomus.core.slingmodels.components.v1.map.LottieAnimationModel;
import com.tonomus.core.utils.MediaUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for m34-component-background.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ComponentBackgroundModel {

  /**
   * Transition Direction.
   */
  @ValueMapValue
  private String transitionDirection;

  /**
   * Disable transition.
   */
  @ValueMapValue
  private boolean disableTransition;

  /**
   * Is sticky.
   */
  @ValueMapValue
  private boolean sticky;

  /**
   * Effect.
   */
  @ValueMapValue
  private String effect;

  /**
   * Background Image.
   */
  @Setter
  @ChildResource
  private ImageModel image;

  /**
   * Background Image Mobile.
   */
  @ChildResource
  private ImageModel imageMobile;

  /**
   * Background Video.
   */
  @Setter
  @ChildResource
  private VideoModel video;

  /**
   * Background lottie.
   */
  @ChildResource
  private LottieAnimationModel lottie;

  /**
   * Mask.
   */
  private Mask mask;

  /**
   * Constructor for ComponentBackgroundModel Object.
   *
   * @param image ImageModel.
   * @param video VideoModel.
   */
  public ComponentBackgroundModel(ImageModel image, VideoModel video) {
    // Following lines are due to data structure changes and this ensures backward compatibility
    // and prevents component breaking on live pages.
    if (Objects.nonNull(image)) {
      this.image = image;
    }
    if (!MediaUtils.isVideoNotPresent(video)) {
      this.video = video;
    }
    this.mask = Mask.DEFAULT_MASK;
  }

  /**
   * Model constructor. Mask object should not be null even if child resource does not exists.
   * @param mask nullable instance of Mask object
   */
  @Inject
  public ComponentBackgroundModel(@ChildResource(name = "mask") Mask mask) {
    this.mask = Optional.ofNullable(mask).orElse(Mask.DEFAULT_MASK);
  }

  /**
   * Is background present.
   * @return true if background is set
   */
  public boolean hasBackground() {
    return !MediaUtils.isBackgroundNotPresent(video, image, lottie);
  }

  /**
   * Mask class.
   */
  @AllArgsConstructor
  @NoArgsConstructor
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class Mask {

    /**
     * Default opacity.
     */
    private static final String DEFAULT_OPACITY = "0.5";

    /**
     * Default Mask object.
     */
    protected static final Mask DEFAULT_MASK = new Mask(false, DEFAULT_OPACITY);
    /**
     * Is solid.
     */
    @ValueMapValue
    private boolean solid;

    /**
     * Opacity.
     */
    @ValueMapValue
    @Default(values = DEFAULT_OPACITY)
    private String opacity;
  }
}
