package com.tonomus.core.slingmodels.components.v2.form.impl;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import com.adobe.cq.wcm.core.components.models.form.Container;
import com.day.cq.wcm.api.Page;
import com.tonomus.core.constants.Constants;
import com.tonomus.core.servlets.forms.v2.FormServlet;
import com.tonomus.core.slingmodels.components.v2.form.ContainerModel;

import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.via.ResourceSuperType;

@Getter
@Model(adaptables = SlingHttpServletRequest.class, 
  adapters = {ContainerModel.class, Container.class}, 
  resourceType = ContainerModelImpl.RESOURCE_TYPE, 
  defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ContainerModelImpl implements ContainerModel, Container {

  public static final String RESOURCE_TYPE = "tonomus/components/content/components/form/container/v2/container";

  @Self
  @Via(type = ResourceSuperType.class)
  private Container container;

  @ValueMapValue
  private String description;

  @ValueMapValue
  private String title;

  @ValueMapValue
  private String pretitle;

  @Getter(AccessLevel.NONE)
  @SlingObject
  private Resource resource;

  @Getter(AccessLevel.NONE)
  @ScriptVariable
  private Page currentPage;

  @Setter
  private String actionPath;

  @ValueMapValue(name = "redirectPath")
  private String redirect;

  @Setter
  private String languageCode;

  @PostConstruct void init() {
    setActionPath(resource.getResourceResolver().map(resource.getPath()) + Constants.DOT + FormServlet.EXTENSION);
    setLanguageCode(currentPage.getLanguage(false).getLanguage());
  }

}
