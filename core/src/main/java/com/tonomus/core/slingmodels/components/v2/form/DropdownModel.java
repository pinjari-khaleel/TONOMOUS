package com.tonomus.core.slingmodels.components.v2.form;

import java.util.List;

import com.adobe.cq.wcm.core.components.models.form.Options;

public interface DropdownModel {

  public String getText();
  public String getValue();
  public boolean isSelected();
  public boolean isDisabled();
  public String getTitle();
  public String getName();
  public List<DropdownModel> getDynamicDropdown();
  public DropdownModel getDropdown();
  public String getHelpMessage();
  public Options getOptions();
}
