package com.tonomus.core.slingmodels.components.v2.form;

import java.util.List;

import com.adobe.cq.wcm.core.components.models.form.Options;

public interface MultiDropdownModel extends Options {

  public Options getOptions();
  public List<DropdownModel> getDropdownOptions();
  public String getItemsJson();

}
