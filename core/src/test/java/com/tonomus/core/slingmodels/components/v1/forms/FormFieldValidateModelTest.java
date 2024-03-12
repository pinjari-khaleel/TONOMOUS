package com.tonomus.core.slingmodels.components.v1.forms;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class FormFieldValidateModelTest {

  private static final String CONTENT_PATH = "/content/neom/en-us";

  @Test
  @DisplayName("Test getters")
  void getterFormFieldValidateModelFormatTest() {
    assertPojoMethodsForAll(FormFieldValidateModel.ValidateFormat.class)
        .testing(Method.GETTER).areWellImplemented();
  }
  @Test
  @DisplayName("Test getters")
  void getterFormFieldValidateModelMessageTest() {
    assertPojoMethodsForAll(FormFieldValidateModel.ValidateMessageModel.class)
        .testing(Method.GETTER).areWellImplemented();
  }
  @Test
  @DisplayName("Test getters")
  void getterFormFieldValidateModelLengthCheckTest() {
    assertPojoMethodsForAll(FormFieldValidateModel.LengthCheckModel.class)
        .testing(Method.GETTER).areWellImplemented();
  }
  @Test
  @DisplayName("Test getters")
  void getterFormFieldValidateModelNumberValidationTest() {
    assertPojoMethodsForAll(FormFieldValidateModel.NumberValidation.class)
        .testing(Method.GETTER).areWellImplemented();
  }
  @Test
  @DisplayName("Test getters")
  void getterFormFieldValidateModelTest() {
    assertPojoMethodsForAll(FormFieldValidateModel.class)
        .testing(Method.GETTER).areWellImplemented();
  }

  @Test void testFormField(AemContext aemContext) {
    aemContext.load()
        .json("/components/c59-multi-step-form/c59-multi-step-form.json", CONTENT_PATH);
    String RESOURCE_PATH = CONTENT_PATH + "/jcr:content/root/responsivegrid"
        + "/c59_multi_step_form/c59_step_1006455254/c59_step_group/m30_text_field";
    FormTextModel formTextModel =
        aemContext.currentResource(RESOURCE_PATH).adaptTo(FormTextModel.class);
    assertEquals("^Please enter your first name",
        formTextModel.getValidate().getPresence().getMessage());
    assertEquals("[^0-9!-/:-@\\[-`{-~]+", formTextModel.getValidate().getFormat().getPattern());
    assertEquals("^Please only use letters", formTextModel.getValidate().getFormat().getMessage());
    assertEquals(
        "{\"presence\":{\"message\":\"^Please enter your first name\",\"allowEmpty\":false},\"format\":{\"pattern\":\"[^0-9!-/:-@\\\\[-`{-~]+\",\"message\":\"^Please only use letters\"}}",
        formTextModel.getValidate().getJson());
  }

  @Test void testPhoneValidationField(AemContext aemContext) {
    aemContext.load()
        .json("/components/c59-multi-step-form/c59-multi-step-form.json", CONTENT_PATH);
    String RESOURCE_PATH = CONTENT_PATH + "/jcr:content/root/responsivegrid"
        + "/c59_multi_step_form/c59_step_1006455254/c59_step_group/phone_field";
    FormTextModel phoneFormModel =
        aemContext.currentResource(RESOURCE_PATH).adaptTo(FormTextModel.class);
    assertEquals("^Please use only numbers",
        phoneFormModel.getValidate().getNumericality().getMessage());
    assertTrue(phoneFormModel.getValidate().getNumericality().isNumericality());
    assertEquals(
        "{\"numericality\":{\"numericality\":true,\"message\":\"^Please use only numbers\"}}",
        phoneFormModel.getValidate().getJson());
  }

  @Test void testFormFieldWhenValidationFieldsAreEmpty(AemContext aemContext) {
    aemContext.load()
        .json("/components/c59-multi-step-form/c59-multi-step-form-when-validation-empty.json",
            CONTENT_PATH);
    String RESOURCE_PATH = CONTENT_PATH + "/jcr:content/root/responsivegrid"
        + "/c59_multi_step_form/c59_step_1006455254/c59_step_group/m30_text_field";
    FormTextModel formTextModel =
        aemContext.currentResource(RESOURCE_PATH).adaptTo(FormTextModel.class);
    assertNotNull(formTextModel.getValidate());
    assertNull(formTextModel.getValidate().getPresence());
    assertNull(formTextModel.getValidate().getFormat());
    assertNull(formTextModel.getValidate().getJson());
  }
}
