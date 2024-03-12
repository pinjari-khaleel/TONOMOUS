package com.tonomus.core.services.impl.v2;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class EndpointResponseTest {

  @Test void test() {
    EndpointResponse<String> response = new EndpointResponse<>();
    assertEquals(0, response.getResponseCode());
    assertNull(response.getResponseMessage());
    assertNull(response.getData());
    response.setResponseCode(200);
    response.setResponseMessage("message");
    response.setData("data");
    assertEquals(200, response.getResponseCode());
    assertEquals("message", response.getResponseMessage());
    assertEquals("data", response.getData());

    response = new EndpointResponse<>(200);
    assertEquals(200, response.getResponseCode());
    assertNull(response.getResponseMessage());
    assertNull(response.getData());

    response = new EndpointResponse<>(200, "message");
    assertEquals(200, response.getResponseCode());
    assertEquals("message", response.getResponseMessage());
    assertNull(response.getData());
  }
}
