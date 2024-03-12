package com.tonomus.core.constants;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.osgi.service.component.ComponentConstants;

import static com.day.cq.commons.jcr.JcrConstants.JCR_CONTENT;

/**
 * Constants class.
 * Dictionary for commonly used keywords.
 */
public final class Constants {

  /**
   * Default Constructor.
   */
  private Constants() {
    // Do Nothing
  }

  /**
   * Constant for SLASH.
   */
  public static final String SLASH = "/";

  /**
   * Constant for COLON.
   */
  public static final char COLON = ':';

  /**
   * Constant for DOT.
   */
  public static final String DOT = ".";

  /**
   * The constant EQUAL.
   */
  public static final String EQUAL = "=";

  /**
   * The constant HYPHEN.
   */
  public static final String HYPHEN = "-";

  /**
   * Dollar constant.
   */
  public static final String DOLLAR = "$";

  /**
   * Comma.
   */
  public static final String COMMA = ",";

  /**
   * Pipe.
   */
  public static final String PIPE = "|";

  /**
   * Underscore
   */
  public static final String UNDERSCORE = "_";

  /**
   * At sign
   */
  public static final String AT_SIGN = "@";

  /**
   * Constant for CONTENT_LABEL.
   */
  public static final String CONTENT_LABEL = "content";

  /**
   * Responsive grid Path Constant, where all the components will reside.
   */
  public static final String RESPONSIVE_GRID_PATH = "root/responsivegrid";

  /**
   * The class of ResourceBundle provider service.
   */
  public static final String I18N_RESOURCE_BUNDLE_PROVIDER_CLASS
      = "org.apache.sling.i18n.impl.JcrResourceBundleProvider";

  /**
   * The full target to the I18n provider.
   */
  public static final String I18N_PROVIDER_SERVICE_TARGET
      = "(" + ComponentConstants.COMPONENT_NAME + Constants.EQUAL + Constants.I18N_RESOURCE_BUNDLE_PROVIDER_CLASS + ")";

  /**
   * Constant for Carousel Item resource type.
   */
  public static final String CAROUSEL_ITEM_RES_TYPE = "tonomus/components/content/wrappers/c16"
      + "-carousel-item";

  /**
   * hideInNav property.
   */
  public static final String HIDE_IN_NAV = "hideInNav";

  /**
   * Constant used for anchor links.
   */
  public static final String HASH = "#";

  /**
   * Constant for true.
   */
  public static final String TRUE = "true";

  /**
   * Constant for false.
   */
  public static final String FALSE = "false";

  /**
   * Constant for question mark.
   */
  public static final String QUESTION_MARK = "?";

  /**
   * Constant HTTPS.
   */
  public static final String HTTPS = "https://";

  /**
   * Constant Tonomus site.
   */
  public static final String TONOMUS_SITE = "tonomus.com";

  /**
   * Constant Tonomus Content Path.
   */
  @SuppressWarnings("java:S1075") // AEM CRX Path is not depend on platform
  public static final String TONOMUS_CONTENT_PATH = "/content/tonomus";

  /**
   * Constant Tonomus Content JCR Path.
   */
  public static final String TONOMUS_CONTENT_JCR_PATH =
      TONOMUS_CONTENT_PATH + SLASH + JCR_CONTENT;

  /**
   * Constant Tonomus Content JCR Path.
   */
  @SuppressWarnings("java:S1075") // AEM CRX Path is not depend on platform
  public static final String TONOMUS_DAM_PATH = "/content/dam/tonomus";

  /**
   * Constant Tonomus Content JCR Path.
   */
  @SuppressWarnings("java:S1075") // AEM CRX Path is not depend on platform
  public static final String TONOMUS_EXPERIENCE_FRAGMENT_PATH = "/content/experience-fragments/tonomus";

  /**
   * Constant Page.
   */
  public static final String PAGE = "page";

  /**
   * Constant for Neom service username.
   */
  public static final String SERVICE_USER_NAME = "neom-service";

  /**
   * Constant for Nav Image.
   */
  public static final String NAV_IMAGE = "navImage";

  /**
   * Constant for Nav Icon.
   */
  public static final String NAV_ICON = "navIcon";

  /**
   * Constant for Nav Child List Type.
   */
  public static final String NAV_CHILD_LIST_TYPE = "navChildListType";

  /**
   * Constant for Under Construction flag.
   */
  public static final String UNDER_CONSTRUCTION = "underConstruction";

  /**
   * Constant for Enable Active Path flag.
   */
  public static final String ENABLE_ACTIVE_PATH = "enableActivePath";

  /**
   * Constant Link.
   */
  public static final String LINK = "link";

  /**
   * Constant Medium.
   */
  public static final String MEDIUM = "medium";

  /**
   * Resource type for C92-modal component.
   */
  public static final String C92_RESOURCE_TYPE =
      "tonomus/components/content/components/c92-modal/v1/c92-modal";

