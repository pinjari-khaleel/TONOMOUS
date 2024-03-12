package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;

import java.util.Objects;
import java.util.Optional;

import javax.annotation.PostConstruct;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.RequestAttribute;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;

import static com.tonomus.core.constants.Constants.RESPONSIVE_GRID_PATH;
import static com.tonomus.core.constants.NumberConstants.TWO;

/**
 * This model computes resource Path from the configuration pages.
 */
@Model(adaptables = {SlingHttpServletRequest.class},
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ConfigResourceModel {

  /**
   * Inject the resourceType that needs to be fetched form a Page.
   */
  @RequestAttribute
  private String resourceType;

  /**
   * Inject the page path where resource exists.
   */
  @RequestAttribute
  private String configPage;

  /**
   * Inject the configPagePath is Relative Path.
   */
  @RequestAttribute
  @Default(booleanValues = false)
  private boolean isRelativePath;

  /**
   * Variable for current Page.
   */
  @ScriptVariable
  private Page currentPage;

  /**
   * Injects the ResourceResolver.
   */
  @ScriptVariable
  private ResourceResolver resolver;

  /**
   * Injects the PageManager.
   */
  @ScriptVariable
  private PageManager pageManager;

  /**
   * This variable holds the configured resource path.
   */
  @Getter
  private String resourcePath = "";

  /**
   * Init method to get the details of resource.
   */
  @PostConstruct protected void init() {

    Resource resource = Optional.of(isRelativePath).map(x -> currentPage.getAbsoluteParent(TWO))
        .map(home -> home.adaptTo(Resource.class)).map(res -> resolver.getResource(res, configPage))
        .orElse(resolver.getResource(configPage));

    Page containingPage = pageManager.getContainingPage(resource);

    if (Objects.nonNull(containingPage) && StringUtils.isNotBlank(resourceType)) {
      Iterable<Resource> children =
          containingPage.getContentResource(RESPONSIVE_GRID_PATH).getChildren();
      for (Resource res : children) {
        if (res.isResourceType(resourceType)) {
          resourcePath = res.getPath();
          break;
        }
      }
    }
  }
}
