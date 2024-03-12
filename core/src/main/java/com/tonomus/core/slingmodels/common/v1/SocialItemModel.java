package com.tonomus.core.slingmodels.common.v1;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

/**
 * Sling model for m12-social molecule.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Model(adaptables = {Resource.class},
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class SocialItemModel {

  /**
   * Variable for items in social block.
   */
  @ChildResource
  @Setter(value = AccessLevel.PROTECTED)
  private List<SocialModel> items;

}
