package com.tonomus.core.config.v2;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Tonomus (V2 pages) Google Recaptcha Config", 
    description = "Recaptcha configuration for Tonomus")
public @interface TonomusGoogleRecaptchaConfig {

    @AttributeDefinition(
        name = "Site Verify API URL", 
        description = "Enter reCAPTCHA verification API endpoint.",
        type = AttributeType.STRING)
    String siteVerifyURL() default "";

    @AttributeDefinition(
        name = "Secret Key",
        description = "Secret Key for reCAPTCHA.",
        type = AttributeType.STRING)
    String secretKey() default "";

    @AttributeDefinition(   
        name = "Site Key",
        description = "Site Key for reCAPTCHA.",
        type = AttributeType.STRING)
    String siteKey() default "";
}
