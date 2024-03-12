export type A23CountrySelectItemProps = {
  countryCode: string;
  label: string;
  value: string;
};

export type A23CountrySelectProps = {
  id?: string;
  items: ReadonlyArray<A23CountrySelectItemProps>;
  /**
   * FE path : 'image/flags/'
   * BE path : '/content/dam/neom/components/flags/'
   */
  flagsPath: string;
  placeholder: string;
  showRawValue: boolean;
  isWideDropdown: boolean;
};
