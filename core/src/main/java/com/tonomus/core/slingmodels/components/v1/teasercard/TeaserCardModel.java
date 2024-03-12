package com.tonomus.core.slingmodels.components.v1.teasercard;

import java.util.List;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.tonomus.core.slingmodels.common.v1.HeaderModel;
import com.tonomus.core.slingmodels.common.v1.ImageModel;
import com.tonomus.core.slingmodels.common.v1.LinkModel;
import com.tonomus.core.slingmodels.common.v1.TextModel;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

/**
 * Class for C101 Teaser card.
 */
@Slf4j
@Getter
@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TeaserCardModel {

    /**
     * Card heading text.
     */
    @ChildResource
    private HeaderModel header;

    /**
     * Card description.
     */
    @ChildResource
    private TextModel description;

    /**
     * Card CTA
     */
    @ChildResource
    private LinkModel button;

    @ChildResource
    private List<ImageModel> images;

    @ValueMapValue
    private String cardLayout;
}
