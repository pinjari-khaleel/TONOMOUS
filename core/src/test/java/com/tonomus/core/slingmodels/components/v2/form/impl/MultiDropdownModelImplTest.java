package com.tonomus.core.slingmodels.components.v2.form.impl;

import pl.pojo.tester.api.assertion.Method;

import com.tonomus.core.utils.AppAemContextUtils;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(AemContextExtension.class)
class MultiDropdownModelImplTest {

  private static final String CONTENT_PAGE = "/content/tonomus/en-us";

  private final AemContext context = AppAemContextUtils.appAemContextWithCoreComponent();

  @Test
  void getterModelTest() {
    assertPojoMethodsForAll(MultiDropdownModelImpl.class, DropdownModelImpl.class).testing(Method.GETTER)
        .areWellImplemented();
  }

  @BeforeEach
  void setUp() {
    final String COMPONENT = "../ui.apps/src/main/content/jcr_root/apps/tonomus/components/content/components/form/multidropdown/v2/multidropdown/.content.xml";
    context.load().fileVaultXml(COMPONENT, "/apps/" + MultiDropdownModelImpl.RESOURCE_TYPE);
    context.load().json("/components/form/form.json", CONTENT_PAGE);
  }

  @Test
  void testGetModelImpl() {
    context.currentResource(CONTENT_PAGE + "/jcr:content/root/container/multidropdown");
    MultiDropdownModelImpl model = context.request().adaptTo(MultiDropdownModelImpl.class);
    assertNotNull(model);
    assertNotNull(model.getDropdownOptions()); 
    assertEquals(2, model.getDropdownOptions().size());
    assertNotNull(model.getItemsJson());
  }
}
