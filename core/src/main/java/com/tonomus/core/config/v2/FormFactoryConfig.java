package com.tonomus.core.config.v2;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Tonomus (V2 pages) Form Configuration Factory", 
    description = "Form Configuration Factory")
public @interface FormFactoryConfig {

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

    @AttributeDefinition(
        name = "Audience Id Options",
        description = "Audience Id options of the form.",
        type = AttributeType.STRING) 
    String audienceIds();
}
