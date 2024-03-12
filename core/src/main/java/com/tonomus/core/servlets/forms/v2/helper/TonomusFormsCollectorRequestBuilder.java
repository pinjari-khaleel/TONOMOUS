package com.tonomus.core.servlets.forms.v2.helper;

import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.tonomus.core.services.v2.FormFactoryConfigService;
import com.tonomus.core.utils.LangUtils;

import org.apache.commons.collections4.map.MultiKeyMap;
import org.apache.commons.lang3.StringUtils;

/**
 * Form collector request builder.
 * Class is responsible for preparing data that is to be sent to the external
 * API.
 */
@Slf4j
public class TonomusFormsCollectorRequestBuilder {

  /**
   * Param API Key.
   * Used to identify our system.
   */
  protected static final String API_KEY = "api_key";

  /**
   * Google Analytics Cookie name.
   */
  protected static final String COOKIE_GA = "_ga";

  /**
   * Ecid cookie name.
   */
  protected static final String COOKIE_ECID = "s_ecid";

  /**
   * Oxagon default prefered language.
   */
  protected static final String OXAGON_DEFAULT_PREF_LANG = "English";

  /**
   * Oxagon language parameter.
   */
  protected static final String PARAM_OXAGON_LANGUAGE = "LANGUAGE";

  /**
   * Oxagon interest parameter.
   */
  protected static final String PARAM_OXAGON_INTEREST = "interest";

  /**
   * BQ mc list id parameter.
   */
  protected static final String PARAM_MC_LIST_ID = "mc_list_id";

  /**
   * BQ mc list status parameter.
   */
  protected static final String PARAM_MC_LIST_STATUS = "mc_list_status";

  /**
   * Contact permissions property name.
   */
  protected static final String CONTACT_PERMISSION = "contact-permission";

  /**
   * Country property name.
   */
  protected static final String COUNTRY = "country";

  /**
   * Phone property name.
   */
  protected static final String PHONE = "PHONE";

  /**
   * Country and phone property name. MC required both values to be joined in a
   * single property.
   */
  protected static final String COUNTRY_PHONE = "COUNTRY-PHONE";

  /**
   * Language code property name.
   */
  protected static final String LANG_CODE = "lang_code";

  /**
   * Subsription status
   */
  private static final Map<String, String> SUBSCRIPTION_STATUS_MAP = new HashMap<>();
  static {
    SUBSCRIPTION_STATUS_MAP.put("no", "unsubscribed");
    SUBSCRIPTION_STATUS_MAP.put("yes", "subscribed");
  }

  /**
   * Form request.
   */
  private final FormRequest formRequest;

  /**
   * Form Config
   */
  private final FormFactoryConfigService formFactoryConfigService;

  /**
   * BQ Api Key.
   */
  private final String apiKey;

  /**
   * Constructor.
   *
   * @param formRequest form request
   * @param resource    resource
   * @param apiKey      api key
   */
  public TonomusFormsCollectorRequestBuilder(FormRequest formRequest, FormFactoryConfigService formFactoryConfigService,
      String apiKey) {
    this.formRequest = formRequest;
    this.formFactoryConfigService = Optional
        .ofNullable(formFactoryConfigService.getConfig(formRequest.getParameterMap().getFormId()))
        .orElseThrow(() -> new NullPointerException("Form Id not found in configuration."));
    this.apiKey = apiKey;
  }

  /**
   * Build request.
   *
   * @return request
   */
  public Map<String, Object> build() {
    Map<String, Object> data = new HashMap<>();
    data.put(FormRequestParameterMap.PARAM_FORM_ID, formRequest.getParameterMap().getFormId());

    formRequest.getParameterMap().getParameters().entrySet()
        .forEach(e -> data.put(e.getKey(), e.getValue().getValue()));

    formRequest.getCookieValue(COOKIE_GA).ifPresent(ga -> data.put(COOKIE_GA, ga));
    formRequest.getCookieValue(COOKIE_ECID).ifPresent(ga -> data.put(COOKIE_ECID, ga));

    data.put(API_KEY, apiKey);

    fillAudienceId(data);
    fillSubscriptionStatus(data);
    fillPhoneCountry(data);

    if (!data.containsKey(LANG_CODE)) {
      data.putIfAbsent(PARAM_OXAGON_LANGUAGE, OXAGON_DEFAULT_PREF_LANG);
    }

    return data;
  }

  /**
   * Set country-phone property value.
   *
   * @param data data
   */
  private void fillPhoneCountry(final Map<String, Object> data) {
    StringBuilder phoneCode = new StringBuilder();
    phoneCode.append((data.getOrDefault(COUNTRY, StringUtils.EMPTY)));
    phoneCode.append(data.getOrDefault(PHONE, StringUtils.EMPTY));
    
    if (StringUtils.isNotEmpty(phoneCode)) {
      data.put(COUNTRY_PHONE, phoneCode.toString().trim());
    }
  }

  /**
   * Set audience id.
   *
   * @param data http request properties
   */
  private void fillAudienceId(final Map<String, Object> data) {
    String language = data.getOrDefault(PARAM_OXAGON_LANGUAGE, data.getOrDefault(LANG_CODE, LangUtils.ENGLISH_LANGUAGE))
        .toString();
    String interest = data.getOrDefault(PARAM_OXAGON_INTEREST, StringUtils.EMPTY).toString();
    
    MultiKeyMap<String, String> audiencesMap = formFactoryConfigService.getAudienceIds();
    String mcListId = Optional.ofNullable(audiencesMap.get(language, interest))
        .orElseGet(() -> audiencesMap.get(language, "*"));
    Optional.ofNullable(mcListId).ifPresent(id -> data.put(PARAM_MC_LIST_ID, id));
  }

  /**
   * Set subscription status.
   *
   * @param data http request properties
   */
  private void fillSubscriptionStatus(final Map<String, Object> data) {
    String contactPermissions = data.getOrDefault(CONTACT_PERMISSION, StringUtils.EMPTY).toString();
    if (StringUtils.isNotEmpty(contactPermissions)) {
      data.put(PARAM_MC_LIST_STATUS, SUBSCRIPTION_STATUS_MAP.get(contactPermissions));
    }
  }

}
