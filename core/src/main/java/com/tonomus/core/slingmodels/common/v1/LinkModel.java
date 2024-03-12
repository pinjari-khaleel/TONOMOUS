package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.annotation.PostConstruct;

import com.tonomus.core.utils.LinkUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling model for m06-link molecule.
 */
@Getter
@Setter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@NoArgsConstructor
public class LinkModel {

  /**
   * Variable storing label value.
   */
  @ValueMapValue
  private String label;

  /**
   * Variable storing href value.
   */
  @ValueMapValue
  private String href;

  /**
   * Variable storing target value.
   */
  @ValueMapValue
  private String target;

  /**
   * Variable storing icon value.
   */
  @ValueMapValue
  private String icon;

  /**
   * Init method for sling model. Adds an extension to internal links.
   */
  @PostConstruct private void init() {
    href = LinkUtils.getUrlWithExtension(href);
  }
}
