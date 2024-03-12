package com.tonomus.core.services;

import java.util.List;

public interface FormMandatoryFieldFactoryConfigService {
    
    String getFormID();
    List<String> getMandatoryFields();
    List<FormMandatoryFieldFactoryConfigService> getAllConfigs();
    FormMandatoryFieldFactoryConfigService getConfig(String formID);
}
