package com.tonomus.core.slingmodels.common.v1;

import lombok.Builder;
import lombok.Getter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.inject.Inject;
import javax.inject.Named;

import com.adobe.cq.wcm.style.ComponentStyleInfo;
import com.adobe.cq.wcm.style.ContentPolicyStyleInfo;
import com.adobe.cq.wcm.style.StyleGroupInfo;
import com.adobe.cq.wcm.style.StyleInfo;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;

import static java.util.Objects.isNull;

/**
 * Sling Model - Style system representation for all components.
 */
@Model(adaptables = Resource.class, cache = true,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CommonComponentStyleModel {

  /**
   * The map css classes separated by group.
   */
  @Getter
  private Map<String, String> mapAppliedCssClasses;

  /**
   * The string of list css classes related component background color.
   */
  @Getter
  private String backgroundColorStyleInline;

  /**
   * ComponentStyleInfo.
   */
  private final ComponentStyleInfo componentStyleInfo;

  /**
   * Constructor.
   *
   * @param componentStyleInfo Current style system information
   */
  @Inject public CommonComponentStyleModel(
      @Self @Named("componentStyleInfo") final ComponentStyleInfo componentStyleInfo) {
    this.componentStyleInfo = componentStyleInfo;
    if (isNull(componentStyleInfo) || isNull(componentStyleInfo.getContentPolicyStyleInfo())) {
      return;
    }

    Map<String, ComponentStyle> mapMyStyleByStyleId = new HashMap<>();
    for (StyleGroupInfo styleGroupInfo : componentStyleInfo.getContentPolicyStyleInfo()
        .getStyleGroups()) {
      for (StyleInfo styleInfo : styleGroupInfo.getStyles()) {
        mapMyStyleByStyleId.put(styleInfo.getId(),
            ComponentStyle.builder().styleId(styleInfo.getId()).groupLabel(styleGroupInfo.getLabel())
                .cssClasses(styleInfo.getCssClasses()).build());
      }
    }

    Map<String, List<ComponentStyle>> mapAppliedMyStyleByGroupLabel =
        componentStyleInfo.getAppliedStyles().stream()
            .map(styleInfo -> mapMyStyleByStyleId.get(styleInfo.getId()))
            .collect(Collectors.groupingBy(ComponentStyle::getGroupLabel));

    mapAppliedCssClasses = new HashMap<>();
    for (Map.Entry<String, List<ComponentStyle>> item : mapAppliedMyStyleByGroupLabel.entrySet()) {
      String classes =
          item.getValue().stream().map(ComponentStyle::getCssClasses).collect(Collectors.joining(" "));
      mapAppliedCssClasses.put(item.getKey(), classes);
    }

    backgroundColorStyleInline = Optional.ofNullable(mapAppliedCssClasses.get("Background Color"))
        .map(cssClass -> "--component-background-color: var(" + cssClass + ");").orElse(null);
  }

  /**
   * Getter for ContentPolicyStyleInfo.
   *
   * @return ContentPolicyStyleInfo.
   */
  public ContentPolicyStyleInfo getContentPolicyStyleInfo() {
    return componentStyleInfo.getContentPolicyStyleInfo();
  }

  /**
   * Getter for List<StyleInfo>.
   *
   * @return List<StyleInfo>.
   */
  public List<StyleInfo> getAppliedStyles() {
    return componentStyleInfo.getAppliedStyles();
  }

  /**
   * Get applied css classes.
   *
   * @return css classes
   */
  public String getAppliedCssClasses() {
    return componentStyleInfo.getAppliedCssClasses();
  }

  /**
   * Get applied html element.
   *
   * @return html element.
   */
  public String getAppliedHtmlElement() {
    return componentStyleInfo.getAppliedHtmlElement();
  }

  /**
   * Class to hold style properties.
   */
  @Getter
  @Builder
  private static class ComponentStyle {
    /**
     * Style id.
     */
    private String styleId;
    /**
     * Group label.
     */
    private String groupLabel;
    /**
     * Line of css classes separated by space.
     */
    private String cssClasses;
  }
}
