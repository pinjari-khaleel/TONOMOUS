package com.tonomus.core.utils.v2;

import static com.tonomus.core.constants.Constants.ERROR_AUDIENCEOPTIONUTILS;

import java.util.Arrays;
import java.util.List;
import java.util.StringTokenizer;

import com.tonomus.core.constants.Constants;
import com.tonomus.core.constants.NumberConstants;

import org.apache.commons.collections4.map.HashedMap;
import org.apache.commons.collections4.map.MultiKeyMap;
import org.apache.commons.lang3.ArrayUtils;

/**
 * Audience Options Util class.
 */
public final class AudienceOptionsUtils {

  /**
   * Private constructor for utility class.
   */
  private AudienceOptionsUtils() {
    throw new IllegalStateException(ERROR_AUDIENCEOPTIONUTILS + "Utility class");
  }

  /**
   * Method to parse rows from configuration.
   *
   * @param rows rows array
   * @return map where language + interest is a key
   */
  public static MultiKeyMap<String, String> getAudienceOptionsMap(List<String> config) {
    String[] rows = config.stream().toArray(String[]::new);
    MultiKeyMap<String, String> result = MultiKeyMap.multiKeyMap(new HashedMap<>());
    if (ArrayUtils.isNotEmpty(rows)) {
      Arrays.stream(rows)
          .map(row -> new StringTokenizer(row, Constants.PIPE, false))
          .filter(tokenizer -> tokenizer.countTokens() > NumberConstants.TWO)
          .forEach(tokenizer -> result.put(tokenizer.nextToken(), tokenizer.nextToken(), tokenizer.nextToken()));
    }
    return result;
  }
}
