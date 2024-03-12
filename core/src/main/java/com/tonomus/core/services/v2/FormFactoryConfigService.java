package com.tonomus.core.services.v2;

import java.util.List;

import org.apache.commons.collections4.map.MultiKeyMap;

public interface FormFactoryConfigService {
    
    String getFormID();
    List<String> getMandatoryFields();
    List<FormFactoryConfigService> getAllConfigs();
    FormFactoryConfigService getConfig(String formID);
    MultiKeyMap<String, String> getAudienceIds();
}
