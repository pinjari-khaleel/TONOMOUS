package com.tonomus.core.slingmodels.components.v1.forms.multistep;

import lombok.Getter;

import javax.annotation.PostConstruct;

import com.tonomus.core.slingmodels.components.v1.forms.CountrySelectModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

/**
 * Sling Model for Oxagon phone field.
 */
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
public class MultiStepFormPhoneModel extends MultiStepFormTextModel {

  /**
   * Сountry selector.
   */
  @ChildResource
  private CountrySelectModel countrySelector;

  /**
   * PostConstruct (individual for this class).
   */
  @PostConstruct protected void initForOxagonFormPhoneModel() {
    setType("phone");
  }
}
