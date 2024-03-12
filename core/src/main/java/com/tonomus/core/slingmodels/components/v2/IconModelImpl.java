package com.tonomus.core.slingmodels.components.v2;

import com.day.cq.dam.api.Asset;
import com.drew.lang.StringUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;
import java.io.IOException;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

/**
 * Returns SVG/XML of the file.
 *
 * Usage example:
 * <pre>
     <sly data-sly-use.svgLoader="${'com.tonomus.core.slingmodels.components.v2.IconModelImpl' @ path=src}">
         <img class="cmp-icon ${className}" data-icon-type="default" src="${svgLoader.original}" />
         <img class="cmp-icon ${className}" data-icon-type="hover" src="${svgLoader.pressed}" />
         <img class="cmp-icon ${className}" data-icon-type="pressed" src="${svgLoader.hover}" />
     </sly>
 * </pre>
 */
@Slf4j
@Model(adaptables = {SlingHttpServletRequest.class, Resource.class},
        adapters = { IconModel.class },
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class IconModelImpl implements IconModel {

    private static final String PRESSED_STATE = "-pressed";
    private static final String HOVER_STATE = "-hover";
    private static final String FILENAME_EXTENSION = ".";
    @Inject
    private String path;

    @Inject
    private ResourceResolver resolver;

    public String getOriginal() {
        return path;
    }

    public String getPressed() {
        return appendFile(PRESSED_STATE);
    }

    @Override
    public String getHover() {
        return appendFile(HOVER_STATE);
    }

    @Override
    public String getOriginalAsSvg() {
        return getSvg(getOriginal());
    }

    private String appendFile(final String suffix) {
        if (Optional.ofNullable(getOriginal()).isEmpty()) {
            return getOriginal();
        }
        int lastIndex = getOriginal().lastIndexOf(FILENAME_EXTENSION);
        final StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(getOriginal().substring(0, lastIndex));
        stringBuilder.append(suffix);
        stringBuilder.append(getOriginal().substring(lastIndex));

        return stringBuilder.toString();
    }

    private String getSvg(final String path) {
        if (Optional.ofNullable(path).isEmpty()) {
            log.error("IconModelImpl.getSvg will return empty, {} is null or empty", path);
            return StringUtils.EMPTY;
        }
        Resource resource = resolver.getResource(path);
        Asset asset = resource != null ? resource.adaptTo(Asset.class) : null;
        String returnValue = StringUtils.EMPTY;
        try {
            log.error("IconModelImpl.getSvg asset is null {} for given path {}", (asset == null), path);
            if (asset != null) {
                StringWriter writer = new StringWriter();
                IOUtils.copy(asset.getOriginal().getStream(), writer, StandardCharsets.UTF_8.name());
                returnValue = writer.toString();
            }
        } catch (IOException ex) {
            log.error(ex.getMessage(), ex);
        }
        return returnValue;
    }
}
