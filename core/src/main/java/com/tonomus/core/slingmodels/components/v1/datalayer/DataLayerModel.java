package com.tonomus.core.slingmodels.components.v1.datalayer;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.Date;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.inject.Named;

import com.day.cq.wcm.api.constants.NameConstants;
import com.day.cq.wcm.api.Page;
import com.tonomus.core.config.GenericSiteConfig;
import com.tonomus.core.constants.Constants;
import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.utils.CommonUtils;

import org.apache.commons.collections4.IterableUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.oak.commons.PathUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import static com.adobe.aem.wcm.seo.SeoTags.PN_ROBOTS_TAGS;
import static com.tonomus.core.constants.Constants.COMMA;
import static com.tonomus.core.constants.Constants.SLASH;
import static com.tonomus.core.constants.NumberConstants.TWO;
import static java.util.Objects.nonNull;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

/**
 * Data object for data layer.
 */
@Slf4j
@Getter
@Model(adaptables = {SlingHttpServletRequest.class, Resource.class},
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class DataLayerModel {

  /**
   * Variable for current Page.
   */
  @ScriptVariable
  private Page currentPage;

  /**
   * Variable for current Resource.
   */
  @SlingObject
  private Resource currentResource;

  /**
   * Site Section.
   */
  @ValueMapValue
  private String siteSection;

  /**
   * English Title.
   */
  @ValueMapValue
  private String englishTitle;

  /**
   * Image.
   */
  @Setter
  @ChildResource
  private ImageModel image;

  /**
   * Meta Page Type.
   */
  private String metaPageType;

  /**
   * Last modified Date.
   */
  @ValueMapValue
  @Named(NameConstants.PN_PAGE_LAST_MOD)
  private Date lastModified;

  /**
   * URL.
   */
  private String url;

  /**
   * Locale.
   */
  private String locale;

  /**
   * Site.
   */
  private String site;

  /**
   * Canonical URL.
   */
  private String canonicalUrl;

  /**
   * Page Type. For MVP there will only be one page type.
   */
  private final String pageType = Constants.PAGE;

  /**
   * Facebook domain verification value for <meta> tag.
   */
  private String facebookDomainVerification;

  /**
   * Adobe Launch configuration value for neom-launch-head.html scripts.
   */
  private String adobeLaunchConfiguration;

  /**
   * Adobe Launch JS script in order to manage flicker is enabled.
   */
  private boolean adobeLaunchAsyncScriptEnable;

  /**
   * Delay in milliseconds for Adobe Launch JS code (the default value is 3000 ms).
   */
  private String delay;

  /**
   * GTM ID value for neom-gtm-head.html script.
   */
  private String gtmId;

  /**
   * GTM ID related to the lightweight GA4 property.
   */
  private String lightGtmId;

  /**
   * Subdomain.
   */
  private String subDomain;

  /**
   * Value for tag meta with name 'lytics:topics'.
   */
  private String metaLyticsTopics;

  /**
   * Default robots tags.
   */
  private String defaultRobotsTags;

  /**
   * CQ robots tags.
   */
  private String robotsTags;



  /**
   * Generic Site Configuration.
   */
  @Getter(AccessLevel.NONE)
  private GenericSiteConfig siteConfig;

  /**
   * init method.
   */
  @PostConstruct private void init() {
    site = CommonUtils.getSiteDomainName(currentPage);
    defaultRobotsTags = CommonUtils.getDefaultRobotsTags(currentPage);
    subDomain = CommonUtils.getSiteRootPath(currentResource).replace("/content/", "");
    // Read the site domain from Externalizer
    if (!StringUtils.startsWith(currentPage.getPath(), "/conf")) {
      String path = currentResource.getParent().getPath();
      String urlPath = path.replaceAll("/content/([^/]+)([^.]*)", "$2");
      url = Constants.HTTPS + site + path;
      canonicalUrl = Constants.HTTPS + site + urlPath;
      locale = IterableUtils.toList(PathUtils.elements(currentPage.getPath())).get(TWO);

      setImageMetaData();
      siteConfig = getSiteConfig();
      if (siteConfig == null) {
        log.info("Generic site config not found!");
        return;
      }
      facebookDomainVerification = readGenericSiteProperty(GenericSiteConfig::getFacebookDomainVerification);
      adobeLaunchConfiguration = readGenericSiteProperty(GenericSiteConfig::getAdobeLaunchConfiguration);
      adobeLaunchAsyncScriptEnable = siteConfig.isAdobeLaunchAsyncScriptEnable();
      delay = readGenericSiteProperty(GenericSiteConfig::getDelay);
      gtmId = readGenericSiteProperty(GenericSiteConfig::getGtmId);
      lightGtmId = readGenericSiteProperty(GenericSiteConfig::getLightGtmId);

      metaLyticsTopics = Optional.ofNullable(currentPage.getProperties())
          .map(props -> props.get("metaLyticsTopics", String.class))
          .filter(StringUtils::isNotBlank).orElse(null);
      if (isBlank(metaLyticsTopics) && isNotBlank(urlPath) && urlPath.length() > 1) {
        metaLyticsTopics = Arrays.stream(urlPath.split(SLASH))
            .filter(StringUtils::isNotBlank)
            .collect(Collectors.joining(" | "));
      }

      String[] robotsTagsArray = currentPage.getProperties().get(PN_ROBOTS_TAGS, String[].class);
      if (nonNull(robotsTagsArray)) {
        if (Arrays.stream(robotsTagsArray).noneMatch(r -> r.equals("noindex") || r.equals("nofollow"))
            && isNotBlank(defaultRobotsTags)) {
          robotsTags = StringUtils.join(robotsTagsArray, COMMA) + COMMA + defaultRobotsTags;
        } else {
          robotsTags = StringUtils.join(robotsTagsArray, COMMA);
        }
      } else {
        robotsTags = defaultRobotsTags;
      }
    }
  }

  /**
   * Creates Generic Site Configuration bу adapting Resource.
   *
   * @return GenericSiteConfig object
   */
  private GenericSiteConfig getSiteConfig() {
    return currentResource.adaptTo(GenericSiteConfig.class);
  }

  /**
   * Method reads string property using getter for generic site configuration.
   *
   * @param getterFunction - functional interface for getters associated with {@code GenericSiteConfig}.
   * @return string representation of the property or null if value is not set
   */
  private String readGenericSiteProperty(final Function<GenericSiteConfig, String> getterFunction) {
    return Optional.ofNullable(siteConfig).map(getterFunction).filter(StringUtils::isNotBlank).orElse(null);
  }

  /**
   * Set metadata for image and type.
   */
  private void setImageMetaData() {
    metaPageType = Constants.WEBSITE;
  }
}
