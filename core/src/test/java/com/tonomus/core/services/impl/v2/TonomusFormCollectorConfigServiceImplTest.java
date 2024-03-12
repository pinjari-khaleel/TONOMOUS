package com.tonomus.core.services.impl.v2;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

import java.util.Collections;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import com.tonomus.core.config.v2.TonomusFormCollectorConfig;

import pl.pojo.tester.api.assertion.Method;

@ExtendWith(MockitoExtension.class)
class TonomusFormCollectorConfigServiceImplTest {

    private TonomusFormCollectorConfigServiceImpl service;
    private TonomusFormCollectorConfig config;

    @BeforeEach
    void setUp() {      
        service = new TonomusFormCollectorConfigServiceImpl();
        config = mock(TonomusFormCollectorConfig.class);                     
    }

    @Test
    void testActivate() {
        final String[] mandatoryFields = { "fname", "lname" };
        when(config.url()).thenReturn("http://test.com");
        when(config.siteKey()).thenReturn("thisissitekey");
        when(config.mandatoryFields()).thenReturn(mandatoryFields);
        service.activate(config);
        assertEquals("thisissitekey", service.getSiteKey());
        assertEquals(2, service.getMandatoryFields().size());
    }

    @Test
    void testActivateEmptyMandatoryField() {
        when(config.mandatoryFields()).thenReturn(null);
        service.activate(config);
        assertEquals(Collections.emptyList(), service.getMandatoryFields());
    }

    @Test
    void testGetter() {
        assertPojoMethodsForAll(TonomusFormCollectorConfigServiceImpl.class).testing(Method.GETTER)
                .areWellImplemented();
    }

}
