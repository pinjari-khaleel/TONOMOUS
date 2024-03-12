package com.tonomus.core.slingmodels.components.v2.form.impl;

import lombok.Getter;

import com.adobe.cq.wcm.core.components.models.form.Options;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tonomus.core.slingmodels.components.v2.form.DropdownModel;
import com.tonomus.core.slingmodels.components.v2.form.MultiDropdownModel;
import com.tonomus.core.utils.JsonUtils;

import java.util.List;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.via.ResourceSuperType;

@Getter
@Model(adaptables = SlingHttpServletRequest.class, 
  adapters = MultiDropdownModel.class, 
  resourceType = MultiDropdownModelImpl.RESOURCE_TYPE, 
  defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class MultiDropdownModelImpl implements MultiDropdownModel{

  public static final String RESOURCE_TYPE = "tonomus/components/content/components/form/multidropdown/v2/multidropdown";

  @Self
  @Via(type = ResourceSuperType.class)
  private Options options;

  @ChildResource(name = "items")
  private List<DropdownModel> dropdownOptions;

  @ValueMapValue
  private boolean required;

  @ValueMapValue
  private String requiredMessage;

  @JsonIgnore
  public String getItemsJson() {
    return JsonUtils.serialize(dropdownOptions);
  }

}
