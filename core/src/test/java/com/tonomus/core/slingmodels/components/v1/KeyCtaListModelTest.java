package com.tonomus.core.slingmodels.components.v1;

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
class KeyCtaListModelTest {

    private static final String CONTENT_PATH = "/content/neom/en-us/c88-key-cta-list";

    @BeforeEach
    public void setUp(AemContext context) {
        context.load().json("/components/c88-key-cta-list/c88-key-cta-list-page.json",
            CONTENT_PATH);
    }

    @Test
    @DisplayName("Test all getters and setters of KeyCtaListModel and Item")
    void getterSetterKeyCtaListModelMethodsTest() {
        assertPojoMethodsForAll(KeyCtaListModel.class, KeyCtaListModel.Item.class)
                .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    }

    @Test
    void testKeyCtaListModel(AemContext aemContext) {
        String RESOURCE_PATH =
            "/content/neom/en-us/c88-key-cta-list/jcr:content/root/responsivegrid/c88_key_cta_list";

        Resource resource = aemContext.currentResource(RESOURCE_PATH);
        assertNotNull(resource);
        KeyCtaListModel model = resource.adaptTo(KeyCtaListModel.class);
        assertNotNull(model);
        assertNotNull(model.getHeading());
        assertNotNull(model.getHeading().getText());
        assertEquals("h2", model.getHeading().getSize());
        assertNotNull(model.getList());
        assertEquals(3, model.getList().size());
        assertEquals("#form-id", model.getList().get(0).getHref());
    }
}
