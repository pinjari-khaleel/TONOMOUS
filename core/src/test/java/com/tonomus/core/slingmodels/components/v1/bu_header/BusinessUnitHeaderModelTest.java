package com.tonomus.core.slingmodels.components.v1.bu_header;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsFor;

import org.apache.sling.servlethelpers.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.day.cq.wcm.api.Page;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import pl.pojo.tester.api.FieldPredicate;
import pl.pojo.tester.api.assertion.Method;

@ExtendWith(AemContextExtension.class)
public class BusinessUnitHeaderModelTest {

  private static final String CONTENT_PAGE = "/content/neom/en-us";

  @BeforeEach
  void setUp(AemContext context) {
    context.load().json("/components/s12-bu-header/s12-bu-header-sidebar.json", CONTENT_PAGE);
  }

  @Test
  @DisplayName("Test all getters of Business Unit header")
  void getterBusinessUnitModelMethodsTest() {
    assertPojoMethodsFor(BusinessUnitHeaderModel.class, FieldPredicate.exclude("resourceResolver", "sideBarItems"))
        .testing(Method.GETTER).areWellImplemented();
  }

  @Test
  void testInit(AemContext context) {
    Page page = context.resourceResolver().getResource(CONTENT_PAGE).adaptTo(Page.class);
    context.currentPage(page);
    MockSlingHttpServletRequest request = context.request();
    request.setResource(
        context.resourceResolver().getResource(CONTENT_PAGE + "/jcr:content/root/responsivegrid/s12_bu_header"));
    BusinessUnitHeaderModel model = request.adaptTo(BusinessUnitHeaderModel.class);
    assertNotNull(model);
    assertNotNull(model.getSideBarItems());
    assertEquals(2, model.getSideBarItems().size());
    assertEquals("1st Section", model.getSideBarItems().get(0).getAnchorLabel());
    assertEquals("3rd Section", model.getSideBarItems().get(1).getAnchorLabel());
  }

  @Test
  void testInitNoResource() {
    AemContext context = new AemContext();
    context.load().json("/components/s12-bu-header/s12-bu-header-no-responsivegrid.json", CONTENT_PAGE);
    Page withoutReponsiveGridPage = context.resourceResolver().getResource(CONTENT_PAGE).adaptTo(Page.class);
    context.currentPage(withoutReponsiveGridPage);
    MockSlingHttpServletRequest request = context.request();
    request.setResource(
        context.resourceResolver().getResource(CONTENT_PAGE + "/jcr:content/anypath/xpfragment/s12_bu_header"));
    BusinessUnitHeaderModel model = request.adaptTo(BusinessUnitHeaderModel.class);
    assertNotNull(model);
    assertNotNull(model.getSideBarItems());
    assertEquals(0, model.getSideBarItems().size());
  }

}
