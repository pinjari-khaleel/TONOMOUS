package com.tonomus.core.slingmodels.common.v1;

import pl.pojo.tester.api.assertion.Method;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsForAll;

@ExtendWith(MockitoExtension.class)
class BackButtonLinkModelTest {

  @Mock
  private Resource resource;
  @Mock
  private ResourceResolver resolver;
  @Mock
  private PageManager pageManager;
  @Mock
  private Page page;
  @Mock
  private Page parent;

  @Test
  void testGetter() {
    assertPojoMethodsForAll(BackButtonLinkModel.class).testing(Method.GETTER)
        .areWellImplemented();
  }

  @Test
  void test() {
    when(resolver.adaptTo(PageManager.class)).thenReturn(pageManager);
    when(resource.getResourceResolver()).thenReturn(resolver);
    when(pageManager.getContainingPage(resource)).thenReturn(page);
    when(page.getParent()).thenReturn(parent);
    when(parent.getPath()).thenReturn("/content/tonomus/en-us/page");
    when(parent.getTitle()).thenReturn("Test");
    BackButtonLinkModel backButtonLinkModel = new BackButtonLinkModel(null, null, resource);
    assertEquals("/content/tonomus/en-us/page", backButtonLinkModel.getHref());
    assertEquals("Return to Test", backButtonLinkModel.getLabel());
  }

  @Test
  void test2() {
    when(resource.getResourceResolver()).thenReturn(resolver);
    when(resolver.adaptTo(PageManager.class)).thenReturn(pageManager);
    assertThrows(IllegalArgumentException.class, () -> new BackButtonLinkModel(null, null,
        resource));
  }

}