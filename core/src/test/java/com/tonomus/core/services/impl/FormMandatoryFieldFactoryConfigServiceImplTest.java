package com.tonomus.core.services.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import com.tonomus.core.config.FormMandatoryFieldFactoryConfig;
import com.tonomus.core.services.FormMandatoryFieldFactoryConfigService;

import junitx.util.PrivateAccessor;
import pl.pojo.tester.api.assertion.Method;

@ExtendWith(MockitoExtension.class)
public class FormMandatoryFieldFactoryConfigServiceImplTest {

    private FormMandatoryFieldFactoryConfigServiceImpl serviceImpl;
    private FormMandatoryFieldFactoryConfig config;

    @BeforeEach
    void setUp() {
        
        serviceImpl = new FormMandatoryFieldFactoryConfigServiceImpl();
        config = mock(FormMandatoryFieldFactoryConfig.class);                     
    }

    @Test
    void testActivateEmptyMandatoryFields() {
        final String mandatoryFields = "fname,lname";
        when(config.formID()).thenReturn("sample_form");
        when(config.mandatoryFields()).thenReturn(mandatoryFields);
        serviceImpl.activate(config);
        assertEquals("[fname, lname]", serviceImpl.getMandatoryFields().toString());
    }

    @Test
    void testActivateEmpty() {
        serviceImpl.activate(config);
        assertEquals(Collections.emptyList(), serviceImpl.getMandatoryFields());
    }

    @Test
    void testGetter() {
        assertPojoMethodsForAll(FormMandatoryFieldFactoryConfigServiceImpl.class).testing(Method.GETTER)
                .areWellImplemented();
    }

    @Test
    void testGetConfig() throws NoSuchFieldException{        
        FormMandatoryFieldFactoryConfigService config1 = new FormMandatoryFieldFactoryConfigServiceImpl();
        PrivateAccessor.setField(config1, "formID", "form1");
        FormMandatoryFieldFactoryConfigService config2 = new FormMandatoryFieldFactoryConfigServiceImpl();
        PrivateAccessor.setField(config2, "formID", "form2");
        List<FormMandatoryFieldFactoryConfigService> allConfigs = new ArrayList<>(Arrays.asList(config1, config2));
        PrivateAccessor.setField(serviceImpl, "allConfigs", allConfigs);
        assertEquals(config2, serviceImpl.getConfig("form2"));

        List<FormMandatoryFieldFactoryConfigService> getAllConfigs = (List<FormMandatoryFieldFactoryConfigService>) PrivateAccessor
                .getField(serviceImpl, "allConfigs");
        serviceImpl.bindFormMandatoryFieldFactoryConfigService(config2);
        assertEquals(3, getAllConfigs.size());
        serviceImpl.unbindFormMandatoryFieldFactoryConfigService(config2);
        assertEquals(2, getAllConfigs.size());
        serviceImpl.unbindFormMandatoryFieldFactoryConfigService(config2);
        serviceImpl.unbindFormMandatoryFieldFactoryConfigService(config1);
        assertNotNull(getAllConfigs);

        PrivateAccessor.setField(serviceImpl, "allConfigs", null);
        serviceImpl.bindFormMandatoryFieldFactoryConfigService(config2);
        assertNotNull(getAllConfigs);
    }
}
