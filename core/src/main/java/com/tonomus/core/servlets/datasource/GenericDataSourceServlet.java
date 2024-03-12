package com.tonomus.core.servlets.datasource;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import com.adobe.granite.ui.components.ds.DataSource;
import com.adobe.granite.ui.components.ds.SimpleDataSource;
import com.adobe.granite.ui.components.ds.ValueMapResource;
import com.day.cq.commons.jcr.JcrConstants;
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
 * Generic Datasource: it can be used to include reusable jcr nodes in side
 * Touch UI dropdown.
 * To use this datasource see below jcr structure
 * + myselect
 * - sling:resourceType = "granite/ui/components/coral/foundation/form/select"
 * - emptyText = "Select"
 * - name = "./myselect"
 * + datasource
 * - path = "/apps/path/to/my/items"
 * - sling:resourceType = tonomus/generic/datasource"
 */

@Component(service = Servlet.class,
           immediate = true,
           property = {Constants.SERVICE_DESCRIPTION + "=Tonomus - Generic Datasource Servlet",
               "sling.servlet.resourceTypes=tonomus/generic/datasource",
               "sling.servlet.methods=" + HttpConstants.METHOD_GET})
@Slf4j
public class GenericDataSourceServlet extends SlingSafeMethodsServlet {

  /**
   * Override doGet method of SlingSafeMethodsServlet, for more details read
   * class java doc.
   *
   * @param req  SlingHttpServletRequest
   * @param resp SlingHttpServletResponse
   * @throws ServletException ServletException
   * @throws IOException      IOException
   */
  @Override protected void doGet(final SlingHttpServletRequest req,
      final SlingHttpServletResponse resp) throws ServletException, IOException {
    ResourceResolver resolver = req.getResourceResolver();

    Stream<Resource> resourceStream = ServletUtils.getDataSourceResourceStream(req);

    List<Resource> resourceList =
        resourceStream.map(Resource::getValueMap).map(ValueMapDecorator::new).map(
            vm -> new ValueMapResource(resolver, new ResourceMetadata(),
                JcrConstants.NT_UNSTRUCTURED, vm)).collect(Collectors.toList());

    DataSource ds = new SimpleDataSource(resourceList.iterator());
    req.setAttribute(DataSource.class.getName(), ds);
  }
}
