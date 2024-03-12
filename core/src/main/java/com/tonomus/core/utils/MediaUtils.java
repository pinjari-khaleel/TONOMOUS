package com.tonomus.core.utils;

import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Stream;

import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.DamConstants;
import com.tonomus.core.constants.Constants;
import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.common.v1.VideoModel;
import com.tonomus.core.slingmodels.common.v1.VideoPropsModel;
import com.tonomus.core.slingmodels.components.v1.map.LottieAnimationModel;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;

import static com.day.cq.commons.jcr.JcrConstants.JCR_CONTENT;
import static com.day.cq.dam.api.DamConstants.DAM_SIZE;
import static com.tonomus.core.constants.Constants.SLASH;
import static com.tonomus.core.constants.NumberConstants.FIVE;
import static com.tonomus.core.constants.NumberConstants.ONE;
import static com.tonomus.core.constants.NumberConstants.THREE;
import static com.tonomus.core.constants.NumberConstants.ZERO;
import static java.util.Objects.nonNull;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

/**
 * This class contains Media utility methods.
 */
@Slf4j
@UtilityClass
public class MediaUtils {

  /**
   * Full path to metadata child node of asset (with jcr:content) "jcr:content/metadata".
   */
  public static final String METADATA_CHILD_RES_PATH =
      JCR_CONTENT + SLASH + DamConstants.METADATA_FOLDER;

  /**
   * Format to print file size in B/KB/MB.
   */
  private static final DecimalFormat DECIMAL_FORMAT = (DecimalFormat) NumberFormat.getNumberInstance(Locale.US);

  static {
    DECIMAL_FORMAT.applyPattern("#.#");
  }

  /**
   * Bytes in kilobyte.
   */
  public static final long KILOBYTE = 1024;

  /**
   * Bytes in megabyte.
   */
  private static final long MEGABYTE = KILOBYTE * KILOBYTE;


  /**
   * Check: is video file set.
   *
   * @param videoModel - video object
   * @return true - if it's not set
   */
  public static boolean isVideoNotPresent(VideoModel videoModel) {
    return Objects.isNull(videoModel)
        || Objects.isNull(videoModel.getProps())
        || (Objects.isNull(videoModel.getProps().getSources())
        && Objects.isNull(videoModel.getProps().getYoutube()));
  }

  /**
   * Check: is background files set.
   *
   * @param videoModel - video object
   * @param imageModel - image object
   * @param lottieModel - lottie object
   * @return true - if it's not set
   */
  public static boolean isBackgroundNotPresent(VideoModel videoModel, ImageModel imageModel,
      LottieAnimationModel lottieModel) {
    return isVideoNotPresent(videoModel)
        && (Objects.isNull(imageModel) || Objects.isNull(imageModel.getSrc()))
        && (Objects.isNull(lottieModel) || (Objects.isNull(lottieModel.getAssetsFolderPath())
        && Objects.isNull(lottieModel.getJsonFilePath())));
  }

  /**
   * Convert file size to simplified string.
   *
   * @param size file size
   * @return simplified string
   */
  public static String getFileSizeAsString(long size) {
    if (size > MEGABYTE) {
      return DECIMAL_FORMAT.format((double) size / MEGABYTE) + "MB";
    }
    if (size > KILOBYTE) {
      return DECIMAL_FORMAT.format((double) size / KILOBYTE) + "KB";
    }
    return DECIMAL_FORMAT.format(size) + "B";
  }

  /**
   * Get simplified asset file size.
   *
   * @param resolver  Resource Resolver
   * @param assetPath path to asset
   * @return simplified file size as string
   */
  public static String getFileSizeAsString(ResourceResolver resolver, String assetPath) {
    if (nonNull(resolver)) {
      Resource resource = resolver.getResource(assetPath);
      if (nonNull(resource)) {
        Asset asset = resource.adaptTo(Asset.class);
        if (nonNull(asset)) {
          String damSizeText = asset.getMetadataValueFromJcr(DAM_SIZE);
          if (isNotBlank(damSizeText)) {
            return getFileSizeAsString(Long.parseLong(damSizeText));
          }
        }
      }
    }
    return StringUtils.EMPTY;
  }

  /**
   * Get file extension.
   *
   * @param path path
   * @return file extension
   */
  public static String getFileExtension(String path) {
    String extension;
    int index = path.lastIndexOf('.');
    if (index >= ZERO && index < path.length() - THREE) {
      extension = path.substring(index + ONE).toLowerCase();
    } else {
      extension = "unknw";
    }
    if (extension.length() > FIVE) {
      extension = extension.substring(ZERO, FIVE);
    }
    return extension;
  }

  /**
   * Method for eliminating wrong video type source setting.
   * @param videoType video type.
   * @param video video object.
   */
  public void youtubeOrDam(String videoType, VideoModel video) {
    if (nonNull(video) && nonNull(video.getProps())) {
      if (Objects.isNull(videoType) || Constants.DAM.equals(videoType)) {
        video.getProps().setYoutube(null);
      } else if (Constants.YOUTUBE.equals(videoType)) {
        video.getProps().setSources(null);
      }
    }
  }

  /**
   * Method finds the first vide config source and serializes it into JSON format.
   *
   * @param video video model
   * @return the first vide config source serialized into JSON format
   */
  public static String getFirstSourceJson(VideoModel video) {
    return (Optional.ofNullable(video).map(VideoModel::getProps)
        .map(VideoPropsModel::getSources).map(List::stream).orElse(Stream.empty())).findFirst()
        .map(JsonUtils::serialize).orElse(null);
  }

  /**
   * This method checks that if the provided asset path is Internal DAM or not.
   *
   * @param path link/path that needs to be tested
   * @return true: for Internal asset, and false for External asset
   */
  public static boolean isInternalAsset(final String path) {
    return (nonNull(path) && path.startsWith(SLASH + Constants.CONTENT_LABEL
        + SLASH + Constants.DAM));
  }

  /**
   * Retrieves the mimeType in Assets metadata
   * @param resource
   * @param src
   * @return
   */
  public static String getMediaType(Resource resource, String src){
    return Optional.ofNullable(resource.getResourceResolver()).map(r -> r.getResource(src))
      .map(e -> e.adaptTo(Asset.class)).map(e->e.getMetadataValueFromJcr(DamConstants.DC_FORMAT))
      .orElse(null);
  }
}
