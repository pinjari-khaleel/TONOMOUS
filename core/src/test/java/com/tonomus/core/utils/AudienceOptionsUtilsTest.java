package com.tonomus.core.utils;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.tonomus.core.slingmodels.components.v1.forms.MailchimpAudienceID;

import org.apache.commons.collections4.map.MultiKeyMap;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class AudienceOptionsUtilsTest {

  private final String[] rows = {"English,visit TROJENA,b7870a80dc", "English,setup a business in"
      + " TROJENA,7f57f466b1", "English,live/have a property in TROJENA,aed9f9cce9"};

  @Test void getAudienceOptionsList() {
    Map<String, String> audienceMap =
        AudienceOptionsUtils.getAudienceOptionsList(rows).stream()
            .collect(
                Collectors.toMap(MailchimpAudienceID::getCustType, MailchimpAudienceID::getId));
    assertEquals("b7870a80dc", audienceMap.get("visit TROJENA"));
    assertEquals("aed9f9cce9", audienceMap.get("live/have a property in TROJENA"));
    assertEquals("7f57f466b1", audienceMap.get("setup a business in TROJENA"));
  }

  @Test void getAudienceOptionsListWhenRowsIsEmptyOrNull() {
    List<MailchimpAudienceID> audienceOptionsList =
        AudienceOptionsUtils.getAudienceOptionsList(null);
    assertNotNull(audienceOptionsList);
    assertEquals(0, audienceOptionsList.size());
  }

  @Test
  void getAudienceOptionsListWhenExactlyTwoTokensInARow() {
    String[] rows = {"English,1"};
    Map<String, String> audienceMap =
        AudienceOptionsUtils.getAudienceOptionsList(rows).stream()
            .collect(
                Collectors.toMap(MailchimpAudienceID::getLanguage, MailchimpAudienceID::getId));
    assertEquals("1", audienceMap.get("English"));
  }

  @Test
  public void testGetAudienceOptionsMap() {
    // Given
    String[] rows = {"English,visit TROJENA,1", "Spanish,live/have a property in TROJENA,2"};

    // When
    MultiKeyMap<String, String> audienceOptionsMap =
        AudienceOptionsUtils.getAudienceOptionsMap(rows);

    // Then
    assertEquals("1", audienceOptionsMap.get("English", "visit TROJENA"));
    assertEquals("2", audienceOptionsMap.get("Spanish", "live/have a property in TROJENA"));
  }
}
