package com.tonomus.core.services.impl.v2;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.metatype.annotations.Designate;

import com.tonomus.core.config.v2.TonomusFormCollectorConfig;
import com.tonomus.core.services.v2.TonomusFormCollectorConfigService;

import lombok.Getter;

@Getter
@Component(service = TonomusFormCollectorConfigService.class, immediate = true, configurationPolicy = ConfigurationPolicy.REQUIRE)
@Designate(ocd = TonomusFormCollectorConfig.class)
public class TonomusFormCollectorConfigServiceImpl implements TonomusFormCollectorConfigService {
    
    private String url;

    private String siteKey;

    private List<String> mandatoryFields;

    /**
     * Fetch configuration in system during activation and modification
     * @param config
     */
    @Activate @Modified
    protected void activate(final TonomusFormCollectorConfig config) {
        this.url = config.url();
        this.siteKey = config.siteKey();
        if (ArrayUtils.isNotEmpty(config.mandatoryFields())) {
            this.mandatoryFields = Arrays.stream(config.mandatoryFields())
                .filter(StringUtils::isNotBlank)
                .collect(Collectors.toList());
        } else {
            this.mandatoryFields = Collections.emptyList();
        }
    }

}
