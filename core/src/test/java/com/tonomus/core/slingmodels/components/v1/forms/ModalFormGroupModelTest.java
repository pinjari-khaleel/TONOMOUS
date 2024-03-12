package com.tonomus.core.slingmodels.components.v1.forms;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class ModalFormGroupModelTest {


  private static final String CONTENT_PATH = "/content/tonomus/en-us/c92-test";

  @BeforeEach public void setUp(AemContext context) {
    context.load().json("/components/c92-modal/c92-modal-page.json", CONTENT_PATH);
  }

  @Test void testWebGlEffectHeroModelModel(AemContext aemContext) {
    String RESOURCE_PATH =
        CONTENT_PATH + "/jcr:content/root/responsivegrid/c92_modal/c48_forms_group";

    Resource resource = aemContext.currentResource(RESOURCE_PATH);
    assertNotNull(resource);
    ModalFormGroupModel model = resource.adaptTo(ModalFormGroupModel.class);
    assertNotNull(model);
    assertNotNull(model.getItems());
    assertEquals(6, model.getItems().size());
    assertEquals(FormTextModel.class, model.getItems().get(0).getClass());
    assertEquals(FormCheckBoxModel.class, model.getItems().get(3).getClass());
    assertEquals(FormCheckBoxModel.class, model.getItems().get(4).getClass());
    assertEquals(FormSelectModel.class, model.getItems().get(5).getClass());
  }


  @Test @DisplayName("Test all getters of ModalFormGroupModel") void getterSetterMethodsTest() {
    assertPojoMethodsForAll(ModalFormGroupModel.class).testing(Method.CONSTRUCTOR, Method.GETTER)
        .areWellImplemented();
  }
}
