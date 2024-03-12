package com.tonomus.core.services.v2;

public interface TonomusRecaptchaConfigService {
    
    String getSiteVerifyURL();
    String getSecretKey();
    String getSiteKey();
    boolean isNotEmpty();
}
