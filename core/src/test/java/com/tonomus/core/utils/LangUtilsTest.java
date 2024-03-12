package com.tonomus.core.utils;

import org.junit.jupiter.api.Test;

import static com.tonomus.core.utils.LangUtils.ENGLISH_LANGUAGE;
import static org.junit.jupiter.api.Assertions.assertEquals;

class LangUtilsTest {

  @Test void testGetCurrentLocale() {
    assertEquals(ENGLISH_LANGUAGE, LangUtils.getCurrentLocale(null).getLanguage());
  }

  @Test void testGetLocalizedCountryName() {
    assertEquals("美国", LangUtils.getLocalizedCountryName("us", "zh"));
    assertEquals("エストニア", LangUtils.getLocalizedCountryName("ee", "ja"));
    assertEquals("Франция", LangUtils.getLocalizedCountryName("fr", "ru"));
    assertEquals("كازاخستان", LangUtils.getLocalizedCountryName("kz", "ar"));
  }
}
