package com.tonomus.core.slingmodels.components.v1.forms;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class CountrySelectModelTest {

  private static final String COMPONENT_PATH = "/content/project/page/select";

  @Test
  @DisplayName("Items defined in the select should be preferred to the whatever comes in "
      + "optionsPath")
  void testSelectWithItems(AemContext context) {
    context.addModelsForClasses(CountrySelectModel.class, CountryModel.class);
    context.load().json("/components/forms/form-select-model/select-with-items.json", COMPONENT_PATH);
    CountrySelectModel model = context.currentResource(COMPONENT_PATH).adaptTo(CountrySelectModel.class);
    assertNotNull(model);
    assertEquals(3, model.getItems().size());
    CountryModel optionModel = model.getItems().get(1);
    assertEquals("Andorra", optionModel.getLabel());
    assertEquals("376", optionModel.getValue());
    assertEquals("AD", optionModel.getCountryCode());
    assertEquals("ad", optionModel.getLowerCaseCode());
  }

  @Test
  void testSelectWithOptionsPath(AemContext context) {
    context.addModelsForClasses(CountrySelectModel.class, CountryModel.class);
    context.load().json("/components/forms/form-select-model/content-fragments-flags.json",
        "/content/dam/neom/content-fragments/flags");
    context.load().json("/components/forms/form-select-model/select-without-items.json",
        COMPONENT_PATH);
    CountrySelectModel model = context.currentResource(COMPONENT_PATH).adaptTo(CountrySelectModel.class);
    assertNotNull(model);
    assertEquals(3, model.getItems().size());
    CountryModel optionModel = model.getItems().get(0);
    assertEquals("France", optionModel.getLabel());
    assertEquals("89", optionModel.getValue());
    assertEquals("FR", optionModel.getCountryCode());
    assertEquals("fr", optionModel.getLowerCaseCode());
  }

  @Test
  @DisplayName("Test all getters")
  void getterSetterMethodsTest() {
    assertPojoMethodsForAll(CountrySelectModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

}
