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
class FormSelectModelTest {

  private final static String COMPONENT_WITH_MANUAL = "/content/component-manual";
  private final static String COMPONENT_WITH_CF = "/content/component-cf";
  private final static String FRAGMENTS_PATH = "/path/to/content/fragments";

  @BeforeEach
  void setUp(AemContext context) {
    context.load().json("/components/m31-dropdown-field/resource-manual.json", COMPONENT_WITH_MANUAL);
    context.load().json("/components/m31-dropdown-field/resource-cf.json", COMPONENT_WITH_CF);
    context.load().json("/components/m31-dropdown-field/content-fragments.json", FRAGMENTS_PATH);
  }

  @Test
  void testGetItems_whenManualSource(AemContext context) {
    Resource resource = context.resourceResolver().getResource(COMPONENT_WITH_MANUAL);
    FormSelectModel model = resource.adaptTo(FormSelectModel.class);
    assertEquals(3, model.getItems().size());
    assertEquals("Business", model.getItems().get(0).getValue());
    assertEquals("Business", model.getItems().get(0).getLabel());
  }

  @Test
  void testGetItems_whenContentFragmentsSource(AemContext context) {

    Resource resource = context.resourceResolver().getResource(COMPONENT_WITH_CF);
    FormSelectModel model = resource.adaptTo(FormSelectModel.class);
    assertEquals(3, model.getItems().size());
    assertEquals("Saudi Arabia", model.getItems().get(0).getValue());
    assertEquals("Saudi Arabia", model.getItems().get(0).getLabel());
  }

  @Test
  @DisplayName("Test all getters")
  void getterModelTest(AemContext context) {
    assertPojoMethodsForAll(FormSelectModel.class).testing(Method.GETTER).areWellImplemented();
    
    Resource resource = context.resourceResolver().getResource(COMPONENT_WITH_CF);
    FormSelectModel model = resource.adaptTo(FormSelectModel.class);
    assertNotNull(model.getItemsJson());
  }
}
