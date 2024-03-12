package com.tonomus.core.slingmodels.components.v1.forms;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.FieldPredicate;
import pl.pojo.tester.api.assertion.Method;

import java.util.Objects;

import com.tonomus.core.constants.Constants;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsFor;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class FormTextModelTest {

  private static final String CONTENT_PATH = "/content/neom/en-us";

  @Test @DisplayName("Test all getters of FormFieldBase") void getterSetterFormFieldBaseMethodsTest() {
    assertPojoMethodsForAll(FormFieldBase.class).testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    FormFieldBase formFieldBase = new FormFieldBase();
    formFieldBase.initialize();
    assertNotNull(formFieldBase.getId());
  }

  @Test @DisplayName("Test all getters and setters of FormTextModel") void getterSetterMethodsTest() {
    assertPojoMethodsForAll(FormTextModel.class).testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    assertPojoMethodsFor(FormTextModel.class, FieldPredicate.include("value", "name", "type"))
      .testing(Method.SETTER).areWellImplemented();
  }

  @BeforeEach void setUp(AemContext context) {
    context.load().json("/components/c48-forms/form-page.json", CONTENT_PATH);
  }

  @Test void testTextFieldMaxLength(AemContext aemContext) {
    String RESOURCE_PATH = CONTENT_PATH + "/mebrand/jcr:content/root/responsivegrid/c48_forms/c48_forms_group/m30_text_field";

    FormTextModel formModel = Objects.requireNonNull(aemContext.currentResource(RESOURCE_PATH)).adaptTo(FormTextModel.class);
    assertNotNull(Objects.requireNonNull(formModel).getMaxlength());
    assertEquals(Constants.THOUSAND, formModel.getMaxlength());
  }
}