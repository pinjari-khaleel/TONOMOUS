package com.tonomus.core.slingmodels.components.v1.cardlist;

import lombok.Getter;

import java.util.List;

import com.tonomus.core.slingmodels.common.v1.ButtonModel;
import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.common.v1.TextModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for c82 card content.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CardContentModel {

  /**
   * Item heading text.
   */
  @ChildResource
  private TextModel heading;

  /**
   * Item description.
   */
  @ValueMapValue
  private String description;

  /**
   * Rich text Copy.
   */
  @ValueMapValue
  private String copy;

  /**
   * Image model.
   */
  @ChildResource
  private ImageModel image;

  /**
   * List of buttons.
   */
  @ChildResource
  private List<ButtonModel> buttons;

}
