package com.tonomus.core.transformer;

import static com.tonomus.core.constants.Constants.ATTRIB_HREF;
import static com.tonomus.core.constants.Constants.TAG_ANCHOR;
import static com.tonomus.core.constants.Constants.TARGET_BLANK;
import static com.tonomus.core.constants.Constants.TARGET_SELF;
import static com.tonomus.core.constants.Constants.TONOMUS_CONTENT_PATH;
import static com.tonomus.core.constants.Constants.TONOMUS_EXPERIENCE_FRAGMENT_PATH;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.mockito.Mockito.doCallRealMethod;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.io.IOException;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.xml.sax.Attributes;
import org.xml.sax.ContentHandler;
import org.xml.sax.SAXException;

import junitx.util.PrivateAccessor;

@ExtendWith(MockitoExtension.class)
public class TargetLinkRewriterTransformerFactoryTest {

    @Test
    public void testFactoryAndDelegateContentHandler() throws IOException, SAXException, NoSuchFieldException {

        TargetLinkRewriterTransformerFactory factory = new TargetLinkRewriterTransformerFactory();
        assertInstanceOf(TargetLinkRewriterTransformer.class, factory.createTransformer());

        ContentHandler contentHandler = mock(ContentHandler.class);

        TargetLinkRewriterTransformer transformer = new TargetLinkRewriterTransformer();
        PrivateAccessor.setField(transformer, "contentHandler", contentHandler);

        transformer.setDocumentLocator(null);
        verify(contentHandler, times(1)).setDocumentLocator(null);

        transformer.startDocument();
        verify(contentHandler, times(1)).startDocument();

        transformer.endDocument();
        verify(contentHandler, times(1)).endDocument();

        transformer.startPrefixMapping(null, null);
        verify(contentHandler, times(1)).startPrefixMapping(null, null);

        transformer.endPrefixMapping(null);
        verify(contentHandler, times(1)).endPrefixMapping(null);

        transformer.endElement(null, null, null);
        verify(contentHandler, times(1)).endDocument();

        transformer.characters(null, 0, 0);
        verify(contentHandler).characters(null, 0, 0);

        transformer.ignorableWhitespace(null, 0, 0);
        verify(contentHandler).ignorableWhitespace(null, 0, 0);

        transformer.processingInstruction(null, null);
        verify(contentHandler, times(1)).processingInstruction(null, null);

        transformer.skippedEntity(null);
        verify(contentHandler, times(1)).skippedEntity(null);

        TargetLinkRewriterTransformer mockTargetLinkRewriterTransformer = mock(TargetLinkRewriterTransformer.class);
        doCallRealMethod().when(mockTargetLinkRewriterTransformer).setContentHandler(contentHandler);
        mockTargetLinkRewriterTransformer.setContentHandler(contentHandler);

        doCallRealMethod().when(mockTargetLinkRewriterTransformer).dispose();
        mockTargetLinkRewriterTransformer.dispose();
        verify(mockTargetLinkRewriterTransformer, times(1)).setContentHandler(contentHandler);

        doCallRealMethod().when(mockTargetLinkRewriterTransformer).init(null, null);
        mockTargetLinkRewriterTransformer.init(null, null);
        verify(mockTargetLinkRewriterTransformer, times(1)).init(null, null);

    }

    @Test
    public void doStartElement() throws SAXException, NoSuchFieldException {
        TargetLinkRewriterTransformer transformer = mock(TargetLinkRewriterTransformer.class);
        Attributes atts = mock(Attributes.class);
        ContentHandler handler = mock(ContentHandler.class);
        PrivateAccessor.setField(transformer, "contentHandler", handler);
        doCallRealMethod().when(transformer).startElement(null, ATTRIB_HREF, TAG_ANCHOR, atts);
        transformer.startElement(null, ATTRIB_HREF, TAG_ANCHOR, atts);

        verify(transformer, times(1)).startElement(null, ATTRIB_HREF, TAG_ANCHOR, atts);
    }

    @Test
    public void doGetTarget() throws SAXException, NoSuchFieldException {
        TargetLinkRewriterTransformer transformer = new TargetLinkRewriterTransformer();
        assertEquals(TARGET_BLANK, transformer.getTarget("https://google.com"));
        assertEquals(TARGET_SELF, transformer.getTarget(TONOMUS_CONTENT_PATH + "/en-us.html"));
        assertEquals(TARGET_SELF, transformer.getTarget(TONOMUS_EXPERIENCE_FRAGMENT_PATH + "/header"));
    }
}
