package com.tonomus.core.utils;

import junit.framework.Assert;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;

import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.slf4j.Logger;

class JsonUtilsTest {

  @Test
  public void testDeserializeWithNullStream() {
    Logger mockLogger = Mockito.mock(Logger.class);
    InputStream nullStream = null;
    String dateFormat = "yyyy-MM-dd";
    Type type = new TypeToken<String>() {
    }.getType();

    Assert.assertNull(JsonUtils.deserialize(type, nullStream, dateFormat, mockLogger));
    Mockito.verify(mockLogger).error("Unable to parse JSON: stream is null");
  }

  @Test
  public void testDeserializeWithValidInput() {
    Logger mockLogger = Mockito.mock(Logger.class);
    String jsonString = "\"Hello, World!\"";
    InputStream stream = new ByteArrayInputStream(jsonString.getBytes(StandardCharsets.UTF_8));
    String dateFormat = "yyyy-MM-dd";
    Type type = new TypeToken<String>() {
    }.getType();

    String result = JsonUtils.deserialize(type, stream, dateFormat, mockLogger);
    Assert.assertEquals("Hello, World!", result);
  }

  @Test
  public void testDeserializeWithInvalidJson() {
    Logger mockLogger = Mockito.mock(Logger.class);
    String invalidJson = "Invalid JSON";
    InputStream stream = new ByteArrayInputStream(invalidJson.getBytes(StandardCharsets.UTF_8));
    String dateFormat = "yyyy-MM-dd";
    Type type = new TypeToken<String>() {
    }.getType();

    Assert.assertNull(JsonUtils.deserialize(type, stream, dateFormat, mockLogger));
    Mockito.verify(mockLogger).error(Mockito.eq("Error while parsing JSON: "), Mockito.any(
        JsonSyntaxException.class));
  }

}