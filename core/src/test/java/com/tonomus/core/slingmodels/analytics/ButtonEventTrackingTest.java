package com.tonomus.core.slingmodels.analytics;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import org.apache.jackrabbit.oak.commons.PathUtils;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(AemContextExtension.class)
class ButtonEventTrackingTest {

  private static final String CONTENT_PATH = "/content/tonomus/en-us/suppliers";

  private static final String RESPONSIVE_GRID_PATH = PathUtils.concat(CONTENT_PATH + "/jcr:content"
      + "/root/responsivegrid");

  private static final String C22_WITH_SHA_PATH = PathUtils.concat(RESPONSIVE_GRID_PATH,
      "c22_hero_component_with_sha/buttons");

  private static final String C22_NO_SHA_PATH = PathUtils.concat(RESPONSIVE_GRID_PATH,
      "c22_hero_component_wo_sha/buttons");

  @BeforeEach void setUp(AemContext aemContext) {
    aemContext.load().json("/analytics/suppliers-page-button.json", CONTENT_PATH);
  }

  @Test
  void testModel_whenDisabled(AemContext aemContext) {
    final String path = PathUtils.concat(C22_WITH_SHA_PATH, "item1");
    Resource resource = aemContext.resourceResolver().getResource(path);
    ButtonEventTracking model = resource.adaptTo(ButtonEventTracking.class);
    assertFalse(model.isEnabled());
    assertNull(model.getData());
  }

  @Test
  void testModel_whenEnabledAndHashIsNotSet(AemContext aemContext) {
    final String path = PathUtils.concat(C22_NO_SHA_PATH, "item0");
    Resource resource = aemContext.resourceResolver().getResource(path);
    ButtonEventTracking model = resource.adaptTo(ButtonEventTracking.class);
    assertTrue(model.isEnabled());
    assertNull(model.getData());
  }
}