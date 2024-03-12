package com.tonomus.core.slingmodels.components.v2.horizontaltabs;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.tonomus.core.utils.AppAemContextUtils;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsFor;

@ExtendWith(AemContextExtension.class)
class HorizontalTabsModelImplTest {

  private static final String CONTENT_PAGE = "/content/tonomus/en-us";

  private final AemContext context = AppAemContextUtils.appAemContextWithCoreComponent();

  @Test
  void getterModelTest() {
    assertPojoMethodsFor(HorizontalTabsModelImpl.class).testing(Method.GETTER).areWellImplemented();
  }

  @BeforeEach
  void setUp() {
    final String COMPONENT = "../ui.apps/src/main/content/jcr_root/apps/tonomus/components/content/components/horizontaltabs/v2/horizontaltabs/.content.xml";
    context.load().fileVaultXml(COMPONENT, "/apps/" + HorizontalTabsModelImpl.RESOURCE_TYPE);
    context.load().json("/components/horizontaltabs/horizontaltabs.json", CONTENT_PAGE);
  }

  @Test
  void testGetModelImpl() {
    context.currentResource(CONTENT_PAGE + "/jcr:content/root/component");
    HorizontalTabsModelImpl model = context.request().adaptTo(HorizontalTabsModelImpl.class);
    assertNotNull(model);
    assertNotNull(model.getTabs());
    assertEquals("<h2>Our leadership</h2>", model.getTitle());
  }

  @Test
  void testInterface() {
    context.currentResource(CONTENT_PAGE + "/jcr:content/root/component");
    HorizontalTabsModel model = context.request().adaptTo(HorizontalTabsModel.class);
    assertNotNull(model);
    assertNotNull(model.getTabs());
    assertEquals("<h2>Our leadership</h2>", model.getTitle());
  }
}
