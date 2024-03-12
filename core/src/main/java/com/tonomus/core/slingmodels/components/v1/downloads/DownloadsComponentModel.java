package com.tonomus.core.slingmodels.components.v1.downloads;

import lombok.Getter;

import javax.annotation.PostConstruct;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.Self;

import static com.tonomus.core.constants.Constants.C45_COLUMN_RESOURCE_TYPE;
import static java.util.Objects.nonNull;

/**
 * Sling Model for the component c30-downloads .
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class DownloadsComponentModel {

  /**
   * DownloadItems model.
   */
  @ChildResource
  private DownloadItemsModel downloads;

  /**
   * Direction.
   */
  private String direction;

  /**
   * Inject self Resource.
   */
  @Self
  private Resource currentResource;

  /**
   * Post construct.
   */
  @PostConstruct
  private void init() {
    Resource parent = currentResource.getParent();
    if (nonNull(parent) && parent.isResourceType(C45_COLUMN_RESOURCE_TYPE)) {
      direction = "column";
    }
  }
}
