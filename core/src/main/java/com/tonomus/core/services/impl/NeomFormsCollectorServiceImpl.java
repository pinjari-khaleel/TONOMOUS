package com.tonomus.core.services.impl;

import lombok.Getter;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.google.gson.Gson;
import com.tonomus.core.services.NeomFormsCollectorService;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpHeaders;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

/**
 * Neom Forms Collector Service.
 */
@Slf4j
@Component(configurationPolicy = ConfigurationPolicy.REQUIRE)
@Designate(ocd = NeomFormsCollectorServiceImpl.Configuration.class)
public class NeomFormsCollectorServiceImpl extends AbstractHttpClient
    implements NeomFormsCollectorService {

  /**
   * Mandatory fields.
   */
  private List<String> mandatoryFields;

  /**
   * This method gets triggered on Activation or modification of configurations.
   *
   * @param configuration config
   **/
  @Activate
  public void activate(Configuration configuration) {
    if (ArrayUtils.isNotEmpty(configuration.mandatoryFields())) {
      this.mandatoryFields = Arrays.stream(configuration.mandatoryFields())
          .filter(StringUtils::isNotBlank)
          .collect(Collectors.toList());
    } else {
      this.mandatoryFields = Collections.emptyList();
    }
  }

  /**
   * Inject HttpClientBuilderFactory.
   */
  @Reference
  @Getter
  private HttpClientBuilderFactory httpClientBuilderFactory;

  /**
   * Submit form data.
   * @param uri receiver uri
   * @param data form data
   * @return response
   */
  @Override public EndpointResponse<String> sendFormData(@NonNull final String uri,
      @NonNull final Map<String, Object> data) {

    if (!mandatoryFields.stream().allMatch(data::containsKey)) {
      throw new IllegalArgumentException("Mandatory parameters missing in: "
          + StringUtils.join(data.keySet(), ","));
    }

    HttpPost request = new HttpPost(uri);
    request.addHeader(HttpHeaders.CONTENT_TYPE, com.adobe.granite.rest.Constants.CT_JSON);
    request.setEntity(new StringEntity(new Gson().toJson(data), StandardCharsets.UTF_8));
    return executeRequest(String.class, request);
  }


  /**
   * Service configuration.
   */
  @ObjectClassDefinition(name = "Neom Forms Collector Service Configuration")
  @interface Configuration {

    /**
     * Mandatory field names.
     *
     * @return list of mandatory field names.
     */
    @AttributeDefinition(name = "Mandatory fields", type = AttributeType.STRING)
    String[] mandatoryFields();
  }
}
