package com.tonomus.core.services.impl.v2;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import static com.tonomus.core.constants.Constants.ERROR_TONOMUSRECAPTCHAVALIDATIONSERVICE;

import java.util.Map;
import java.util.Optional;

import com.tonomus.core.services.v2.TonomusRecaptchaValidationService;
import com.tonomus.core.services.v2.TonomusRecaptchaConfigService;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * Google Recaptcha validation service.
 * The service is responsible for interaction with the Google API to provide validation.
 * In case of any failure during the interaction, captcha will be considered as false.
 */
@Slf4j
@Component
public class TonomusRecaptchaValidationServiceImpl extends AbstractHttpClient
    implements TonomusRecaptchaValidationService {

  /**
   * Inject GoogleRecaptchaConfigService.
   */
  @Reference
  private TonomusRecaptchaConfigService tonomusRecaptchaConfigService;

  /**
   * Secret parameter name.
   */
  private static final String SECRET_PARAMETER = "secret";

  /**
   * Response parameter name.
   */
  private static final String RESPONSE_PARAMETER = "response";

  /**
   * Required for AbstractHttpClient.
   */
  @Reference
  @Getter
  private HttpClientBuilderFactory httpClientBuilderFactory;

  /**
   * Google Recaptcha validation response.
   */
  class GoogleRecaptchaResponse {
    /**
     * Validation flag.
     */
    private boolean success;
  }

  /**
   * 
   * @param captchaResponse
   * @return 
   */
  @Override
  public boolean validate(String captchaResponse) {
    try {
      if (StringUtils.isEmpty(captchaResponse)) {
        log.error(ERROR_TONOMUSRECAPTCHAVALIDATIONSERVICE +"Recaptcha token is missing.");
        return false;
      }
      return validateCaptcha(captchaResponse);
    } catch (Exception e) {
      log.error(ERROR_TONOMUSRECAPTCHAVALIDATIONSERVICE +"Exception occurred while validating recaptcha token.");
      return false;
    }
  }

  /**
   * 
   * @param captchaResponse
   * @return
   */
  private boolean validateCaptcha(String captchaResponse) {
    HttpPost postRequest = new HttpPost(tonomusRecaptchaConfigService.getSiteVerifyURL());
    Map<String, String> payload = Map.of(SECRET_PARAMETER, tonomusRecaptchaConfigService.getSecretKey(),
        RESPONSE_PARAMETER, captchaResponse);
    addPayload(postRequest, payload);
    return Optional.of(executeRequest(GoogleRecaptchaResponse.class, postRequest))
        .map(EndpointResponse::getData).map(data -> ((GoogleRecaptchaResponse) data).success)
        .orElse(false);
  }

}
