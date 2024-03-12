package com.tonomus.core.servlets.forms;

import uk.org.lidalia.slf4jtest.LoggingEvent;
import uk.org.lidalia.slf4jtest.TestLogger;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.List;
import java.util.Objects;
import java.util.function.Predicate;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

/**
 * Some functions useful in Unit Testing.
 */
public class TestUtils {

  /**
   * Verifies that a utility class is well defined.
   *
   * @param clazz                           utility class to verify
   * @param constructorShouldThrowException set to true if constructor should throw exception
   */
  public static void assertUtilityClassWellDefined(final Class<?> clazz,
      final boolean constructorShouldThrowException)
      throws NoSuchMethodException, IllegalAccessException, InvocationTargetException,
      InstantiationException {
    assertTrue(Modifier.isFinal(clazz.getModifiers()), "Class must be final");

    assertEquals(1, clazz.getDeclaredConstructors().length, "There must be only one constructor");
    final Constructor<?> constructor = clazz.getDeclaredConstructor();
    if (constructor.isAccessible() || !Modifier.isPrivate(constructor.getModifiers())) {
      fail("Constructor is not private");
    }
    constructor.setAccessible(true);
    if (constructorShouldThrowException) {
      assertThrows(Exception.class, constructor::newInstance, "Constructor should throw exception");
    } else {
      // Constructor coverage
      constructor.newInstance();
    }
    constructor.setAccessible(false);

    for (final Method method : clazz.getMethods()) {
      if (!Modifier.isStatic(method.getModifiers()) && method.getDeclaringClass().equals(clazz)) {
        fail("There exists a non-static method:" + method);
      }
    }
  }

  /**
   * Get last log event from lidalia test logger.
   *
   * @param logger the current test logger
   * @return last log event
   */
  public static LoggingEvent getLastLogEvent(final TestLogger logger) {
    final List<LoggingEvent> loggingEvents = logger.getLoggingEvents();
    return loggingEvents.get(loggingEvents.size() - 1);
  }

  /**
   * Check if the last logged event contains specified text.
   *
   * @param logger       test logger
   * @param errorMessage message to check
   * @return true if last logged event contains specified text
   */
  public static boolean lastErrorContains(final TestLogger logger, final String errorMessage) {
    return getLastLogEvent(logger).getMessage().contains(errorMessage);
  }

  /**
   * Assert all objects with the specified predicate.
   *
   * @param predicate predicate to execute
   * @param objects   list of objects to check
   */
  public static void assertAll(final Predicate<? super Object> predicate, final Object... objects) {
    assertTrue(Stream.of(objects).allMatch(predicate));
  }

  /**
   * Assert that all the specified objects are null.
   *
   * @param objects list of objects to check
   */
  public static void assertAllNulls(final Object... objects) {
    assertAll(Objects::isNull, objects);
  }
}
