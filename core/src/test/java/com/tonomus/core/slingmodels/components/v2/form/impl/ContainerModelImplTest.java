package com.tonomus.core.slingmodels.components.v2.form.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsFor;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.tonomus.core.slingmodels.components.v2.form.ContainerModel;
import com.tonomus.core.utils.AppAemContextUtils;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.FieldPredicate;
import pl.pojo.tester.api.assertion.Method;

@ExtendWith(AemContextExtension.class)
class ContainerModelImplTest {

  private static final String CONTENT_PAGE = "/content/tonomus/en-us";

  private AemContext context = AppAemContextUtils.appAemContextWithCoreComponent();

  @Test
  void getterModelTest() {
    assertPojoMethodsFor(ContainerModelImpl.class, FieldPredicate.exclude("resource", "currentPage"))
        .testing(Method.GETTER).areWellImplemented();
  }

  @BeforeEach
  void setUp() {
    final String COMPONENT = "../ui.apps/src/main/content/jcr_root/apps/tonomus/components/content/components/form/container/v2/container/.content.xml";
    context.load().fileVaultXml(COMPONENT, "/apps/" + ContainerModelImpl.RESOURCE_TYPE);
    context.load().json("/components/form/form.json", CONTENT_PAGE);
  }

  @Test
  void testGetModelImpl() {
    context.currentResource(CONTENT_PAGE + "/jcr:content/root/container");
    ContainerModel model = context.request().adaptTo(ContainerModel.class);
    assertNotNull(model);
    assertEquals("How can we help?", model.getTitle());
  }

  @Test
  void testInterface() {
    context.currentResource(CONTENT_PAGE + "/jcr:content/root/container");
    ContainerModel model = context.request().adaptTo(ContainerModel.class);
    assertNotNull(model);
    assertEquals("GENERAL Business inquiry", model.getPretitle());
    assertEquals("* Required fields", model.getDescription());
    assertEquals("/content/tonomus/en-us/_jcr_content/root/container.form", model.getActionPath());
  }
}
