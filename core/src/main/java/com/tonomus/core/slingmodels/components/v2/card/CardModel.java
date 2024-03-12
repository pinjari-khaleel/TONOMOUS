package com.tonomus.core.slingmodels.components.v2.card;

import com.adobe.cq.wcm.core.components.models.Teaser;
import com.tonomus.core.slingmodels.components.v2.video.VideoModel;

public interface CardModel extends Teaser {

  public VideoModel getVideo();
  public Teaser getTeaser();
  public String getHtml();
  public String getImageFileReference();
}
