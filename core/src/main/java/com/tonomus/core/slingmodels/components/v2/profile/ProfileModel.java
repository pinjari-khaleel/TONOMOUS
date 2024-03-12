package com.tonomus.core.slingmodels.components.v2.profile;

import java.util.List;

import com.adobe.cq.wcm.core.components.models.Teaser;

public interface ProfileModel extends Teaser {

  public List<String> getIcons();
  public Teaser getTeaser();

}
