package com.tonomus.core.slingmodels.analytics;

import lombok.Getter;

import javax.inject.Inject;
import javax.inject.Named;

import com.tonomus.core.models.viaproviders.parent.ComponentResource;
import com.tonomus.core.utils.AnalyticsConstants;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Button event tracking model.
 */
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
public class ButtonEventTracking extends EventTracking {

  /**
   * Custom id field name.
   */
  protected static final String ID_JSON_NAME = "componentId";

  /**
   * Custom id field name.
   * @return field name
   */
  @Override protected String getAttributeName() {
    return ID_JSON_NAME;
  }

  /**
   * Constructor.
   * @param enableTracking is tracking enabled
   * @param eventTrackingId user provided event tracking id
   * @param sha1Path hashed path
   * @param eventAction event action
   */
  @Inject
  public ButtonEventTracking(
      @Named(AnalyticsConstants.PN_ENABLE_TRACKING) @ValueMapValue boolean enableTracking,
      @Named(AnalyticsConstants.PN_EVENT_TRACKING_ID) @ValueMapValue String eventTrackingId,
      @ValueMapValue(name = AnalyticsConstants.SHA1_PATH)
      @Via(type = ComponentResource.class) String sha1Path,
      @ValueMapValue(name = AnalyticsConstants.PN_EVENT_ACTION) @Default(values = "") String eventAction
  ) {
    super(enableTracking, sha1Path, eventTrackingId, eventAction);
  }

}
