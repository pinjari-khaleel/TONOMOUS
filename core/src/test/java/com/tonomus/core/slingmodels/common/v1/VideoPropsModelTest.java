package com.tonomus.core.slingmodels.common.v1;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.FieldPredicate;
import pl.pojo.tester.api.assertion.Method;

import java.util.Collections;
import java.util.Enumeration;
import java.util.Locale;
import java.util.ResourceBundle;

import com.drew.lang.annotations.NotNull;
import com.tonomus.core.constants.Constants;
import com.tonomus.core.models.dmedia.DynamicMediaPropsModel;
import com.tonomus.core.slingmodels.components.v1.heroslider.HeroSliderModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.i18n.ResourceBundleProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.osgi.service.component.ComponentConstants;

import static junitx.framework.Assert.assertFalse;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsFor;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(AemContextExtension.class)
class VideoPropsModelTest {
  private static final String CONTENT_PATH = "/content/tonomus/en-us/komarov-test2";

  @Test
  void videoSourceInit(AemContext aemContext) {
    aemContext.load().json(
        "/components/c56-full-width-media/c56-full-width-media-ignoreDynamicTrue.json",
        CONTENT_PATH);
    ComponentBackgroundModel model = aemContext.currentResource(CONTENT_PATH + "/jcr:content/root"
        + "/responsivegrid"
        + "/c56_full_width_media").adaptTo(ComponentBackgroundModel.class);
    VideoPropsModel.VideoSource source = model.getVideo().getProps().getSources().get(0);
    assertEquals("/content/dam/tonomus/prev/teaser-video.mp4", source.getSrc());
   assertTrue(source.isIgnoreDynamicMedia());
  }

  @Test
  void videoConfigDefaultSrcInit(AemContext aemContext) {
    aemContext.load().json(
            "/components/c56-full-width-media/c56-full-width-media-ignoreDynamicTrue.json",
            CONTENT_PATH);

    final ResourceBundle i18n = new ResourceBundle() {
      @Override
      protected Object handleGetObject(@NotNull String key) {
        return key;
      }

      @Override
      public Enumeration<String> getKeys() {
        return Collections.emptyEnumeration();
      }
    };

    final ResourceBundleProvider i18nProvider = mock(ResourceBundleProvider.class);
    doReturn(i18n).when(i18nProvider).getResourceBundle(any(Locale.class));

    aemContext.registerService(ResourceBundleProvider.class, i18nProvider,
            ComponentConstants.COMPONENT_NAME, Constants.I18N_RESOURCE_BUNDLE_PROVIDER_CLASS);

    ComponentBackgroundModel model = aemContext.currentResource(CONTENT_PATH + "/jcr:content/root"
            + "/responsivegrid"
            + "/c56_full_width_media").adaptTo(ComponentBackgroundModel.class);
    VideoPropsModel videoPropsModel = model.getVideo().getProps();
    assertEquals("/content/dam/tonomus/joshua-1080p-flipped-compressed.mp4", videoPropsModel.getVideo().getSrc());
  }

  @Test
  void videoSourceInitIgnoreDynamicFalse(AemContext aemContext) {
    aemContext.load().json(
        "/components/c56-full-width-media/c56-full-width-media-ignoreDynamicFalse.json",
        CONTENT_PATH);
    ComponentBackgroundModel model = aemContext.currentResource(CONTENT_PATH + "/jcr:content/root"
        + "/responsivegrid"
        + "/c56_full_width_media").adaptTo(ComponentBackgroundModel.class);
    VideoPropsModel.VideoSource source = model.getVideo().getProps().getSources().get(0);
    assertEquals("/content/dam/tonomus/prev/teaser-video.mp4", source.getSrc());
    assertFalse(source.isIgnoreDynamicMedia());
  }

  @Test
  void videoSourceInitYoutube(AemContext aemContext) {
    aemContext.load().json(
        "/components/c56-full-width-media/c56-full-width-media-youtube-video.json",
        CONTENT_PATH);
    ComponentBackgroundModel model = aemContext.currentResource(CONTENT_PATH + "/jcr:content/root"
        + "/responsivegrid"
        + "/c56_full_width_media").adaptTo(ComponentBackgroundModel.class);
    String source = model.getVideo().getProps().getYoutube();
    assertEquals("ey4fiZe7DdA", source);
  }

