package com.tonomus.core.servlets.datasource;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import java.io.IOException;
import java.util.stream.StreamSupport;

import javax.servlet.ServletException;

import com.adobe.granite.ui.components.ds.DataSource;
import com.adobe.granite.ui.components.ds.SimpleDataSource;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(AemContextExtension.class)
class GenericDataSourceServletTest {
  private GenericDataSourceServlet genericDataSourceServlet;

  @BeforeEach public void setup() {
    genericDataSourceServlet = new GenericDataSourceServlet();
  }

  /**
   * Test Generic datasource with all correct data
   * Expected output: returns the result size 4
   *
   * @throws ServletException
   * @throws IOException
   */
  @Test void testGenericDatasourceWithCorrectData(AemContext context) throws ServletException, IOException {
    SlingHttpServletRequest request = context.request();
    SlingHttpServletResponse response = context.response();
    context.load().json("/common/datasource/datasource-items.json", "/path/to/items");
    context.load().json("/common/datasource/resource.json", "/path/to/resource");
    context.currentResource("/path/to/resource");
    genericDataSourceServlet.doGet(request, response);
    SimpleDataSource simpleDataSource = (SimpleDataSource) request.getAttribute(
        "com.adobe.granite.ui.components.ds" + ".DataSource");
    Iterable<Resource> resourceIterable = () -> simpleDataSource.iterator();
    assertEquals(4, StreamSupport.stream(resourceIterable.spliterator(), false).count());
  }

  /**
   * Test Generic datasource with invalid path on resource node
   * Expected output: returns the result size 0
   *
   * @throws ServletException
   * @throws IOException
   */
  @Test void testGenericDatasourceWithInvalidPathInsideResource(AemContext context)
      throws ServletException, IOException {
    SlingHttpServletRequest request = context.request();
    SlingHttpServletResponse response = context.response();
    context.load().json("/common/datasource/resource.json", "/path/to/resource");
    context.currentResource("/path/to/resource");
    genericDataSourceServlet.doGet(request, response);
    SimpleDataSource simpleDataSource =
        (SimpleDataSource) request.getAttribute(DataSource.class.getName());
    Iterable<Resource> resourceIterable = () -> simpleDataSource.iterator();
    assertEquals(0, StreamSupport.stream(resourceIterable.spliterator(), false).count());
  }

  /**
   * Test Generic datasource with empty path on resource node
   * Expected output: returns the result size 0
   *
   * @throws ServletException
   * @throws IOException
   */
  @Test void testGenericDatasourceWithEmptyPathInsideResource(AemContext context)
      throws ServletException, IOException {
    SlingHttpServletRequest request = context.request();
    SlingHttpServletResponse response = context.response();
    context.load().json("/common/datasource/resource-with-empty-path.json", "/path/to/resource");
    context.currentResource("/path/to/resource");
    genericDataSourceServlet.doGet(request, response);
    SimpleDataSource simpleDataSource =
        (SimpleDataSource) request.getAttribute(DataSource.class.getName());
    Iterable<Resource> resourceIterable = () -> simpleDataSource.iterator();
    assertEquals(0, StreamSupport.stream(resourceIterable.spliterator(), false).count());
  }

}
