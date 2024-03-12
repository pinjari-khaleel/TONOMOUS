package com.tonomus.core.slingmodels.components.v1.peoplecarousel;

import lombok.Getter;

import javax.inject.Inject;

import com.adobe.cq.export.json.ExporterConstants;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling model for Business Card internal component (item of the C86 People Carousel).
 */
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
          extensions = ExporterConstants.SLING_MODEL_EXTENSION)
@Getter
@Model(adaptables = Resource.class,
       cache = true,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL,
       resourceType = BusinessCardModel.RESOURCE_TYPE)
public class BusinessCardModel extends ImageCarouselItemModel {

  /**
   * Resource type for this model.
   */
  static final String RESOURCE_TYPE =
      "tonomus/components/content/components/c86-people-carousel/v1/business-card";

  /**
   * LinkedIn URL.
   */
  @ValueMapValue
  private String linkedin;

  /**
   * Person job description.
   */
  @ChildResource
  private JobDescription job;

  /**
   * Person biography rich text.
   */
  @ValueMapValue
  private String biography;

  /**
   * Inject constructor.
   *
   * @param resource the current Business Card resource
   */
  @Inject
  public BusinessCardModel(@SlingObject final Resource resource) {
    super(resource);
  }
}
