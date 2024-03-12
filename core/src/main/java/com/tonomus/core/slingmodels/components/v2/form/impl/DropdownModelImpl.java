package com.tonomus.core.slingmodels.components.v2.form.impl;

import java.util.List;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.via.ResourceSuperType;

import com.adobe.cq.wcm.core.components.models.form.Options;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tonomus.core.slingmodels.components.v2.form.DropdownModel;
import com.tonomus.core.utils.JsonUtils;

import lombok.Getter;

@Getter
@Model(adaptables = { SlingHttpServletRequest.class, Resource.class }, adapters = { DropdownModel.class,
    Options.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class DropdownModelImpl implements DropdownModel, Options {

  @Self
  @Via(type = ResourceSuperType.class)
  private Options options;

  @ValueMapValue
  private String text;

  @ValueMapValue
  private String value;

  @ValueMapValue
  private boolean selected;

  @ValueMapValue
  private boolean disabled;

  @ValueMapValue(name = "jcr:title")
  private String title;

  @ValueMapValue
  private String name;

  @ValueMapValue
  private String helpMessage;

  @ValueMapValue
  private boolean required;

  @ValueMapValue
  private String requiredMessage;

  @ChildResource
  private List<DropdownModel> dynamicDropdown;

  @ChildResource(name = "dynamicDropdown")
  private DropdownModel dropdown;
}
