package com.tonomus.core.slingmodels.components.v1.forms;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.annotation.PostConstruct;

import com.tonomus.core.constants.Constants;
import com.tonomus.core.legacy.cloud.CloudServiceConfiguration;
import com.tonomus.core.legacy.cloud.GoogleRecaptchaConfiguration;
import com.tonomus.core.legacy.cloud.ResourceCloudServices;
import com.tonomus.core.slingmodels.common.v1.TextModel;
import com.tonomus.core.utils.JsonUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;


/**
 * A model to generate json for ModalForm.
 */
@Slf4j
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ModalFormModel extends FormModel {


  /**
   * Inject self Resource.
   */
  @Self
  private transient Resource resource;

  /**
   * List of form groups.
   */
  private List<ModalFormGroupModel> groups;

  /**
   * Form name.
   */
  @ValueMapValue
  private String name;

  /**
   * Form heading.
   */
  @Self
  private TextModel heading;

  /**
   * Recaptcha istance.
   */
  private Recaptcha recaptcha;

  /**
   * Init method for class members belong to this Sling Model.
   */
  @PostConstruct protected void initModal() {
    String actionPath = resource.getResourceResolver().map(resource.getPath());
    setAction(actionPath + ".form");

    groups = StreamSupport.stream(resource.getChildren().spliterator(), false)
        .filter(r -> r.getResourceType().equals(Constants.C48_FORMS_GROUP_RESOURCE_TYPE))
        .map(res -> res.adaptTo(ModalFormGroupModel.class)).collect(Collectors.toList());

    try {
      ResourceCloudServices cloudServices = new ResourceCloudServices(resource);
      //use the same Recaptcha configuration as in GenericFormsServlet.
      GoogleRecaptchaConfiguration recaptchaConfiguration =
          cloudServices.getConfiguration(CloudServiceConfiguration.GOOGLE_RECAPTCHA);
      recaptcha = new Recaptcha(recaptchaConfiguration.getReCaptchaSiteKey(), getBranding());
    } catch (IllegalArgumentException ex) {
      log.error("no configurations for Google Recaptcha");
    }

  }

  /**
   * Generates JSON for modal.
   *
   * @return json of the form.
   */
  public String toJson() {
    return JsonUtils.serialize(Map.of("form", this));
  }

  /**
   * Class for recaptcha properties.
   */
  @AllArgsConstructor
  @Getter
  private class Recaptcha {

    /**
     * Sitekey.
     */
    private String sitekey;
    /**
     * Statement.
     */
    private String statement;
  }

}
