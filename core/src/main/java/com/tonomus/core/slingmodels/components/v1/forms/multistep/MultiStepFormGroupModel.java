package com.tonomus.core.slingmodels.components.v1.forms.multistep;

import lombok.Getter;

import java.util.List;

import javax.inject.Inject;

import com.tonomus.core.slingmodels.components.v1.forms.FieldsetLegendModel;
import com.tonomus.core.slingmodels.components.v1.forms.FormSelectModel;
import com.tonomus.core.slingmodels.components.v1.forms.FormTextModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ResourcePath;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling Model for Form Step Group.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class MultiStepFormGroupModel extends FormTextModel {

  /**
   * Legend.
   */
  @ChildResource
  private FieldsetLegendModel fieldsetLegend;

  /**
   * Copy.
   */
  @ValueMapValue
  private String copy;

  /**
   * Show Textarea For Other Choice.
   */
  @ChildResource
  private ShowTextareaForOtherChoice showTextareaForOtherChoice;

  /**
   * Show Textarea For Multiple Choice.
   */
  @ChildResource
  private ShowDropdownForMultipleChoice showDropdownForMultipleChoice;

  /**
   * Sling Model for Form Step Group - ShowTextareaForOtherChoice.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class ShowTextareaForOtherChoice extends FormTextModel {
    /**
     * Is wide.
     */
    @ValueMapValue
    private boolean wide;

    @Override public boolean isDisabled() {
      return true;
    }
  }

  /**
   * Sling Model for Form Step Group - ShowDropdownForMultipleChoice.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class ShowDropdownForMultipleChoice extends FormSelectModel {
    /**
     * Is wide.
     */
    @ValueMapValue
    private boolean wide;

    /**
     * Is multi-selection allowed.
     */
    @ValueMapValue
    private boolean multiSelect;

    /**
     * Is a scroll component.
     */
    @ValueMapValue
    private boolean scrollComponent;

    /**
     * Constructor.
     * @param optionsSource options source
     * @param contentFragmentsRoot content fragments root
     * @param items option items defined in the dialog
     */
    @Inject
    public ShowDropdownForMultipleChoice(
        @ValueMapValue(name = "optionsSource") String optionsSource,
        @ResourcePath(name = "contentFragmentsPath") Resource contentFragmentsRoot,
        @ChildResource(name = "items") List<FormSelectOptionModel> items
    ) {
      super(optionsSource, contentFragmentsRoot, items);
    }
  }
}
