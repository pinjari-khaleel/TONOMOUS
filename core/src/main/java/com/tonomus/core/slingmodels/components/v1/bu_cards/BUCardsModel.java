package com.tonomus.core.slingmodels.components.v1.bu_cards;

import java.util.List;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tonomus.core.slingmodels.common.v1.HeaderModel;
import com.tonomus.core.utils.JsonUtils;

import lombok.Getter;

/**
 * Class for C95 Business Unit (BU) cards.
 */
@Getter
@Model(adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class BUCardsModel {
    
    /**
    * Item heading text.
    */
    @ChildResource
    private HeaderModel header;

    /**
    * Card color.
    */
    @ValueMapValue
    private String color;

    @Getter
    @ChildResource
    private List<BUCardItemModel> buCards;
    
    /**
    * ItemsJson method for serialize items list.
    *
    * @return json representation.
    */
    @JsonIgnore
    public String getItemsJson() {
        return JsonUtils.serialize(buCards);
    }
}
