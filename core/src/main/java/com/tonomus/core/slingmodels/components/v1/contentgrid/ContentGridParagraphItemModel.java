package com.tonomus.core.slingmodels.components.v1.contentgrid;

import lombok.Getter;

import java.util.List;

import javax.annotation.PostConstruct;

import com.tonomus.core.slingmodels.common.v1.ButtonModel;
import com.tonomus.core.slingmodels.common.v1.ComponentBackgroundModel;
import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.common.v1.TextModel;
import com.tonomus.core.utils.MediaUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for c24/m18 paragraph item model.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ContentGridParagraphItemModel extends ContentGridBaseItemModel {

  /**
   * Image content.
   */
  @ChildResource
  private ContentGridParagraphItemContent content;

  /**
   * Image.
   */
  @ChildResource
  private ComponentBackgroundModel background;

  /**
   * Class for c24/m18 paragraph item content model.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class ContentGridParagraphItemContent {
    /**
     * Icon.
     */
    @ValueMapValue
    private String icon;
    /**
     * Image.
     */
    @ChildResource
    private ImageModel image;
    /**
     * Header's eyebrow.
     */
    @ChildResource
    private TextModel eyebrow;
    /**
     * Header's heading.
     */
    @ChildResource
    private TextModel heading;

    /**
     * Size.
     */
    @ValueMapValue
    private String size;
    /**
     * Copy.
     */
    @ValueMapValue
    private String copy;

    /**
     * Buttons.
     */
    @ChildResource
    private List<ButtonModel> buttons;

    /**
     * Button type.
     */
    @ValueMapValue
    private String buttonType;

    /**
     * Paragraph moustache.
     */
    @ChildResource
    private TextModel moustache;

    /**
     * Asset align.
     */
    @ValueMapValue
    private String alignAsset;


    /**
     * init.
     */
    @PostConstruct void init() {
      if (buttons != null) {
        buttons.forEach(this::processButton);
      }
    }

    /**
     * Processing individual buttons in context of DAM/YouTube video support.
     *
     * @param button button
     */
    private void processButton(ButtonModel button) {
      if (button != null && !MediaUtils.isVideoNotPresent(button.getVideo())) {
        button.setAttrs("data-play-button");
      }
    }
  }
}
