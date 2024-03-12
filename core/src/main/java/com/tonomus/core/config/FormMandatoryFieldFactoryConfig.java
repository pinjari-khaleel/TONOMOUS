package com.tonomus.core.config;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Tonomus Form Mandatory Field Factory Config", 
    description = "Form Mandatory Field Configuration Factory")
public @interface FormMandatoryFieldFactoryConfig {

    @AttributeDefinition(
        name = "Form ID", 
        description = "Enter form id.",
        type = AttributeType.STRING)
    String formID() default "";

    @AttributeDefinition(
        name = "Mandatory Fields",
        description = "Add required fields of the form.",
        type = AttributeType.STRING)
    String mandatoryFields();
}
