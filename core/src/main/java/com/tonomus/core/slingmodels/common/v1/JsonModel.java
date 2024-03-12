package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;

import java.util.Optional;

import javax.inject.Inject;

import com.tonomus.core.utils.JsonUtils;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.RequestAttribute;

/**
 * Json model.
 */
@Model(adaptables = SlingHttpServletRequest.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
public class JsonModel {

  /**
   * Json string.
   */
  private String json;

  /**
   * Constructor.
   * @param input input object
   */
  @Inject
  public JsonModel(
      @RequestAttribute(name = "input") final Object input
  ) {
    json = Optional.ofNullable(input)
        .map(JsonUtils::serialize)
        .orElse(StringUtils.EMPTY);
  }

}
