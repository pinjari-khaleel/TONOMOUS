package com.tonomus.core.slingmodels.components.v1.datalayer;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.FieldPredicate;
import pl.pojo.tester.api.assertion.Method;

import java.util.Objects;

import com.tonomus.core.config.adapters.GenericSiteConfigAdapter;
import com.tonomus.core.config.caconfig.GenericSiteCaConfiguration;
import com.tonomus.core.constants.Constants;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.caconfig.MockContextAwareConfig;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsFor;

@ExtendWith(AemContextExtension.class)
class DataLayerModelTest {

  private static final String CONTENT_PATH = "/content/tonomus/en-us";

  @Test void testCarouselModel(AemContext aemContext) {
    aemContext.load().json("/components/datalayer/datalayer.json", CONTENT_PATH);
    String RESOURCE_PATH = "/content/tonomus/en-us/jcr:content";
    aemContext.currentResource(RESOURCE_PATH);
    DataLayerModel dataLayerModel = aemContext.request().adaptTo(DataLayerModel.class);
    assertNotNull(dataLayerModel);
    assertNotNull(dataLayerModel.getLastModified());
    assertEquals("en-us", Objects.requireNonNull(dataLayerModel.getCurrentResource().getParent()).getName());
    assertEquals("English Title", dataLayerModel.getEnglishTitle());
    assertEquals("home", dataLayerModel.getSiteSection());
    assertEquals("https://tonomus.com/en-us", dataLayerModel.getCanonicalUrl());
    assertEquals("https://tonomus.com/content/tonomus/en-us", dataLayerModel.getUrl());
    assertEquals("en-us", dataLayerModel.getCurrentPage().getName());
    assertEquals("en-us", dataLayerModel.getLocale());
    assertEquals(Constants.WEBSITE, dataLayerModel.getMetaPageType());
  }

  //@Test
  void testMetaImage(AemContext aemContext) {
    aemContext.load().json("/components/datalayer/datalayer_metaimage.json", CONTENT_PATH);
    String RESOURCE_PATH = CONTENT_PATH + "/jcr:content";

    Resource resource = aemContext.currentResource(RESOURCE_PATH);
    assertNotNull(resource);
    aemContext.registerService(new GenericSiteConfigAdapter());
    MockContextAwareConfig.registerAnnotationClasses(aemContext, GenericSiteCaConfiguration.class);
    DataLayerModel dataLayerModel = aemContext.request().adaptTo(DataLayerModel.class);
    assertNotNull(dataLayerModel);
//    assertEquals(Constants.ARTICLE, dataLayerModel.getMetaPageType());
    assertEquals("/content/dam/tonomus/newsroom/neom-kaust-coral-garden-mou/Article_5_Hero_Image.jpg", dataLayerModel.getImage().getSrc());
    assertEquals("NEOM partners with KAUST to create the world's largest coral garden", dataLayerModel.getImage().getAlt());
    assertNull(dataLayerModel.getFacebookDomainVerification());
  }

  @Test
  void assertGetterMethods() {
    assertPojoMethodsFor(DataLayerModel.class, FieldPredicate.include("image", "site", "facebookDomainVerification",
        "adobeLaunchConfiguration", "adobeLaunchAsyncScriptEnable", "delay", "gtmId", "lightGtmId", "subDomain",
        "metaLyticsTopics", "defaultRobotsTags",
        "robotsTags")).testing(Method.GETTER).areWellImplemented();
  }
}
