package com.tonomus.core.slingmodels.components.v1.forms;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import java.util.Objects;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class FormModelTest {

  private static final String CONTENT_PATH = "/content/neom/en-us";

  @Test
  @DisplayName("Test all getters of FormModel")
  void getterSetterMethodsTest() {
    assertPojoMethodsForAll(FormModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

  @Test
  void testSectorButtonModel(AemContext context) {
    context.load().json("/components/c48-forms/form-page.json", CONTENT_PATH);

    String RESOURCE_PATH = "/content/neom/en-us/mebrand/jcr:content/root/responsivegrid/c48_forms";

    FormModel formModel = Objects.requireNonNull(context.currentResource(RESOURCE_PATH)).adaptTo(FormModel.class);
    assertNotNull(formModel);
    assertNotNull(formModel.getAction());
    assertNotNull(formModel.getButtons());
    assertNull(formModel.getFooterCopy());
    assertNotNull(formModel.getMessagesJson());
  }

  @Test
  void testInitForFormModelEmpty(AemContext context) {
    context.load().json("/components/c48-forms/form-page-no-child-resource.json", CONTENT_PATH);

    String RESOURCE_PATH = "/content/neom/en-us/mebrand/jcr:content/root/responsivegrid/c48_forms";

    FormModel formModel = Objects.requireNonNull(context.currentResource(RESOURCE_PATH)).adaptTo(FormModel.class);
    assertNotNull(formModel);
    assertTrue(formModel.isEmpty());
  }
}
