package com.tonomus.core.config.adapters;

import com.tonomus.core.config.impl.SocialOptionsImpl;

import org.apache.sling.api.adapter.AdapterFactory;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;

/**
 * Social Options default configuration model adapter.
 */
@Component(service = AdapterFactory.class,
           property = {"adaptables=org.apache.sling.api.resource.Resource",
               "adapters=com.tonomus.core.config.SocialOptions"})
public class SocialOptionsAdapter implements AdapterFactory {

  @Override public <T> T getAdapter(Object adaptable, Class<T> type) {
    Resource resource = (Resource) adaptable;
    return (T) new SocialOptionsImpl(resource);
  }
}
