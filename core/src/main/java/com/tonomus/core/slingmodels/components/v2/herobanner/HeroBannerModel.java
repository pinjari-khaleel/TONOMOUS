package com.tonomus.core.slingmodels.components.v2.herobanner;

import java.util.List;

import com.adobe.cq.wcm.core.components.models.Teaser;

public interface HeroBannerModel extends Teaser {

  public List<DescriptionModel> getDescriptions();
  public Teaser getTeaser();

}
