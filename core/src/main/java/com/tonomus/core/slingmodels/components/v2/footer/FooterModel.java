package com.tonomus.core.slingmodels.components.v2.footer;

import com.adobe.cq.wcm.core.components.models.Navigation;
import com.tonomus.core.slingmodels.common.v1.LinkModel;

import java.util.List;

public interface FooterModel extends Navigation {

    /**
     * @return returns <code>addressTitle</code> property value of a component
     */
    public String getAddressTitle();

    /**
     * @return returns <code>addressDetail</code> property value of a component
     */
    public String getAddressDetail();

    /**
     * @return returns list of links from <code>socialMediaLinks</code> of a component
     */
    public List<LinkModel> getSocialMediaLinks();

    /**
     * @return returns list of links from <code>otherLinks</code> of a component
     */
    public List<LinkModel> getOtherLinks();
}
