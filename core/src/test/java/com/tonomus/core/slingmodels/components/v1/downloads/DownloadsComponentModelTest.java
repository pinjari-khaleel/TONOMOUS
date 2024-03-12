package com.tonomus.core.slingmodels.components.v1.downloads;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import java.util.Collections;
import java.util.Enumeration;
import java.util.Locale;
import java.util.ResourceBundle;

import com.drew.lang.annotations.NotNull;
import com.tonomus.core.constants.Constants;

import org.apache.sling.i18n.ResourceBundleProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.osgi.service.component.ComponentConstants;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;

@ExtendWith(AemContextExtension.class)
class DownloadsComponentModelTest {

  private static final String CONTENT_PATH = "/content/tonomus/en/c30-downloads";

  @BeforeEach
  public void setUp(AemContext context) {
    final ResourceBundle i18n = new ResourceBundle() {
      @Override
      protected Object handleGetObject(@NotNull String key) {
        return key;
      }

      @Override
      public Enumeration<String> getKeys() {
        return Collections.emptyEnumeration();
      }
    };
    final ResourceBundleProvider i18nProvider = mock(ResourceBundleProvider.class);
    doReturn(i18n).when(i18nProvider).getResourceBundle(any(Locale.class));
    context.registerService(ResourceBundleProvider.class, i18nProvider,
        ComponentConstants.COMPONENT_NAME, Constants.I18N_RESOURCE_BUNDLE_PROVIDER_CLASS);

    context.load().json("/components/c30-downloads/c30-downloads.json", CONTENT_PATH);
  }

  @Test void testDownloadsComponentModel(AemContext aemContext) {
    String RESOURCE_PATH =
        "/content/tonomus/en/c30-downloads/jcr:content/root/responsivegrid/c30_downloads";

    DownloadsComponentModel downloadsComponentModel =
        aemContext.currentResource(RESOURCE_PATH).adaptTo(DownloadsComponentModel.class);
    assertNotNull(downloadsComponentModel);
  }
}
