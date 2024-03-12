package com.tonomus.core.config.adapters;

import com.tonomus.core.config.impl.FormAudienceOptionsImpl;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

class AudienceOptionsAdapterTest {
  @Test
  void testGetAdapter() {
    AudienceOptionsAdapter adapter = new AudienceOptionsAdapter();
    Resource mockResource = mock(Resource.class);

    Object result = adapter.getAdapter(mockResource, Object.class);

    assertTrue(result instanceof FormAudienceOptionsImpl);
  }
}