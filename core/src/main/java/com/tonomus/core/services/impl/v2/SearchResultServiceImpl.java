package com.tonomus.core.services.impl.v2;

import static com.day.cq.dam.api.DamConstants.DC_DESCRIPTION;
import static com.day.cq.dam.api.DamConstants.DC_FORMAT;
import static com.day.cq.dam.api.DamConstants.DC_TITLE;
import static com.day.cq.dam.api.DamConstants.METADATA_FOLDER;
import static com.day.cq.wcm.api.constants.NameConstants.NN_CONTENT;
import static com.day.cq.wcm.api.constants.NameConstants.NN_TEMPLATE;
import static com.day.cq.wcm.api.constants.NameConstants.NT_PAGE;
import static com.day.cq.wcm.api.constants.NameConstants.PN_PAGE_LAST_MOD;
import static com.day.cq.wcm.api.constants.NameConstants.PN_TAGS;
import static com.tonomus.core.constants.Constants.AT_SIGN;
import static com.tonomus.core.constants.Constants.DAM_ASSET;
import static com.tonomus.core.constants.Constants.DOT;
import static com.tonomus.core.constants.Constants.ERROR_SEARCHRESULTSERVICE;
import static com.tonomus.core.constants.Constants.PDF_MIMETYPE;
import static com.tonomus.core.constants.Constants.SLASH;
import static com.tonomus.core.constants.Constants.TONOMUS_CONTENT_PATH;
import static com.tonomus.core.constants.Constants.TONOMUS_DAM_PATH;
import static com.tonomus.core.constants.Constants.TRUE;
import static com.tonomus.core.constants.Constants.UNDERSCORE;
import static com.tonomus.core.constants.NumberConstants.NEGATIVE_ONE_LONG;
import static com.tonomus.core.constants.NumberConstants.ONE;
import static com.tonomus.core.constants.NumberConstants.TWO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.day.cq.dam.api.Asset;
import com.day.cq.search.Predicate;
import com.day.cq.search.PredicateConverter;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.eval.FulltextPredicateEvaluator;
import com.day.cq.search.eval.JcrPropertyPredicateEvaluator;
import com.day.cq.search.eval.PathPredicateEvaluator;
import com.day.cq.search.eval.TypePredicateEvaluator;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.Page;
import com.drew.lang.annotations.NotNull;
import com.drew.lang.annotations.Nullable;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.tonomus.core.services.v2.SearchResultService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component(service = SearchResultService.class)
public class SearchResultServiceImpl implements SearchResultService {

  private static final String ROOT_LIMIT = PredicateConverter.GROUP_PARAMETER_PREFIX + DOT + Predicate.PARAM_LIMIT;

  private static final String ROOT_GUESSTOTAL = PredicateConverter.GROUP_PARAMETER_PREFIX + DOT
      + Predicate.PARAM_GUESS_TOTAL;

  private static final String ROOT_HITS = PredicateConverter.GROUP_PARAMETER_PREFIX + DOT + "hits";

  private static final String FULL = "full";

  private static final String UNDERSCORE_PROPERTY = UNDERSCORE + JcrPropertyPredicateEvaluator.PROPERTY;

  private static final String UNDERSCORE_PROPERTY_VALUE = UNDERSCORE + JcrPropertyPredicateEvaluator.PROPERTY + DOT
      + JcrPropertyPredicateEvaluator.VALUE;

  private static final String ORDERBY_SORT = Predicate.ORDER_BY + DOT + Predicate.PARAM_SORT;

  private static final String RESULTS = "results";

  private static final String PATH = "path";

  private static final String TITLE = "title";

  private static final String DESCRIPTION = "description";

  private static final String OR = "or";

  private static final String GROUP_ONE = DOT + ONE + UNDERSCORE + PredicateGroup.TYPE + DOT;

  private static final String GROUP_TWO = DOT + TWO + UNDERSCORE + PredicateGroup.TYPE + DOT;

  @Reference
  private QueryBuilder queryBuilder;

  /**
   * Execute FULL TEXT search
   * path=/content/tonomus/<extract the locale ie. en-us/ar-sa from
   * <Accept-Language>
   * 
   * fulltext=cognitive
   * p.limit=-1
   * p.hits=full
   * p.guessTotal=true
   * group.p.or=true
   * group.1_group.path=/content/tonomus/en-us
   * group.1_group.type=cq:Page
   * group.1_group.1_property=jcr:content/cq:template
   * group.1_group.1_property.value=/conf/tonomus/settings/wcm/templates/generic-template
   * group.2_group.path=/content/dam/tonomus
   * group.2_group.type=dam:Asset
   * group.2_group.1_property=jcr:content/metadata/dc:format
   * group.2_group.1_property.value=application/pdf
   * orderby=@jcr:content/cq:lastModified
   * orderby.sort=desc
   *
   * @param resourceResolver
   * @param text
   * @param path
   * @return
   */
  @Override
  public JsonObject searchResultFullTextOnPDFAssetsAndPages(ResourceResolver resourceResolver, String text,
      String locale) {
    return searchResult(resourceResolver, NEGATIVE_ONE_LONG,
        createFullTextSearchOnPDFAssetsAndPagesQuery(text, locale, null, true));
  }

  /**
   * Execute query to generate results based on queryMap
   * 
   * @param resourceResolver
   * @param text             fulltext pass via query parameter in request.
   * @param path
   * @param resultLimit
   * @param resultIndex
   * @param pageTemplate
   * @param tag
   * @param isDescending
   * @return
   */
  private JsonObject searchResult(ResourceResolver resourceResolver, Long resultLimit, Map<String, String> queryMap) {

    final Session session = resourceResolver.adaptTo(Session.class);
    Query query = queryBuilder.createQuery(PredicateGroup.create(queryMap), session);

    SearchResult searchResult = query.getResult();
    return populateResult(searchResult);
  }

