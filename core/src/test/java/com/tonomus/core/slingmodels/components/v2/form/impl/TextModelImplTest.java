package com.tonomus.core.slingmodels.components.v2.form.impl;

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
class TextModelImplTest {

  private static final String CONTENT_PAGE = "/content/tonomus/en-us";

  private final AemContext context = AppAemContextUtils.appAemContextWithCoreComponent();

  @Test
  void getterModelTest() {
    assertPojoMethodsFor(TextModelImpl.class).testing(Method.GETTER).areWellImplemented();
  }

  @BeforeEach
  void setUp() {
    final String COMPONENT = "../ui.apps/src/main/content/jcr_root/apps/tonomus/components/content/components/form/text/v2/text/.content.xml";
    context.load().fileVaultXml(COMPONENT, "/apps/" + TextModelImpl.RESOURCE_TYPE);
    context.load().json("/components/form/form.json", CONTENT_PAGE);
  }

  @Test
  void testGetModelImpl() {
    context.currentResource(CONTENT_PAGE + "/jcr:content/root/container/text");
    TextModelImpl model = context.request().adaptTo(TextModelImpl.class);
    assertNotNull(model);
    assertEquals("Name", model.getPlaceholder());
  }

  @Test
  void testInterface() {
    context.currentResource(CONTENT_PAGE + "/jcr:content/root/container/text_email");
    TextModelImpl model = context.request().adaptTo(TextModelImpl.class);
    assertNotNull(model);
    assertEquals("Email", model.getPlaceholder());
  }
}
