package com.tonomus.core.slingmodels.components.v2.footer;

import com.adobe.cq.wcm.core.components.models.Navigation;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(AemContextExtension.class)
public class FooterModelImplTest {
    private static final String MOCK_DATA_FILE = "/components/footer/footer.json";
    private static final String BASE_CONTENT = "/content";
    private static final String TEST_DATA_EMPTY = BASE_CONTENT + "/hasNoContent";
    private static final String TEST_DATA_HAS_CONTENT = BASE_CONTENT + "/hasContent";
    private static final String TEST_DATA_INVALID_PAGE_ROOT = BASE_CONTENT + "/invalidPageRoot";
    private static final String TEST_DATA_VALID_PAGE_ROOT = BASE_CONTENT + "/validPageRoot";

    @BeforeEach
    public void setup(AemContext context) {
        context.load().json(MOCK_DATA_FILE, BASE_CONTENT);
        context.addModelsForClasses(Navigation.class);
        context.addModelsForPackage("com.tonomus.core.slingmodels");
    }

    /***
     * WHEN: Component is empty
     * THEN: getItems should return empty list
     * AND: getSocialMediaLinks should return empty list
     * AND: getOtherLinks should return empty list
     */
    @Test
    public void whenEmpty(AemContext context) {
        FooterModel footerModel = getModel(context, TEST_DATA_EMPTY);
        final int expectedListSize = 0;
        Assertions.assertNotNull(footerModel);
        Assertions.assertNotNull(footerModel.getExportedType());
        Assertions.assertNull(footerModel.getAddressTitle());
        Assertions.assertNull(footerModel.getAddressDetail());
        Assertions.assertNull(footerModel.getAccessibilityLabel());
        Assertions.assertEquals(expectedListSize, footerModel.getItems().size());
        Assertions.assertEquals(expectedListSize, footerModel.getSocialMediaLinks().size());
        Assertions.assertEquals(expectedListSize, footerModel.getOtherLinks().size());
    }

    /**
     * WHEN: Root page is set
     * AND: Root page is not existing (invalid)
     * THEN: get methods should return expected values for each properties
     */
    @Test
    public void whenPropertiesHaveValue(AemContext context) {
        FooterModel footerModel = getModel(context, TEST_DATA_HAS_CONTENT);
        final int expectedSocialMediaLinkSize = 1;
        final int expectedOtherLinkSize = 2;
        final String expectedAddressTitle = "Sample address title";
        final String expectedAddressDetail = "Sample address detail";
        Assertions.assertNotNull(footerModel);
        Assertions.assertNotNull(footerModel.getExportedType());
        Assertions.assertEquals(expectedAddressTitle, footerModel.getAddressTitle());
        Assertions.assertEquals(expectedAddressDetail, footerModel.getAddressDetail());
        Assertions.assertNotNull(footerModel.getItems());
        Assertions.assertEquals(expectedSocialMediaLinkSize, footerModel.getSocialMediaLinks().size());
        Assertions.assertEquals(expectedOtherLinkSize, footerModel.getOtherLinks().size());
    }

    /**
     * WHEN: Root page is set
     * AND: Root page is non-existing page (invalid)
     * THEN: getItems size should return 0 without throwing null exception
     */
    @Test
    public void whenPageRootIsInvalid(AemContext context) {
        FooterModel footerModel = getModel(context, TEST_DATA_INVALID_PAGE_ROOT);
        Assertions.assertNotNull(footerModel);
        Assertions.assertNotNull(footerModel.getItems());
    }

    private FooterModelImpl getModel(AemContext context, String path) {
        Resource resource = context.currentResource(path);
        context.request().setResource(resource);
        return context.request().adaptTo(FooterModelImpl.class);
    }
}
