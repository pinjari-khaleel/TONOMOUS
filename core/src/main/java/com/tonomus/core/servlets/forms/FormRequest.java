package com.tonomus.core.servlets.forms;

import lombok.Getter;

import java.util.Optional;

import javax.servlet.http.Cookie;

import org.apache.sling.api.SlingHttpServletRequest;

/**
 * Form request representation.
 */
public class FormRequest {

  /**
   * Raw http servlet request.
   */
  private final SlingHttpServletRequest httpRequest;

  /**
   * Parameters map.
   */
  @Getter
  private final FormRequestParameterMap parameterMap;

  /**
   * Constructor.
   * @param httpRequest raw http request
   */
  public FormRequest(SlingHttpServletRequest httpRequest) {
    this.httpRequest = httpRequest;
    this.parameterMap = new FormRequestParameterMap(httpRequest.getRequestParameterMap());
  }

  /**
   * Fetch cookie value.
   * @param cookieName cookie name
   * @return cookie value
   */
  public Optional<String> getCookieValue(String cookieName) {
    return Optional.ofNullable(httpRequest.getCookie(cookieName)).map(Cookie::getValue);
  }

}
