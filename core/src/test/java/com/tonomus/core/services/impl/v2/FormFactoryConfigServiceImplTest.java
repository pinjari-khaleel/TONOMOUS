package com.tonomus.core.services.impl.v2;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.apache.commons.collections4.map.MultiKeyMap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import com.tonomus.core.config.v2.FormFactoryConfig;
import com.tonomus.core.services.v2.FormFactoryConfigService;

import junitx.util.PrivateAccessor;
import pl.pojo.tester.api.assertion.Method;

@ExtendWith(MockitoExtension.class)
class FormFactoryConfigServiceImplTest {

    private FormFactoryConfigServiceImpl service;
    private FormFactoryConfig config;

    @BeforeEach
    void setUp() {
        service = new FormFactoryConfigServiceImpl();
        config = mock(FormFactoryConfig.class);
    }

    @Test
    void testActivateEmptyMandatoryFields() {
        String mandatoryFields = "fname,lname";
        String audienceIds = "language|interest|value";
        MultiKeyMap<String, String> expected = new MultiKeyMap<>();
        expected.put("language", "interest", "value");
        when(config.formID()).thenReturn("sample_form");
        when(config.mandatoryFields()).thenReturn(mandatoryFields);
        when(config.audienceIds()).thenReturn(audienceIds);
        service.activate(config);
        assertEquals("[fname, lname]", service.getMandatoryFields().toString());
        assertEquals(expected, service.getAudienceIds());
    }

    @Test
    void testActivateEmpty() {
        service.activate(config);
        assertEquals(Collections.emptyList(), service.getMandatoryFields());
    }

    @Test
    void testGetter() {
        assertPojoMethodsForAll(FormFactoryConfigServiceImpl.class).testing(Method.GETTER)
                .areWellImplemented();
    }

    @Test
    void testGetConfig() throws NoSuchFieldException {
        FormFactoryConfigService config1 = new FormFactoryConfigServiceImpl();
        PrivateAccessor.setField(config1, "formID", "form1");
        FormFactoryConfigService config2 = new FormFactoryConfigServiceImpl();
        PrivateAccessor.setField(config2, "formID", "form2");
        List<FormFactoryConfigService> allConfigs = new ArrayList<>(Arrays.asList(config1, config2));
        PrivateAccessor.setField(service, "allConfigs", allConfigs);
        assertEquals(config2, service.getConfig("form2"));

        List<FormFactoryConfigService> getAllConfigs = (List<FormFactoryConfigService>) PrivateAccessor
                .getField(service, "allConfigs");
        service.bindFormMandatoryFieldFactoryConfigService(config2);
        assertEquals(3, getAllConfigs.size());
        service.unbindFormMandatoryFieldFactoryConfigService(config2);
        assertEquals(2, getAllConfigs.size());
        service.unbindFormMandatoryFieldFactoryConfigService(config2);
        service.unbindFormMandatoryFieldFactoryConfigService(config1);
        assertNotNull(getAllConfigs);

        PrivateAccessor.setField(service, "allConfigs", null);
        service.bindFormMandatoryFieldFactoryConfigService(config2);
        assertNotNull(getAllConfigs);
    }
}
