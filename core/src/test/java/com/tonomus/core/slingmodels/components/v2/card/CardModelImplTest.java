package com.tonomus.core.slingmodels.components.v2.card;

import pl.pojo.tester.api.FieldPredicate;
import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.day.cq.dam.api.DamConstants;
import com.tonomus.core.constants.Constants;
import com.tonomus.core.utils.AppAemContextUtils;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsFor;

@ExtendWith(AemContextExtension.class)
class CardModelImplTest {

  private static final String CONTENT_PAGE = "/content/tonomus/en-us";

  private final AemContext context = AppAemContextUtils.appAemContextWithCoreComponent();

  private final String format = Constants.VIDEO + Constants.SLASH + Constants.MP4;

  @Test
  void getterModelTest() {
    assertPojoMethodsFor(CardModelImpl.class, FieldPredicate.exclude("resource", "id")).testing(Method.GETTER).areWellImplemented();
  }

  @BeforeEach
  void setUp() {
    final String COMPONENT = "../ui.apps/src/main/content/jcr_root/apps/tonomus/components/content/components/card/v2/card/.content.xml";
    context.load().fileVaultXml(COMPONENT, "/apps/" + CardModelImpl.RESOURCE_TYPE);
    context.load().json("/components/card/card.json", CONTENT_PAGE);
    context.create().asset("/content/dam/video.mp4", 600, 600, format, DamConstants.DC_FORMAT, format);
    context.create().asset("/content/dam/image.png", 600, 600, "image/png");
  }

  @Test
  void testGetModelImpl() {
    context.currentResource(CONTENT_PAGE + "/jcr:content/root/component");
    CardModelImpl model = context.request().adaptTo(CardModelImpl.class);
    assertNotNull(model);
    assertNotNull(model.getTeaser());
    assertEquals("/content/dam/video.mp4", model.getVideo().getSrc());
  }

  @Test
  void testInterface() {
    context.currentResource(CONTENT_PAGE + "/jcr:content/root/component");
    CardModel model = context.request().adaptTo(CardModel.class);
    assertNotNull(model);
    assertNotNull(model.getTeaser());
    assertEquals("/content/dam/video.mp4", model.getVideo().getSrc());
    assertEquals(format, model.getVideo().getMediaType());
    assertEquals("/content/dam/image.png", model.getImageFileReference());
  }
}
