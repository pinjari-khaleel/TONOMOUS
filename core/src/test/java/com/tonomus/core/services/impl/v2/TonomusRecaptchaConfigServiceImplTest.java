package com.tonomus.core.services.impl.v2;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import com.tonomus.core.config.v2.TonomusGoogleRecaptchaConfig;

import pl.pojo.tester.api.assertion.Method;

@ExtendWith(MockitoExtension.class)
class TonomusRecaptchaConfigServiceImplTest {

    private TonomusRecaptchaConfigServiceImpl service;
    private TonomusGoogleRecaptchaConfig config;

    @BeforeEach
    void setUp() {      
        service = new TonomusRecaptchaConfigServiceImpl();
        config = mock(TonomusGoogleRecaptchaConfig.class);                      
    }

    @Test
    void testIncompleteConfiguration() {
        when(config.secretKey()).thenReturn("thisissecretkey");
        when(config.siteKey()).thenReturn("thisissitekey");
        when(config.siteVerifyURL()).thenReturn(null);
        service.activate(config);
        assertFalse(service.isNotEmpty());
    }

    @Test
    void testGetter() {
        assertPojoMethodsForAll(TonomusRecaptchaConfigServiceImpl.class).testing(Method.GETTER)
                .areWellImplemented();         
    }

    @Test
    void testActivate() {        
        when(config.secretKey()).thenReturn("thisissecretkey");
        when(config.siteKey()).thenReturn("thisissitekey");
        when(config.siteVerifyURL()).thenReturn("http://test.com");  
        service.activate(config); 
        assertEquals("thisissecretkey", service.getSecretKey());
        assertEquals("thisissitekey", service.getSiteKey());
        assertEquals("http://test.com", service.getSiteVerifyURL());
    }
}
