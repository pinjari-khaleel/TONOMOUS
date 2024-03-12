package com.tonomus.core.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.StringTokenizer;

import com.tonomus.core.constants.Constants;
import com.tonomus.core.constants.NumberConstants;
import com.tonomus.core.slingmodels.components.v1.forms.MailchimpAudienceID;

import org.apache.commons.collections4.map.HashedMap;
import org.apache.commons.collections4.map.MultiKeyMap;
import org.apache.commons.lang3.ArrayUtils;

import static java.util.Objects.nonNull;

/**
 * Audience Options Util class.
 */
public final class AudienceOptionsUtils {

  /**
   * Private constructor for utility class.
   */
  private AudienceOptionsUtils() {
    throw new IllegalStateException("Utility class");
  }

  /**
   * Method to parse rows from context-aware configuration.
   *
   * @param rows rows array
   * @return List of MailchimpAudienceID
   */
  public static List<MailchimpAudienceID> getAudienceOptionsList(String[] rows) {
    if (nonNull(rows)) {
      List<MailchimpAudienceID> audienceIDList = new ArrayList<>();
      for (String row : rows) {
        StringTokenizer tokenizer = new StringTokenizer(row, Constants.COMMA, false);
        if (tokenizer.countTokens() > NumberConstants.TWO) {
          MailchimpAudienceID mailchimpAudienceID =
              MailchimpAudienceID.builder().language(tokenizer.nextToken())
                  .custType(tokenizer.nextToken()).id(tokenizer.nextToken()).build();
          audienceIDList.add(mailchimpAudienceID);
        } else if (tokenizer.countTokens() > NumberConstants.ONE) {
          MailchimpAudienceID mailchimpAudienceID =
              MailchimpAudienceID.builder().language(tokenizer.nextToken())
                  .id(tokenizer.nextToken()).build();
          audienceIDList.add(mailchimpAudienceID);
        }
      }
      return Collections.unmodifiableList(audienceIDList);
    }
    return Collections.emptyList();
  }

  /**
   * Method to parse rows from context-aware configuration.
   *
   * @param rows rows array
   * @return map where language + interest is a key
   */
  public static MultiKeyMap<String, String> getAudienceOptionsMap(String[] rows) {
    MultiKeyMap<String, String> result = MultiKeyMap.multiKeyMap(new HashedMap<>());
    if (ArrayUtils.isNotEmpty(rows)) {
      Arrays.stream(rows)
              .map(row -> new StringTokenizer(row, Constants.COMMA, false))
              .filter(tokenizer -> tokenizer.countTokens() > NumberConstants.TWO)
              .forEach(tokenizer -> result.put(tokenizer.nextToken(), tokenizer.nextToken(), tokenizer.nextToken()));
    }
    return result;
  }
}
