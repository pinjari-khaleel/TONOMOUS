package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;
import lombok.NonNull;

import java.util.Optional;

import javax.inject.Inject;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Back button link model.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class BackButtonLinkModel {

  /**
   * Link label.
   */
  private String label;

  /**
   * Reference page.
   */
  private String href;

  /**
   * Constructor.
   *
   * @param label label for button link
   * @param href optional reference to the parent page
   * @param currentResource current resource
   */
  @Inject
  public BackButtonLinkModel(
      @ValueMapValue(name = "label") String label,
      @ValueMapValue(name = "href") String href,
      @SlingObject Resource currentResource
  ) {
    this.href = Optional.ofNullable(href)
        .filter(StringUtils::isNotBlank)
        .orElseGet(() -> getParentPagePath(currentResource));
    this.label = Optional.ofNullable(label)
        .filter(StringUtils::isNotBlank)
        .orElseGet(() -> getParentPageTitle(currentResource));
  }

  /**
   * Get path to the parent page.
   * @param resource current resource
   * @return parent page's path
   */
  private static String getParentPagePath(@NonNull Resource resource) {
    return Optional.ofNullable(resource.getResourceResolver().adaptTo(PageManager.class))
        .map(pageManager -> pageManager.getContainingPage(resource))
        .map(Page::getParent)
        .map(Page::getPath)
        .orElseThrow(() -> new IllegalArgumentException("Unable to determine parent page"));
  }

  /**
   * Get path to the parent page title.
   * @param resource current resource
   * @return parent page's path
   */
  private static String getParentPageTitle(@NonNull Resource resource) {
    return "Return to " + Optional.ofNullable(resource.getResourceResolver().adaptTo(PageManager.class))
        .map(pageManager -> pageManager.getContainingPage(resource))
        .map(Page::getParent)
        .map(Page::getTitle)
        .orElseThrow(() -> new IllegalArgumentException("Unable to determine parent page title"));
  }

}
