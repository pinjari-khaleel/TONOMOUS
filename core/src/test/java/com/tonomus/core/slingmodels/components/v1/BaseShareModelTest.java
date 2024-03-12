package com.tonomus.core.slingmodels.components.v1;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

import java.util.Arrays;
import java.util.ResourceBundle;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.i18n.ResourceBundleProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.osgi.service.component.ComponentConstants;

import com.tonomus.core.config.SocialOptions;
import com.tonomus.core.constants.Constants;
import com.tonomus.core.slingmodels.components.v1.shareoptions.ShareOptionsModel;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

@ExtendWith(AemContextExtension.class)
class BaseShareModelTest {

    private static final String CONTENT_PAGE = "/content/neom/en-us";

    @BeforeEach
    void setUp(AemContext context) {
        context.load().json("/components/base-share-model.json", CONTENT_PAGE);
    }

    @Test
    void testModel(AemContext context) {
        assertPojoMethodsForAll(BaseShareModel.class)
                .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();

        ResourceBundleProvider resourceBundleProvider = mock(ResourceBundleProvider.class);
        ResourceBundle resourceBundle = mock(ResourceBundle.class);
        SocialOptions socialOptions = mock(SocialOptions.class);
        
        context.registerService(ResourceBundleProvider.class, resourceBundleProvider,
                ComponentConstants.COMPONENT_NAME, Constants.I18N_RESOURCE_BUNDLE_PROVIDER_CLASS);
        context.registerAdapter(Resource.class, SocialOptions.class, socialOptions);

        when(resourceBundleProvider.getResourceBundle(any())).thenReturn(resourceBundle);
        
        BaseShareModel model = context.resourceResolver()
                .getResource(CONTENT_PAGE + "/jcr:content/root/responsivegrid/c80_dynamic_quote_co")
                .adaptTo(BaseShareModel.class);
        assertNotNull(model);
        assertNotNull(model.getShareOptionsJson());
        
        ShareOptionsModel shareOptionsModel = mock(ShareOptionsModel.class);
        when(shareOptionsModel.getItems()).thenReturn(Arrays.asList(ShareOptionsModel.class));
        model.setShareOptions(shareOptionsModel);
        assertEquals(shareOptionsModel, model.getShareOptions());
        assertNotNull(model.getShareOptionsJson());

        BaseShareModel modelNoSocialOptions = context.resourceResolver()
                .getResource(CONTENT_PAGE + "/jcr:content/root/responsivegrid/c80_dynamic")
                .adaptTo(BaseShareModel.class);
        assertNotNull(modelNoSocialOptions);
    }
}
