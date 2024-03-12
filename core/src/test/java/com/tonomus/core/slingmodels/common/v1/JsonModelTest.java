package com.tonomus.core.slingmodels.common.v1;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import lombok.AllArgsConstructor;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith({MockitoExtension.class, AemContextExtension.class})
class JsonModelTest {

  private static final String INPUT = "input";

  @Mock
  private SlingHttpServletRequest request;

  @Test void testGetJson_whenRequestAttributeIsNotEmpty(AemContext context) {
    MyClass object = new MyClass(INPUT);

    context.request().setAttribute(INPUT, object);
    JsonModel jsonModel = context.request().adaptTo(JsonModel.class);
    assertEquals("{\"value\":\"input\"}", jsonModel.getJson());
  }

  @Test void testGetJson_whenRequestAttributeIsNotProvided(AemContext context) {
    JsonModel jsonModel = context.request().adaptTo(JsonModel.class);
    assertEquals(StringUtils.EMPTY, jsonModel.getJson());
  }

  @AllArgsConstructor
  private static final class MyClass {
    private final String value;
  }

}