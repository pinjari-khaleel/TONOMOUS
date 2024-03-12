package com.tonomus.core.slingmodels.components.v1.tonomusfooter;

import lombok.Getter;

import com.tonomus.core.slingmodels.common.v1.LogoModel;
import com.tonomus.core.slingmodels.components.v1.footer.FooterModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for s10 tonomus footer.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TonomusFooterModel extends FooterModel {

  /**
   * Social Items Section Title.
   */
  @ValueMapValue
  private String socialItemsTitle;

  /**
   * Logo.
   */
  @ChildResource
  private LogoModel logo;

}
