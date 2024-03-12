package com.tonomus.core.slingmodels.components.v1.footer;

import lombok.Getter;

import java.util.Calendar;
import java.util.List;

import javax.annotation.PostConstruct;

import com.tonomus.core.slingmodels.common.v1.LinkModel;
import com.tonomus.core.slingmodels.common.v1.SocialModel;
import com.tonomus.core.utils.CommonUtils;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import static com.tonomus.core.constants.Constants.COPYRIGHT;

/**
 * Class for s02 footer.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class FooterModel {

  /**
   * Copyright Text.
   */
  @ValueMapValue
  private String copyrightText;

  /**
   * Social Section Text.
   */
  @ValueMapValue
  private String socialSectionText;

  /**
   * Copyright Text.
   * Copyright site name.
   */
  @ValueMapValue
  private String copyrightSiteName;

  /**
   * Recaptcha Text.
   */
  @ValueMapValue
  private String recaptcha;

  /**
   * Links.
   */
  @ChildResource
  private List<LinkModel> links;

  /**
   * List of sitemap items.
   */
  @ChildResource
  private List<FooterSitemapItemsModel> sitemapItems;

  /**
   * List of social items.
   */
  private List<SocialModel> socialItems;

  /**
   * Paths to social items content fragments.
   */
  @ValueMapValue
  private String[] socialPaths;

  /**
   * The current component resource.
   */
  @Self
  private Resource currentResource;

  /**
   * Post Construct init method.
   */
  @PostConstruct
  private void init() {
    if (StringUtils.isNotBlank(copyrightSiteName)) {
      copyrightText = COPYRIGHT + StringUtils.SPACE + Calendar.getInstance().get(Calendar.YEAR) + StringUtils.SPACE
              + copyrightSiteName;
    }

    socialItems = CommonUtils.getSocialMediaFromContentFragments(currentResource, socialPaths);
  }
}
