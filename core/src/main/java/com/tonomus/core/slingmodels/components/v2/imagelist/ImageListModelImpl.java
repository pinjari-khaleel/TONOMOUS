package com.tonomus.core.slingmodels.components.v2.imagelist;

import com.tonomus.core.slingmodels.common.v1.ImageModel;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Model(adaptables = {SlingHttpServletRequest.class, Resource.class},
        adapters = ImageListModel.class,
        resourceType = ImageListModelImpl.RESOURCE_TYPE,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ImageListModelImpl implements ImageListModel {

    public static final String RESOURCE_TYPE = "tonomus/components/content/components/imagelist/v2/imagelist";

    @ChildResource
    private List<ImageModel> images;

    public List<ImageModel> getImages() {
        return Optional.ofNullable(images).orElse(Collections.emptyList());
    }
}
