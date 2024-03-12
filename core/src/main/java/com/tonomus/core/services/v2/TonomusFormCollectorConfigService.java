package com.tonomus.core.services.v2;

import java.util.List;

public interface TonomusFormCollectorConfigService {
    
    String getUrl();
    String getSiteKey();
    List<String> getMandatoryFields();
}
