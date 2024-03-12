package com.tonomus.core.servlets.search;

import static com.adobe.granite.rest.Constants.CT_JSON;
import static com.tonomus.core.constants.Constants.DEFAULT_LOCALE;
import static com.tonomus.core.constants.Constants.EQUAL;
import static com.tonomus.core.constants.Constants.ERROR_SEARCH_SERVLET;
import static com.tonomus.core.constants.Constants.HEADER_ACCEPT_LANGUAGE;
import static com.tonomus.core.constants.Constants.HEADER_CONTENT_LANGUAGE;
import static javax.servlet.http.HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
import static javax.servlet.http.HttpServletResponse.SC_OK;
import static org.apache.sling.api.servlets.ServletResolverConstants.SLING_SERVLET_METHODS;

import java.io.IOException;
import java.util.Optional;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.xss.XSSAPI;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.drew.lang.annotations.NotNull;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.tonomus.core.models.GenericPayloadResponse;
import com.tonomus.core.services.v2.SearchResultService;
import com.tonomus.core.slingmodels.components.v2.search.SearchModelImpl;

import lombok.extern.slf4j.Slf4j;

@Component(service = Servlet.class, property = {
    Constants.SERVICE_DESCRIPTION + EQUAL + "Tonomus - Search Servlet",
    ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + EQUAL
        + SearchModelImpl.RESOURCE_TYPE,
    SLING_SERVLET_METHODS + EQUAL + HttpConstants.METHOD_GET })
@Slf4j
public class SearchServlet extends SlingSafeMethodsServlet {

  @Reference
  private transient SearchResultService searchResultService;

  @Reference
  private transient XSSAPI xssapi;

  private static final String QUERY = "query";

  @Override
  protected void doGet(@NotNull SlingHttpServletRequest request,
      @NotNull SlingHttpServletResponse response) throws ServletException, IOException {

    final String languageContent = Optional.ofNullable(xssapi.encodeForHTML(request.getHeader(HEADER_ACCEPT_LANGUAGE)))
        .orElse(DEFAULT_LOCALE);

    response.setContentType(CT_JSON);
    response.setHeader(HEADER_CONTENT_LANGUAGE, languageContent);
    try {
      processRequest(request, response, languageContent);
    } catch (Exception e) {
      log.error(ERROR_SEARCH_SERVLET + "Exception occurred while processing POST request.", e.getMessage());
      GenericPayloadResponse payload = new GenericPayloadResponse(SC_INTERNAL_SERVER_ERROR,
          Optional.ofNullable(e.getMessage()).orElse(GenericPayloadResponse.MESSAGE_500));
      response.getWriter().write(new Gson().toJson(payload));
      response.setStatus(SC_INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Request processing logic.
   * 
   * @param request  incoming request
   * @param response outgoing response
   * @throws IOException IO exception
   */
  private void processRequest(SlingHttpServletRequest request, SlingHttpServletResponse response, final String languageContent)
      throws IOException {

    final String searchText = xssapi.encodeForXML(xssapi.encodeForHTML(request.getParameter(QUERY)));

    if (StringUtils.isBlank(searchText)) 
      throw new NullPointerException("Query parameter is empty.");

    JsonObject result = searchResultService.searchResultFullTextOnPDFAssetsAndPages(request.getResourceResolver(), searchText,
        languageContent);

    response.getWriter().write(result.toString());
    response.setStatus(SC_OK);
  }

}
