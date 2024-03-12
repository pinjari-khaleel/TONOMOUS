package com.tonomus.core.slingmodels.components.v1.contentgrid;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.util.Iterator;

import javax.annotation.PostConstruct;

import com.tonomus.core.constants.NumberConstants;
import com.tonomus.core.slingmodels.common.v1.ComponentBackgroundModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import static com.day.cq.commons.jcr.JcrConstants.NT_UNSTRUCTURED;
import static java.util.Objects.nonNull;

/**
 * Class for c24 content.
 */
@Getter
@Slf4j
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ContentGridModel {

  /**
   * Variant.
   */
  @ValueMapValue
  @Setter(value = AccessLevel.PROTECTED)
  private String variant;

  /**
   * Content width.
   */
  @ValueMapValue
  @Default(values = "small")
  private String contentWidth;

  /**
   * maxAllowedItemCount.
   */
  @Setter(value = AccessLevel.PROTECTED)
  private int maxAllowedItemsCount;

  /**
   * itemsCount.
   */
  @Setter(value = AccessLevel.PROTECTED)
  private int itemsCount;

  /**
   * Background of the component.
   */
  @ChildResource
  private ComponentBackgroundModel background;

  /**
   * Inject self Resource.
   */
  @Self
  private Resource currentResource;

  /**
   * init.
   */
  @PostConstruct
  protected void init() {
    if (nonNull(variant)) {
      maxAllowedItemsCount = NumberConstants.ZERO;
      if (variant.startsWith("single") || "fullWidth".equals(variant)) {
        maxAllowedItemsCount = NumberConstants.ONE;
      } else if (variant.startsWith("double")) {
        maxAllowedItemsCount = NumberConstants.TWO;
      } else if (variant.startsWith("triple")) {
        maxAllowedItemsCount = NumberConstants.THREE;
      } else if (variant.startsWith("quad")) {
        maxAllowedItemsCount = NumberConstants.FOUR;
      }
      itemsCount = getChildrenCount();
    }
  }

  /**
   * Calculating children count.
   * @return count
   */
  protected int getChildrenCount() {
    int count = 0;
    Iterator<Resource> it = currentResource.listChildren();
    while (it.hasNext()) {
      Resource res = it.next();
      if (!NT_UNSTRUCTURED.equals(res.getResourceType())) {
        count++;
      }
    }
    return count;
  }

  /**
   * Calculating first subcomponent.
   * @return count
   */
  protected Resource getFirstChildComponentResource() {
    Iterator<Resource> it = currentResource.listChildren();
    while (it.hasNext()) {
      Resource res = it.next();
      if (!NT_UNSTRUCTURED.equals(res.getResourceType())) {
        return res;
      }
    }
    return null;
  }
}
