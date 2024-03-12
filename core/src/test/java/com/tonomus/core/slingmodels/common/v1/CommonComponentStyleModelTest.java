package com.tonomus.core.slingmodels.common.v1;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import java.util.ArrayList;
import java.util.List;

import com.adobe.cq.wcm.style.ComponentStyleInfo;
import com.adobe.cq.wcm.style.ContentPolicyStyleInfo;
import com.adobe.cq.wcm.style.StyleGroupInfo;
import com.adobe.cq.wcm.style.StyleInfo;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class CommonComponentStyleModelTest {

  @Mock
  ComponentStyleInfo componentStyleInfo;

  @Mock
  ContentPolicyStyleInfo policyStyleInfo;

  @Mock
  StyleGroupInfo styleGroupInfo;

  @Mock
  StyleInfo styleInfo;

  List<StyleGroupInfo> groupInfos;
  List<StyleInfo> styleInfos;

  CommonComponentStyleModel componentStyleModel;

  @BeforeEach
  void setUp() {
    groupInfos = new ArrayList<>();
    styleInfos = new ArrayList<>();
    groupInfos.add(styleGroupInfo);
    styleInfos.add(styleInfo);
    componentStyleModel = new CommonComponentStyleModel(componentStyleInfo);
  }

  @Test
  void testConstructorIsNotEmpty() {
    when(componentStyleInfo.getContentPolicyStyleInfo()).thenReturn(policyStyleInfo);
    when(componentStyleInfo.getContentPolicyStyleInfo().getStyleGroups()).thenReturn(groupInfos);
    when(styleGroupInfo.getStyles()).thenReturn(styleInfos);
    componentStyleModel = new CommonComponentStyleModel(componentStyleInfo);
    Assertions.assertNotNull(componentStyleModel);
  }

  @Test
  void testConstructorWithNull() {
    componentStyleModel = new CommonComponentStyleModel(null);
    Assertions.assertNotNull(componentStyleModel);
  }

  @Test
  void testGetPolicyStyleInfo() {
    when(componentStyleModel.getContentPolicyStyleInfo()).thenReturn(policyStyleInfo);
    ContentPolicyStyleInfo actual = componentStyleModel.getContentPolicyStyleInfo();
    Assertions.assertSame(policyStyleInfo, actual);
  }

  @Test
  void testGetAppliedStyles() {
    when(componentStyleModel.getAppliedStyles()).thenReturn(styleInfos);
    List<StyleInfo> actualList = componentStyleModel.getAppliedStyles();
    Assertions.assertSame(styleInfos, actualList);
  }

  @Test
  void testGetAppliedCssClasses() {
    when(componentStyleModel.getAppliedCssClasses()).thenReturn("");
    String actual = componentStyleModel.getAppliedCssClasses();
    Assertions.assertSame("", actual);
  }

  @Test
  void testGetAppliedHtmlElement() {
    when(componentStyleModel.getAppliedHtmlElement()).thenReturn("");
    String actual = componentStyleModel.getAppliedHtmlElement();
    Assertions.assertSame("", actual);
  }
}