  /**
   * Generate map query based on availble parameters.
   * 
   * @param fulltext
   * @param path
   * @param tag
   * @param isDescending
   * @return
   */
  private Map<String, String> createFullTextSearchOnPDFAssetsAndPagesQuery(@NotNull String fulltext,
      @NotNull String locale, @Nullable String tag, boolean isDescending) {

    /*
     * fulltext=cognitive
     * p.limit=-1
     * p.hits=full
     * p.guessTotal=true
     * group.p.or=true
     * group.1_group.path=/content/tonomus/en-us
     * group.1_group.type=cq:Page
     * group.1_group.1_property=jcr:content/cq:template
     * group.1_group.1_property.value=/conf/tonomus/settings/wcm/templates/generic-
     * template
     * group.2_group.path=/content/dam/tonomus
     * group.2_group.type=dam:Asset
     * group.2_group.1_property=jcr:content/metadata/dc:format
     * group.2_group.1_property.value=application/pdf
     * orderby=@jcr:content/cq:lastModified
     * orderby.sort=desc
     */

    Map<String, String> queryMap = new HashMap<>();
    queryMap.put(FulltextPredicateEvaluator.FULLTEXT, fulltext);
    queryMap.put(ROOT_LIMIT, Long.toString(NEGATIVE_ONE_LONG));
    queryMap.put(ROOT_HITS, FULL);
    queryMap.put(ROOT_GUESSTOTAL, TRUE);

    queryMap.put(PredicateGroup.TYPE + DOT + PredicateConverter.GROUP_PARAMETER_PREFIX + DOT+ OR, TRUE);
    queryMap.put(PredicateGroup.TYPE + GROUP_ONE + PathPredicateEvaluator.PATH, TONOMUS_CONTENT_PATH + SLASH + locale);
    queryMap.put(PredicateGroup.TYPE + GROUP_ONE + TypePredicateEvaluator.TYPE, NT_PAGE);
    if (StringUtils.isNotBlank(tag)) {
      queryMap.put(PredicateGroup.TYPE + GROUP_ONE + TWO + UNDERSCORE_PROPERTY, NN_CONTENT + SLASH + PN_TAGS);
      queryMap.put(PredicateGroup.TYPE + GROUP_ONE + TWO + UNDERSCORE_PROPERTY_VALUE, tag);
    }

    queryMap.put(PredicateGroup.TYPE + GROUP_TWO + PathPredicateEvaluator.PATH, TONOMUS_DAM_PATH + locale);
    queryMap.put(PredicateGroup.TYPE + GROUP_TWO + TypePredicateEvaluator.TYPE, DAM_ASSET);
    queryMap.put(PredicateGroup.TYPE + GROUP_TWO + ONE + UNDERSCORE_PROPERTY,
        NN_CONTENT + SLASH + METADATA_FOLDER + SLASH + DC_FORMAT);
    queryMap.put(PredicateGroup.TYPE + GROUP_TWO + ONE + UNDERSCORE_PROPERTY_VALUE, PDF_MIMETYPE);
    if (StringUtils.isNotBlank(tag)) {
      queryMap.put(PredicateGroup.TYPE + GROUP_TWO + TWO + UNDERSCORE_PROPERTY,
          NN_CONTENT + SLASH + METADATA_FOLDER + SLASH + PN_TAGS);
      queryMap.put(PredicateGroup.TYPE + GROUP_TWO + TWO + UNDERSCORE_PROPERTY_VALUE, tag);
    }

    queryMap.put(Predicate.ORDER_BY, AT_SIGN + NN_CONTENT + SLASH + PN_PAGE_LAST_MOD);
    queryMap.put(ORDERBY_SORT, isDescending ? Predicate.SORT_DESCENDING : Predicate.SORT_ASCENDING);

    return queryMap;
  }

  /**
   * Prepare the result for payload response.
   * 
   * @param result
   * @param resultLimit
   * @return
   */
  private JsonObject populateResult(final SearchResult result) {
    JsonObject searchResult = new JsonObject();
    JsonArray resultArray = new JsonArray();

    long totalResults = result.getTotalMatches();

    searchResult.addProperty(TOTAL_RESULT_COUNT_PARAM, totalResults);
    if (totalResults == 0)
      return searchResult;

    List<Hit> hits = result.getHits();

    hits.forEach(hit -> {
      try {
        JsonObject resultPage = new JsonObject();

        Page page = hit.getResource().adaptTo(Page.class);
        if (page != null) {
          resultPage.addProperty(PATH, page.getPath());
          resultPage.addProperty(TITLE, page.getTitle());
          resultPage.addProperty(DESCRIPTION, page.getDescription());
          resultArray.add(resultPage);
          return;
        } 

        Asset asset = hit.getResource().adaptTo(Asset.class);
        if (asset != null) {
          resultPage.addProperty(PATH, asset.getPath());
          resultPage.addProperty(TITLE, asset.getMetadataValueFromJcr(DC_TITLE));
          resultPage.addProperty(DESCRIPTION, asset.getMetadataValueFromJcr(DC_DESCRIPTION));
          resultArray.add(resultPage);
          return;
        }        

      } catch (RepositoryException e) {
        log.error(ERROR_SEARCHRESULTSERVICE + "Error occured while populating search results. {}", e.getMessage());
      }
    });
    searchResult.add(RESULTS, resultArray);

    return searchResult;
  }
}
