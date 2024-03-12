package com.tonomus.core.slingmodels.components.v1.shareoptions;

import lombok.Getter;
import lombok.Setter;

import com.tonomus.core.slingmodels.common.v1.ArticleDataLayerModel;
import com.tonomus.core.slingmodels.common.v1.EventTrackingModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

/**
 * Class for c44 article content.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ArticleShareOptionsModel extends ShareOptionsModel<ArticleShareOptionsModel.ArticleEventTrackingModel> {


  /**
   * Event tracking model for Article.
   */
  @Getter
  @Model(adaptables = Resource.class,
          defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class ArticleEventTrackingModel extends EventTrackingModel {
    /**
     * Article stuff.
     */
    @Setter
    @ChildResource
    private ArticleDataLayerModel article;
  }
}
