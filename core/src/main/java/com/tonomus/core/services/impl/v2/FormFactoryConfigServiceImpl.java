package com.tonomus.core.services.impl.v2;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.collections4.map.MultiKeyMap;
import org.apache.commons.lang3.StringUtils;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ReferenceCardinality;
import org.osgi.service.component.annotations.ReferencePolicy;
import org.osgi.service.metatype.annotations.Designate;

import com.tonomus.core.config.v2.FormFactoryConfig;
import com.tonomus.core.services.v2.FormFactoryConfigService;
import com.tonomus.core.utils.v2.AudienceOptionsUtils;

import lombok.Getter;

@Getter
@Component(service = FormFactoryConfigService.class, immediate = true, configurationPolicy = ConfigurationPolicy.REQUIRE)
@Designate(ocd = FormFactoryConfig.class, factory = true)
public class FormFactoryConfigServiceImpl implements FormFactoryConfigService {
    
    private String formID;

    private List<String> mandatoryFields;

    private MultiKeyMap<String, String> audienceIds;

    private List<FormFactoryConfigService> allConfigs;

    /**
     * @param config
     */
    @Activate
    @Modified
    protected void activate(final FormFactoryConfig config) {
        this.formID = config.formID();
        this.audienceIds = AudienceOptionsUtils.getAudienceOptionsMap(toList(config.audienceIds()));
        this.mandatoryFields = toList(config.mandatoryFields());
    }

    /**
     * @param config
     */
    @Reference(
        service = FormFactoryConfigService.class, 
        cardinality = ReferenceCardinality.MULTIPLE,
        policy = ReferencePolicy.DYNAMIC)
    public synchronized void bindFormMandatoryFieldFactoryConfigService(final FormFactoryConfigService config) {
        if (allConfigs == null) {
            allConfigs = new ArrayList<>();
        }
        allConfigs.add(config);
    }

    /**
     * @param config
     */
    public synchronized void unbindFormMandatoryFieldFactoryConfigService(final FormFactoryConfigService config) {
        allConfigs.remove(config);
    }

    /**
     * @param formID
     * @return first config matching form ID
     */
    @Override
    public FormFactoryConfigService getConfig(String formID) {        
        return allConfigs.stream()
            .filter(e -> formID.equals(e.getFormID()))
            .findFirst()
            .orElse(null);
    }

    private List<String> toList(String config){
        if (StringUtils.isNotBlank(config)) {
            return Stream.of(config.split(",", -1))
                .map(String::trim)
                .collect(Collectors.toList());
        } else {
            return Collections.emptyList();      
        }
    }
}
