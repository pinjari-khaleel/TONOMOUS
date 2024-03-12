package com.tonomus.core.models.dmedia;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.message.BasicNameValuePair;

import static com.tonomus.core.models.dmedia.DynamicMediaModel.DEFAULT_SCHEME;
import static java.util.Objects.nonNull;

/**
 * An item of src set.
 */
@Slf4j
public class SrcSetItem {

  /**
   * Url.
   */
  @Getter
  private String url;

  /**
   * Width.
   */
  private long width;

  public SrcSetItem(final String url, final long width) {
    this.url = url;
    this.width = width;
  }

  public String getSrcUrl() {
    return url + " " + width + "w";
  }

  public static SrcSetItem of(String s7domain, String s7path,
      NameValuePair transparentParam, long width, long height) {
    List<NameValuePair> params = new ArrayList<>();
    if (nonNull(transparentParam)) {
      params.add(transparentParam);
    }
    params.add(new BasicNameValuePair("wid", Long.toString(width)));
    params.add(new BasicNameValuePair("hei", Long.toString(height)));

    URIBuilder uriBuilder = new URIBuilder().setHost(s7domain).setScheme(DEFAULT_SCHEME)
        .setPath(s7path).addParameters(params);
    try {
      String url = uriBuilder.build().toString();
      return new SrcSetItem(url, width);
    } catch (URISyntaxException e) {
      log.error("Error", e);
    }
    return null;
  }
}
