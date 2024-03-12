package com.tonomus.core.slingmodels.components.v1.whatwedo;

import com.tonomus.core.slingmodels.common.v1.ImageModel;
import lombok.Getter;

import javax.inject.Inject;

import com.adobe.cq.export.json.ExporterConstants;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import com.tonomus.core.slingmodels.components.v1.peoplecarousel.ImageCarouselItemModel;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
        extensions = ExporterConstants.SLING_MODEL_EXTENSION)
@Getter
@Model(adaptables = Resource.class,
        cache = true,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL,
        resourceType = OpportunityCardModel.RESOURCE_TYPE)
public class OpportunityCardModel extends ImageCarouselItemModel {

    static final String RESOURCE_TYPE = "tonomus/components/content/components/c97-what-we-do-cards/v1/opportunity-cards";

    @ValueMapValue
    private String title;

//    @ChildResource
//    private ImageModel icon;

    @Inject
    public OpportunityCardModel(@SlingObject final Resource resource) {
    super(resource);
  }
}