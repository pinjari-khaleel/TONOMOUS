package com.tonomus.core.services.impl.v2;

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

import com.tonomus.core.services.v2.FormFactoryConfigService;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import junitx.util.PrivateAccessor;

@ExtendWith({ AemContextExtension.class, MockitoExtension.class })
class FormMandatoryFieldValidationServiceImplTest {

    private FormMandatoryFieldValidationServiceImpl validationService;

    private FormFactoryConfigService formFactoryConfigService;

    private Map<String, Object> data;

    @BeforeEach
    void setUp() throws NoSuchFieldException {
        data = Stream.of(new Object[][] {
                { "form_id", "a_form" },
                { "fname", "firstname" },
                { "lname", "lastname" },
        }).collect(Collectors.toMap(e -> (String) e[0], e -> (Object) e[1]));
   
        validationService = new FormMandatoryFieldValidationServiceImpl();
        formFactoryConfigService = mock(FormFactoryConfigService.class);
        PrivateAccessor.setField(validationService, "formFactoryConfigService",
                formFactoryConfigService);
    }

    @Test
    void testValidateKeysAllMatch() {             
        final String[] mandatoryFields = { "fname", "lname" };
        assertNotNull(formFactoryConfigService);
        when(formFactoryConfigService.getMandatoryFields())
                .thenReturn(Arrays.asList(mandatoryFields));        
        when(formFactoryConfigService.getConfig(anyString()))
                .thenReturn(formFactoryConfigService);
        validationService.validate(data);
    }

    @Test()
    void testValidateThrowIllegalArg() {
        final String[] mandatoryFields = { "fname", "lname", "email" };
        when(formFactoryConfigService.getMandatoryFields())
                .thenReturn(Arrays.asList(mandatoryFields));
        when(formFactoryConfigService.getConfig(anyString()))
                .thenReturn(formFactoryConfigService);
        assertThrows(IllegalArgumentException.class, () -> validationService.validate(data));

        when(formFactoryConfigService.getConfig(anyString())).thenReturn(null);
        validationService.validate(data);
    }
    
}
