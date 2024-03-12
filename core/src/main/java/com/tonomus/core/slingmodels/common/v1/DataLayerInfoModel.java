package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;
import lombok.Setter;

import javax.annotation.PostConstruct;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import static java.util.Objects.isNull;

/**
 * Class model for store titles for DataLayer.
 */
@Getter
@Setter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class DataLayerInfoModel {

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
   * Variable for src.
   */
  @ValueMapValue
  private String src;

  /**
   * init method for slingModel.
   */
  @PostConstruct private void init() {
    if (isNull(title)) {
      title = titleInEnglish;
    }
  }
}
