package com.tonomus.core.slingmodels.components.v1.peoplecarousel;

import lombok.Getter;
import lombok.experimental.Delegate;
import lombok.extern.slf4j.Slf4j;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ContainerExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.wcm.core.components.models.Carousel;
import com.tonomus.core.constants.Constants;
import com.tonomus.core.slingmodels.common.v1.TextModel;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.via.ResourceSuperType;
import org.apache.sling.models.factory.ModelFactory;

/**
 * Sling model for C86 People Carousel.
 * Can be used with small modifications for any carousels / tabs / accordions that display
 * thumbnails instead of content titles.
 */
@Model(adaptables = SlingHttpServletRequest.class,
       adapters = {ImageCarouselModel.class, Carousel.class, ComponentExporter.class, ContainerExporter.class},
       cache = true,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL,
       resourceType = ImageCarouselModel.RESOURCE_TYPE)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
          extensions = ExporterConstants.SLING_MODEL_EXTENSION)
@Slf4j
public class ImageCarouselModel implements Carousel {

  /**
   * Resource type for this model.
   */
  static final String RESOURCE_TYPE = Constants.C86_RESOURCE_TYPE;

  /**
   * The component heading rich text.
   */
  @Getter
  @ChildResource
  private TextModel heading;

  /**
   * Core Components Carousel model injection.
   */
  @Delegate
  @Self
  @Via(type = ResourceSuperType.class)
  private Carousel coreCarousel;

  /**
   * List of child BusinessCard items.
   */
  @Getter
  private List<ImageCarouselItemModel> thumbnailItems;

  /**
   * The current resource resolver.
   */
  @SlingObject
  private ResourceResolver resourceResolver;

  /**
   * The model factory.
   */
  @OSGiService
  private ModelFactory modelFactory;

  /**
   * Post constructor initializer.
   */
  @PostConstruct void initImageCarouselModel() {
    // To make the Core Components' carousel functionalities working, item should have such
    // properties as id, name, title.
    // To make m55 Image Pagination html working, item should contain thumbnail or image property.
    // So we're creating our own models from the default items and set up those properties.
    this.thumbnailItems = Optional.ofNullable(this.coreCarousel)
        .map(injectedCarousel -> injectedCarousel.getItems().stream()
            .map(listItem -> Optional.ofNullable(listItem.getPath())
                .map(resourceResolver::getResource)
                .filter(childResource ->
                    modelFactory.canCreateFromAdaptable(childResource, ImageCarouselItemModel.class))
                .map(childResource -> {
                  final ImageCarouselItemModel createdModel =
                      modelFactory.createModel(childResource, ImageCarouselItemModel.class);
                  createdModel.setId(listItem.getId());
                  return createdModel;
                })
                    // Adapting is not possible - create a new instance of card
                .orElseGet(() -> new ImageCarouselItemModel(listItem))).collect(Collectors.toList()))
        .orElse(Collections.emptyList());

    // Cleanup
    this.resourceResolver = null;
    this.modelFactory = null;
  }
}
