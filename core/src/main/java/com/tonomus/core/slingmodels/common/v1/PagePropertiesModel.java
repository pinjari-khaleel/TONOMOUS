package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.util.Objects;
import java.util.Optional;

import javax.annotation.PostConstruct;

import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.tonomus.core.constants.Constants;
import com.tonomus.core.utils.LinkUtils;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.RequestAttribute;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;

import static com.day.cq.wcm.api.constants.NameConstants.PN_NAV_TITLE;


/**
 * This class facilitate the Page Properties for a provide page Path or by adapting to a Resource.
 */
@Slf4j
@Getter
@Model(adaptables = {Resource.class, SlingHttpServletRequest.class},
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class PagePropertiesModel {

  /**
   * variable holds the page Path that needs to be injected from HTL.
   */
  @RequestAttribute
  private String pagePath;

  /**
   * Variable for current Page.
   */
  @ScriptVariable
  private Page currentPage;

  /**
   * Injects the PageManager.
   */
  @ScriptVariable
  private PageManager pageManager;

  /**
   * Variable to store the adapted Page Resource.
   */
  @Self
  private Resource adaptedPageResource;

  /**
   * Variable holds feature image path of the page.
   */
  private String featureImage;

  /**
   * Variable holds navigation image path of the page.
   */
  private String navImage;

  /**
   * Variable hold the feature Image path of the page for responsive devices.
   */
  private String mobileNavImage;

  /**
   * Variable holds title of the page.
   */
  @Setter
  private String title;

  /**
   * Variable holds navigation title of the page.
   */
  @Setter
  private String navTitle;

  /**
   * Variable hold the description of the page.
   */
  @Setter
  private String description;

  /**
   * Variable hold the ContentResource Object of the injected page path via HTL.
   */
  private Resource contentResource;

  /**
   * Variable hold the url.
   */
  private String url;

  /**
   * Variable to hold the hideInNav flag.
   */
  private boolean hideInNav;

  /**
   * init method for slingModel.
   */
  @PostConstruct protected void init() {

    ValueMap valueMap = ValueMap.EMPTY;

    // when the Model will be adapted from slingRequest, the ScriptVariable PageManager will be
    // non null. and details will be fetched form the injected Page.
    if (Objects.nonNull(pageManager)) {
      Page page = Optional.ofNullable(pageManager.getContainingPage(pagePath)).orElse(currentPage);
      this.contentResource = page.getContentResource();
      valueMap = page.getProperties();
      this.url = LinkUtils.getUrlWithExtension(page.getPath());
    } else {
      // when the Model will be adapted from the resource.
      this.contentResource = adaptedPageResource.getChild(JcrConstants.JCR_CONTENT);
      valueMap =
          Optional.ofNullable(this.contentResource).map(Resource::getValueMap).orElse(valueMap);
      this.url = LinkUtils.getUrlWithExtension(adaptedPageResource.getPath());
    }

    this.title = valueMap.get(JcrConstants.JCR_TITLE, String.class);
    this.description = valueMap.get(JcrConstants.JCR_DESCRIPTION, String.class);
    this.navTitle = valueMap.get(PN_NAV_TITLE, String.class);
    this.hideInNav = valueMap.get(Constants.HIDE_IN_NAV, Boolean.FALSE);

    /**
     * This below block is used to assign external link for the page in aem, Depending on the
     * external url configured at page_properties of a page
     * If not configured it will be page path by default.
     */
    Optional.ofNullable(valueMap.get(Constants.PAGE_EXTERNAL_URL)).filter(Objects::nonNull)
        .ifPresent(extUrl -> this.url = LinkUtils.getUrlWithExtension(Objects.toString(extUrl)));

  }
}

