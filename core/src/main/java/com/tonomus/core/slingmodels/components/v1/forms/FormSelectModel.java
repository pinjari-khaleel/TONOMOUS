package com.tonomus.core.slingmodels.components.v1.forms;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.inject.Inject;

import com.adobe.cq.dam.cfm.ContentFragment;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tonomus.core.constants.Constants;
import com.tonomus.core.utils.CommonUtils;
import com.tonomus.core.utils.JsonUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ResourcePath;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling Model for Select model.
 */
@Model(adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
public class FormSelectModel extends FormFieldBase {

  /**
   * Content fragments option items source.
   */
  public static final String CONTENT_FRAGMENTS_SOURCE = "contentFragments";

  /**
   * Type of the select field.
   */
  private final String type = Constants.SELECT;



  /**
   * Variable storing label.
   */
  @ValueMapValue
  private String label;

  @ValueMapValue
  private String iconName;

  /**
   * Variable storing titleInEnglish.
   */
  @ValueMapValue
  private String titleInEnglish;

  /**
   * Variable storing label.
   */
  @ValueMapValue
  private String name;

  /**
   * Required.
   */
  @ValueMapValue
  private boolean required;

  /**
   * Disabled.
   */
  @ValueMapValue
  private boolean disabled;

  /**
   * Autocomplete.
   */
  @ValueMapValue
  private boolean autocomplete;

  /**
   * Placeholder.
   */
  @ValueMapValue
  private String placeholder;

  /**
   * List of options.
   */
  private List<FormSelectOptionModel> items;

  /**
   * Validate.
   */
  @ChildResource
  private FormFieldValidateModel validate;

  /**
   * Items as json.
   * @return items
   */
  @JsonIgnore
  public String getItemsJson() {
    return JsonUtils.serialize(this.items);
  }

  /**
   * Constructor.
   * @param optionsSource options source
   * @param contentFragmentsRoot content fragments root
   * @param items option items defined in the dialog
   */
  @Inject
  public FormSelectModel(
      @ValueMapValue(name = "optionsSource") String optionsSource,
      @ResourcePath(name = "contentFragmentsPath") Resource contentFragmentsRoot,
      @ChildResource(name = "items") List<FormSelectOptionModel> items
  ) {
    if (CONTENT_FRAGMENTS_SOURCE.equals(optionsSource) && contentFragmentsRoot != null) {
      this.items =
          CommonUtils.iteratorStream(contentFragmentsRoot.listChildren())
              .map(resource -> resource.adaptTo(ContentFragment.class))
              .filter(Objects::nonNull)
              .map(contentFragment -> {
                FormSelectOptionModel model = new FormSelectOptionModel();
                model.label = contentFragment.getElement("name").getContent();
                model.value = contentFragment.getElement("value").getContent();
                return model;
              })
              .collect(Collectors.toList());
    } else {
      this.items = Optional.ofNullable(items).map(ArrayList::new).orElse(null);
    }

  }

  /**
   * Sling Model for Select model.
   */
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  @Getter
  public static class FormSelectOptionModel {
    /**
     * Label.
     */
    @ValueMapValue
    private String label;
    /**
     * Value.
     */
    @ValueMapValue
    private String value;
  }
}
