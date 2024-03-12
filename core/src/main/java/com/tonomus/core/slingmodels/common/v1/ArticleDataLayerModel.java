package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;
import lombok.Setter;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class model for Article DataLayer.
 */
@Getter
@Setter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ArticleDataLayerModel {

  /**
   * Variable for title.
   */
  @ValueMapValue
  private String title;

  /**
   * Variable for title in English.
   */
  @ValueMapValue
  private String titleInEnglish;

  /**
   * Variable for author.
   */
  @ValueMapValue
  private String author;

  /**
   * Variable for publishingDate.
   */
  @ValueMapValue
  private String publishingDate;
}
