package com.tonomus.core.transformer;

import java.io.IOException;

import org.apache.sling.rewriter.ProcessingComponentConfiguration;
import org.apache.sling.rewriter.ProcessingContext;
import org.apache.sling.rewriter.Transformer;
import org.xml.sax.Attributes;
import org.xml.sax.ContentHandler;
import org.xml.sax.Locator;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.AttributesImpl;

import lombok.extern.slf4j.Slf4j;

import static com.tonomus.core.constants.Constants.ATTRIB_HREF;
import static com.tonomus.core.constants.Constants.ATTRIB_TARGET;
import static com.tonomus.core.constants.Constants.CDATA;
import static com.tonomus.core.constants.Constants.INTERNAL_LINKS;
import static com.tonomus.core.constants.Constants.TAG_ANCHOR;
import static com.tonomus.core.constants.Constants.TARGET_BLANK;
import static com.tonomus.core.constants.Constants.TARGET_SELF;

@Slf4j
public class TargetLinkRewriterTransformer implements Transformer {

    private ContentHandler contentHandler;

    @Override
    public void setDocumentLocator(Locator locator) {
        contentHandler.setDocumentLocator(locator);
    }

    @Override
    public void startDocument() throws SAXException {
        contentHandler.startDocument();
    }

    @Override
    public void endDocument() throws SAXException {
        contentHandler.endDocument();
    }

    @Override
    public void startPrefixMapping(String prefix, String uri) throws SAXException {
        contentHandler.startPrefixMapping(prefix, uri);
    }

    @Override
    public void endPrefixMapping(String prefix) throws SAXException {
        contentHandler.endPrefixMapping(prefix);
    }

    @Override
    public void startElement(String uri, String localName, String qName, Attributes atts) throws SAXException {
        // Adds 'target' attribute to <a> tags without it
        if (atts.getIndex(ATTRIB_HREF) > -1 && qName.equalsIgnoreCase(TAG_ANCHOR)) {
            AttributesImpl attributes = new AttributesImpl(atts);
            String hrefValue = attributes.getValue(ATTRIB_HREF);
            if (attributes.getIndex(ATTRIB_TARGET) == -1) {
                attributes.addAttribute(uri, ATTRIB_TARGET, ATTRIB_TARGET, CDATA, getTarget(hrefValue));
            }
            contentHandler.startElement(uri, localName, qName, attributes);
        }
    }

    /**
     * Assigns target value with condition -
     * internal link = '_self'
     * external link = '_blank'
     * @param href extracted from <href> tag
     * @return
     */
    protected String getTarget(String href) {
         return INTERNAL_LINKS.stream().filter(e -> href.startsWith(e)).findAny().isPresent()? TARGET_SELF : TARGET_BLANK;
    }

    @Override
    public void endElement(String uri, String localName, String qName) throws SAXException {
        contentHandler.endElement(uri, localName, qName);

    }

    @Override
    public void characters(char[] ch, int start, int length) throws SAXException {
        contentHandler.characters(ch, start, length);
    }

    @Override
    public void ignorableWhitespace(char[] ch, int start, int length) throws SAXException {
        contentHandler.ignorableWhitespace(ch, start, length);
    }

    @Override
    public void processingInstruction(String target, String data) throws SAXException {
        contentHandler.processingInstruction(target, data);
    }

    @Override
    public void skippedEntity(String name) throws SAXException {
        contentHandler.skippedEntity(name);
    }

    @Override
    public void init(ProcessingContext context, ProcessingComponentConfiguration config) throws IOException {

    }

    @Override
    public void setContentHandler(ContentHandler handler) {
        this.contentHandler = handler;
    }

    @Override
    public void dispose() {

    }

}
