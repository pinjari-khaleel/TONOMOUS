package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;

import java.util.List;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for m02-button molecule.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ModalModel {

  /**
   * Header's heading.
   */
  @ChildResource
  private TextModel heading;

  /**
   * Variable for copy text.
   */
  @ValueMapValue
  private String copy;

  /**
   * Image.
   */
  @ChildResource
  private ImageModel image;

  /**
   * Variable for buttons.
   */
  @ChildResource
  private List<ButtonModel> buttons;

  /**
   * Variable for social block.
   */
  @ChildResource
  private SocialItemModel social;


}
