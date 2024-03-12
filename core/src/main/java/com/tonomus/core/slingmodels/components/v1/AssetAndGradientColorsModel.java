package com.tonomus.core.slingmodels.components.v1;


import lombok.Getter;

import java.util.List;
import java.util.Optional;

import javax.annotation.PostConstruct;

import com.tonomus.core.utils.JsonUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for Asset and Gradient Colors Model.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class AssetAndGradientColorsModel {
  /**
   * Asset's path.
   */
  @ValueMapValue
  private String asset;

  /**
   * List of colors.
   */
  @ValueMapValue
  private List<String> gradientColors;

  /**
   * Colors string.
   */
  private String gradientColorsString;

  /**
   * Post construction.
   */
  @PostConstruct
  private void init() {
    gradientColorsString =
        Optional.ofNullable(gradientColors).map(gc -> JsonUtils.serialize(gradientColors))
            .orElse(null);
  }

}

