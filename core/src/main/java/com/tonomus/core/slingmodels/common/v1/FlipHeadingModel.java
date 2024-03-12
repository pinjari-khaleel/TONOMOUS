package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;
import lombok.Setter;

import java.util.Arrays;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import static java.util.Objects.nonNull;

/**
 * Alternative variant for HeaderModel.heading.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class FlipHeadingModel {

  /**
   * Variable storing prefix.
   */
  @Setter
  @ValueMapValue
  private String prefix;

  /**
   * Variable storing list of labels to pass to HTL.
   */
  private List<String> labels;

  /**
   * Authored array of labels.
   */
  @ValueMapValue
  private String[] labelsArray;

  /**
   * Variable storing size.
   */
  @ValueMapValue
  private String size;

  /**
   * Variable storing element.
   */
  @ValueMapValue
  private String element;

  /**
   * Post Construct method.
   */
  @PostConstruct
  private void init() {
    if (nonNull(labelsArray) && labelsArray.length > 0) {
      labels = Arrays.asList(labelsArray);
    }
  }
}
