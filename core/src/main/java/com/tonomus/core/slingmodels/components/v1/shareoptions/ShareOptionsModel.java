package com.tonomus.core.slingmodels.components.v1.shareoptions;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.ResourceBundle;

import javax.annotation.PostConstruct;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tonomus.core.constants.Constants;
import com.tonomus.core.slingmodels.common.v1.EventTrackingModel;
import com.tonomus.core.slingmodels.common.v1.TextModel;
import com.tonomus.core.utils.LangUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.i18n.ResourceBundleProvider;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.Self;

/**
 * Class for c44 article content.
 *
 * @param <T> tag
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ShareOptionsModel<T extends EventTrackingModel> {

  /**
   * Share Options Heading.
   */
  @Setter
  @ChildResource
  private TextModel heading;

  /**
   * Event tracking.
   */
  @Setter
  @ChildResource
  private T eventTracking;

  /**
   * List of Share Options items.
   */
  @Setter
  private List<ShareOptionsItem> items;


  /**
   * i18nProvider.
   */
  @JsonIgnore
  @OSGiService(filter = Constants.I18N_PROVIDER_SERVICE_TARGET)
  private transient ResourceBundleProvider i18nProvider;

  /**
   * The current component resource.
   */
  @JsonIgnore
  @Self
  private transient Resource currentResource;

  /**
   * Post construct init method.
   */
  @PostConstruct
  private void init() {
    Locale locale = LangUtils.getCurrentLocale(currentResource);
    ResourceBundle i18nBundle = i18nProvider.getResourceBundle(locale);
    if (Objects.nonNull(heading) && Objects.nonNull(heading.getText())) {
      heading.setText(LangUtils.getI18nStringOrKey(i18nBundle, heading.getText()));
    }
  }
}
