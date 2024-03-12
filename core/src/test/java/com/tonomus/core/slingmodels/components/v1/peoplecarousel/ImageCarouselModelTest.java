package com.tonomus.core.slingmodels.components.v1.peoplecarousel;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import junitx.util.PrivateAccessor;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

import com.adobe.cq.wcm.core.components.models.Carousel;
import com.adobe.cq.wcm.core.components.models.ListItem;
import com.tonomus.core.slingmodels.common.v1.ImageModel;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.factory.ModelFactory;
import org.apache.sling.models.impl.ModelAdapterFactory;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Unit test for ImageCarouselModel class.
 */
@ExtendWith(AemContextExtension.class)
class ImageCarouselModelTest {

  private static final String JSON_FILE =
      "/components/c86-people-carousel/c86-people-carousel.json";

  private static final String PAGE_PATH = "/content/some-page";

  private static final String RES_PATH =
      PAGE_PATH + "/jcr:content/root/responsivegrid/some_component";

  @BeforeEach
  void setUp(AemContext context) {
    context.addModelsForPackage("com.adobe.cq.wcm.core.components");
    context.load().json(JSON_FILE, RES_PATH);
  }

  @Test
  void testAdapting(AemContext context) throws NoSuchFieldException {
    //
    // Test empty List
    //
    final Resource currentResource = context.currentResource(RES_PATH);
    assertNotNull(currentResource);

    final MockSlingHttpServletRequest currentRequest = context.request();

    final ImageCarouselModel model = currentRequest.adaptTo(ImageCarouselModel.class);
    assertNotNull(model);
    assertNotNull(model.getHeading());

    // The resourceSuperType injection doesn't work here, so it always returns empty list,
    // even if we configure full json
    final List<ImageCarouselItemModel> cardItems = model.getThumbnailItems();
    assertNotNull(cardItems);
    assertTrue(CollectionUtils.isEmpty(cardItems));

    //
    // Check the list with updated cards (with thumbnails)
    //
    final String nodeName = "some_business_card";
    final String fullPathToCard = RES_PATH + "/" + nodeName;
    context.load().json(BusinessCardModelTest.JSON_FILE, fullPathToCard);
    final List<ListItem> listItems = Collections.singletonList(new ListItem() {
      @Override
      public String getId() {
        return "some-id";
      }

      @Override
      public String getPath() {
        return fullPathToCard;
      }
    });
    final Carousel coreCarousel = mock(Carousel.class);
    when(coreCarousel.getItems()).thenReturn(listItems);
    PrivateAccessor.setField(model, "coreCarousel", coreCarousel);
    PrivateAccessor.setField(model, "resourceResolver", context.resourceResolver());
    final ModelFactory modelFactory = mock(ModelAdapterFactory.class);
    PrivateAccessor.setField(model, "modelFactory", modelFactory);
    when(modelFactory.canCreateFromAdaptable(any(), any())).thenReturn(true);
    final ImageCarouselItemModel testItem =
        Objects.requireNonNull(context.resourceResolver().getResource(fullPathToCard))
            .adaptTo(ImageCarouselItemModel.class);
    when(modelFactory.createModel(any(), eq(ImageCarouselItemModel.class))).thenReturn(testItem);
    model.initImageCarouselModel();

    final ImageCarouselModel notEmptyModel = currentRequest.adaptTo(ImageCarouselModel.class);
    assertNotNull(notEmptyModel);

    // The resourceSuperType is not set up for unit tests, so it returns empty list
    final List<ImageCarouselItemModel> testItems = notEmptyModel.getThumbnailItems();
    assertNotNull(testItems);
    assertEquals(1, testItems.size());

    final ImageCarouselItemModel toTest = testItems.get(0);
    assertEquals("some-id", toTest.getId());
    assertEquals(nodeName, toTest.getName());
    assertEquals("Joseph Bradley", toTest.getTitle());

    final ImageModel img = toTest.getImage();
    assertNotNull(img);
    assertEquals("Joseph Bradley", img.getAlt());
    assertEquals("/content/dam/neom/demo-assets/image/image.png", img.getSrc());

    final ImageModel thumb = toTest.getThumbnail();
    assertNotNull(thumb);
    assertEquals("Joseph Bradley", thumb.getAlt());
    assertEquals("/content/dam/neom/demo-assets/image/image.png", thumb.getSrc());
  }
}
