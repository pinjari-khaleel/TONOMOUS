package com.tonomus.core.slingmodels.components.v1.whatwedo;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
public class OpportunityCardModelTest {

    private static final String CONTENT_PAGE = "/content/neom/en-us";

    @BeforeEach
    void setUp(AemContext context) {
        context.load().json("/components/c97-opportunity-card/c97-opportunity-card.json", CONTENT_PAGE);
    }

    @Test
    void testModel(AemContext context) {
        OpportunityCardModel model = context.resourceResolver()
                .getResource(CONTENT_PAGE + "/jcr:content/root/responsivegrid/opportunity_cards")
                .adaptTo(OpportunityCardModel.class);

        assertNotNull(model);
    }
}
