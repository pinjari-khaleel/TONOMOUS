package com.tonomus.core.config.impl;



import pl.pojo.tester.api.assertion.Method;

import com.tonomus.core.config.caconfig.GenericSiteCaConfiguration;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.caconfig.ConfigurationBuilder;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

class GenericSiteConfigImplTest {

  GenericSiteConfigImpl siteConfig;

  @Mock
  GenericSiteCaConfiguration mockConfig;

  @Mock
  ConfigurationBuilder builder;

  @Mock
  Resource resource;

  @Test void testSetConfig() {
    MockitoAnnotations.openMocks(this);
    when(resource.adaptTo(ConfigurationBuilder.class)).thenReturn(builder);
    when(builder.as(GenericSiteCaConfiguration.class)).thenReturn(mockConfig);
    when(mockConfig.facebookDomainVerification()).thenReturn("example.com");
    when(mockConfig.adobeLaunchConfigurationScript()).thenReturn("...");
    when(mockConfig.adobeLaunchAsyncScriptEnable()).thenReturn(true);
    when(mockConfig.delay()).thenReturn("5000L");
    when(mockConfig.gtmId()).thenReturn("GTM-XXXXX");
    when(mockConfig.lightGtmId()).thenReturn("GTM-YYYYY");
    siteConfig = new GenericSiteConfigImpl(resource);

    assertEquals("example.com", siteConfig.getFacebookDomainVerification());
    assertEquals("...", siteConfig.getAdobeLaunchConfiguration());
    assertEquals(true, siteConfig.isAdobeLaunchAsyncScriptEnable());
    assertEquals("5000L", siteConfig.getDelay());
    assertEquals("GTM-XXXXX", siteConfig.getGtmId());
    assertEquals("GTM-YYYYY", siteConfig.getLightGtmId());
  }
}