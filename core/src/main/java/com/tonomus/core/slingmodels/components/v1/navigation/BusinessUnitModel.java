package com.tonomus.core.slingmodels.components.v1.navigation;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.common.v1.LinkModel;

import lombok.Getter;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Getter
@Model(adaptables = {Resource.class},
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class BusinessUnitModel{

    @ChildResource
    private LinkModel link;

    @ChildResource
    private ImageModel logoImage;

    @ValueMapValue
    private boolean selected;
}
