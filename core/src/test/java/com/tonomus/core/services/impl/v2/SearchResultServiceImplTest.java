package com.tonomus.core.services.impl.v2;

import java.util.ArrayList;
import java.util.List;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.Page;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;

import junitx.util.PrivateAccessor;

import static com.tonomus.core.services.v2.SearchResultService.TOTAL_RESULT_COUNT_PARAM;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SearchResultServiceImplTest {

  private SearchResultServiceImpl service;

  private QueryBuilder queryBuilder;

  private ResourceResolver resourceResolver;

  private Session session;

  private Query query;

  private SearchResult result;

  private List<Hit> pageResults;

  private Hit pageResult;
  
  private Resource resource;

  @BeforeEach
  void setUp() throws NoSuchFieldException {
    service = new SearchResultServiceImpl();
    queryBuilder = mock(QueryBuilder.class);
    resourceResolver = mock(ResourceResolver.class);
    session = mock(Session.class);
    query = mock(Query.class);
    result = mock(SearchResult.class);
    pageResults = mock(new ArrayList<Hit>().getClass());
    pageResult = mock(Hit.class);
    resource = mock(Resource.class);

    PrivateAccessor.setField(service, "queryBuilder", queryBuilder);
    
  }

  @Test
  void testSearchResult_withZeroResults() {
    when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
    doReturn(query).when(queryBuilder).createQuery(any(), any(Session.class));
    when(query.getResult()).thenReturn(result);
    when(result.getTotalMatches()).thenReturn(Long.valueOf(0));

    JsonObject jsonObject = service.searchResultFullTextOnPDFAssetsAndPages(resourceResolver, "test", "en-us");
    assertNotNull(jsonObject);
    assertEquals(new JsonPrimitive(0), jsonObject.get(TOTAL_RESULT_COUNT_PARAM));
  }

  @Test
  void testSearchResult_withPageResults() throws RepositoryException {
    when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
    doReturn(query).when(queryBuilder).createQuery(any(), any(Session.class));
    when(query.getResult()).thenReturn(result);
    when(result.getTotalMatches()).thenReturn(Long.valueOf(2));
    pageResults = new ArrayList<>();
    pageResults.add(pageResult);
    pageResults.add(pageResult);
    when(result.getHits()).thenReturn(pageResults);

    Page page = mock(Page.class);
    when(pageResult.getResource()).thenReturn(resource);
    when(resource.adaptTo(Page.class)).thenReturn(page);
   
    when(page.getPath()).thenReturn("/somepath");
    when(page.getDescription()).thenReturn("some desc");
    when(page.getTitle()).thenReturn("Some Title");
    
    JsonObject jsonObject = service.searchResultFullTextOnPDFAssetsAndPages(resourceResolver, "test", "en-us");
    assertNotNull(jsonObject);
    assertEquals(new JsonPrimitive(2), jsonObject.get(TOTAL_RESULT_COUNT_PARAM));
  }

}