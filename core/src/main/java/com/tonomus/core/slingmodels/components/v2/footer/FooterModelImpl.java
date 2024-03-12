package com.tonomus.core.slingmodels.components.v2.footer;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.wcm.core.components.models.Navigation;
import com.adobe.cq.wcm.core.components.models.NavigationItem;
import com.tonomus.core.slingmodels.common.v1.LinkModel;
import lombok.AccessLevel;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.via.ResourceSuperType;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Model(
        adaptables = {SlingHttpServletRequest.class, Resource.class},
        adapters = {FooterModel.class, ComponentExporter.class},
        resourceType = FooterModelImpl.RESOURCE_TYPE,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class FooterModelImpl implements FooterModel {

    public static final String RESOURCE_TYPE = "tonomus/components/content/components/footer/v2/footer";

    @Self
    private SlingHttpServletRequest request;

    @Self
    @Via(type=ResourceSuperType.class)
    private Navigation navigation;

    @ChildResource
    private List<LinkModel> socialMediaLinks;

    @ChildResource
    private List<LinkModel> otherLinks;

    @Getter
    @ValueMapValue
    private String addressTitle;

    @Getter
    @ValueMapValue
    private String addressDetail;

    @Override
    public List<NavigationItem> getItems() {
        return Optional.ofNullable(navigation).isPresent() ? navigation.getItems() : Collections.emptyList();
    }

    @Override
    public String getAccessibilityLabel() {
        return Optional.ofNullable(navigation).isPresent() ? navigation.getAccessibilityLabel() : null;
    }

    @Override
    public String getExportedType() {
        return RESOURCE_TYPE;
    }

    public List<LinkModel> getOtherLinkSimple() {
        return Optional.of(otherLinks).orElse(Collections.emptyList());
    }

    public List<LinkModel> getOtherLinks() {

        return Optional.ofNullable(otherLinks).orElse(Collections.emptyList());
    }

    public List<LinkModel> getSocialMediaLinks() {
        return Optional.ofNullable(socialMediaLinks).orElse(Collections.emptyList());
    }
}
