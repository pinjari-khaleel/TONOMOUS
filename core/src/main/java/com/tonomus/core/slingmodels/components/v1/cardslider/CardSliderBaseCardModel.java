package com.tonomus.core.slingmodels.components.v1.cardslider;

import lombok.Getter;
import lombok.experimental.Delegate;

import com.tonomus.core.slingmodels.common.v1.ButtonModel;
import com.tonomus.core.slingmodels.common.v1.CommonComponentModel;
import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.common.v1.LinkModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Base card model for c90 card slider.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CardSliderBaseCardModel {

  /**
   * Card type.
   */
  @ValueMapValue
  private String cardType;

  /**
   * Pass all the common component's fields to reduce number of models.
   */
  @Self
  @Delegate
  private CommonComponentModel commonComponentModel;


  /**
   * Card title.
   */
  @ValueMapValue
  private String title;

  /**
   * Card Image.
   */
  @ChildResource
  private ImageModel image;


  /**
   * Event date/time in string format.
   */
  @ValueMapValue
  private String datetime;

  /**
   * Card button.
   */
  @ChildResource
  private ButtonModel button;

  /**
   * Link.
   */
  @ChildResource
  private LinkModel link;

  /**
   * Meta.
   */
  @ValueMapValue
  private String meta;

  /**
   * Modal data.
   */
  @ChildResource
  private CardSliderModal modal;
}
