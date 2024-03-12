package com.tonomus.core.servlets.forms.v2.helper;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.request.RequestParameterMap;

public class MockRequestParameterMap implements RequestParameterMap {

    private final Map<String, RequestParameter[]> delegate;

    MockRequestParameterMap(Map<String, RequestParameter[]> input) {
        delegate = new HashMap<>(input);
    }

    @Override
    public RequestParameter[] getValues(String key) {
        return this.get(key);
    }

    @Override
    public RequestParameter getValue(String key) {
        return Optional.ofNullable(delegate.get(key))
                .filter(values -> values.length > 0)
                .map(values -> values[0])
                .orElse(null);
    }

    @Override
    public int size() {
        return delegate.size();
    }

    @Override
    public boolean isEmpty() {
        return delegate.isEmpty();
    }

    @Override
    public boolean containsKey(Object key) {
        return delegate.containsKey(key);
    }

    @Override
    public boolean containsValue(Object value) {
        return delegate.containsValue(value);
    }

    @Override
    public RequestParameter[] get(Object key) {
        return delegate.get(key);
    }

    @Override
    public RequestParameter[] put(String key, RequestParameter[] value) {
        return delegate.put(key, value);
    }

    @Override
    public RequestParameter[] remove(Object key) {
        return delegate.remove(key);
    }

    @Override
    public void putAll(Map<? extends String, ? extends RequestParameter[]> map) {
        delegate.putAll(map);
    }

    @Override
    public void clear() {
        delegate.clear();
    }

    @Override
    public Set<String> keySet() {
        return delegate.keySet();
    }

    @Override
    public Collection<RequestParameter[]> values() {
        return delegate.values();
    }

    @Override
    public Set<Entry<String, RequestParameter[]>> entrySet() {
        return delegate.entrySet();
    }

}
