package com.tonomus.core.slingmodels.components.v1.forms;

import lombok.Getter;

import java.util.List;
import java.util.Optional;

import javax.annotation.PostConstruct;

import com.google.gson.Gson;
import com.tonomus.core.slingmodels.common.v1.ButtonModel;
import com.tonomus.core.slingmodels.components.v1.forms.multistep.MultiStepFormModel;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling Model for form model - o45.
 */
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
public class FormModel extends FormModelBase {

  /**
   * Variable storing text.
   */
  @ValueMapValue
  private String text;

  /**
   * Variable storing description.
   */
  @ValueMapValue
  private String description;

  /**
   * Buttons.
   */
  @ChildResource
  private List<ButtonModel> buttons;

  /**
   * Variable storing footer copy.
   */
  @ValueMapValue
  private String footerCopy;

  /**
   * Messages.
   */
  @ChildResource
  private FormMessages messages;

  /**
   * List of Hidden Fields.
   */
  @ChildResource
  private List<MultiStepFormModel.NameValueObject> hiddenFields;

  /**
   * Messages as JSON.
   * @return messages
   */
  public String getMessagesJson() {
    return Optional.ofNullable(messages).map(ms -> new Gson().toJson(ms)).orElse(null);
  }

  /**
   * The component is empty.
   */
  private boolean empty;

  /**
   * Post construct (individual for this class).
   */
  @PostConstruct
  protected void initForFormModel() {
    empty = !getCurrentResource().hasChildren();
  }
}
