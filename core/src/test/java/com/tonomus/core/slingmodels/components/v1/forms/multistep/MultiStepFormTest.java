package com.tonomus.core.slingmodels.components.v1.forms.multistep;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.tonomus.core.slingmodels.common.v1.HeaderModel;

import static com.tonomus.core.constants.NumberConstants.ONE;
import static com.tonomus.core.constants.NumberConstants.ZERO;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class MultiStepFormTest {

  private static final String CONTENT_PATH = "/content/neom/en-us";

  @Test
  @DisplayName("Test all getters of MultiStepForm models")
  void getterSetterMethodsTest() {
    assertPojoMethodsForAll(MultiStepFormGroupModel.class, MultiStepFormFinalStepModel.class,
        MultiStepFormFinalStepModel.FormSubmissionResultModel.class,
        MultiStepFormCheckBoxModel.class, MultiStepFormFinalStepModel.CopyModel.class,
        MultiStepFormModel.class, MultiStepFormModel.NameValueObject.class,
        MultiStepFormSelectModel.class, MultiStepFormPhoneModel.class,
        MultiStepFormTextModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(MultiStepFormGroupModel.ShowTextareaForOtherChoice.class,
        MultiStepFormGroupModel.ShowDropdownForMultipleChoice.class).testing(Method.GETTER).areWellImplemented();
    MultiStepFormModel multiStepFormModel = new MultiStepFormModel();
    multiStepFormModel.initMultiStepFormModel();
    assertEquals("ltr", multiStepFormModel.getDir());
  }

  @Test void testForms(AemContext aemContext) {
    aemContext.load()
        .json("/components/c59-multi-step-form/c59-multi-step-form.json", CONTENT_PATH);
    String RESOURCE_PATH = CONTENT_PATH + "/jcr:content/root/responsivegrid/c59_multi_step_form";
    MultiStepFormModel model =
        aemContext.currentResource(RESOURCE_PATH).adaptTo(MultiStepFormModel.class);
    assertNotNull(model);

    RESOURCE_PATH = CONTENT_PATH + "/jcr:content/root/responsivegrid/c59_multi_step_form/c59_step";
    MultiStepFormStepModel stepModel0 =
        aemContext.currentResource(RESOURCE_PATH).adaptTo(MultiStepFormStepModel.class);
    assertNotNull(stepModel0);
    assertNull(stepModel0.getRecaptchaBranding());
    assertEquals(ZERO, stepModel0.getStep());

    RESOURCE_PATH = CONTENT_PATH + "/jcr:content/root/responsivegrid/c59_multi_step_form/c59_step_1006455254";
    MultiStepFormStepModel stepModel1 =
        aemContext.currentResource(RESOURCE_PATH).adaptTo(MultiStepFormStepModel.class);
    assertNotNull(stepModel1);
    assertEquals(ONE, stepModel1.getStep());

    RESOURCE_PATH = RESOURCE_PATH + "/c59_step_group/phone_field";
    MultiStepFormPhoneModel phoneModel =
        aemContext.resourceResolver().getResource(RESOURCE_PATH).adaptTo(MultiStepFormPhoneModel.class);
    assertNotNull(phoneModel);
  }

    @Test void testFormsWithDirRtlAndHeaderRes(AemContext aemContext) {
    aemContext.load()
        .json("/components/c59-multi-step-form/c59-multi-step-form-ar-headerres.json", CONTENT_PATH);
    aemContext.addModelsForClasses(HeaderModel.class);
    String RESOURCE_PATH = CONTENT_PATH + "/jcr:content/root/responsivegrid/c59_multi_step_form";
    MultiStepFormModel model =
        aemContext.currentResource(RESOURCE_PATH).adaptTo(MultiStepFormModel.class);
    assertNotNull(model);
    }
}
