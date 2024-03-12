package com.tonomus.core.slingmodels.components.v2.form;

import com.adobe.cq.wcm.core.components.models.form.Button;

public interface ButtonModel {

  public boolean isRecaptchaEnabled();
  public Button getButton();
  public boolean isRecaptchaConfigured();
  public String getRecaptchaSiteKey();
}
