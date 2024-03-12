package com.tonomus.core.slingmodels.components.v1.forms.multistep;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.StreamSupport;

import javax.annotation.PostConstruct;

import com.tonomus.core.constants.NumberConstants;
import com.tonomus.core.slingmodels.common.v1.ComponentBackgroundModel;
import com.tonomus.core.slingmodels.common.v1.HeaderModel;
import com.tonomus.core.slingmodels.components.v1.forms.FormModelBase;
import com.tonomus.core.utils.LangUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import static com.tonomus.core.slingmodels.components.v1.forms.multistep.MultiStepFormStepModel.RT_MULTISTEPFORM_STEP;
import static java.util.Objects.nonNull;

/**
 * Sling Model for MultiStep Form.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class MultiStepFormModel extends FormModelBase {

  /**
   * List of Hidden Fields.
   */
  @ChildResource
  private List<NameValueObject> hiddenFields;

  /**
   * Back Button Text Value.
   */
  @ValueMapValue
  private String backButtonLabel;

  /**
   * Back Button Text Value.
   */
  @ValueMapValue
  private String nextButtonLabel;

  /**
   * Back Button Text Value.
   */
  @ValueMapValue
  private String submitButtonLabel;

  /**
   * dir.
   */
  private String dir;

  /**
   * List of step headers.
   */
  private List<HeaderModel> stepHeaderList = new ArrayList<>();

  /**
   * First step percentage.
   */
  private Integer percentage;

  /**
   * Inject self Resource.
   */
  @Self
  private Resource currentResource;

  /**
   * Background.
   */
  @ChildResource
  private ComponentBackgroundModel background;

  /**
   * Post construct.
   */
  @PostConstruct
  protected void initMultiStepFormModel() {
    if (LangUtils.ARABIC_LANGUAGE.equals(getLanguageCode())) {
      dir = "rtl";
    } else {
      dir = "ltr";
    }
    if (nonNull(currentResource)) {
      StreamSupport
          .stream(currentResource.getChildren().spliterator(), false)
          .filter(r -> RT_MULTISTEPFORM_STEP.equals(r.getResourceType())).forEach(r -> {
            Resource headerRes = r.getChild("header");
            HeaderModel header = null;
            if (nonNull(headerRes)) {
              header = headerRes.adaptTo(HeaderModel.class);
            }
            stepHeaderList.add(header);
          });
      if (!stepHeaderList.isEmpty()) {
        percentage = Math.round(NumberConstants.HUNDRED_FLOAT / stepHeaderList.size());
      }
      String actionPath = currentResource.getResourceResolver().map(currentResource.getPath());
      super.setAction(actionPath + ".form");

    }
  }

  /**
   * Sling Model for Name-Value Objets.
   */
  @Getter
  @Model(adaptables = Resource.class,
         defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
  public static class NameValueObject {
    /**
     * Name.
     */
    @ValueMapValue
    private String name;
    /**
     * Value.
     */
    @ValueMapValue
    private String value;
  }
}
