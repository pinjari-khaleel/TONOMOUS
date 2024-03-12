package com.tonomus.core.slingmodels.components.v2.cardwithicon;

import com.adobe.cq.wcm.core.components.models.Teaser;
import com.tonomus.core.slingmodels.common.v1.LinkModel;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.via.ResourceSuperType;

/**
 * Class for Card With Icon component.
 */
@Getter
@Model(adaptables = SlingHttpServletRequest.class,
        adapters = CardWithIconModel.class,
        resourceType = CardWithIconModelImpl.RESOURCE_TYPE,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CardWithIconModelImpl implements CardWithIconModel {

  public static final String RESOURCE_TYPE = "tonomus/components/content/components/card-with-icon/v2/card-with-icon";

  @Self
  @Via(type = ResourceSuperType.class)
  private Teaser teaser;

  @ChildResource
  private LinkModel href;

  @ValueMapValue
  private String icon;

  public LinkModel getHref() {
    return href;
  }

  public String getIcon() {
    return icon;
  }
}