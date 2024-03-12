package com.tonomus.core.servlets.forms.v2;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

import com.drew.lang.annotations.NotNull;
import com.google.gson.Gson;
import com.tonomus.core.models.GenericPayloadResponse;
import com.tonomus.core.services.impl.v2.EndpointResponse;
import com.tonomus.core.services.v2.TonomusRecaptchaValidationService;
import com.tonomus.core.services.v2.FormFactoryConfigService;
import com.tonomus.core.services.v2.FormMandatoryFieldValidationService;
import com.tonomus.core.services.v2.TonomusFormCollectorConfigService;
import com.tonomus.core.services.v2.TonomusFormCollectorService;
import com.tonomus.core.servlets.forms.v2.helper.FormRequest;
import com.tonomus.core.servlets.forms.v2.helper.TonomusFormsCollectorRequestBuilder;
import com.tonomus.core.slingmodels.components.v2.form.impl.ContainerModelImpl;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.xss.XSSAPI;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import static com.tonomus.core.constants.Constants.EQUAL;
import static com.tonomus.core.constants.Constants.ERROR_FORM_SERVLET;
import static com.tonomus.core.constants.Constants.PARAM_G_RECAPTCHA_RESPONSE;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.apache.sling.api.servlets.ServletResolverConstants.SLING_SERVLET_METHODS;
import static org.apache.sling.api.servlets.ServletResolverConstants.SLING_SERVLET_EXTENSIONS;
import static org.apache.sling.api.servlets.ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES;

@Slf4j
@Component(service = Servlet.class, immediate = true, property = {
    Constants.SERVICE_DESCRIPTION + EQUAL + "Tonomus - Form Servlet",
    SLING_SERVLET_RESOURCE_TYPES + EQUAL + ContainerModelImpl.RESOURCE_TYPE,
    SLING_SERVLET_RESOURCE_TYPES + EQUAL + "tonomus/components/structure/tonomus-base-page-v2",
    SLING_SERVLET_EXTENSIONS + EQUAL + FormServlet.EXTENSION,
    SLING_SERVLET_METHODS + EQUAL + HttpConstants.METHOD_POST })
public class FormServlet extends SlingAllMethodsServlet {

  public static final String EXTENSION = "form";

  @Reference
  private transient TonomusRecaptchaValidationService tonomusRecaptchaValidationService;

  @Reference
  private transient FormMandatoryFieldValidationService formMandatoryFieldValidationService;

  @Reference
  private transient FormFactoryConfigService formFactoryConfigService;

  @Reference
  private transient TonomusFormCollectorConfigService tonomusFormCollectorConfigService;

  @Reference
  private transient TonomusFormCollectorService tonomusFormCollectorService;

  @Reference
  private transient XSSAPI xssapi;

  /**
   * Post request processor.
   * 
   * @param request  http request
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
      log.error(ERROR_FORM_SERVLET + "Exception occurred while processing POST request", e.getMessage());
      GenericPayloadResponse payload = new GenericPayloadResponse(
          HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
          Optional.ofNullable(e.getMessage()).orElse(GenericPayloadResponse.MESSAGE_500));
      response.getWriter().write(new Gson().toJson(payload));
      response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Request processing logic.
   * 
   * @param request  incoming request
   * @param response outgoing response
   * @throws ServletException servlet exception
   * @throws IOException      IO exception
   */
  private void processRequest(SlingHttpServletRequest request, SlingHttpServletResponse response)
      throws ServletException, IOException {
    
    final String recaptcha = request.getParameter(PARAM_G_RECAPTCHA_RESPONSE);

    if (!tonomusRecaptchaValidationService.validate(recaptcha)) {    
      throw new ServletException(ERROR_FORM_SERVLET + "Invalid recaptcha response");
    }

    FormRequest formRequest = new FormRequest(request, xssapi);
    TonomusFormsCollectorRequestBuilder collectorRequestBuilder = new TonomusFormsCollectorRequestBuilder(formRequest,
        formFactoryConfigService, tonomusFormCollectorConfigService.getSiteKey());
    Map<String, Object> data = collectorRequestBuilder.build();
    
    formMandatoryFieldValidationService.validate(data);
    
    EndpointResponse<String> collectorResponse = tonomusFormCollectorService.sendFormData(data);
    if (isNotBlank(collectorResponse.getData())) {
      response.getWriter().write(collectorResponse.getData());
    } else {
      throw new ServletException(ERROR_FORM_SERVLET +
          "No data received from the Neom Forms Collector endpoint. Response code: "
              + collectorResponse.getResponseCode());
    }
    response.setStatus(collectorResponse.getResponseCode());
  }

}
