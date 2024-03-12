package com.tonomus.core.slingmodels.components.v1.map;

import lombok.Getter;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling Model for component c19-map lottie model.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class LottieAnimationModel {

  /**
   * Variable storing json file path.
   */
  @ValueMapValue
  private String jsonFilePath;

  /**
   * Variable storing assets folder path.
   */
  @ValueMapValue
  private String assetsFolderPath;

  /**
   * Variable for alt.
   */
  @ValueMapValue
  private String alt;

  /**
   * Variable storing loop.
   */
  @ValueMapValue
  private boolean loop;

  /**
   * Variable storing autoplay.
   */
  @ValueMapValue
  private boolean autoplay;
}
