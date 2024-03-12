package com.tonomus.core.slingmodels.components.v1.cardslider;

import lombok.Getter;

import com.google.gson.Gson;
import com.tonomus.core.slingmodels.common.v1.ButtonModel;
import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.common.v1.TextModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Card modal' model for c90 card slider.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CardSliderModal {

  /**
   * Card Modal heading.
   */
  @ChildResource
  private TextModel heading;

  /**
   * Card Modal Image.
   */
  @ChildResource
  private ImageModel image;

  /**
   * Card Modal text.
   */
  @ValueMapValue
  private String copy;

  /**
   * Button on modal.
   */
  @ChildResource
  private ButtonModel modalButton;

  /**
   * Returns this object as Json.
   * @return json string.
   */
  public String toJson() {
    return new Gson().toJson(this);
  }

}
