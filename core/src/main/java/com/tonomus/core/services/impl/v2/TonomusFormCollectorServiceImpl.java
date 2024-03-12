package com.tonomus.core.services.impl.v2;

import lombok.Getter;
import lombok.NonNull;

import static com.tonomus.core.constants.Constants.ERROR_FORMCOLLECTORSERVICE;

import java.nio.charset.StandardCharsets;
import java.util.Map;

import com.google.gson.Gson;
import com.tonomus.core.services.v2.TonomusFormCollectorConfigService;
import com.tonomus.core.services.v2.TonomusFormCollectorService;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpHeaders;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(service = TonomusFormCollectorService.class, immediate = true)
public class TonomusFormCollectorServiceImpl extends AbstractHttpClient
    implements TonomusFormCollectorService {

  @Reference
  private TonomusFormCollectorConfigService tonomusFormCollectorConfigService;

  /**
   * Inject HttpClientBuilderFactory.
   */
  @Reference
  @Getter
  private HttpClientBuilderFactory httpClientBuilderFactory;

  /**
   * Submit form data.
   * 
   * @param uri  receiver uri
   * @param data form data
   * @return response
   */
  @Override
  public EndpointResponse<String> sendFormData(@NonNull final Map<String, Object> data) {

    if (!tonomusFormCollectorConfigService.getMandatoryFields().stream().allMatch(data::containsKey)) {
      throw new IllegalArgumentException(ERROR_FORMCOLLECTORSERVICE + "Mandatory parameters missing in: "
          + StringUtils.join(data.keySet(), ","));
    }

    HttpPost request = new HttpPost(tonomusFormCollectorConfigService.getUrl());
    request.addHeader(HttpHeaders.CONTENT_TYPE, com.adobe.granite.rest.Constants.CT_JSON);
    request.setEntity(new StringEntity(new Gson().toJson(data), StandardCharsets.UTF_8));
    return executeRequest(String.class, request);
  }

}
