package com.tonomus.core.config.v2;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Tonomus (V2 pages) Neom Form Collector Config", 
    description = "Form Collector configuration")
public @interface TonomusFormCollectorConfig {

    @AttributeDefinition(
        name = "Endpoint URL", 
        description = "Enter API endpoint URL to sending form data.",
        type = AttributeType.STRING)
    String url() default "";

    @AttributeDefinition(   
        name = "API Key",
        description = "API Key for authentication.",
        type = AttributeType.STRING)
    String siteKey() default "";

    @AttributeDefinition(
        name = "Mandatory fields", 
        description = "Mandatory fields for Neom Form collector.",
        type = AttributeType.STRING)
    String[] mandatoryFields();
}
