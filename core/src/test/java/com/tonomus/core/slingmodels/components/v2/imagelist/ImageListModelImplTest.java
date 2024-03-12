package com.tonomus.core.slingmodels.components.v2.imagelist;

import com.tonomus.core.utils.AppAemContextUtils;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(AemContextExtension.class)
public class ImageListModelImplTest {

    private static final String MOCK_DATA_FILE = "/components/imagelist/imagelist.json";
    private static final String BASE_CONTENT = "/content";

    private final AemContext context = AppAemContextUtils.appAemContextWithCoreComponent();

    @BeforeEach
    public void setup(AemContext context) {
        context.load().json(MOCK_DATA_FILE, BASE_CONTENT);
    }

    @Test
    void testGetModelImpl() {
        ImageListModelImpl model = context.resourceResolver().getResource(BASE_CONTENT+"/component-no-images").adaptTo(ImageListModelImpl.class);
        assertNotNull(model);
        assertNotNull(model.getImages());
        assertEquals(0, model.getImages().size());
    }

    @Test
    void testInterface() {
        ImageListModel model = context.resourceResolver().getResource(BASE_CONTENT).adaptTo(ImageListModel.class);
        assertNotNull(model);
        assertNotNull(model.getImages());
        assertEquals(3, model.getImages().size());
    }

}
