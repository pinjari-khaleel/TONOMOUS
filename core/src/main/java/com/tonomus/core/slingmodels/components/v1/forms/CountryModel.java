package com.tonomus.core.slingmodels.components.v1.forms;

import lombok.Getter;
import lombok.NoArgsConstructor;

import com.adobe.cq.dam.cfm.ContentFragment;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tonomus.core.utils.LangUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Country model.
 */
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
@NoArgsConstructor
public class CountryModel {
  /**
   * Country code property name.
   */
  private static final String COUNTRY_CODE = "countryCode";

  /**
   * Phone code property name.
   */
  private static final String PHONE_CODE = "phoneCode";

  /**
   * Selected flag property name.
   */
  private static final String SELECTED = "selected";

  /**
   * Constructor to create Country from content fragment.
   *
   * @param contentFragment Flag Content Fragment.
   * @param localLanguage   Local language code.
   */
  public CountryModel(ContentFragment contentFragment, String localLanguage) {
    this.label =
        LangUtils.getLocalizedCountryName(contentFragment.getElement(COUNTRY_CODE).getContent(), localLanguage);
    this.value = contentFragment.getElement(PHONE_CODE).getContent();
    this.countryCode = contentFragment.getElement(COUNTRY_CODE).getContent();
    this.selected = Boolean.parseBoolean(contentFragment.getElement(SELECTED).getContent());
  }

  /**
   * Country name.
   */
  @ValueMapValue
  private String label;
  /**
   * Phone code.
   */
  @ValueMapValue
  private String value;
  /**
   * Country code.
   */
  @ValueMapValue
  private String countryCode;

  /**
   * Selected value.
   */
  @ValueMapValue
  private boolean selected;

  /**
   * Lower cased country code.
   * @return country code
   */
  @JsonIgnore public String getLowerCaseCode() {
    return countryCode.toLowerCase();
  }

}
