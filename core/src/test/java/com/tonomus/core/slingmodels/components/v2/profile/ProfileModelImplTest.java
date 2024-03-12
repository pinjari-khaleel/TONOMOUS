package com.tonomus.core.slingmodels.components.v2.profile;

import pl.pojo.tester.api.FieldPredicate;
import pl.pojo.tester.api.assertion.Method;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.tonomus.core.utils.AppAemContextUtils;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static pl.pojo.tester.api.assertion.Assertions.assertPojoMethodsFor;

@ExtendWith(AemContextExtension.class)
class ProfileModelImplTest {

  private static final String CONTENT_PAGE = "/content/tonomus/en-us";

  private final AemContext context = AppAemContextUtils.appAemContextWithCoreComponent();

  @Test
  void getterModelTest() {
    assertPojoMethodsFor(ProfileModelImpl.class, FieldPredicate.exclude("request"))
        .testing(Method.GETTER).areWellImplemented();
  }

  @BeforeEach
  void setUp() {
    final String COMPONENT = "../ui.apps/src/main/content/jcr_root/apps/tonomus/components/content/components/profile/v2/profile/.content.xml";
    context.load().fileVaultXml(COMPONENT, "/apps/" + ProfileModelImpl.RESOURCE_TYPE);
    context.load().json("/components/profile/profile.json", CONTENT_PAGE);
  }

  @Test
  void testGetModelImpl() {
    context.currentResource(CONTENT_PAGE + "/jcr:content/root/component");
    ProfileModelImpl model = context.request().adaptTo(ProfileModelImpl.class);
    assertNotNull(model);
    assertNotNull(model.getTeaser());
    assertEquals(2, model.getIcons().size());
  }

  @Test
  void testInterface() {
    context.currentResource(CONTENT_PAGE + "/jcr:content/root/component-nodescription-noctas");
    ProfileModel model = context.request().adaptTo(ProfileModel.class);
    assertNotNull(model);
    assertNotNull(model.getTeaser());
    assertNull(model.getTeaser().getDescription());
  }

  @Test
  void testGetEmptyIcon() {
    context.currentResource(CONTENT_PAGE + "/jcr:content/root/component-ctawithouticon");
    ProfileModel model = context.request().adaptTo(ProfileModel.class);
    assertNotNull(model);
    assertNotNull(model.getTeaser());
    assertEquals(0, model.getIcons().size());
  }
}
