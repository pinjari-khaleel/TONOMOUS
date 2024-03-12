package com.tonomus.core.slingmodels.components.v2.cardwithicon;

import com.tonomus.core.utils.AppAemContextUtils;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import pl.pojo.tester.api.assertion.Method;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsFor;

@ExtendWith(AemContextExtension.class)
public class CardWithIconModelImplTest {
    private static final String MOCK_DATA_FILE = "/components/cardwithicon/cardwithicon.json";
    private static final String BASE_CONTENT = "/content/tonomus";

    private final AemContext context = AppAemContextUtils.appAemContextWithCoreComponent();

    @BeforeEach
    public void setup() {
        final String COMPONENT = "../ui.apps/src/main/content/jcr_root/apps/tonomus/components/content/components/card-with-icon/v2/card-with-icon/.content.xml";
        context.load().fileVaultXml(COMPONENT, "/apps/" + CardWithIconModelImpl.RESOURCE_TYPE);
        context.load().json(MOCK_DATA_FILE, BASE_CONTENT);
    }

    @Test
    void getterModelTest() {
        assertPojoMethodsFor(CardWithIconModelImpl.class).testing(Method.GETTER).areWellImplemented();
    }

    @Test
    void testGetModelImpl() {
        context.currentResource(BASE_CONTENT + "/jcr:content/root/component");
        CardWithIconModelImpl model = context.request().adaptTo(CardWithIconModelImpl.class);
        assertNotNull(model);
        assertNotNull(model.getTeaser());
    }

    @Test
    void testInterface() {
        context.currentResource(BASE_CONTENT + "/jcr:content/root/component");
        CardWithIconModel model = context.request().adaptTo(CardWithIconModel.class);
        assertNotNull(model);
        assertNotNull(model.getTeaser());
    }
}
