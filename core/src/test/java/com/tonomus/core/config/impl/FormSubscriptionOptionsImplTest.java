package com.tonomus.core.config.impl;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.caconfig.ConfigurationBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Collections;

import com.tonomus.core.config.caconfig.AudienceSubscriptionCaConfigurations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

public class FormSubscriptionOptionsImplTest {

  @Mock
  private Resource resource;

  @Mock
  private ConfigurationBuilder configurationBuilder;

  @Mock
  private AudienceSubscriptionCaConfigurations audienceSubscriptionCaConfigurations;

  private FormSubscriptionOptionsImpl formSubscriptionOptions;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);

    when(resource.adaptTo(ConfigurationBuilder.class)).thenReturn(configurationBuilder);
    when(configurationBuilder.asCollection(AudienceSubscriptionCaConfigurations.class)).thenReturn(Collections.singletonList(audienceSubscriptionCaConfigurations));
    when(audienceSubscriptionCaConfigurations.key()).thenReturn("testKey");
    when(audienceSubscriptionCaConfigurations.value()).thenReturn("testValue");
  }

  @Test
  public void testGetStatus() {
    // Given
    formSubscriptionOptions = new FormSubscriptionOptionsImpl(resource);

    // When
    String status = formSubscriptionOptions.getStatus("testKey");

    // Then
    assertEquals("testValue", status);
  }

  @Test
  public void testGetStatusWithUnknownKey() {
    // Given
    formSubscriptionOptions = new FormSubscriptionOptionsImpl(resource);

    // When
    String status = formSubscriptionOptions.getStatus("unknownKey");

    // Then
    assertNull(status);
  }
}