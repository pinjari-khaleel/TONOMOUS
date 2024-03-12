package com.tonomus.core.slingmodels.components.v1.downloads;

import lombok.Getter;

import java.util.List;

import com.tonomus.core.slingmodels.common.v1.DownloadModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for c-30 downloads.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class DownloadItemsModel {

  /**
   * Title.
   */
  @ValueMapValue
  private String title;

  /**
   * Download items.
   */
  @ChildResource
  private List<DownloadModel> items;
}
