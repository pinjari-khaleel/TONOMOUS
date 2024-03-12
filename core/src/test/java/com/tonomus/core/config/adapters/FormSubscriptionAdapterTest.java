package com.tonomus.core.config.adapters;

import com.tonomus.core.config.impl.FormSubscriptionOptionsImpl;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

class FormSubscriptionAdapterTest {
  @Test
  void testGetAdapter() {
    FormSubscriptionAdapter adapter = new FormSubscriptionAdapter();
    Resource mockResource = mock(Resource.class);

    Object result = adapter.getAdapter(mockResource, Object.class);

    assertTrue(result instanceof FormSubscriptionOptionsImpl);
    FormSubscriptionOptionsImpl obj = (FormSubscriptionOptionsImpl) result;
    System.out.println();
  }
}