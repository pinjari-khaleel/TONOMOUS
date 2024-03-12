package com.tonomus.core.slingmodels.components.v2.form.impl;

import lombok.Getter;

import com.adobe.cq.wcm.core.components.models.form.Text;
import com.tonomus.core.slingmodels.components.v2.form.TextModel;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.via.ResourceSuperType;

@Getter
@Model(adaptables = SlingHttpServletRequest.class, 
  adapters = TextModel.class, 
  resourceType = TextModelImpl.RESOURCE_TYPE, 
  defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TextModelImpl implements TextModel {

  public static final String RESOURCE_TYPE = "tonomus/components/content/components/form/text/v2/text";

  @Self
  @Via(type = ResourceSuperType.class)
  private Text text;

  @ValueMapValue
  private String placeholder;

}
