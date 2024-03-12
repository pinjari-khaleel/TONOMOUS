package com.tonomus.core.config.impl;

import java.util.ResourceBundle;

import com.tonomus.core.config.caconfig.SocialOptionsCaConfiguration;
import com.tonomus.core.constants.Constants;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.caconfig.ConfigurationBuilder;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SocialOptionsImplTest {

  @Mock
  private Resource resource;

  @Mock
  private ConfigurationBuilder configurationBuilder;

  @Mock
  private SocialOptionsCaConfiguration socialOptionsCaConfiguration;

  @Mock
  private ResourceBundle resourceBundle;

  @Test void testI18nInvocation() {
    when(resource.adaptTo(ConfigurationBuilder.class)).thenReturn(configurationBuilder);
    when(configurationBuilder.as(SocialOptionsCaConfiguration.class))
        .thenReturn(socialOptionsCaConfiguration);
    when(socialOptionsCaConfiguration.twitterUrl()).thenReturn(Constants.TWITTER_LABEL);
    when(socialOptionsCaConfiguration.linkedinUrl()).thenReturn(Constants.LINKEDIN_LABEL);
    when(socialOptionsCaConfiguration.facebookUrl()).thenReturn(Constants.FACEBOOK_LABEL);
    when(socialOptionsCaConfiguration.whatsappUrl()).thenReturn(Constants.WHATSAPP_LABEL);
    when(socialOptionsCaConfiguration.emailUrl()).thenReturn(Constants.EMAIL_LABEL);
    when(socialOptionsCaConfiguration.introductionCopy()).thenReturn(StringUtils.EMPTY);
    when(resourceBundle.containsKey(anyString())).thenReturn(true);
    SocialOptionsImpl socialOptions = new SocialOptionsImpl(resource);
    socialOptions.getShareOptions(StringUtils.EMPTY, resourceBundle);
    assertEquals("Email", socialOptions.getEmailUrl());
    assertEquals("Twitter", socialOptions.getTwitterUrl());
    assertEquals(Constants.FACEBOOK_LABEL, socialOptions.getFacebookUrl());
    assertEquals(StringUtils.EMPTY, socialOptions.getIntroductionCopy());
    assertEquals(Constants.LINKEDIN_LABEL, socialOptions.getLinkedinUrl());
    assertEquals(Constants.WHATSAPP_LABEL, socialOptions.getWhatsappUrl());
    verify(resourceBundle, times(1)).getString(Constants.TWITTER_LABEL);
    verify(resourceBundle, times(1)).getString(Constants.LINKEDIN_LABEL);
    verify(resourceBundle, times(1)).getString(Constants.FACEBOOK_LABEL);
    verify(resourceBundle, times(1)).getString(Constants.WHATSAPP_LABEL);
    verify(resourceBundle, times(1)).getString(Constants.EMAIL_LABEL);
    verify(resourceBundle, times(1)).getString(Constants.COPY_LINK);
  }

}