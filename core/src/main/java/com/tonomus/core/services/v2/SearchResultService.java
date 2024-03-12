package com.tonomus.core.services.v2;

import org.apache.sling.api.resource.ResourceResolver;

import com.google.gson.JsonObject;

public interface SearchResultService {

  public static final String TOTAL_RESULT_COUNT_PARAM = "totalResults";

  /**
   * For FULL TEXT search
   * path=/content/tonomus/<extract the locale ie. en-us/ar-sa from <Accept-Language>
   * type=cq:Page (fix)
   * 1_property=jcr:content/cq:template (fix)
   * 1_property.value=/conf/tonomus/settings/wcm/templates/generic-template (fix)
   * fulltext=@param path
   * orderby=cq:lastModified (fix)
   * p.limit=-1 (fix)
   * p.hits=full (fix)
   * p.guessTotal=true (fix)
   *
   * @param resourceResolver
   * @param text
   * @param path
   * @return
   */
  JsonObject searchResultFullTextOnPDFAssetsAndPages(ResourceResolver resourceResolver, String text, String path);

}
