package com.tonomus.core.models.dmedia;

import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.DamConstants;
import com.day.cq.dam.commons.handler.StandardImageHandler;

import org.apache.http.NameValuePair;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static com.day.cq.dam.api.DamConstants.TIFF_IMAGELENGTH;
import static com.day.cq.dam.api.DamConstants.TIFF_IMAGEWIDTH;
import static com.day.cq.dam.scene7.api.constants.Scene7Constants.PN_S7_DOMAIN;
import static com.day.cq.dam.scene7.api.constants.Scene7Constants.PN_S7_FILE;
import static com.day.cq.dam.scene7.api.constants.Scene7Constants.PN_S7_FILE_STATUS;
import static com.day.cq.dam.scene7.api.constants.Scene7Constants.PN_S7_HEIGHT;
import static com.day.cq.dam.scene7.api.constants.Scene7Constants.PN_S7_TYPE;
import static com.day.cq.dam.scene7.api.constants.Scene7Constants.PN_S7_WIDTH;
import static com.tonomus.core.models.dmedia.DynamicMediaModel.FMT_GIF_ALPHA;
import static com.tonomus.core.models.dmedia.DynamicMediaModel.FMT_JPEG2000_ALPHA;
import static com.tonomus.core.models.dmedia.DynamicMediaModel.FMT_JPEGXR_ALPHA;
import static com.tonomus.core.models.dmedia.DynamicMediaModel.FMT_PNG_ALPHA;
import static com.tonomus.core.models.dmedia.DynamicMediaModel.FMT_TIF_ALPHA;
import static com.tonomus.core.models.dmedia.DynamicMediaModel.MIME_JXR;
import static com.tonomus.core.models.dmedia.DynamicMediaModel.P_FMT;
import static com.tonomus.core.models.dmedia.DynamicMediaPropsModel.PUBLISH_COMPLETE;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DynamicMediaModelTest {

  private static final String PATH_ASSET = "/content/dam/img.jpg";
  @Mock
  private ResourceResolver resolver;
  @Mock
  private Resource resource;
  @Mock
  private Asset asset;

  @Test
  void test() {
    when(resolver.getResource(PATH_ASSET)).thenReturn(resource);
    when(resource.adaptTo(Asset.class)).thenReturn(asset);
    when(asset.getMetadataValueFromJcr(PN_S7_FILE_STATUS)).thenReturn(PUBLISH_COMPLETE);
    when(asset.getMetadataValueFromJcr(PN_S7_DOMAIN)).thenReturn("https://neom.scene7.com/");
    when(asset.getMetadataValueFromJcr(PN_S7_FILE)).thenReturn("neomstage/img");
    when(asset.getMetadataValueFromJcr(PN_S7_TYPE)).thenReturn("Image");
    when(asset.getMetadataValueFromJcr(TIFF_IMAGEWIDTH)).thenReturn("4652");
    when(asset.getMetadataValueFromJcr(TIFF_IMAGELENGTH)).thenReturn("1333");
    when(asset.getMetadataValueFromJcr(PN_S7_WIDTH)).thenReturn(null);
    when(asset.getMetadataValueFromJcr(PN_S7_HEIGHT)).thenReturn(null);
    when(asset.getMetadataValueFromJcr(DamConstants.DC_FORMAT)).thenReturn(
        StandardImageHandler.JPEG_MIMETYPE);
    DynamicMediaModel dynamicMediaModel = new DynamicMediaModel(resolver, PATH_ASSET, null);
    assertEquals("https://neom.scene7.com/is/image/neomstage/img?wid=1920&hei=550",
        dynamicMediaModel.getSrc());
    assertEquals(7, dynamicMediaModel.getRenditions().size());
  }

  @Test
  void testGetTransparentParameter() {
    // Test for MIME_PNG
    NameValuePair result = DynamicMediaModel.getTransparentParameter("image/png");
    assertNotNull(result);
    assertEquals(P_FMT, result.getName());
    assertEquals(FMT_PNG_ALPHA, result.getValue());

    // Test for MIME_WEBP
    result = DynamicMediaModel.getTransparentParameter("image/webp");
    assertNotNull(result);
    assertEquals(P_FMT, result.getName());
    assertEquals(FMT_PNG_ALPHA, result.getValue());

    // Test for MIME_TIFF
    result = DynamicMediaModel.getTransparentParameter("image/tiff");
    assertNotNull(result);
    assertEquals(P_FMT, result.getName());
    assertEquals(FMT_TIF_ALPHA, result.getValue());

    // Test for MIME_GIF
    result = DynamicMediaModel.getTransparentParameter("image/gif");
    assertNotNull(result);
    assertEquals(P_FMT, result.getName());
    assertEquals(FMT_GIF_ALPHA, result.getValue());

    // Test for MIME_JP2
    result = DynamicMediaModel.getTransparentParameter("image/jp2");
    assertNotNull(result);
    assertEquals(P_FMT, result.getName());
    assertEquals(FMT_JPEG2000_ALPHA, result.getValue());

    // Test for MIME_JXR
    result = DynamicMediaModel.getTransparentParameter(MIME_JXR);
    assertNotNull(result);
    assertEquals(P_FMT, result.getName());
    assertEquals(FMT_JPEGXR_ALPHA, result.getValue());

    // Test for unknown MIME type
    result = DynamicMediaModel.getTransparentParameter("image/unknown");
    assertNull(result);
  }
}