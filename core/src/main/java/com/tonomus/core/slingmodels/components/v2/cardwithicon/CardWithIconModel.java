package com.tonomus.core.slingmodels.components.v2.cardwithicon;

import com.adobe.cq.wcm.core.components.models.Teaser;
import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.common.v1.LinkModel;

public interface CardWithIconModel extends Teaser {

  public Teaser getTeaser();

  public LinkModel getHref();

  public String getIcon();

}
