package com.tonomus.core.services.impl.v2;

import org.apache.commons.lang3.StringUtils;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.metatype.annotations.Designate;

import com.tonomus.core.config.v2.TonomusGoogleRecaptchaConfig;
import com.tonomus.core.services.v2.TonomusRecaptchaConfigService;

import lombok.Getter;

@Getter
@Component(service = TonomusRecaptchaConfigService.class, immediate = true, configurationPolicy = ConfigurationPolicy.REQUIRE)
@Designate(ocd = TonomusGoogleRecaptchaConfig.class)
public class TonomusRecaptchaConfigServiceImpl implements TonomusRecaptchaConfigService {
    
    private String siteVerifyURL;

    private String secretKey;

    private String siteKey;

    /**
     * Fetch configuration in system during activation and modification
     * @param config
     */
    @Activate @Modified
    protected void activate(final TonomusGoogleRecaptchaConfig config) {
        this.siteVerifyURL = config.siteVerifyURL();
        this.secretKey = config.secretKey();
        this.siteKey = config.siteKey();
    }

    /**
     * Check whether configuration is completely configured.
     */
    public boolean isNotEmpty() {
        return StringUtils.isNotBlank(secretKey) && StringUtils.isNotBlank(siteVerifyURL) && StringUtils.isNotBlank(siteKey);
    }
}
