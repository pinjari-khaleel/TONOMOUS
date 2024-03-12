package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;
import lombok.Setter;

import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.ResourceBundle;

import javax.annotation.PostConstruct;

import com.tonomus.core.constants.Constants;
import com.tonomus.core.utils.CommonUtils;
import com.tonomus.core.utils.JsonUtils;
import com.tonomus.core.utils.LangUtils;
import com.tonomus.core.utils.MediaUtils;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.i18n.ResourceBundleProvider;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling Model for m05-download-item molecule.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class DownloadModel {

  /**
   * Constant 'Download - '.
   */
  private static final String DOWNLOAD_DASH = "Download - ";

  /**
   * i18n link title key.
   */
  private static final String I18N_DOWNLOAD_LINK_TITLE = "{0} file {1}";

  /**
   * Variable containing heading.
   */
  @Setter
  @ChildResource
  private TextModel heading;

  /**
   * Variable containing description.
   */
  @ValueMapValue
  private String description;

  /**
   * Variable containing image.
   */
  @ChildResource
  private ImageModel image;

  /**
   * Variable containing link for download.
   */
  @ChildResource
  private LinkModel link;

  /**
   * Event Tracking is enabled.
   */
  @ValueMapValue
  private boolean enabledEventTracking;

  /**
   * i18nProvider.
   */
  @OSGiService(filter = Constants.I18N_PROVIDER_SERVICE_TARGET)
  private ResourceBundleProvider i18nProvider;

  /**
   * The current component resource.
   */
  @Self
  private Resource currentResource;

  /**
   * Variable containing configurable event tracking JSON.
   */
  private EventTrackingModel eventTracking;

  /**
   * Get EventTracking as Json.
   *
   * @return json as string
   */
  public String getEventTrackingJson() {
    return Optional.ofNullable(eventTracking).map(JsonUtils::serialize).orElse(null);
  }

  /**
   * Init method to get the details of resource.
   */
  @PostConstruct protected void init() {
    description = CommonUtils.replaceWithHtmlTags(description);
    String title = null;
    if (Objects.nonNull(heading)) {
      title = heading.getText();
    }
    if (Objects.nonNull(image) && Objects.nonNull(title)) {
      image.setAlt(title);
    }
    if (enabledEventTracking && Objects.nonNull(link) && StringUtils.isNotBlank(link.getHref())) {
      Locale locale = LangUtils.getCurrentLocale(currentResource);
      ResourceBundle i18nBundle = i18nProvider.getResourceBundle(locale);
      String extension = MediaUtils.getFileExtension(link.getHref()).toUpperCase();
      initEventTracking(title, extension);
      initLink(LangUtils.getI18nStringOrKey(i18nBundle, extension), i18nBundle);
    }

    if (heading != null && heading.getElement() == null) {
      // for backward compatibility only
      heading.setElement("h3");
    }
  }

  /**
   * Initialize field EventTracking.
   * @param title title
   * @param extension file extension
   */
  private void initEventTracking(String title, String extension) {
    eventTracking = new EventTrackingModel();
    eventTracking.setEvent("download");
    eventTracking.setEventCategory("Download");
    eventTracking.setEventAction(DOWNLOAD_DASH + extension);
    if (Objects.nonNull(title)) {
      eventTracking.setEventLabel(DOWNLOAD_DASH + title);
    }
  }

  /**
   * Initialize link.
   * @param extension file extension
   * @param i18nBundle i18n bundle
   */
  private void initLink(String extension, final ResourceBundle i18nBundle) {
    String filesize = MediaUtils
        .getFileSizeAsString(currentResource.getResourceResolver(), link.getHref());

    String label = StringUtils
        .replaceEach(LangUtils.getI18nStringOrKey(i18nBundle, I18N_DOWNLOAD_LINK_TITLE),
            new String[] {"{0}", "{1}"}, new String[] {extension, filesize});
    link.setLabel(label);
  }
}