  /**
   * M18-paragraph resource type.
   */
  public static final String M18_PARAGRAPH_RESOURCE_TYPE =
      "tonomus/components/content/wrappers/m18-paragraph";
  /**
   * Resource path form m31 dropdown.
   */
  public static final String M31_DROPDOWN_FIELD_RESOURCE =
      "tonomus/components/content/wrappers/m31-dropdown-field";

  /**
   * Resource path form m30 text.
   */
  public static final String M30_TEXT_FIELD_RESOURCE =
      "tonomus/components/content/wrappers/m30-text-field";

  /**
   * Resource path form m28 radio option.
   */
  public static final String M28_RADIO_OPTION_RESOURCE =
      "tonomus/components/content/wrappers/m28-radio-option";

  /**
   * Resource for m27 checkbox.
   */
  public static final String M27_CHECKBOX_OPTION_RESOURCE =
      "tonomus/components/content/wrappers/m27-checkbox-option";

  /**
   * Resource type for O45 component.
   */
  public static final String O45_FORM_WRAPPER_RESOURCE_TYPE =
      "tonomus/components/content/wrappers/o45-form";

  /**
   * Resources used inside form group.
   */
  public static final List<String> RESOURCES_IN_FORM_GROUP =
      Collections.unmodifiableList(Arrays.asList(M27_CHECKBOX_OPTION_RESOURCE,
          M28_RADIO_OPTION_RESOURCE, M30_TEXT_FIELD_RESOURCE,
          M31_DROPDOWN_FIELD_RESOURCE));

  /**
   * Resource type for C48-Forms-Group.
   */
  public static final String C48_FORMS_GROUP_RESOURCE_TYPE =
      "tonomus/components/content/wrappers/c48-forms-group";

  /**
   * Resource type for c37 Legal Content component.
   */
  public static final String C37_RESOURCE_TYPE = "tonomus/components/content/components/c37-legal"
      + "-content/v1/c37-legal-content";

  /**
   * Resource type for C45-Content-Column component.
   */
  public static final String C45_COLUMN_RESOURCE_TYPE = "tonomus/components/content/wrappers/c45"
      + "-content-column";

  /**
   * Resource type for C86-People-Carousel component.
   */
  public static final String C86_RESOURCE_TYPE =
      "tonomus/components/content/components/c86-people-carousel/v1/c86-people-carousel";

  /**
   * Radio type for FormCheckBoxModel.
   */
  public static final String RADIO = "radio";

  /**
   * Checkbox type for FormCheckBoxModel.
   */
  public static final String CHECKBOX = "checkbox";

  /**
   * Select type for FormSelectModels.
   */
  public static final String SELECT = "select";

  /**
   * CTA.
   */
  public static final String CTA = "CTA";

  /**
   * Share Page.
   */
  public static final String SHARE_PAGE = "Share Page";

  /**
   * Website type of page.
   */
  public static final String WEBSITE = "website";

  /**
   * Copy Link.
   */
  public static final String COPY_LINK = "Copy Link";

  /**
   * Constant for Image.
   */
  public static final String IMAGE = "image";

  /**
   * Constant for Video.
   */
  public static final String VIDEO = "video";

  /**
   * Date format in JSON.
   */
  public static final String DATE_FORMAT_JSON = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

  /**
   * Date format for Data Layer.
   */
  public static final String DATE_FORMAT_DATA_LAYER = "yyyy-MM-dd'T'HH:mm:ss'Z'";

  /**
   * Constant for one thousand.
   */
  public static final Integer THOUSAND = 1000;

  /**
   * Constant for DAM video type.
   */
  public static final String DAM = "dam";

  /**
   * Constant for YouTube video type.
   */
  public static final String YOUTUBE = "youtube";

  /**
   * Constant for link Twitter label.
   */
  public static final String TWITTER_LABEL = "Twitter";

  /**
   * Constant for link Linkedin label.
   */
  public static final String LINKEDIN_LABEL = "LinkedIn";

  /**
   * Constant for link Facebook label.
   */
  public static final String FACEBOOK_LABEL = "Facebook";

  /**
   * Constant for link Whatsapp label.
   */
  public static final String WHATSAPP_LABEL = "WhatsApp";

  /**
   * Constant for link Email label.
   */
  public static final String EMAIL_LABEL = "Email";

  /**
   * Constant for link Twitter icon.
   */
  public static final String TWITTER_ICON = "twitter-gold";

  /**
   * Constant for link LinkedIn icon.
   */
  public static final String LINKEDIN_ICON = "linkedin-gold";

  /**
   * Constant for link Facebook icon.
   */
  public static final String FACEBOOK_ICON = "facebook-gold";

  /**
   * Constant for link Whatsapp icon.
   */
  public static final String WHATSAPP_ICON = "whatsapp-gold";

