package com.tonomus.core.slingmodels.common.v1;

import lombok.extern.slf4j.Slf4j;
import pl.pojo.tester.api.assertion.Method;

import com.tonomus.core.utils.TestUtils;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@Slf4j
class CommonSlingModelsTest extends TestUtils {

  @Test
  @DisplayName("Test all getters of DownloadItemModel")
  void getterDownloadModelMethodsTest() {
    assertPojoMethodsForAll(DownloadModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

  @Test
  @DisplayName("Test PostConstruct method of DownloadItemModel")
  void postConstructDownloadModelMethodsTest() {
    DownloadModel dm = new DownloadModel();
    TextModel tx  = new TextModel();
    tx.setElement("h1");
    dm.setHeading(tx);
    dm.init();
    assertEquals("h1",dm.getHeading().getElement());

    tx.setElement(null);
    dm.setHeading(tx);
    dm.init();
    assertEquals("h3",dm.getHeading().getElement());
  }

  @Test
  @DisplayName("Test all getters of EventTrackingModel")
  void getterEventTrackingModelMethodsTest() {
    assertPojoMethodsForAll(EventTrackingModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

  @Test
  @DisplayName("Test all getters and setters of TextModel")
  void getterSetterTextModelMethodsTest() {
    assertPojoMethodsForAll(TextModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

  @Test
  @DisplayName("Test constructor and getters of LinkModel")
  void getterLinkModelTest() {
    assertPojoMethodsForAll(LinkModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

  @Test
  @DisplayName("Test constructor and getters of FlipHeadingModel")
  void getterFlipHeadingModelTest() {
    assertPojoMethodsForAll(FlipHeadingModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

  @Test
  @DisplayName("Test constructor and getters of HeaderModel")
  void getterHeaderModelTest() {
    assertPojoMethodsForAll(HeaderModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

  @Test
  @DisplayName("Test all getters of SocialModel")
  void getterSocialModelMethodsTest() {
    assertPojoMethodsForAll(SocialModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

  @Test
  @DisplayName("Test all getters and setters of VideoModel")
  void getterSetterVideoModelMethodsTest() {
    assertPojoMethodsForAll(VideoModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

  @Test
  @DisplayName("Test all getters and setters of VideoPropsModel")
  void getterSetterVideoConfigModelMethodsTest() {
    assertPojoMethodsForAll(VideoPropsModel.class)
        .testing(Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(VideoPropsModel.VideoControls.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(VideoPropsModel.VideoSource.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(VideoPropsModel.VideoEventTrackingModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    VideoPropsModel model = new VideoPropsModel();
    model.setControls(new VideoPropsModel.VideoControls());
    assertNotNull(model.getControls());
  }

  @Test
  @DisplayName("Test all getters and setters of SocialItemsModel")
  void getterSetterSocialItemsModelMethodsTest() {
    assertPojoMethodsForAll(SocialItemsModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

  @Test
  @DisplayName("Test all getters in LogoModel")
  void getterLogoModelTest() {
    assertPojoMethodsForAll(LogoModel.class)
            .testing(Method.GETTER).areWellImplemented();
  }

  @Test
  @DisplayName("Test all getters in RunMode")
  void getterRunModeModelTest() {
    assertPojoMethodsForAll(RunMode.class)
        .testing(Method.GETTER).areWellImplemented();
  }

  @Test
  @DisplayName("Test all getters in DataLayerTitlesModel")
  void getterDataLayerTitlesModelTest() {
    assertPojoMethodsForAll(DataLayerInfoModel.class)
        .testing(Method.GETTER).testing(Method.SETTER).areWellImplemented();
  }

  @Test
  @DisplayName("Test all getters in AlignmentModel")
  void getterAlignmentModelTest() {
    assertPojoMethodsForAll(AlignmentModel.class)
        .testing(Method.GETTER).areWellImplemented();
  }

  @Test
  @DisplayName("Test all getters in CommonComponentModel")
  void getterCommonComponentModelTest() {
    assertPojoMethodsForAll(CommonComponentModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

}
