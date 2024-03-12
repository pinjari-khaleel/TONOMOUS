export type EqualityConstraint = {
  equality?:
    | string
    | {
        attribute?: string;
        comparator?: (value1: any, value2: any) => boolean;
        message?: string;
      };
};

export type EmailConstraint = {
  email?: {
    message?: string;
    pattern?: RegExp;
  };
};

export type FormatConstraint = {
  format?:
    | RegExp
    | {
        flags?: string;
        message?: string;
        pattern?: RegExp | string;
      };
};

export type LengthConstraint = {
  length?: {
    is?: number;
    maximum?: number;
    message?: string;
    minimum?: number;
    notValid?: string;
    tokenizer?: (inputValue: number) => number;
    tooLong?: string;
    tooShort?: string;
    wrongLength?: string;
  };
};

export type NumericalityConstraint = {
  numericality?: {
    divisibleBy?: number;
    equalTo?: number;
    even?: boolean;
    greaterThan?: number;
    greaterThanOrEqualTo?: number;
    lessThan?: number;
    lessThanOrEqualTo?: number;
    message?: string;
    notDivisibleBy?: string;
    notEqualTo?: string;
    notEven?: string;
    notGreaterThan?: string;
    notGreaterThanOrEqualTo?: string;
    notInteger?: string;
    notLessThan?: string;
    notLessThanOrEqualTo?: string;
    notOdd?: string;
    notValid?: string;
    odd?: boolean;
    onlyInteger?: boolean;
    strict?: boolean;
  };
};

export type PresenceConstraint = {
  presence?: {
    allowEmpty?: boolean;
    message?: string;
  };
};

export type ValidationType =
  | EqualityConstraint
  | EmailConstraint
  | FormatConstraint
  | LengthConstraint
  | NumericalityConstraint
  | PresenceConstraint;
