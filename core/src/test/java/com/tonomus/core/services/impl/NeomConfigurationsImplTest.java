package com.tonomus.core.services.impl;

import pl.pojo.tester.api.assertion.Method;

import com.tonomus.core.config.NeomConfig;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class NeomConfigurationsImplTest {
  private NeomConfigurationsImpl neomConfigurations;
  NeomConfig neomConfig;

  @BeforeEach
  void setUp() {
    neomConfig = mock(NeomConfig.class);
    when(neomConfig.environment()).thenReturn("test-env");
    neomConfigurations = new NeomConfigurationsImpl();
    neomConfigurations.activate(neomConfig);
  }

  @Test
  void getEnvironmentTest() {
    assertEquals("test-env", neomConfigurations.getEnvironment());
  }

  @Test
  void testGetter() {
    assertPojoMethodsForAll(NeomConfigurationsImpl.class).testing(Method.GETTER)
        .areWellImplemented();
  }
}
