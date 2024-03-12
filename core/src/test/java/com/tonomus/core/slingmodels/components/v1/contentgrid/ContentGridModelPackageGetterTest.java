package com.tonomus.core.slingmodels.components.v1.contentgrid;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class ContentGridModelPackageGetterTest {

  @Test
  @DisplayName("Test all getters and setters of package")
  void getterSetterPackageTest() {
    assertPojoMethodsForAll(ContentGridModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(ContentGridBaseItemModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(ContentGridImageItemModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(ContentGridImageItemModel.ContentGridImageItemContent.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(ContentGridListItemModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(ContentGridListItemModel.ContentGridListItemContent.class,
        ContentGridListItemModel.ListHeaderModel.class, ContentGridListItemModel.ListCopyModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(ContentGridListItemModel.ListItemModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(ContentGridParagraphItemModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(ContentGridParagraphItemModel.ContentGridParagraphItemContent.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();

    assertPojoMethodsForAll(ContentGridVideoItemModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
    assertPojoMethodsForAll(ContentGridVideoItemModel.ContentGridVideoItemContent.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }
}
