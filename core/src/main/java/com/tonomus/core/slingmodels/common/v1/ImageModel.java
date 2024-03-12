package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling model for a01-image atom.
 */
@Getter
@Setter
@NoArgsConstructor
@Model(adaptables = {Resource.class},
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ImageModel {

  /**
   * Variable for alt.
   */
  @ValueMapValue
  private String alt;

  /**
   * Variable for src.
   */
  @ValueMapValue
  private String src;

  /**
   * Media value for c67, hard-coded breakpoint for tablets.
   */
  @ValueMapValue
  private String media;

  /**
   * Sources.
   */
  private List<ImageModel> sources;

  /**
   * Constructor for Basic ImageModel Object.
   *
   * @param src src.
   */
  public ImageModel(String src) {
    this.src = src;
  }

  /**
   * Constructor.
   * @param src src
   * @param alt alt
   */
  public ImageModel(String src, String alt) {
    this(src);
    this.alt = alt;
  }

  /**
   * Constructor.
   * @param src src
   * @param alt alt
   * @param media media
   */
  public ImageModel(String src, String alt, String media) {
    this(src, alt);
    this.media = media;
  }
}
