package com.tonomus.core.slingmodels.components.v1;


import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import java.util.Locale;
import java.util.Objects;
import java.util.ResourceBundle;

import javax.annotation.PostConstruct;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tonomus.core.config.SocialOptions;
import com.tonomus.core.constants.Constants;
import com.tonomus.core.slingmodels.common.v1.TextModel;
import com.tonomus.core.slingmodels.components.v1.shareoptions.GenericShareOptionsModel;
import com.tonomus.core.slingmodels.components.v1.shareoptions.ShareOptionsModel;
import com.tonomus.core.utils.CommonUtils;
import com.tonomus.core.utils.JsonUtils;
import com.tonomus.core.utils.LangUtils;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.i18n.ResourceBundleProvider;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Base class sling model for share.
 */
@Getter

@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class BaseShareModel {

  /**
   * Add Share Options checkbox.
   */
  @ValueMapValue
  private boolean addShareOptions;

  /**
   * Disable Event Tracking.
   */
  @ValueMapValue
  private boolean disableEventTracking;

  /**
   * Share Options.
   */
  @ChildResource
  @Setter(value = AccessLevel.PROTECTED)
  private ShareOptionsModel shareOptions;

  /**
   * The current component resource.
   */
  @Self
  private Resource currentResource;

  /**
   * i18nProvider.
   */
  @JsonIgnore
  @OSGiService(filter = Constants.I18N_PROVIDER_SERVICE_TARGET)
  private ResourceBundleProvider i18nProvider;

  /**
   * Json with Share Options data.
   * @return Json representation.
   */
  @JsonIgnore
  public String getShareOptionsJson() {
    if (Objects.isNull(shareOptions) || CollectionUtils.isEmpty(shareOptions.getItems())) {
      return "";
    }
    return JsonUtils.serialize(shareOptions);
  }

  /**
   * init.
   */
  @PostConstruct
  void initialize() {
    if (addShareOptions) {
      createShareOptions();
    }
  }

  /**
   * Method for creating a sharing functionality.
   */
  private void createShareOptions() {
    String pagePath = CommonUtils.getFullPagePath(currentResource);

    Locale locale = LangUtils.getCurrentLocale(currentResource);
    ResourceBundle i18nBundleObject = i18nProvider.getResourceBundle(locale);

    processEventTracking();

    SocialOptions socialOptions = currentResource.adaptTo(SocialOptions.class);
    if (Objects.nonNull(socialOptions)) {
      shareOptions.setItems(socialOptions.getShareOptions(pagePath, i18nBundleObject));
    }
  }

  /**
   * Method for processing event tracking.
   */
  protected void processEventTracking() {
    String pagePath = CommonUtils.getFullPagePath(currentResource);
    Locale locale = LangUtils.getCurrentLocale(currentResource);
    ResourceBundle i18nBundleObject = i18nProvider.getResourceBundle(locale);

    //located here as set to GenericShareOptionsModel, and overriden with
    //ArticleShareOptionsModel in ArticleContentModel
    if (Objects.isNull(shareOptions)) {
      shareOptions = new GenericShareOptionsModel();
      shareOptions.setHeading(new TextModel());
      shareOptions.getHeading().setText(LangUtils.getI18nStringOrKey(i18nBundleObject,
          Constants.SHARE_PAGE));
    }

    GenericShareOptionsModel.GenericShareEventTrackingModel eventTrackingModel =
        new GenericShareOptionsModel.GenericShareEventTrackingModel();
    // Need Empty object in FE to consume.
    if (!disableEventTracking) {
      eventTrackingModel.setLinkUrl(pagePath);
      eventTrackingModel.setEvent("share_page");
    }

    shareOptions.setEventTracking(eventTrackingModel);
  }
}
