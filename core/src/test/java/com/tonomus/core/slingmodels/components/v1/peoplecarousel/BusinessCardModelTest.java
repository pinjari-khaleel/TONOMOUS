package com.tonomus.core.slingmodels.components.v1.peoplecarousel;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Unit test for BusinessCardModel class.
 */
@ExtendWith(AemContextExtension.class)
class BusinessCardModelTest {

  public static final String JSON_FILE = "/components/c86-people-carousel/business-card.json";

  private static final String CONTENT_PATH = "/content/neom/some-page";

  private static final String RES_PATH =
      CONTENT_PATH + "/jcr:content/root/responsivegrid/some_component";

  @BeforeEach
  void setUp(AemContext context) {
    context.addModelsForClasses(ImageCarouselItemModel.class);
    context.load().json(JSON_FILE, RES_PATH);
  }

  @Test
  void testAdapting(AemContext context) {
    final Resource currentResource = context.currentResource(RES_PATH);
    assertNotNull(currentResource);
    final BusinessCardModel model = currentResource.adaptTo(BusinessCardModel.class);
    assertNotNull(model);
    final JobDescription job = model.getJob();
    assertNotNull(job);
    assertEquals("Chief Executive Officer", job.getTitle());
    assertEquals("NEOM Tech and Digital", job.getDepartment());
    assertEquals(
        "Joseph Bradley is the strategic mind behind the vision that drives Tonomus, shaping the "
            + "creation of a full-scale ecosystem of cognitive technologies. By harnessing the "
            + "power of artificial intelligence, the internet of things, blockchain and robotics,"
            + " he and his team are bringing cognition to life.", model.getBiography());
    assertEquals("#", model.getLinkedin());
    // Images are tested in ImageCarouselModelTest.class
  }

  @Test
  void testModel() {
    AemContext context = new AemContext();
    context.load().json("/components/c86-people-carousel/people-carousel.json", CONTENT_PATH);
    BusinessCardModel model = context.resourceResolver().getResource(CONTENT_PATH + "/jcr:content/root/responsivegrid/peoplecarousel/business_card_1944128410")
        .adaptTo(BusinessCardModel.class);
    assertNotNull(model);
    assertEquals("https://www.linkedin.com/in/josephmbradley/", model.getLinkedin());
    assertEquals("Sample", model.getJob().getDepartment());
    assertEquals("Chief Executive Officer", model.getJob().getTitle());
    assertNotNull(model.getBiography());
  }
}
