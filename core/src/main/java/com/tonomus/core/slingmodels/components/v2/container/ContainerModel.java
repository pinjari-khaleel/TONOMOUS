package com.tonomus.core.slingmodels.components.v2.container;

import com.adobe.cq.wcm.core.components.models.LayoutContainer;
import com.tonomus.core.slingmodels.common.v1.LinkModel;

public interface ContainerModel extends LayoutContainer {

  public String getTitle();
  public LinkModel getAction();
  public LayoutContainer getLayoutContainer();

}
