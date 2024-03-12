package com.tonomus.core.utils;

import lombok.experimental.UtilityClass;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;

/**
 * This class contains Json utility methods.
 */
@UtilityClass
public class JsonUtils {

  /**
   * Serializes given object to JSON.
   *
   * @param t   class literal
   * @param <T> generic model class
   * @return String representation of JSON
   */
  public <T> String serialize(T t) {
    return new Gson().toJson(t);
  }

  /**
   * Construct model class instance from stream without date conversion.
   *
   * @param <T>        generic model class
   * @param type       the specific genericized type of model class
   * @param stream     input stream
   * @param logger     logger
   * @return instance of model class
   */
  public <T> T deserialize(Type type, InputStream stream, final Logger logger) {
    return deserialize(type, stream, null, logger);
  }

  /**
   * Construct model class instance from stream with date conversion.
   *
   * Method accepts generic types and is able to deserialize
   * anonymous lists as a root objects
   * The idea behind the use of java.lang.reflect.Type interface is as follows:
   * 1. Gson does not work with generic types directly.
   * 2. Gson needs to understand generic type structure to be able to deserialize properly.
   *
   * @param <T>        generic model class
   * @param type       the specific genericized type of model class
   * @param stream     input stream
   * @param dateFormat date format
   * @param logger     logger
   * @return instance of model class
   */
  public <T> T deserialize(Type type, InputStream stream, String dateFormat, final Logger logger) {

    if (stream == null) {
      logger.error("Unable to parse JSON: stream is null");
      return null;
    }

    try {
      GsonBuilder gsonBuilder = new GsonBuilder();

      if (StringUtils.isNotEmpty(dateFormat)) {
        gsonBuilder.setDateFormat(dateFormat);
      }

      Gson gson = gsonBuilder.create();
      Reader jsonReader = new InputStreamReader(stream, StandardCharsets.UTF_8);
      return gson.fromJson(jsonReader, type);
    } catch (JsonIOException | JsonSyntaxException e) {
      logger.error("Error while parsing JSON: ", e);
      return null;
    }
  }
}
