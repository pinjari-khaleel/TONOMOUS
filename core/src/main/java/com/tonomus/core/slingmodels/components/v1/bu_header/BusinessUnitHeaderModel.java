package com.tonomus.core.slingmodels.components.v1.bu_header;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.annotation.PostConstruct;

import com.tonomus.core.slingmodels.common.v1.ImageModel;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

import com.day.cq.wcm.api.Page;
import com.tonomus.core.slingmodels.common.v1.CommonComponentModel;
import com.tonomus.core.slingmodels.components.v1.navigation.BusinessUnitModel;
import com.tonomus.core.slingmodels.components.v1.tonomus_navigation.TonomusNavigationModel;

import static com.tonomus.core.constants.Constants.RESPONSIVE_GRID_PATH;
import static com.tonomus.core.constants.Constants.SLASH;
import static com.day.cq.commons.jcr.JcrConstants.JCR_CONTENT;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

/**
 * Class for S12 Business Unit (BU) header.
 */
@Slf4j
@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class BusinessUnitHeaderModel extends TonomusNavigationModel {

    /**
     * For business unit dropdown
     */
    @Getter
    @ChildResource
    private List<BusinessUnitModel> buNav;

    @SlingObject
    private ResourceResolver resourceResolver;

    @ScriptVariable
    private Page currentPage;

    private List<CommonComponentModel> sideBarItems;

    @PostConstruct
    public void init() {
        super.init();
        Resource responsiveGrid = resourceResolver
                .getResource(currentPage.getPath() + SLASH + JCR_CONTENT + SLASH + RESPONSIVE_GRID_PATH);
        if (responsiveGrid != null) {
            Iterable<Resource> components = () -> responsiveGrid.listChildren();
            sideBarItems = StreamSupport.stream(components.spliterator(), false)
                    .peek(e -> log.info("BusinessUnitHeaderModel > init > stream:" + e.getPath()))
                    .map(resource -> resource.adaptTo(CommonComponentModel.class))
                    .filter(e -> e.getAnchorId() != null & e.getAnchorLabel() != null)
                    .collect(Collectors.toList());
        }
    }

    public List<CommonComponentModel> getSideBarItems() {
        return Optional.ofNullable(sideBarItems)
                .orElse(Collections.emptyList());
    }

    public BusinessUnitModel getSelectedBuNav() {
        List<BusinessUnitModel> buList = Optional.ofNullable(buNav).orElse(Collections.emptyList());
        return buList.stream()
                .filter(item -> item.isSelected())
                .findFirst()
                .orElse(null);
    }
}
