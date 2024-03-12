package com.tonomus.core.slingmodels.components.v1.article_meta;

import lombok.Getter;

import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.common.v1.TextModel;
import com.tonomus.core.slingmodels.components.v1.BaseShareModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for c91 Article Model.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ArticleModel extends BaseShareModel {

  /**
   * Article Meta.
   */
  @ChildResource
  private ArticleMetaModel meta;

  /**
   * Article Image.
   */
  @ChildResource
  private ImageModel image;

  /**
   * Article's heading.
   */
  @ChildResource
  private TextModel heading;

  /**
   * Article Content.
   */
  @ValueMapValue
  private String content;
}
