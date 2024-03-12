package com.tonomus.core.slingmodels.components.v1.shareoptions;

import lombok.Getter;
import lombok.Setter;

import com.tonomus.core.slingmodels.common.v1.EventTrackingModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

/**
 * Class for Generic type of Sharing(c25).
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class GenericShareOptionsModel
    extends ShareOptionsModel<GenericShareOptionsModel.GenericShareEventTrackingModel> {


  /**
   * Event tracking model as generic.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class GenericShareEventTrackingModel extends EventTrackingModel {
    /**
     * Article stuff.
     */
    @Setter
    private String linkUrl;
  }
}
