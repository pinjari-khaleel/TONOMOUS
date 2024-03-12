package com.tonomus.core.config.adapters;

import com.tonomus.core.config.impl.SocialOptionsImpl;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

class SocialOptionsAdapterTest {
  @Test
  void testGetAdapter() {
    SocialOptionsAdapter adapter = new SocialOptionsAdapter();
    Resource mockResource = mock(Resource.class);

    Object result = adapter.getAdapter(mockResource, Object.class);

    assertTrue(result instanceof SocialOptionsImpl);
  }
}