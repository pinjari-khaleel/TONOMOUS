package com.tonomus.core.slingmodels.common.v1;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import com.tonomus.core.slingmodels.components.v1.downloads.DownloadsComponentModel;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class ChildResourceCounterModelTest {

  private static final String CONTENT_PATH = "/content/tonomus/en-us/test-page";

  private static final String RESOURCE_PATH = CONTENT_PATH + "/jcr:content/root/responsivegrid/c45_content_columns";

  @BeforeEach
  public void setUp(AemContext context) {
    context.load().json("/common/child-resource-counter/child-resource-counter.json", CONTENT_PATH);
  }

  @Test
  @DisplayName("Test ChildResourceCounterModel")
  void getterChildResourceCounterModelTest(AemContext aemContext) {
    assertPojoMethodsForAll(ChildResourceCounterModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();

    Resource resource = aemContext.currentResource(RESOURCE_PATH);
    assertNotNull(resource);
    ChildResourceCounterModel counterModel = resource.adaptTo(ChildResourceCounterModel.class);
    assertNotNull(counterModel);
    assertEquals(2, counterModel.getColumnCount());
    resource = aemContext.currentResource(RESOURCE_PATH + "/c45_content_column/c30_downloads");
    DownloadsComponentModel model = resource.adaptTo(DownloadsComponentModel.class);
    assertNotNull(model);
    assertEquals("column", model.getDirection());
  }
}