  /**
   * Constant for video control button text play video i18n key.
   */
  public static final String PLAY_VIDEO = "Play Video";

  /**
   * Constant for video control button text pause video i18n key.
   */
  public static final String PAUSE_VIDEO = "Pause Video";

  /**
   * Constant for video control button text mute video i18n key.
   */
  public static final String MUTE_VIDEO = "Mute Video";

  /**
   * Constant for video control button text unmute video i18n key.
   */
  public static final String UNMUTE_VIDEO = "Unmute Video";

  /**
   * Constant for video control button text full screen i18n key.
   */
  public static final String ENTER_FULL_SCREEN = "Full Screen";

  /**
   * Constant for video control button text exit full screen i18n key.
   */
  public static final String EXIT_FULL_SCREEN = "Exit Full Screen";

  /**
   * Copyright character.
   */
  public static final String COPYRIGHT = "©";

  /**
   * Request param 'g-recaptcha-response'.
   */
  public static final String PARAM_G_RECAPTCHA_RESPONSE = "g-recaptcha-response";

  /**
   * Json extension text.
   */
  public static final String JSON = "json";

  /**
   * Form ID form field name.
   */
  public static final String FORM_ID_FIELD_NAME = "form_id";

  /**
   * Page External URL for Local pages.
   */
  public static final String PAGE_EXTERNAL_URL = "pageExternalUrl";

  /**
   * href attribute in HTML
   */
  public static final String ATTRIB_HREF = "href";

  /**
   * target attribute in HTML
   */
  public static final String ATTRIB_TARGET = "target";

  /**
   * Anchor element in HTML
   */
  public static final String TAG_ANCHOR = "a";

  /**
   * target attribute value that opens link in new tab or window.
   */
  public static final String TARGET_BLANK = "_blank";

  /**
   * target attribute value that opens link in same frame.
   */
  public static final String TARGET_SELF = "_self";

  /*
   * CDATA element type of XML
   */
  public static final String CDATA ="CDATA";

  /**
   * etc.clientlibs path
   */
  public static final String ETC_CLIENTLIBS_PATH = "/etc.clientlibs";
  
  /**
   * Internal links
   */
  public static final List<String> INTERNAL_LINKS =
      Collections.unmodifiableList(Arrays.asList(TONOMUS_CONTENT_PATH,
          TONOMUS_EXPERIENCE_FRAGMENT_PATH, ETC_CLIENTLIBS_PATH, HASH));

  public static final String SOURCE ="src";

  public static final String ACTIONS ="actions";

  /**
   * Constant for internal
   */
  public static final String INTERNAL = "internal";

  /**
   * Constant for metadata file type/format property dc:format
   */
  public static final String DC_FORMAT = "dc:format";
  
   /**
   * Constant for primary type dam:Asset
   */
  public static final String DAM_ASSET = "dam:Asset";

   /**
   * Constant for video format for video/mp4
   */
  public static final String MP4 = "mp4";

   /**
   * Constant for video format for video/webm
   */
  public static final String WEBM= "webm";

   /**
   * Constant for video format for video/ogg
   */
  public static final String OGG= "OGG";

  /**
   * Constant for acceptable video media types for video element
   */
  public static final List<String> VIDEO_TYPES =
      Collections.unmodifiableList(Arrays.asList(MP4, WEBM, OGG));

  public static final String ERROR_ABSTRACTHTTPCLIENT = "ERROR_TONOMUS(V2)_001: ";

  public static final String ERROR_TONOMUSRECAPTCHAVALIDATIONSERVICE = "ERROR_TONOMUS(V2)_002: ";

  public static final String ERROR_FORM_SERVLET = "ERROR_TONOMUS(V2)_003: ";

  public static final String ERROR_FORMMANDATORYFIELDVALIDATIONSERVICE = "ERROR_TONOMUS(V2)_004: ";

  public static final String ERROR_FORMCOLLECTORSERVICE = "ERROR_TONOMUS(V2)_005: ";

  public static final String ERROR_FORMREQUESTPARAMETERMAP = "ERROR_TONOMUS(V2)_006: ";
  
  public static final String ERROR_AUDIENCEOPTIONUTILS = "ERROR_TONOMUS(V2)_007: ";

  public static final String ERROR_SEARCH_SERVLET = "ERROR_TONOMUS(V2)_008: ";

  public static final String ERROR_SEARCHRESULTSERVICE = "ERROR_TONOMUS(V2)_009: ";

  public static final String WARN_FORMMANDATORYFIELDVALIDATIONSERVICE = "WARN_TONOMUS(V2)_001: ";

  public static final String DEFAULT_LOCALE = "en-us";

  public static final String HEADER_ACCEPT_LANGUAGE = "Accept-Language";

  public static final String HEADER_CONTENT_LANGUAGE = "Content-Language";

  public static final String PDF_MIMETYPE = "application/pdf";
}
