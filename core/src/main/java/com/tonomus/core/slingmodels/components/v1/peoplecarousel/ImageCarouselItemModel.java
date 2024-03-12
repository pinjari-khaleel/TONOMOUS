package com.tonomus.core.slingmodels.components.v1.peoplecarousel;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

import java.util.Objects;
import java.util.Optional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.wcm.core.components.models.ListItem;
import com.day.cq.commons.jcr.JcrConstants;
import com.tonomus.core.slingmodels.common.v1.ImageModel;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

/**
 * Re-usable model for item of a Carousel that contain image and thumbnail.
 */
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
          extensions = ExporterConstants.SLING_MODEL_EXTENSION)
@Getter
@Model(adaptables = Resource.class,
       cache = true,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@NoArgsConstructor
public class ImageCarouselItemModel implements ListItem {

  /**
   * Property for a card title.
   */
  private static final String PN_PANEL_TITLE = "cq:panelTitle";

  /**
   * Pagination thumbnail.
   */
  @ChildResource
  private ImageModel thumbnail;

  /**
   * Image.
   */
  @ChildResource
  private ImageModel image;

  /**
   * Component id for displaying in Core Components panel container.
   *
   * @noinspection PackageAccessibility
   */
  @Getter(onMethod = @__(@Override))
  @Setter(AccessLevel.PACKAGE)
  private String id;

  /**
   * Panel node name if we need to use this item to inject this child resource to container in HTL.
   *
   * @noinspection PackageAccessibility
   */
  @Getter(onMethod = @__(@Override))
  @Setter(AccessLevel.PRIVATE)
  private String name;

  /**
   * Card / panel title, person name in case of C86 People Carousel.
   *
   * @noinspection PackageAccessibility
   */
  @Getter(onMethod = @__(@Override))
  @Setter(AccessLevel.PRIVATE)
  private String title;

  /**
   * Inject constructor.
   *
   * @param resource the current resource
   */
  @Inject public ImageCarouselItemModel(@SlingObject final Resource resource) {
    name = resource.getName();
    final ValueMap properties = resource.getValueMap();
    title = Optional.ofNullable(properties.get(PN_PANEL_TITLE, String.class))
        .orElseGet(() -> properties.get(JcrConstants.JCR_TITLE, String.class));
  }

  /**
   * Construct from a ListItem instance. We copy only necessary properties, image sources are empty
   * in this case. It is a workaround for the case when not Business Card panel was placed to the
   * carousel.
   *
   * @param listItem list of items
   */
  public ImageCarouselItemModel(@NonNull final ListItem listItem) {
    this.setId(listItem.getId());
    this.setName(listItem.getName());
    this.setTitle(listItem.getTitle());
    ensureRequiredFields();
    updateAltFromTitle();
  }

  /**
   * Post constructor initialization.
   */
  @PostConstruct private void initImageCarouselCard() {
    // To avoid NPE if the component is not authored
    ensureRequiredFields();

    // Image is required field in the dialog, so we can update not configured thumbnail source from
    // the image
    if (StringUtils.isBlank(getThumbnail().getSrc())) {
      getThumbnail().setSrc(getImage().getSrc());
    }

    // Alt is required attribute for the img tag, so if it is not configured update it from title
    updateAltFromTitle();
  }

  /**
   * Create image fields to avoid NPE if we set alt property from.
   */
  private void ensureRequiredFields() {
    if (Objects.isNull(this.image)) {
      this.image = new ImageModel();
    }
    if (Objects.isNull(this.thumbnail)) {
      this.thumbnail = new ImageModel();
    }
  }

  /**
   * Sets the image alt property from the panel title or {@link ListItem#getTitle()}
   * property.
   */
  private void updateAltFromTitle() {
    final String alt = getTitle();
    if (StringUtils.isNotBlank(alt)) {
      if (StringUtils.isBlank(getImage().getAlt())) {
        getImage().setAlt(alt);
      }
      if (StringUtils.isBlank(getThumbnail().getAlt())) {
        getThumbnail().setAlt(alt);
      }
    }
  }
}
