package com.tonomus.core.slingmodels.components.v2.video;

import com.adobe.cq.wcm.core.components.models.Embed;

public interface VideoModel extends Embed {

  public Embed getEmbed();
  public String getSrc();
  public boolean isAutoplay();
  public boolean isMuted();
  public String getVideoType();
  public boolean isLoop();
  public String getPoster();
  public String getMediaType();
}
