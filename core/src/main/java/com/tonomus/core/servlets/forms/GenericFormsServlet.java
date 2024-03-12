package com.tonomus.core.servlets.forms;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

import com.drew.lang.annotations.NotNull;
import com.google.gson.Gson;
import com.tonomus.core.legacy.cloud.CloudServiceConfiguration;
import com.tonomus.core.legacy.cloud.FormCollectorConfiguration;
import com.tonomus.core.legacy.cloud.GoogleRecaptchaConfiguration;
import com.tonomus.core.legacy.cloud.ResourceCloudServices;
import com.tonomus.core.services.CaptchaValidationService;
import com.tonomus.core.services.FormMandatoryFieldValidationService;
import com.tonomus.core.services.NeomFormsCollectorService;
import com.tonomus.core.services.impl.EndpointResponse;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import static com.tonomus.core.constants.Constants.EQUAL;
import static com.tonomus.core.constants.Constants.PARAM_G_RECAPTCHA_RESPONSE;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.apache.sling.api.servlets.ServletResolverConstants.SLING_SERVLET_METHODS;

/**
 * Neom - Generic Forms Servlet. (c59 for now).
 * Should be extended to process newsroom form submission.
 */
@Component(service = Servlet.class,
           property = {Constants.SERVICE_DESCRIPTION + EQUAL + "Neom - Generic Forms Servlet",
               ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + EQUAL
                   + com.tonomus.core.constants.Constants.C92_RESOURCE_TYPE,
               ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + EQUAL
                   + com.tonomus.core.constants.Constants.O45_FORM_WRAPPER_RESOURCE_TYPE,
               ServletResolverConstants.SLING_SERVLET_EXTENSIONS + EQUAL + "form",
               SLING_SERVLET_METHODS + EQUAL + HttpConstants.METHOD_POST})
@Slf4j
public class GenericFormsServlet extends SlingAllMethodsServlet {

  /**
   * CaptchaValidationService.
   */
  @Reference
  private transient CaptchaValidationService captchaValidationService;

  @Reference
  private transient FormMandatoryFieldValidationService formMandatoryFieldValidationService;

  /**
   * NeomFormsCollectorService.
   */
  @Reference
  private transient NeomFormsCollectorService neomFormsCollectorService;

  /**
   * Post request processor.
   * @param request http request
   * @param response http response
   * @throws IOException IO exception
   */
  @Override
  protected void doPost(@NotNull final SlingHttpServletRequest request,
      @NotNull final SlingHttpServletResponse response)
      throws IOException {
    try {
      processRequest(request, response);
    } catch (Exception e) {
      log.error("Error during request: ", e);
      FormResponse formResponse = new FormResponse(
              HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
              Optional.ofNullable(e.getMessage()).orElse("Something went wrong. Please try it later."));
      response.getWriter().write(new Gson().toJson(formResponse));
      response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Request processing logic.
   * @param request incoming request
   * @param response outgoing response
   * @throws ServletException servlet exception
   * @throws IOException IO exception
   */
  private void processRequest(SlingHttpServletRequest request, SlingHttpServletResponse response)
          throws ServletException, IOException {
    ResourceCloudServices cloudServices = new ResourceCloudServices(request.getResource());
    GoogleRecaptchaConfiguration recaptchaConfiguration =
            cloudServices.getConfiguration(CloudServiceConfiguration.GOOGLE_RECAPTCHA);

    // captcha validation
    final String recaptcha = request.getParameter(PARAM_G_RECAPTCHA_RESPONSE);
    final String recaptchaSecretKey = recaptchaConfiguration.getReCaptchaSecretKey();
    if (!captchaValidationService.validate(recaptchaSecretKey, recaptcha)) {
      throw new ServletException("Invalid recaptcha response");
    }

    FormCollectorConfiguration collectorConfiguration =
            cloudServices.getConfiguration(CloudServiceConfiguration.FORM_COLLECTOR);
    FormRequest formRequest = new FormRequest(request);   
        FormsCollectorRequestBuilder collectorRequestBuilder =
            new FormsCollectorRequestBuilder(formRequest, request.getResource(),
                    collectorConfiguration.getApiKey());
        Map<String, Object> data = collectorRequestBuilder.build();
     
    // required field validation
    formMandatoryFieldValidationService.validate(data);

    EndpointResponse<String> collectorResponse = neomFormsCollectorService
            .sendFormData(collectorConfiguration.getUrl(), data);
    if (isNotBlank(collectorResponse.getData())) {
      response.getWriter().write(collectorResponse.getData());
    } else {
      throw new ServletException(
              "No data received from the Neom Forms Collector endpoint. Response code: "
                      + collectorResponse.getResponseCode());
    }
    response.setStatus(collectorResponse.getResponseCode());
  }

}
