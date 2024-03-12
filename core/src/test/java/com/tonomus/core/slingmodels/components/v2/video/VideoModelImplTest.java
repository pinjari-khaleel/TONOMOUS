package com.tonomus.core.slingmodels.components.v2.video;

import pl.pojo.tester.api.FieldPredicate;
import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.adobe.cq.wcm.core.components.models.Embed;
import com.tonomus.core.constants.Constants;
import com.tonomus.core.utils.AppAemContextUtils;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsFor;

@ExtendWith(AemContextExtension.class)
class VideoModelImplTest {

  private static final String CONTENT_PAGE = "/content/tonomus/en-us";

  private final AemContext context = AppAemContextUtils.appAemContextWithCoreComponent();

  @Test
  void getterModelTest() {
    assertPojoMethodsFor(VideoModelImpl.class, FieldPredicate.exclude("resource"))
      .testing(Method.GETTER).areWellImplemented();
  }

  @BeforeEach
  void setUp() {
    final String COMPONENT = "../ui.apps/src/main/content/jcr_root/apps/tonomus/components/content/components/video/v2/video/.content.xml";
    final String format = Constants.VIDEO + Constants.SLASH + Constants.MP4;
    context.load().fileVaultXml(COMPONENT, "/apps/" + VideoModelImpl.RESOURCE_TYPE);
    context.load().json("/components/video/video.json", CONTENT_PAGE);
    context.create().asset("/content/dam/video.mp4", 600, 600, format, Constants.DC_FORMAT, format);
  }

  @Test
  void testGetModelImpl() {
    context.currentResource(CONTENT_PAGE + "/jcr:content/root/component");  
    VideoModelImpl model = context.request().adaptTo(VideoModelImpl.class);  
    assertNotNull(model);
    assertNotNull(model.getEmbed());
    assertEquals(Constants.INTERNAL, model.getVideoType());
    assertEquals("/content/dam/video.mp4", model.getSrc());
    assertEquals("/content/dam/tonomus/components/tonomus-events/tonomus-events-image01.png", model.getPoster());
    assertEquals("video/mp4", model.getMediaType());
  }

  @Test
  void testInterface() {
    context.currentResource(CONTENT_PAGE + "/jcr:content/root/component-html");
    VideoModel model = context.request().adaptTo(VideoModel.class);
    assertNotNull(model);
    assertNotNull(model.getEmbed());
    assertEquals(Embed.Type.HTML, model.getEmbed().getType());
  }
}
