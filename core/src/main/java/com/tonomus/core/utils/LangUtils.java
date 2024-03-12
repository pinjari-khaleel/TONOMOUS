package com.tonomus.core.utils;

import java.util.Locale;
import java.util.Objects;
import java.util.ResourceBundle;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

import org.apache.sling.api.resource.Resource;


/**
 * This class contains Language utility methods.
 */
public final class LangUtils {
  /**
   * English language.
   */
  public static final String ENGLISH_LANGUAGE = "en";

  /**
   * Arabic language.
   */
  public static final String ARABIC_LANGUAGE = "ar";

  /**
   * The constant DEFAULT_LOCALE.
   */
  public static final Locale DEFAULT_LOCALE = new Locale(ENGLISH_LANGUAGE);

  /**
   * Gets i18n string value or key.
   *
   * @param i18nBundle the 18 n bundle
   * @param key        the key
   * @return the i18n string or key
   */
  public static String getI18nStringOrKey(final ResourceBundle i18nBundle, final String key) {
    if (Objects.nonNull(key) && i18nBundle.containsKey(key)) {
      return i18nBundle.getString(key);
    }
    return key;
  }

  /**
   * Get current locale by resource.
   * @param resource resource
   * @return locale
   */
  public static Locale getCurrentLocale(Resource resource) {
    if (Objects.isNull(resource)) {
      return LangUtils.DEFAULT_LOCALE;
    }
    PageManager pageManager = resource.getResourceResolver().adaptTo(PageManager.class);
    if (Objects.isNull(pageManager)) {
      return LangUtils.DEFAULT_LOCALE;
    }
    Page currentPage = pageManager.getContainingPage(resource);
    if (Objects.isNull(currentPage) || Objects.isNull(currentPage.getLanguage())) {
      return LangUtils.DEFAULT_LOCALE;
    }
    return currentPage.getLanguage();
  }

  /**
   * Method to get localized name of country.
   *
   * @param countryCode  country code KZ/kz.
   * @param languageCode language code en/fr.
   * @return if country exists in language returns translation or returns english version
   */
  public static String getLocalizedCountryName(final String countryCode,
      final String languageCode) {
    Locale country = new Locale.Builder().setRegion(countryCode).build();
    Locale lang = new Locale.Builder().setLanguage(languageCode).build();
    return country.getDisplayCountry(lang);
  }

  /**
   * Hide constructor.
   */
  private LangUtils() { }
}
