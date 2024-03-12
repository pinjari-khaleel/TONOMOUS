package com.tonomus.core.slingmodels.components.v2.horizontaltabs;

import com.adobe.cq.wcm.core.components.models.Tabs;
import com.tonomus.core.slingmodels.common.v1.LinkModel;

public interface HorizontalTabsModel extends Tabs {

  public String getTitle();
  public Tabs getTabs();
  public String getDescription();
  public LinkModel getAction();
  
}
