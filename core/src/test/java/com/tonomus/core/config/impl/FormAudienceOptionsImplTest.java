package com.tonomus.core.config.impl;

import java.util.Collections;

import com.tonomus.core.config.caconfig.AudienceOptionsCaConfigurations;
import com.tonomus.core.utils.AudienceOptionsUtils;

import org.apache.commons.collections4.map.MultiKeyMap;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.caconfig.ConfigurationBuilder;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

class FormAudienceOptionsImplTest {

  @Test
  void testGetAudienceOptions() {
    // Mock resource and configuration
    Resource mockResource = Mockito.mock(Resource.class);
    ConfigurationBuilder mockBuilder = Mockito.mock(ConfigurationBuilder.class);
    when(mockResource.adaptTo(ConfigurationBuilder.class)).thenReturn(mockBuilder);

    AudienceOptionsCaConfigurations mockConfigurations =
        Mockito.mock(AudienceOptionsCaConfigurations.class);
    when(mockBuilder.asCollection(AudienceOptionsCaConfigurations.class)).thenReturn(
        Collections.singletonList(mockConfigurations));
    when(mockConfigurations.formId()).thenReturn("formId");

    // Mock audience options map
    MultiKeyMap<String, String> mockAudienceOptionsMap = new MultiKeyMap<>();
    mockAudienceOptionsMap.put("language", "interest", "value");

    // Mock configRows to return String[]
    String[] mockConfigRows = new String[] {"row1", "row2"};
    when(mockConfigurations.configRows()).thenReturn(mockConfigRows);

    try (MockedStatic<AudienceOptionsUtils> utilitiesMock = Mockito.mockStatic(
        AudienceOptionsUtils.class)) {
      utilitiesMock.when(() -> AudienceOptionsUtils.getAudienceOptionsMap(mockConfigRows))
          .thenReturn(mockAudienceOptionsMap);

      // Instantiate FormAudienceOptionsImpl and test getAudienceOptions method
      FormAudienceOptionsImpl formAudienceOptions = new FormAudienceOptionsImpl(mockResource);
      MultiKeyMap<String, String> result = formAudienceOptions.getAudienceOptions("formId");

      // Check that result is not null
      assertNotNull(result, "Result should not be null");

      // Check that result contains the expected value
      assertEquals("value", result.get("language", "interest"));
    }
  }
}
