package com.tonomus.core.slingmodels.components.v2.marquee;

import java.util.List;

import com.tonomus.core.slingmodels.common.v1.ImageModel;

public interface MarqueeModel {

  public List<ImageModel> getImages();

  public String getId();

  public String getAccessibilityLabel();
}
