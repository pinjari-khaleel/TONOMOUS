package com.tonomus.core.utils;

import lombok.NonNull;

import java.io.IOException;
import java.text.ParseException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Spliterators;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.google.gson.Gson;
import com.tonomus.core.constants.Constants;
import com.tonomus.core.slingmodels.common.v1.SocialModel;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.adapter.Adaptable;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;

import static com.tonomus.core.constants.Constants.TONOMUS_CONTENT_PATH;
import static com.tonomus.core.constants.Constants.TONOMUS_SITE;
import static com.tonomus.core.constants.NumberConstants.ONE;
import static com.tonomus.core.utils.LangUtils.ARABIC_LANGUAGE;
import static java.util.Objects.nonNull;


/**
 * This class contains common utility methods.
 */
public final class CommonUtils {

  /**
   * Admin page path pattern.
   */
  private static final String PATTERN_ADMIN_PAGE_PATH = "/content/([^/]+)"
      + "/\\w{2}-\\w{2}/conf/admin.*";
  /**
   * Pattern object for admin page.
   */
  private static final Pattern ADMIN_PAGE_PATH_PATTERN = Pattern.compile(PATTERN_ADMIN_PAGE_PATH);

  /**
   * Property "domainName".
   */
  public static final String PROP_DOMAIN_NAME = "domainName";

  /**
   * Property "defaultRobotsTags".
   */
  public static final String PROP_DEFAULT_ROBOTS_TAGS = "defaultRobotsTags";

  /**
   * Hide constructor.
   */
  private CommonUtils() { }

  /**
   * This method replaces line breaks for textfields and textareas.
   *
   * @param text that needs to be modified
   * @return modified String
   */
  public static String replaceWithHtmlTags(final String text) {
    return Optional.ofNullable(text).map(s -> s.replaceAll("(\r\n|\n)", "<br/>")).orElse(null);
  }

  /**
   * This method returns the ResourceResolver with the service user permissions.
   *
   * @param resourceResolverFactory ResourceResolverFactory
   * @return ResourceResolver
   * @throws LoginException while getting the System User.
   */
  public static ResourceResolver getResourceResolver(
      final ResourceResolverFactory resourceResolverFactory) throws LoginException {
    final Map<String, Object> authInfo =
        Collections.singletonMap(ResourceResolverFactory.SUBSERVICE, Constants.SERVICE_USER_NAME);
    return resourceResolverFactory.getServiceResourceResolver(authInfo);
  }

  /**
   * This method returns formatted date based on locale. AR check is explicitly done as just
   * passing locale doesn't seem to work.
   *
   * @param date   date
   * @param locale locale
   * @return formatted date string
   */
  public static String getFormattedDate(final Date date, final Locale locale) {
    String formattedDate;
    if (ARABIC_LANGUAGE.equals(locale.getLanguage())) {
      formattedDate = DateFormatUtils.format(date, "d MMMM, yyyy", locale);
    } else {
      formattedDate = DateFormatUtils.format(date, "MMMM d, yyyy", locale);
    }
    return formattedDate;
  }

  /**
   * This method returns formatted date based on locale. AR check is explicitly done as just
   * passing locale doesn't seem to work.
   *
   * @param date   string in format 'YYYY-MM-DD'
   * @param locale locale
   * @return formatted date string
   */
  public static String getFormattedDateYYYYMMDD(final String date, final Locale locale) {
    try {
      Date dt = DateFormatUtils.ISO_8601_EXTENDED_DATE_FORMAT.parse(date);
      return getFormattedDate(dt, locale);
    } catch (ParseException e) {
      return null;
    }
  }

  /**
   * Write JSON.
   *
   * @param response the response
   * @param status   the status
   * @param object   the object
   * @throws IOException Signals that an I/O exception has occurred.
   */
  public static void writeJSON(final SlingHttpServletResponse response, final int status,
      final Object object) throws IOException {
    writeJSON(response, status, new Gson().toJson(object));
  }

  /**
   * Writes a JSON via response.
   *
   * @param response   a {@link SlingHttpServletResponse}
   * @param status     a status of the error.
   * @param jsonString a JSON string should be printed.
   * @throws IOException Signals that an I/O exception has occurred.
   */
  public static void writeJSON(final SlingHttpServletResponse response, final int status,
      final String jsonString) throws IOException {
    if (status > 0) {
      response.setStatus(status);
    }
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setContentType("application/json; charset=UTF-8");
    response.getWriter().write(jsonString);
  }

  /**
   * This method is called to create a sublist from provided (int) offset and (int) limit.
   *
   * @param list   List<T>.
   * @param offset int offset
   * @param limit  int limit
   * @param <T>    Class.
   * @return paginated list of items
   */
  public static <T> List<T> paginate(final List<T> list, final int offset, final int limit) {

    int size = list.size();
    int fromIndex = offset;
    if (fromIndex < 0) {
      fromIndex = 0;
    }

    if (fromIndex > size || limit <= 0) {
      return Collections.emptyList();
    }

    int toIndex = fromIndex + limit;
    if (toIndex > size) {
      toIndex = size;
    }

    return list.subList(fromIndex, toIndex);
  }

