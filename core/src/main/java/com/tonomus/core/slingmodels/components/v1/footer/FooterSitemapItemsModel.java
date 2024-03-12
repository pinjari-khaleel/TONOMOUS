package com.tonomus.core.slingmodels.components.v1.footer;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;

import javax.annotation.PostConstruct;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.tonomus.core.slingmodels.common.v1.LinkModel;
import com.tonomus.core.slingmodels.common.v1.PagePropertiesModel;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Class for s02 footer.
 */
@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class FooterSitemapItemsModel {

  /**
   * Label.
   */
  @Setter
  private String label;

  /**
   * Path to parent item.
   */
  @ValueMapValue
  private String path;

  /**
   * Link Target.
   */
  @ValueMapValue
  private String target;

  /**
   * Child Items.
   */
  @Setter
  private List<LinkModel> childItems;

  /**
   * The current component resource.
   */
  @Self
  private Resource currentResource;

  /**
   * Post construct method.
   */
  @PostConstruct
  private void init() {
    PageManager pageManager = currentResource.getResourceResolver().adaptTo(PageManager.class);
    if (Objects.nonNull(pageManager) && StringUtils.isNotBlank(path)) {
      fillFooterSitemap(pageManager, path);
    }
  }

  /**
   * Method for processing parent and child items.
   * @param pageManager pageManaged.
   * @param path path to parent page.
   */
  private void fillFooterSitemap(PageManager pageManager, String path) {
    Page parentPage = pageManager.getContainingPage(path);
    if (Objects.nonNull(parentPage)) {
      PagePropertiesModel parentModel = parentPage.adaptTo(PagePropertiesModel.class);
      setLabel(StringUtils.defaultIfBlank(Objects.requireNonNull(parentModel).getNavTitle(), parentModel.getTitle()));
      List<LinkModel> childItemsProcessed = new ArrayList<>();
      Iterator<Page> iterator = parentPage.listChildren();
      while (iterator.hasNext()) {
        LinkModel childItem = new LinkModel();
        Page childPage = iterator.next();
        PagePropertiesModel childModel = childPage.adaptTo(PagePropertiesModel.class);

        String childLabel = StringUtils.defaultIfBlank(Objects.requireNonNull(childModel).getNavTitle(),
            childModel.getTitle());
        String childUrl = Objects.requireNonNull(childModel).getUrl();

        childItem.setLabel(childLabel);
        childItem.setHref(childUrl);
        childItem.setTarget(target);

        childItemsProcessed.add(childItem);
      }
      setChildItems(childItemsProcessed);
    }
  }
}
