package com.tonomus.core.servlets.forms.v2.helper;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

import org.apache.sling.api.request.RequestParameter;

class MockRequestParameter implements RequestParameter {

    private final String value;

    MockRequestParameter(String value) {
        this.value = value;
    }

    @Override
    public String getName() {
        return value;
    }

    @Override
    public boolean isFormField() {
        return true;
    }

    @Override
    public String getContentType() {
        return null;
    }

    @Override
    public long getSize() {
        return 1;
    }

    @Override
    public byte[] get() {
        return value.getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public InputStream getInputStream() throws IOException {
        return new ByteArrayInputStream(get());
    }

    @Override
    public String getFileName() {
        return null;
    }

    @Override
    public String getString() {
        return value;
    }

    @Override
    public String getString(String encoding) throws UnsupportedEncodingException {
        return new String(get(), encoding);
    }
}
