package com.tonomus.core.slingmodels.components.v1.footer;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.assertion.Method;

import java.util.Calendar;
import java.util.List;

import com.tonomus.core.slingmodels.common.v1.LinkModel;
import com.tonomus.core.slingmodels.common.v1.SocialModel;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static com.tonomus.core.constants.Constants.COPYRIGHT;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class FooterModelTest {

    private static final String CONTENT_PATH = "/content/neom/en-us";
    private static final String CONTENT_FRAGMENT_PATH = "/content/dam/neom/content-fragments/footer-social-items/facebook";
    private static final String RESOURCE_PATH = "/content/neom/en-us/jcr:content/s02-footer";

    @BeforeEach
    public void setUp(AemContext context) {
        context.load().json("/components/s02-footer/s02-footer.json", CONTENT_PATH);
        context.load().json("/components/s02-footer/social-items-content-fragments.json", CONTENT_FRAGMENT_PATH);
    }

    @Test
    @DisplayName("Test all getters and setters of package")
    void getterSetterFooterTest() {
        assertPojoMethodsForAll(FooterModel.class)
                .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
        assertPojoMethodsForAll(FooterSitemapItemsModel.class)
                .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    }

    @Test
    void testFooterSocialAndSitemapItemsModelTest(AemContext aemContext) {
        Resource resource = aemContext.currentResource(RESOURCE_PATH);
        assertNotNull(resource);
        FooterModel footerModel = resource.adaptTo(FooterModel.class);
        assertNotNull(footerModel);

        //Social Items
        assertNotNull(footerModel.getSocialItems());
        SocialModel socialItem = footerModel.getSocialItems().get(0);
        assertNotNull(socialItem);
        assertEquals("Facebook", socialItem.getLabel());
        assertEquals("facebook.com", socialItem.getHref());
        assertEquals("_blank", socialItem.getTarget());
        assertEquals("facebook-gold", socialItem.getIcon());

        //Sitemap Items
        List<FooterSitemapItemsModel> sitemapItemsModels = footerModel.getSitemapItems();
        assertNotNull(sitemapItemsModels);

        FooterSitemapItemsModel bePartOfNeom = sitemapItemsModels.get(0);
        assertEquals("Careers", bePartOfNeom.getLabel());
        List<LinkModel> childItems1 = bePartOfNeom.getChildItems();
        assertNotNull(childItems1);
        LinkModel child1 = childItems1.get(0);
        assertNotNull(child1);
        assertEquals("Be part of Neom child page", child1.getLabel());
        assertEquals("/content/neom/en-us/be-part-of-neom/be-part-of-neom-child.html", child1.getHref());
        assertEquals("_self", child1.getTarget());

        FooterSitemapItemsModel becomeVendor = sitemapItemsModels.get(1);
        assertEquals("Suppliers", becomeVendor.getLabel());
        List<LinkModel> childItems2 = becomeVendor.getChildItems();
        assertNotNull(childItems2);
        LinkModel child2 = childItems2.get(0);
        assertNotNull(child2);
        assertEquals("Become a vendor child page", child2.getLabel());
        assertEquals("/content/neom/en-us/become-a-vendor/become-a-vendor-child.html", child2.getHref());
        assertEquals("_blank", child2.getTarget());
    }

    @Test void testFormFieldWhenValidationFieldsAreEmpty(AemContext aemContext) {
        String copyrightText =
                COPYRIGHT + StringUtils.SPACE + Calendar.getInstance().get(Calendar.YEAR) + StringUtils.SPACE + "NEOM";
        FooterModel footerModel =
                aemContext.currentResource(RESOURCE_PATH).adaptTo(FooterModel.class);
        assertEquals(copyrightText, footerModel.getCopyrightText());
    }
}