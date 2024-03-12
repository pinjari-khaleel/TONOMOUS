package com.tonomus.core.slingmodels.components.v2.search;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.tonomus.core.utils.ServletUtils;

@Getter
@Model(adaptables = Resource.class, 
  adapters = SearchModel.class, 
  resourceType = SearchModelImpl.RESOURCE_TYPE, 
  defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class SearchModelImpl implements SearchModel {

  public static final String RESOURCE_TYPE = "tonomus/components/content/components/search/v2/search";

  @ChildResource
  private List<KeywordModel> suggestedKeywords;

  @ValueMapValue
  private String id;

  @Setter
  private String actionPath;

  @SlingObject @Getter(AccessLevel.NONE)
  private Resource resource;

  @Setter
  private String acceptLanguage;

  @ValueMapValue
  private String resultMessage;

  @ValueMapValue
  private String noResultMessage;

  @PostConstruct void init() {
    setActionPath(resource.getResourceResolver().map(resource.getPath()));
    setAcceptLanguage(ServletUtils.extractLocale(resource.getPath()));
  }

  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class KeywordModel {

    @ValueMapValue
    private String keyword;
  }

}
