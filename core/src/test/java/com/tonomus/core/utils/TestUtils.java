package com.tonomus.core.utils;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;

/**
 * Abstract class providing common methods for JUnit tests.
 */
public abstract class TestUtils {

  /**
   * Reads file from resources section.
   *
   * @param fileName full path to the file
   * @return content of the file
   */
  public String readFile(String fileName) {
    try {
      return IOUtils
          .toString(Objects.requireNonNull(getClass().getClassLoader().getResource(fileName)),
              StandardCharsets.UTF_8).trim();
    } catch (IOException e) {
      return StringUtils.EMPTY;
    }
  }

  /**
   * Deserialize.
   * @param type result class
   * @param filePath file path
   * @param dateFormat date format
   * @param <T> result class
   * @return instance of type
   */
  public static  <T> T deserialize(Type type, String filePath, String dateFormat) {
    InputStream inputStream = TestUtils.class.getResourceAsStream(filePath);

    GsonBuilder gsonBuilder = new GsonBuilder();

    if (StringUtils.isNotEmpty(dateFormat)) {
      gsonBuilder.setDateFormat(dateFormat);
    }

    Gson gson = gsonBuilder.create();
    Reader jsonReader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
    return gson.fromJson(jsonReader, type);
  }
}
