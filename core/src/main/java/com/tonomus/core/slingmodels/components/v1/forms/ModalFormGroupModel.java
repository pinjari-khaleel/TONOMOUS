package com.tonomus.core.slingmodels.components.v1.forms;

import lombok.Getter;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.annotation.PostConstruct;

import com.tonomus.core.constants.Constants;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;

/**
 * Sling Model for form group.
 */
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL,
       resourceType = Constants.C48_FORMS_GROUP_RESOURCE_TYPE)
@Getter
public class ModalFormGroupModel extends FormGroupModel {

  /**
   * List of the items of group.
   */
  @Getter
  private List<FormFieldBase> items;

  /**
   * Current resource.
   */
  @Self
  private transient Resource resource;

  /**
   * Init items.
   */
  @PostConstruct private void initModal() {
    items = StreamSupport.stream(resource.getChildren().spliterator(), false)
        .filter(r -> (!Objects.isNull(r)) && Constants.RESOURCES_IN_FORM_GROUP.contains(r.getResourceType()))
        .map(this::getFormFieldModel).filter(Objects::nonNull).collect(Collectors.toList());
  }

  /**
   * Returns sling model of form group item based on resource.
   *
   * @param resource resource.
   * @return sling model.
   */
  private FormFieldBase getFormFieldModel(Resource resource) {
    switch (resource.getResourceType()) {
      case Constants.M27_CHECKBOX_OPTION_RESOURCE:
      case Constants.M28_RADIO_OPTION_RESOURCE:
        return resource.adaptTo(FormCheckBoxModel.class);
      case Constants.M30_TEXT_FIELD_RESOURCE:
        return resource.adaptTo(FormTextModel.class);
      case Constants.M31_DROPDOWN_FIELD_RESOURCE:
        return resource.adaptTo(FormSelectModel.class);
      default:
        return resource.adaptTo(FormFieldBase.class);
    }
  }
}
