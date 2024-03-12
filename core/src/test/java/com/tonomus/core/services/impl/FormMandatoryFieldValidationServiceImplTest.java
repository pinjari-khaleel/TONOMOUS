package com.tonomus.core.services.impl;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import com.tonomus.core.services.FormMandatoryFieldFactoryConfigService;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import junitx.util.PrivateAccessor;

@ExtendWith({ AemContextExtension.class, MockitoExtension.class })
public class FormMandatoryFieldValidationServiceImplTest {

    private FormMandatoryFieldValidationServiceImpl validationService;

    private FormMandatoryFieldFactoryConfigService formMandatoryFieldFactoryConfigService;

    private Map<String, Object> data;

    @BeforeEach
    void setUp() throws NoSuchFieldException {
        data = Stream.of(new Object[][] {
                { "form_id", "a_form" },
                { "fname", "firstname" },
                { "lname", "lastname" },
        }).collect(Collectors.toMap(e -> (String) e[0], e -> (Object) e[1]));
   
        validationService = new FormMandatoryFieldValidationServiceImpl();
        formMandatoryFieldFactoryConfigService = mock(FormMandatoryFieldFactoryConfigService.class);
        PrivateAccessor.setField(validationService, "formMandatoryFieldFactoryConfigService",
                formMandatoryFieldFactoryConfigService);
    }

    @Test
    void testValidateKeysAllMatch() {             
        final String[] mandatoryFields = { "fname", "lname" };
        assertNotNull(formMandatoryFieldFactoryConfigService);
        when(formMandatoryFieldFactoryConfigService.getMandatoryFields())
                .thenReturn(Arrays.asList(mandatoryFields));        
        when(formMandatoryFieldFactoryConfigService.getConfig(anyString()))
                .thenReturn(formMandatoryFieldFactoryConfigService);
        validationService.validate(data);
    }

    @Test()
    void testValidateThrowIllegalArg() {
        final String[] mandatoryFields = { "fname", "lname", "email" };
        when(formMandatoryFieldFactoryConfigService.getMandatoryFields())
                .thenReturn(Arrays.asList(mandatoryFields));
        when(formMandatoryFieldFactoryConfigService.getConfig(anyString()))
                .thenReturn(formMandatoryFieldFactoryConfigService);
        assertThrows(IllegalArgumentException.class, () -> validationService.validate(data));
    }
}
