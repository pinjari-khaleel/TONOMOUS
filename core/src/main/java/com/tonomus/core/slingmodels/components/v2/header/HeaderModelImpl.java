package com.tonomus.core.slingmodels.components.v2.header;

import lombok.Getter;

import java.util.List;

import javax.annotation.PostConstruct;

import com.adobe.cq.wcm.core.components.models.Navigation;
import com.day.cq.wcm.api.Page;
import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.common.v1.LinkModel;
import com.tonomus.core.slingmodels.components.v1.navigation.LanguageModel;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.via.ResourceSuperType;

/**
 * Class for Header component.
 */
@Getter
@Model(adaptables = SlingHttpServletRequest.class, 
  adapters = HeaderModel.class, 
  resourceType = HeaderModelImpl.RESOURCE_TYPE,
  defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class HeaderModelImpl implements HeaderModel {

  public static final String RESOURCE_TYPE = "tonomus/components/content/components/header/v2/header";

  @Self
  @Via(type = ResourceSuperType.class)
  private Navigation navigation;

  @ScriptVariable
  private Page currentPage;

  @ChildResource
  private List<LanguageModel> languageNavigation;

  @ChildResource
  private ImageModel logoImage;

  @ChildResource
  private LinkModel link;

  @PostConstruct
  public void init() {
    String currentLanguage = currentPage.getLanguage(false).getLanguage();
    if (languageNavigation != null)
      languageNavigation.forEach(languageModel -> {
        if (StringUtils.equalsIgnoreCase(currentLanguage, languageModel.getLanguageCode())) {
          languageModel.setActive(true);
        }
      });
  }

  @ValueMapValue
  private String idLangNav;

  @ValueMapValue
  private String accessibilityLabelLangNav;
}
