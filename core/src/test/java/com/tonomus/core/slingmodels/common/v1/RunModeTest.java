package com.tonomus.core.slingmodels.common.v1;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import java.util.Objects;

import com.tonomus.core.services.NeomConfigurations;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Answers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;

@ExtendWith(AemContextExtension.class)
class RunModeTest {

  private static final String CONTENT_PATH = "/content/tonomus/en-us";

  @BeforeEach
  public void setUp(AemContext context) {
    context.load().json("/components/c48-forms/form-page.json", CONTENT_PATH);

    // NeomConfigurations
    NeomConfigurations neomConfig = mock(NeomConfigurations.class, Answers.RETURNS_MOCKS);
    doReturn("test-env").when(neomConfig).getEnvironment();
    context.registerService(NeomConfigurations.class, neomConfig);
  }

  @Test void testSectorButtonModel(AemContext aemContext) {
    String RESOURCE_PATH =
        "/content/tonomus/en-us/mebrand/jcr:content/root/responsivegrid/c48_forms";

    RunMode runMode =
        Objects.requireNonNull(aemContext.currentResource(RESOURCE_PATH)).adaptTo(RunMode.class);
    assertNotNull(runMode);
    assertEquals("test-env", runMode.getEnvironment());
  }
}
