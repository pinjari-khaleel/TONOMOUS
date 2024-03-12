package com.tonomus.core.config.adapters;

import com.tonomus.core.config.impl.FormSubscriptionOptionsImpl;

import org.apache.sling.api.adapter.AdapterFactory;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;

/**
 * Form subscription model adapter.
 */
@Component(service = AdapterFactory.class,
           property = {"adaptables=org.apache.sling.api.resource.Resource",
               "adapters=com.tonomus.core.config.FormSubscriptionOptions"})
public class FormSubscriptionAdapter implements AdapterFactory {

  @Override public <T> T getAdapter(final Object adaptable, final Class<T> aClass) {
    Resource resource = (Resource) adaptable;
    return (T) new FormSubscriptionOptionsImpl(resource);
  }
}
