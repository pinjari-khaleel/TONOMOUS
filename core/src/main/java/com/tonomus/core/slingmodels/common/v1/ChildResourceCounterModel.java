package com.tonomus.core.slingmodels.common.v1;

import lombok.Getter;

import java.util.Iterator;

import javax.annotation.PostConstruct;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;

import static com.tonomus.core.constants.NumberConstants.ZERO;

/**
 * Class for counting child resources.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ChildResourceCounterModel {

  /**
   * Column count.
   */
  private int columnCount;

  /**
   * The current component resource.
   */
  @Self
  private Resource currentResource;

  /**
   * init.
   */
  @PostConstruct
  protected void init() {
    columnCount = ZERO;
    Iterator<Resource> it = currentResource.listChildren();
    while (it.hasNext()) {
      it.next();
      columnCount++;
    }
  }
}