  /**
   * Return formatted date for Data Layer/Event tracking analytics.
   * @param date date.
   * @param locale locale.
   * @return formatted date.
   */
  public static String getFormattedEventTrackingDate(final Date date, final Locale locale) {
    return DateFormatUtils.format(date, Constants.DATE_FORMAT_DATA_LAYER, locale);
  }

  /**
   * Check is a admin page.
   * @param path page path
   * @return true - if a page is admin page
   */
  public static boolean isAdminPage(String path) {
    return nonNull(path) && ADMIN_PAGE_PATH_PATTERN.matcher(path).matches();
  }

  /**
   * Get site domain name.
   * @param page - a page
   * @return site domain name
   */
  public static String getSiteDomainName(Page page) {
    return Optional.ofNullable(page)
        .map(p -> p.getAbsoluteParent(ONE)).map(Page::getContentResource)
        .map(Resource::getValueMap)
        .map(jcrContent -> jcrContent.get(PROP_DOMAIN_NAME, TONOMUS_SITE)).orElse(TONOMUS_SITE);
  }

  /**
   * Get site domain name.
   * @param resource - a resource object
   * @return site domain name
   */
  public static String getSiteDomainName(Resource resource) {
    return Optional.ofNullable(getSiteRootPage(resource))
        .map(Page::getContentResource).map(Resource::getValueMap)
        .map(jcrContent -> jcrContent.get(PROP_DOMAIN_NAME, TONOMUS_SITE)).orElse(TONOMUS_SITE);
  }

  /**
   * Method to retrieve full page path.
   * @param currentResource current resource
   * @return page path
   */
  public static String getFullPagePath(Resource currentResource) {
    PageManager pageManager = currentResource.getResourceResolver().adaptTo(PageManager.class);
    if (Objects.nonNull(pageManager)) {
      Page page = pageManager.getContainingPage(currentResource);
      return Constants.HTTPS + getSiteDomainName(currentResource) + page.getPath()
          .replaceFirst("/content/\\w*(?=\\/)", "");
    }
    return Constants.HTTPS + Constants.TONOMUS_SITE;
  }

  /**
   * Get site root page.
   * @param resource - a resource object
   * @return Site root page
   */
  public static String getSiteRootPath(Resource resource) {
    return Optional.ofNullable(getSiteRootPage(resource))
        .map(Page::getPath).orElse(TONOMUS_CONTENT_PATH);
  }

  /**
   * Method that either successfully adapts adaptable or throws exception.
   * @param adaptable implementation of adaptable interface
   * @param clazz class to adapt to
   * @return non-null adapted object
   * @param <T> adapter class
   */
  public static <T> @NonNull T strictAdaptTo(Adaptable adaptable, Class<T> clazz) {
    return Optional.ofNullable(adaptable.adaptTo(clazz))
        .orElseThrow(() ->
            new IllegalArgumentException("Unable to adapt to " + clazz.getSimpleName()));
  }

  /**
   * Get site root page.
   * @param resource - a resource object
   * @return Site root page
   */
  private static Page getSiteRootPage(Resource resource) {
    return Optional.ofNullable(resource).map(Resource::getResourceResolver)
        .map(resolver -> resolver.adaptTo(PageManager.class))
        .map(pageManager -> pageManager.getContainingPage(resource))
        .map(page -> page.getAbsoluteParent(ONE)).orElse(null);
  }

  /**
   * Get site default robots tags.
   * @param page - a page
   * @return site default robots tags
   */
  public static String getDefaultRobotsTags(Page page) {
    return Optional.ofNullable(page)
        .map(p -> p.getAbsoluteParent(ONE)).map(Page::getContentResource)
        .map(Resource::getValueMap)
        .map(jcrContent -> jcrContent.get(PROP_DEFAULT_ROBOTS_TAGS, "")).orElse("");
  }

  /**
   * Get list of SocialModel items based content fragments paths.
   * @param currentResource currentResource
   * @param paths paths to Content Fragments
   * @return list of Social items
   */
  public static List<SocialModel> getSocialMediaFromContentFragments(
      Resource currentResource,
      String[] paths) {
    return Optional.ofNullable(paths)
        .stream()
        .flatMap(Arrays::stream)
        .filter(StringUtils::isNotBlank)
        .map(path -> currentResource.getResourceResolver()
            .getResource(StringUtils.join(path, "/jcr:content/data/master")))
        .filter(Objects::nonNull)
        .map(res -> res.adaptTo(SocialModel.class))
        .collect(Collectors.toList());
  }

  /**
   * Common helper function. Returns stream out of iterator. Useful for streams, to be able to
   * put to stream, for example, all resource childrens
   *
   * @param iterator iterator to convert to stream
   * @param <T>      iterator type
   * @return stream of iterator elements or empty stream if iterator is empty
   */
  public static <T> Stream<T> iteratorStream(final Iterator<T> iterator) {
    return Optional.ofNullable(iterator)
        .map(it -> StreamSupport.stream(Spliterators.spliteratorUnknownSize(it, 0), false))
        .orElse(Stream.empty());
  }
}
