package com.tonomus.core.servlets.contentfragment;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.granite.ui.components.ds.DataSource;
import com.adobe.granite.ui.components.ds.SimpleDataSource;
import com.adobe.granite.ui.components.ds.ValueMapResource;
import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.dam.api.DamConstants;
import com.tonomus.core.utils.ServletUtils;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceMetadata;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.api.wrappers.ValueMapDecorator;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;

/**
 * Servlet to return options for component dialog dropdown lists.
 */
@Component(service = Servlet.class,
           immediate = true,
           property = {Constants.SERVICE_DESCRIPTION + "=Tonomus - Generic Datasource Servlet",
               "sling.servlet.resourceTypes=tonomus/generic/datasource/contentfragment",
               "sling.servlet.methods=" + HttpConstants.METHOD_GET})
public class ContentFragmentDataSourceServlet extends SlingSafeMethodsServlet {

  /**
   * Value parameter name.
   */
  private static final String VALUE = "value";
  /**
   * Name parameter name.
   */
  private static final String NAME = "name";
  /**
   * Text parameter name.
   */
  private static final String TEXT = "text";

  /**
   * Override doGet method of SlingSafeMethodsServlet, for more details read
   * class java doc.
   *
   * @param request  SlingHttpServletRequest
   * @param response SlingHttpServletResponse
   * @throws ServletException ServletException
   * @throws IOException      IOException
   */
  @Override protected void doGet(final SlingHttpServletRequest request,
      final SlingHttpServletResponse response) throws ServletException, IOException {
    ResourceResolver resolver = request.getResourceResolver();
    Stream<Resource> resourceStream = ServletUtils.getDataSourceResourceStream(request);
    List<ContentFragment> contentFragments = getContentFragmentsFromResourceStream(resourceStream);
    List<Resource> resourceList = getResourcesFromContentFragments(contentFragments, resolver);

    DataSource ds = new SimpleDataSource(resourceList.iterator());
    request.setAttribute(DataSource.class.getName(), ds);
  }

  /**
   * Get ContentFragment from Resource stream.
   *
   * @param resourceStream Resource stream
   * @return List of ContentFragments
   */
  protected List<ContentFragment> getContentFragmentsFromResourceStream(
      final Stream<Resource> resourceStream) {
    return resourceStream.filter(r -> r.isResourceType(DamConstants.NT_DAM_ASSET))
        .map(r -> r.adaptTo(ContentFragment.class)).filter(Objects::nonNull)
        .filter(cf -> cf.hasElement(NAME) && cf.hasElement(VALUE)).collect(Collectors.toList());
  }

  /**
   * Get Datasource Resources from ContentFragments list.
   *
   * @param contentFragments ContentFragments List
   * @param resolver         ResourceResolver to create Resources
   * @return List of Resources
   */
  protected List<Resource> getResourcesFromContentFragments(
      final List<ContentFragment> contentFragments, ResourceResolver resolver) {
    return contentFragments.stream().map(cf -> new ValueMapDecorator(
        Map.of(TEXT, cf.getElement(NAME).getContent(), VALUE,
            cf.getElement(VALUE).getContent()))).map(
                vm -> new ValueMapResource(resolver, new ResourceMetadata(), JcrConstants.NT_UNSTRUCTURED,
                    vm)).collect(Collectors.toList());
  }
}
