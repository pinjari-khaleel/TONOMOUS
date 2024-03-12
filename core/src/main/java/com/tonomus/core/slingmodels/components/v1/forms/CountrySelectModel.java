package com.tonomus.core.slingmodels.components.v1.forms;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.annotation.PostConstruct;

import com.adobe.cq.dam.cfm.ContentFragment;
import com.day.cq.dam.api.DamConstants;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tonomus.core.utils.JsonUtils;
import com.tonomus.core.utils.LangUtils;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ResourcePath;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Countries select model.
 */
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
public class CountrySelectModel {

  /**
   * Variable storing id.
   */
  @ValueMapValue
  private String id;

  /**
   * Variable storing label.
   */
  @ValueMapValue
  private String label;

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
   * Placeholder.
   */
  @ValueMapValue
  private String placeholder;

  /**
   * Validate.
   */
  @ChildResource
  private FormFieldValidateModel validate;

  /**
   * showRawValue.
   */
  @ValueMapValue
  private boolean showRawValue;

  /**
   * isWideDropdown.
   */
  @ValueMapValue
  private boolean isWideDropdown;

  /**
   * Country items.
   */
  @ChildResource
  private List<CountryModel> items;

  /**
   * Flag's path.
   */
  @ValueMapValue
  private String flagsPath;

  /**
   * A root content fragment resource to hold options.
   */
  @ResourcePath(path = "/content/dam/neom/content-fragments/flags")
  @JsonIgnore
  private Resource contentFragmentsResource;

  /**
   * The current component resource.
   */
  @Self
  @JsonIgnore
  private Resource currentResource;

  /**
   * Items as JSON.
   * @return items
   */
  @JsonIgnore public String getItemsJson() {
    return JsonUtils.serialize(this.items);
  }

  /**
   * Post construction.
   */
  @PostConstruct public void init() {
    if (CollectionUtils.isEmpty(items) && Objects.nonNull(contentFragmentsResource)) {
      Iterable<Resource> iterableRes = () -> contentFragmentsResource.listChildren();
      List<ContentFragment> contentFragments = StreamSupport.stream(iterableRes.spliterator(), false)
          .filter(r -> r.isResourceType(DamConstants.NT_DAM_ASSET)).map(res -> res.adaptTo(ContentFragment.class))
          .collect(Collectors.toList());
      if (!contentFragments.isEmpty()) {
        items = new ArrayList<>();
        String language = LangUtils.getCurrentLocale(currentResource).getLanguage();
        contentFragments.forEach(cf -> items.add(new CountryModel(cf, language)));
      }
    }
  }
}
