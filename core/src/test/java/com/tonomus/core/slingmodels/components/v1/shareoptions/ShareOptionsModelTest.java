package com.tonomus.core.slingmodels.components.v1.shareoptions;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import java.util.Collections;
import java.util.Enumeration;
import java.util.Locale;
import java.util.ResourceBundle;

import com.drew.lang.annotations.NotNull;
import com.tonomus.core.constants.Constants;
import com.tonomus.core.slingmodels.common.v1.ArticleDataLayerModel;

import org.apache.sling.i18n.ResourceBundleProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.osgi.service.component.ComponentConstants;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class ShareOptionsModelTest {

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
    }

    @Test
    void test(AemContext aemContext) {
        assertPojoMethodsForAll(ShareOptionsModel.class)
                .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
        assertPojoMethodsForAll(ShareOptionsItem.class)
                .testing(Method.CONSTRUCTOR, Method.GETTER).testing(Method.SETTER).areWellImplemented();
        assertPojoMethodsForAll(ArticleDataLayerModel.class)
                .testing(Method.CONSTRUCTOR, Method.GETTER).testing(Method.SETTER).areWellImplemented();
    }
}