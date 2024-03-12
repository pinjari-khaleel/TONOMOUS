package com.tonomus.core.slingmodels.components.v1.tonomus_navigation;

import lombok.Getter;

import java.util.List;

import javax.annotation.PostConstruct;

import com.day.cq.wcm.api.Page;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.common.v1.LinkModel;
import com.tonomus.core.slingmodels.components.v1.navigation.LanguageModel;
import com.tonomus.core.utils.JsonUtils;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;


/**
 * Class for S11 Tonomus Navigation model.
 */
@Getter
@Model(adaptables = SlingHttpServletRequest.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TonomusNavigationModel {

  /**
   * Nav Links.
   */
  @ChildResource
  private List<LinkModel> navLinks;

  /**
   * Language and Language Code.
   */
  @ChildResource
  private List<LanguageModel> languages;

  /**
   * Logo Image.
   */
  @ChildResource
  private ImageModel logoImage;

  /**
   * Logo Link.
   */
  @ChildResource
  private LinkModel link;

  /**
   * Dropdown Label.
   */
  @ValueMapValue
  private String dropDownLabel;

  /**
   * Desktop Only.
   */
  @ValueMapValue
  private boolean desktopOnly;

  /**
   * Go Home (Go Back) link.
   */
  @ChildResource
  private LinkModel backItem;

  /**
   * Highlighted Link.
   */
  @ChildResource
  private LinkModel highlightedLink;

  /**
   * Variable for current Page.
   */
  @ScriptVariable
  private Page currentPage;

  /**
   * ItemsJson method for serialize nav item list.
   *
   * @return json representation.
   */
  @JsonIgnore
  public String getNavJson() {
    return JsonUtils.serialize(navLinks);
  }

  /**
   * init method for slingModel.
   */
  @PostConstruct public void init() {
    String currentLanguage = currentPage.getLanguage(false).getLanguage();
    languages.forEach(languageModel -> {
      if (StringUtils.equalsIgnoreCase(currentLanguage, languageModel.getLanguageCode())) {
        languageModel.setActive(true);
      }
    });
  }
}
