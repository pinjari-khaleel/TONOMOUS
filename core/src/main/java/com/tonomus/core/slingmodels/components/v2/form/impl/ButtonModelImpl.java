package com.tonomus.core.slingmodels.components.v2.form.impl;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.via.ResourceSuperType;

import com.adobe.cq.wcm.core.components.models.form.Button;
import com.tonomus.core.services.v2.TonomusRecaptchaConfigService;
import com.tonomus.core.slingmodels.components.v2.form.ButtonModel;

import lombok.AccessLevel;
import lombok.Getter;

@Getter
@Model(adaptables = Resource.class, adapters = { Button.class,
    ButtonModel.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ButtonModelImpl implements ButtonModel, Button {

  public static final String RESOURCE_TYPE = "tonomus/components/content/components/form/button/v2/button";

  @Self
  @Via(type = ResourceSuperType.class)
  private Button button;

  @ValueMapValue(name = "recaptcha")
  private boolean recaptchaEnabled;

  @Getter(AccessLevel.NONE)
  @OSGiService
  private TonomusRecaptchaConfigService tonomusRecaptchaConfigService;

  public boolean isRecaptchaConfigured() {
    return tonomusRecaptchaConfigService.isNotEmpty();
  }

  public String getRecaptchaSiteKey() {
    return recaptchaEnabled ? tonomusRecaptchaConfigService.getSiteKey() : null;
  }
  
}
