package com.tonomus.core.slingmodels.components.v1.bu_cards;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.common.v1.LinkModel;
import com.tonomus.core.slingmodels.common.v1.TextModel;

import lombok.Getter;

@Getter
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class BUCardItemModel {

    @ChildResource
    private ImageModel image;

    @ChildResource
    private ImageModel logo;

    @ChildResource
    private LinkModel link;

    @ChildResource
    private TextModel description;

    @ChildResource
    private TextModel title;
}
