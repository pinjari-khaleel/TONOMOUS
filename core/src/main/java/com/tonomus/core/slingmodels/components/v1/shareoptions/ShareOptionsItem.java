package com.tonomus.core.slingmodels.components.v1.shareoptions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

/**
 * Class for c44 Article Content.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ShareOptionsItem {

  /**
   * Network API URL.
   */
  private String href;

  /**
   * Network id.
   */
  private String id;

  /**
   * Network Label.
   */
  private String label;

  /**
   * Network Icon.
   */
  private String icon;
}
