package com.tonomus.core.models.dmedia;

import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

/**
 * DynamicMediaRenditionModel.
 */
@Getter
@EqualsAndHashCode
public class DynamicMediaRenditionModel {

  /**
   * srcSet.
   */
  private List<SrcSetItem> srcSet;

  /**
   * width.
   */
  private long width;

  /**
   * Constructor.
   * @param srcSet srcSet
   * @param width width
   */
  public DynamicMediaRenditionModel(final List<SrcSetItem> srcSet, final long width) {
    this.srcSet = List.copyOf(srcSet);
    this.width = width;
  }

  public String getSrcSetUrl() {
    return srcSet.stream().map(SrcSetItem::getSrcUrl).collect(Collectors.joining(","));
  }
}
