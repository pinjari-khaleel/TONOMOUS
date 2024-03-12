package com.tonomus.core.slingmodels.components.v1;

import lombok.extern.slf4j.Slf4j;
import pl.pojo.tester.api.assertion.Method;

/*import com.tonomus.core.slingmodels.components.v1.accordion.AccordionModel;
import com.tonomus.core.slingmodels.components.v1.article.ArticleListItem;
import com.tonomus.core.slingmodels.components.v1.article.ArticleListModel;
import com.tonomus.core.slingmodels.components.v1.boxedlist.BoxedCardListModel;
import com.tonomus.core.slingmodels.components.v1.boxedlist.BoxedCardModel;*/
import com.tonomus.core.slingmodels.components.v1.carousel.AuthorInfo;
import com.tonomus.core.slingmodels.components.v1.carousel.CarouselItem;
import com.tonomus.core.slingmodels.components.v1.footer.FooterModel;
/*import com.tonomus.core.slingmodels.components.v1.highlights.HighlightItem;
import com.tonomus.core.slingmodels.components.v1.highlights.HighlightsModel;*/
import com.tonomus.core.slingmodels.components.v1.legalcontent.LegalContentModel;
/*import com.tonomus.core.slingmodels.components.v1.motionslider.MotionSliderItemContent;
import com.tonomus.core.slingmodels.components.v1.motionslider.MotionSliderItemModel;
import com.tonomus.core.slingmodels.components.v1.motionslider.MotionSliderModel;
import com.tonomus.core.slingmodels.components.v1.windows.WindowsItem;
import com.tonomus.core.slingmodels.components.v1.windows.WindowsModel;*/
import com.tonomus.core.utils.TestUtils;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@Slf4j
class ComponentSlingModelsTest extends TestUtils {

  /*@Test @DisplayName("Test all getters and setters of AccordionModel and AccordionItem")
  void getterSetterAccordionMethodsTest() {
    assertPojoMethodsForAll(AccordionModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

  @Test @DisplayName("Test all getters and setters of HighlightsModel and HighlightItem")
  void getterSetterHighlightsMethodsTest() {
    assertPojoMethodsForAll(HighlightsModel.class, HighlightItem.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

  @Test @DisplayName("Test all getters and constructors of BoxedCardModel and BoxedCardListModel")
  void getterSetterBoxedItemsMethodsTest() {
    assertPojoMethodsForAll(BoxedCardModel.class, BoxedCardListModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

  @Test @DisplayName("Test all getters and constructor of FullwidthParagraphModel")
  void getterSetterFullwidthParagraphModelMethodsTest() {
    assertPojoMethodsForAll(FullwidthParagraphModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }*/

  @Test @DisplayName("Test all getters and constructor of FooterModel")
  void getterSetterFooterModelMethodsTest() {
    assertPojoMethodsForAll(FooterModel.class).testing(Method.CONSTRUCTOR, Method.GETTER)
        .areWellImplemented();
  }

  @Test @DisplayName("Test all getters and constructor of CarouselItem and AuthorInfo")
  void getterSetterCarouselItemMethodsTest() {
    assertPojoMethodsForAll(CarouselItem.class, AuthorInfo.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

  /*@Test @DisplayName("Test all getters and constructor of WindowsModel and WindowsItem")
  void getterSetterWindowsMethodsTest() {
    assertPojoMethodsForAll(WindowsModel.class, WindowsItem.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

  @Test @DisplayName("Test all getters and constructor of ArticleListModel and ArticleListItem")
  void getterSetterArticleListMethodsTest() {
    assertPojoMethodsForAll(ArticleListModel.class, ArticleListItem.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

  @Test @DisplayName("Test all getters and constructor of ContentColumns")
  void getterSetterContentColumnsMethodsTest() {
    assertPojoMethodsForAll(ContentColumns.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }*/

  @Test @DisplayName("Test all getters and constructor of BaseShareModel")
  void getterSetterBaseShareModelMethodsTest() {
    assertPojoMethodsForAll(BaseShareModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

  /*@Test
  @DisplayName("Test all getters in MotionSliderModel")
  void getterMotionSliderModelTest() {
    assertPojoMethodsForAll(MotionSliderModel.class, MotionSliderItemModel.class,
        MotionSliderItemContent.class).testing(Method.GETTER).areWellImplemented();
  }

  @Test
  @DisplayName("Test all getters in CardsModel")
  void getterCardsModelTest() {
    assertPojoMethodsForAll(CardsModel.class).testing(Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(CardsModel.CardItemModel.class).testing(Method.GETTER).areWellImplemented();
  }

  @Test @DisplayName("Test all getters in SocialMediaModel")
  void getterSocialMediaModelMethodsTest() {
    assertPojoMethodsForAll(SocialMediaModel.class).testing(Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(SocialMediaModel.SocialMediaItemModel.class).testing(Method.CONSTRUCTOR,
        Method.GETTER).areWellImplemented();
  }*/

  @Test @DisplayName("Test all getters in LegalContentModel")
  void getterLegalContentModelMethodsTest() {
    assertPojoMethodsForAll(LegalContentModel.class).testing(Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(LegalContentModel.Accordion.class).testing(Method.CONSTRUCTOR,
        Method.GETTER).areWellImplemented();
  }
}
