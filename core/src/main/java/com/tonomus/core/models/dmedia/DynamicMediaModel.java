package com.tonomus.core.models.dmedia;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import com.day.cq.dam.api.Asset;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.RequestAttribute;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

import static java.util.Objects.isNull;

/**
 * Dynamic Media Sling Model.
 */
@Model(adaptables = SlingHttpServletRequest.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Slf4j
public class DynamicMediaModel {

  /**
   * The default scheme for all Dynamic Media request "https".
   */
  public static final String DEFAULT_SCHEME = "https";

  /**
   * Explictit format param "fmt".
   */
  public static final String P_FMT = "fmt";



  /**
   * Png mime type "image/png".
   */
  public static final String MIME_PNG = "image/png";

  /**
   * Webp mime type "image/webp".
   */
  public static final String MIME_WEBP = "image/webp";

  /**
   * TIFF mime type "image/tiff".
   */
  public static final String MIME_TIFF = "image/tiff";

  /**
   * GIF mime type "image/gif".
   */
  public static final String MIME_GIF = "image/gif";

  /**
   * JPEG2000 mime type "image/jp2".
   */
  public static final String MIME_JP2 = "image/jp2";

  /**
   * JPEG-XR mime type "image/jxr".
   */
  public static final String MIME_JXR = "image/jxr";

  /**
   * Png format for support alpha channel "png-alpha".
   */
  public static final String FMT_PNG_ALPHA = "png-alpha";

  /**
   * TIFF format for support alpha channel "tif-alpha".
   */
  public static final String FMT_TIF_ALPHA = "tif-alpha";

  /**
   * GIF format for support alpha channel "gif-alpha".
   */
  public static final String FMT_GIF_ALPHA = "gif-alpha";

  /**
   * JPEG2000 format for support alpha channel "jpeg2000-alpha".
   */
  public static final String FMT_JPEG2000_ALPHA = "jpeg2000-alpha";

  /**
   * JPEG2000 format for support alpha channel "jpeg2000-alpha".
   */
  public static final String FMT_JPEGXR_ALPHA = "jpegxr-alpha";


  /**
   * Default image widths.
   */
  @SuppressWarnings("checkstyle:magicnumber")
  private static final long[] SIZE_LIST = {345, 479, 767, 1023, 1239, 1439, 1599, 1920};

  /**
   * Max size of images.
   */
  private static final long MAX_IMAGE_SIZE = 2_000L;

  /**
   * Renditions.
   */
  @Getter
  private final List<DynamicMediaRenditionModel> renditions = new ArrayList<>();

  /**
   * Source url.
   */
  @Getter
  private String src;

  /**
   * Constructor.
   *
   * @param resourceResolver              resourceResolver
   * @param assetPath                     assetPath
   */
  @Inject public DynamicMediaModel(@SlingObject final ResourceResolver resourceResolver,
      @RequestAttribute(name = "assetPath") final String assetPath,
      @RequestAttribute(name = "predefinedCrops") final Object[] predefinedCrops) {
    src = assetPath;
    Resource assetResource = resourceResolver.getResource(assetPath);
    if (isNull(assetResource)) {
      return;
    }
    Asset asset = assetResource.adaptTo(Asset.class);
    if (isNull(asset)) {
      return;
    }

    DynamicMediaPropsModel props = new DynamicMediaPropsModel(asset);
    if (!props.isValid()) {
      return;
    }
    if (ArrayUtils.isNotEmpty(predefinedCrops)) {
      src = props.getDmBareUrl() + predefinedCrops[0];
      return;
    }
    buildRenditions(props);
  }

  private void buildRenditions(DynamicMediaPropsModel props) {
    NameValuePair tranparentParam = getTransparentParameter(props.getAssetMimeType());

    long maxWidth = props.getS7width();
    long maxHeight = props.getS7height();
    if (maxWidth > MAX_IMAGE_SIZE) {
      maxHeight = maxHeight * MAX_IMAGE_SIZE / maxWidth;
      maxWidth = MAX_IMAGE_SIZE;
    }
    if (maxHeight > MAX_IMAGE_SIZE) {
      maxWidth = maxWidth * MAX_IMAGE_SIZE / maxHeight;
      maxHeight = MAX_IMAGE_SIZE;
    }
    boolean toBreak = false;

    for (long width : SIZE_LIST) {
      List<SrcSetItem> srcSet = new ArrayList<>();
      long height = maxHeight * width / maxWidth;
      if (width > maxWidth || height > maxHeight) {
        srcSet.add(SrcSetItem.of(props.getS7domain(),
            props.getS7path(), tranparentParam, maxWidth, maxHeight));
        toBreak = true;
      } else {
        srcSet.add(
            SrcSetItem.of(props.getS7domain(),
                props.getS7path(), tranparentParam, width, height));
        width *= 2;
        height *= 2;
        if (height <= maxHeight && width <= maxWidth) {
          srcSet.add(SrcSetItem.of(props.getS7domain(),
              props.getS7path(), tranparentParam, width, height));
        }
      }
      this.renditions.add(new DynamicMediaRenditionModel(srcSet, width / 2));
      if (toBreak) {
        break;
      }
    }
    reInitSrc();
  }

  private void reInitSrc() {
    int last = renditions.size() - 1;
    List<SrcSetItem> lastSrcSet = renditions.get(last).getSrcSet();
    int lastSrcSetSize = lastSrcSet.size();
    src = lastSrcSet.get(lastSrcSetSize - 1).getUrl();
    this.renditions.remove(last);
  }

  /**
   * Return String with uri parameter for images with transparent background layer.
   * Possible alpha channel formats:
   *  png-alpha       for image/png, bigger files as it's 24 bpp
   *  png8-alpha      for image/png, smaller files, 8 bits
   *  webp-alpha      for image/webp (Note there is an issue with this format on Safari)
   *  tif-alpha       for image/tiff
   *  gif-alpha       for image/gif
   *  jpeg2000-alpha  for image/jp2
   *  jpegxr-alpha    for image/jxr
   * @param assetMimeType - the current asset MIME type to process
   * @return NameValuePair with uri parameter for different asset mime type.
   */
  public static NameValuePair getTransparentParameter(String assetMimeType) {
    switch (assetMimeType) {
      case MIME_PNG:
      case MIME_WEBP:
        // For webp it's workaround for safari - output also in PNG 24 bit
        return new BasicNameValuePair(P_FMT, FMT_PNG_ALPHA);
      case MIME_TIFF:
        return new BasicNameValuePair(P_FMT, FMT_TIF_ALPHA);
      case MIME_GIF:
        return new BasicNameValuePair(P_FMT, FMT_GIF_ALPHA);
      case MIME_JP2:
        return new BasicNameValuePair(P_FMT, FMT_JPEG2000_ALPHA);
      case MIME_JXR:
        return new BasicNameValuePair(P_FMT, FMT_JPEGXR_ALPHA);
      default:
        return null;
    }
  }
}
