package com.tonomus.core.slingmodels.components.v1.forms.multistep;

import lombok.Getter;

import java.util.List;

import javax.inject.Inject;

import com.tonomus.core.slingmodels.components.v1.forms.FormSelectModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ResourcePath;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling Model to be used with m30-text-field in context of Oxagon Form.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class MultiStepFormSelectModel extends FormSelectModel {

  /**
   * Wide.
   */
  @ValueMapValue
  private boolean wide;

  /**
   * Constructor.
   * @param optionsSource options source
   * @param contentFragmentsRoot content fragments root
   * @param items option items defined in the dialog
   */
  @Inject
  public MultiStepFormSelectModel(
      @ValueMapValue(name = "optionsSource") String optionsSource,
      @ResourcePath(name = "contentFragmentsPath") Resource contentFragmentsRoot,
      @ChildResource(name = "items") List<FormSelectOptionModel> items
  ) {
    super(optionsSource, contentFragmentsRoot, items);
  }
}
