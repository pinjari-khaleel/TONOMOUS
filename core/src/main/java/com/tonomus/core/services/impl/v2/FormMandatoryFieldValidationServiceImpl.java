package com.tonomus.core.services.impl.v2;

import static com.tonomus.core.constants.Constants.ERROR_FORMMANDATORYFIELDVALIDATIONSERVICE;
import static com.tonomus.core.constants.Constants.WARN_FORMMANDATORYFIELDVALIDATIONSERVICE;

import java.util.Map;
import java.util.Objects;

import org.apache.commons.lang3.StringUtils;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.tonomus.core.services.v2.FormFactoryConfigService;
import com.tonomus.core.services.v2.FormMandatoryFieldValidationService;
import com.tonomus.core.servlets.forms.FormRequestParameterMap;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component(service = FormMandatoryFieldValidationService.class)
public class FormMandatoryFieldValidationServiceImpl implements FormMandatoryFieldValidationService {

    @Reference
    private FormFactoryConfigService formFactoryConfigService;

    /**
     * 
     */
    @Override
    public void validate(Map<String, Object> data) {
        String formID = (String) data.get(FormRequestParameterMap.PARAM_FORM_ID);   
        FormFactoryConfigService config = formFactoryConfigService.getConfig(formID);           

        if(Objects.isNull(config)) {
            log.warn(WARN_FORMMANDATORYFIELDVALIDATIONSERVICE + "No Form Mandatory Field configuration found for form id: {}", formID);
            return;
        }
            
        if (!config.getMandatoryFields().stream().allMatch(data::containsKey)) {                
                throw new IllegalArgumentException(ERROR_FORMMANDATORYFIELDVALIDATIONSERVICE + "Mandatory parameters missing in: "
                    + StringUtils.join(data.keySet(), ","));
        }
    }
}
