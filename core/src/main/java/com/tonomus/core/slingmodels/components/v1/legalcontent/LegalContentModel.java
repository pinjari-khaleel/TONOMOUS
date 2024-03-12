package com.tonomus.core.slingmodels.components.v1.legalcontent;

import lombok.Getter;

import java.util.List;

import com.tonomus.core.slingmodels.analytics.ButtonEventTracking;
import com.tonomus.core.slingmodels.components.v1.accordion.AccordionItem;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.Self;

/**
 * Class for c37 Legal Content.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class LegalContentModel {

  /**
   * Accordion object.
   */
  @ChildResource
  private Accordion accordion;

  /**
   * Event tracking info.
   */
  @Self
  private ButtonEventTracking eventTracking;

  /**
   * Class for accordion.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class Accordion {

    /**
     * List of accordion items.
     */
    @ChildResource
    private List<AccordionItem> items;
  }
}
