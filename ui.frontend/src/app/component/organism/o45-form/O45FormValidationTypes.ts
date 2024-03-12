import { ValidationType } from 'app/data/type/Validation.types';

export interface FormError {
  response: {
    data: {
      status: number;
      message: string;
    };
  };
}

export interface FormErrorResponse {
  data: ResponseData;
  message: ResponseMessage;
}

export type FormField =
  | FormTextField
  | HTMLSelectElement
  | HTMLFieldSetElement
  | HTMLTextAreaElement;

export type FormOptionGroup = HTMLInputElement | HTMLSelectElement;

export type FormTextField = HTMLInputElement | HTMLTextAreaElement;

export interface Message {
  icon: string;
  heading: {
    text: string;
  };
  description: string;
}

export interface Messages {
  error: Message;
  success: Message;
}

export type ResponseData = {
  error: boolean;
  message: Message | null;
};

export interface ResponseMessage {
  status: number;
  message: string;
}

export type ValidationAttribute = {
  [fieldId: string]: string | null;
};

export type ValidationConstraint = Record<string, ValidationType>;

export type ValidationResult =
  | {
      [fieldId: string]: Array<string>;
    }
  | undefined;
