package com.tonomus.core.slingmodels.components.v1.downloads;

import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class DownloadsComponentGetSetTest {

  @Test
  @DisplayName("Test all getters and setters of DownloadItemsModel")
  void getterSetterDownloadItemsModelMethodsTest() {
    assertPojoMethodsForAll(DownloadItemsModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }

  @Test
  @DisplayName("Test all getters and setters of DownloadsComponentModel")
  void getterSetterDownloadsComponentModelMethodsTest() {
    assertPojoMethodsForAll(DownloadsComponentModel.class)
        .testing(Method.CONSTRUCTOR, Method.GETTER).areWellImplemented();
  }
}
