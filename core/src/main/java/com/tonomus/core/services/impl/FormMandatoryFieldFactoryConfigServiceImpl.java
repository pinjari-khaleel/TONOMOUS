package com.tonomus.core.services.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ReferenceCardinality;
import org.osgi.service.component.annotations.ReferencePolicy;
import org.osgi.service.metatype.annotations.Designate;

import com.tonomus.core.config.FormMandatoryFieldFactoryConfig;
import com.tonomus.core.services.FormMandatoryFieldFactoryConfigService;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component(service = FormMandatoryFieldFactoryConfigService.class, immediate = true, configurationPolicy = ConfigurationPolicy.REQUIRE)
@Designate(ocd = FormMandatoryFieldFactoryConfig.class, factory = true)
public class FormMandatoryFieldFactoryConfigServiceImpl implements FormMandatoryFieldFactoryConfigService {
    
    @Getter
    private String formID;

    @Getter
    private List<String> mandatoryFields;

    @Getter
    private List<FormMandatoryFieldFactoryConfigService> allConfigs;

    /**
     * @param config
     */
    @Activate
    @Modified
    protected void activate(final FormMandatoryFieldFactoryConfig config) {
        this.formID = config.formID();
        if (StringUtils.isNotBlank(config.mandatoryFields())) {
            this.mandatoryFields = Stream.of(config.mandatoryFields().split(",", -1))
                .map(String::trim)
                .collect(Collectors.toList());
        } else {
            this.mandatoryFields = Collections.emptyList();      
        }
    }

    /**
     * @param config
     */
    @Reference(
        service = FormMandatoryFieldFactoryConfigService.class, 
        cardinality = ReferenceCardinality.MULTIPLE,
        policy = ReferencePolicy.DYNAMIC)
    public synchronized void bindFormMandatoryFieldFactoryConfigService(final FormMandatoryFieldFactoryConfigService config) {
        if (allConfigs == null) {
            allConfigs = new ArrayList<>();
        }
        allConfigs.add(config);
    }

    /**
     * @param config
     */
    public synchronized void unbindFormMandatoryFieldFactoryConfigService(final FormMandatoryFieldFactoryConfigService config) {
        allConfigs.remove(config);
    }

    /**
     * @param formID
     * @return first config matching form ID
     */
    @Override
    public FormMandatoryFieldFactoryConfigService getConfig(String formID) {        
        return allConfigs.stream()
            .filter(e -> formID.equals(e.getFormID()))
            .findFirst()
            .orElse(null);
    }
}
