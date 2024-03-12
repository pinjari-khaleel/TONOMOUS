package com.tonomus.core.slingmodels.components.v1.article_meta;

import lombok.Getter;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

/**
 * Class for c91 Article Meta Model.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ArticleMetaModel {
  /**
   * Article's datetime.
   */
  @ChildResource
  private ValueAndTextModel datetime;

  /**
   * Article's duration.
   */
  @ChildResource
  private ValueAndTextModel duration;
}
