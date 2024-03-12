package com.tonomus.core.config.adapters;

import com.tonomus.core.config.impl.GenericSiteConfigImpl;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

class GenericSiteConfigAdapterTest {
  @Test
  void testGetAdapter() {
    GenericSiteConfigAdapter adapter = new GenericSiteConfigAdapter();
    Resource mockResource = mock(Resource.class);

    Object result = adapter.getAdapter(mockResource, Object.class);

    assertTrue(result instanceof GenericSiteConfigImpl);
  }
}