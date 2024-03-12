package com.tonomus.core.utils;

import com.day.cq.dam.api.Asset;
import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.common.v1.VideoModel;
import com.tonomus.core.slingmodels.common.v1.VideoPropsModel;
import com.tonomus.core.slingmodels.components.v1.map.LottieAnimationModel;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class MediaUtilsTest {

  private static final String ASSET_PATH = "/content/dam/example/image.jpg";
  private static final String DAM_SIZE = "dam:size";

  @Test
  void testGetFileSizeAsString2() {
    // Create mock objects
    ResourceResolver resolver = mock(ResourceResolver.class);
    Resource resource = mock(Resource.class);
    Asset asset = mock(Asset.class);

    // Set up the mock behavior
    when(resolver.getResource(ASSET_PATH)).thenReturn(resource);
    when(resource.adaptTo(Asset.class)).thenReturn(asset);
    when(asset.getMetadataValueFromJcr(DAM_SIZE)).thenReturn("1024");

    // Test case 1: Valid file size
    String result1 = MediaUtils.getFileSizeAsString(resolver, ASSET_PATH);
    assertEquals("1024B", result1);

    // Test case 2: Invalid file size
    when(asset.getMetadataValueFromJcr(DAM_SIZE)).thenReturn("");
    String result2 = MediaUtils.getFileSizeAsString(resolver, ASSET_PATH);
    assertEquals(StringUtils.EMPTY, result2);

    // Verify that the mocks were called with the correct parameters
    verify(resolver, times(2)).getResource(ASSET_PATH);
    verify(resource, times(2)).adaptTo(Asset.class);
    verify(asset, times(2)).getMetadataValueFromJcr(DAM_SIZE);
  }

  @Test void testIsVideoNotPresent() {
    assertTrue(MediaUtils.isVideoNotPresent(null));

    VideoModel videoModel = VideoModel.builder().build();
    assertTrue(MediaUtils.isVideoNotPresent(videoModel));

    VideoPropsModel config = VideoPropsModel.builder().youtube("test").build();
    videoModel = VideoModel.builder().props(config).build();
    assertFalse(MediaUtils.isVideoNotPresent(videoModel));
  }

  @Test void testIsBackgroundNotPresent() {

    VideoModel video = new VideoModel();
    ImageModel image = new ImageModel();
    LottieAnimationModel lottie = new LottieAnimationModel();
    assertTrue(MediaUtils.isBackgroundNotPresent(video, image, lottie));
  }


  @Test void testGetFileSizeAsString() {
    assertEquals("213B", MediaUtils.getFileSizeAsString(213L));
    assertEquals("208.2KB", MediaUtils.getFileSizeAsString(213234L));
    assertEquals("223.7MB", MediaUtils.getFileSizeAsString(234534534L));
  }

  @Test void testGetFileExtension() {
    assertEquals("unknw", MediaUtils.getFileExtension("/files/fileUnknown"));
    assertEquals("exten", MediaUtils.getFileExtension("/files/fileUnknown.extension"));
  }

  @Test void testIsInternalAsset() {
    assertTrue(MediaUtils.isInternalAsset("/content/dam/video.mp4"));
    assertFalse(MediaUtils.isInternalAsset(null));
    assertFalse(MediaUtils.isInternalAsset("https://neom.scene7.com/.jpeg"));
  }
}
