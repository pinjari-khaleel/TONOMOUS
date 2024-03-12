package com.tonomus.core.slingmodels.components.v2.search;

import java.util.List;

public interface SearchModel {

  public List<SearchModelImpl.KeywordModel> getSuggestedKeywords();

  public String getActionPath();
}
