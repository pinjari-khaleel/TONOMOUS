package com.tonomus.core.slingmodels.components.v2.header;

import com.adobe.cq.wcm.core.components.models.Navigation;

public interface HeaderModel extends Navigation {

  public Navigation getNavigation();

  public String getIdLangNav();

  public String getAccessibilityLabelLangNav();
}
