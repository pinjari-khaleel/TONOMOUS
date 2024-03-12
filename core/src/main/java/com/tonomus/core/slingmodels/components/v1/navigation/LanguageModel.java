package com.tonomus.core.slingmodels.components.v1.navigation;

import lombok.Getter;
import lombok.Setter;

import com.tonomus.core.slingmodels.common.v1.LinkModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling Model describing single language.
 */
@Getter
@Model(adaptables = {Resource.class},
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class LanguageModel extends LinkModel {

  /**
   * Language code (en, ru, etc.).
   */
  @ValueMapValue
  private String languageCode;

  /**
   * Language short label.
   */
  @ValueMapValue
  private String shortLabel;

  /**
   * Variable storing link is active or not.
   */
  @Setter
  private boolean active;

  /**
   * Flag indicating that language belongs to the list of priority languages.
   */
  @ValueMapValue
  private boolean priorityLanguage;
}
