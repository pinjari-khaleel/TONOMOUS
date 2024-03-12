package com.tonomus.core.services.impl;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.tonomus.core.services.FormMandatoryFieldFactoryConfigService;
import com.tonomus.core.services.FormMandatoryFieldValidationService;
import com.tonomus.core.servlets.forms.FormRequestParameterMap;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component(service = FormMandatoryFieldValidationService.class)
public class FormMandatoryFieldValidationServiceImpl implements FormMandatoryFieldValidationService {

    @Reference
    private FormMandatoryFieldFactoryConfigService formMandatoryFieldFactoryConfigService;

    /**
     * Mandatory fields.
     */
    private List<String> mandatoryFields;

    @Override
    public void validate(Map<String, Object> data) {
        String formID = (String) data.get(FormRequestParameterMap.PARAM_FORM_ID);   
        FormMandatoryFieldFactoryConfigService config = formMandatoryFieldFactoryConfigService.getConfig(formID);           

        if (config != null) {
            mandatoryFields = config.getMandatoryFields();   
            if (!mandatoryFields.stream().allMatch(data::containsKey)) {                
                throw new IllegalArgumentException("Mandatory parameters missing in: "
                    + StringUtils.join(data.keySet(), ","));
            }
        }
    }
}
