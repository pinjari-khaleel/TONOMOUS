package com.tonomus.core.slingmodels.components.v2.container;

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
class ContainerModelImplTest {

  private static final String CONTENT_PAGE = "/content/tonomus/en-us";

  private final AemContext context = AppAemContextUtils.appAemContextWithCoreComponent();

  @Test
  void getterModelTest() {
    assertPojoMethodsFor(ContainerModelImpl.class).testing(Method.GETTER).areWellImplemented();
  }

  @BeforeEach
  void setUp() {
    final String COMPONENT = "../ui.apps/src/main/content/jcr_root/apps/tonomus/components/content/components/container/v2/container/.content.xml";
    context.load().fileVaultXml(COMPONENT, "/apps/" + ContainerModelImpl.RESOURCE_TYPE);
    context.load().json("/components/container/container.json", CONTENT_PAGE);
  }

  @Test
  void testGetModelImpl() {
    context.currentResource(CONTENT_PAGE + "/jcr:content/root/component");
    ContainerModelImpl model = context.request().adaptTo(ContainerModelImpl.class);
    assertNotNull(model);
    assertNotNull(model.getLayoutContainer());
    assertEquals("Trending now at TONOMUS", model.getTitle());
  }

  @Test
  void testInterface() {
    context.currentResource(CONTENT_PAGE + "/jcr:content/root/component");
    ContainerModel model = context.request().adaptTo(ContainerModel.class);
    assertNotNull(model);
    assertNotNull(model.getLayoutContainer());
    assertEquals("Trending now at TONOMUS", model.getTitle());
  }
}