  @Test
  void imageOnly(AemContext aemContext) {
    aemContext.load().json("/components/c56-full-width-media/c56-full-width-media-separately.json",
        CONTENT_PATH);
    ComponentBackgroundModel model = aemContext.currentResource(CONTENT_PATH + "/jcr:content/root"
        + "/responsivegrid"
        + "/c56_full_width_media_image_only").adaptTo(ComponentBackgroundModel.class);
    assertNotNull(model);
    assertNotNull(model.getImage().getSrc());
    assertNull(model.getVideo().getProps().getSources());
  }

  @Test
  void videoOnly(AemContext aemContext) {
    aemContext.load().json("/components/c56-full-width-media/c56-full-width-media-separately.json",
        CONTENT_PATH);
    ComponentBackgroundModel model = aemContext.currentResource(CONTENT_PATH + "/jcr:content/root"
        + "/responsivegrid"
        + "/c56_full_width_media_video_only").adaptTo(ComponentBackgroundModel.class);
    assertNotNull(model);
    assertNull(model.getImage().getSrc());
    assertNotNull(model.getVideo().getProps().getSources());
  }

  @Test
  void testVideoControlButtonsText(AemContext aemContext) {
       final ResourceBundle i18n = new ResourceBundle() {
      @Override protected Object handleGetObject(@NotNull String key) {
        return key;
      }

      @Override public Enumeration<String> getKeys() {
        return Collections.emptyEnumeration();
      }
    };
    final ResourceBundleProvider i18nProvider = mock(ResourceBundleProvider.class);
    doReturn(i18n).when(i18nProvider).getResourceBundle(any(Locale.class));
    aemContext.registerService(ResourceBundleProvider.class, i18nProvider,
            ComponentConstants.COMPONENT_NAME, Constants.I18N_RESOURCE_BUNDLE_PROVIDER_CLASS);

    aemContext.load().json("/components/c22-hero/c22-hero.json", "/content/tonomus/en-us/c22-test");
    String RESOURCE_PATH = "/content/tonomus/en-us/c22-test/jcr:content/root/responsivegrid/c22_hero_component";
    VideoPropsModel
        videoPropsModel = aemContext.currentResource(RESOURCE_PATH).adaptTo(VideoPropsModel.class);

    VideoPropsModel.ButtonsText copy = videoPropsModel.getCopy();
    assertEquals(Constants.PLAY_VIDEO, copy.getPlay());
    assertEquals(Constants.PAUSE_VIDEO, copy.getPause());
    assertEquals(Constants.MUTE_VIDEO, copy.getMute());
    assertEquals(Constants.UNMUTE_VIDEO, copy.getUnmute());
    assertEquals(Constants.ENTER_FULL_SCREEN, copy.getEnterFullScreen());
    assertEquals(Constants.EXIT_FULL_SCREEN, copy.getExitFullScreen());
  }

  @Test void initializePredefinedSourcesTest(AemContext aemContext) {
    aemContext.load().json("/components/c12-hero-slider/c12-hero-slider.json", CONTENT_PATH);
    aemContext.load().json("/common/video-asset/video.json", "/content/dam/tonomus");
    Resource resource = aemContext.currentResource(
        CONTENT_PATH + "/jcr:content/root/responsivegrid/c12_hero_slider");
    Resource videoResource = aemContext.currentResource("/content/dam/tonomus");
    assertNotNull(resource);
    assertNotNull(videoResource);
    HeroSliderModel hero = resource.adaptTo(HeroSliderModel.class);
    assertNotNull(hero);
    VideoPropsModel propsModel = hero.getItems().get(0).getBackground().getVideo().getProps();
    assertNotNull(propsModel);
    DynamicMediaPropsModel dmPropsModel = DynamicMediaPropsModel.of(videoResource);
    propsModel.initializePredefinedSources(dmPropsModel);
    assertEquals(4, propsModel.getSources().size());
    assertNotNull(propsModel.getSources().get(1).getSrc());
    assertTrue(propsModel.getSources().get(1).getSrc()
        .contains("https://neom.scene7.com/is/content/neomstage/SND%2015%20A%20V2_Graded_220914-%20MC%20-%2016x9"));
    assertNotNull(propsModel.getSources().get(1).getMedia());
  }

  @Test
  void assertGetterSetterMethods(){
    assertPojoMethodsForAll(VideoPropsModel.ButtonsText.class)
            .testing(Method.GETTER).areWellImplemented();
    assertPojoMethodsFor(VideoPropsModel.class, FieldPredicate.include("sources", "muted", 
            "loop", "disablePreload", "playsInline")).testing(Method.SETTER).areWellImplemented();
  }
}
