// Imports
import { TextFieldProps } from "@suankularb-components/react";
import { CSSProperties, FC } from "react";

/**
 * The language code of a supported UI language.
 */
export type LangCode = "en-US" | "th";

/**
 * A function component stylable through `className` and `style`.
 */
export type StylableFC<Props extends {} = {}> = FC<
  Props & { className?: string; style?: CSSProperties }
>;

/**
 * Values of a form.
 */
export type FormControlValues<T extends string | symbol = string> = {
  [key in T]: any;
};

/**
 * The validity of each value in a form, represented as booleans.
 */
export type FormControlValids<T extends string | symbol = string> = {
  [key in T]: boolean;
};

/**
 * The validity of each value in a form, represented as booleans or error
 * messages.
 */
export type FormControlValidsWMessages<T extends string | symbol = string> = {
  [key in T]: boolean | string;
};

/**
 * Props of each value in a form, can be applied directly on Text Field.
 */
export type FormControlProps<T extends string | symbol = string> = {
  [key in T]: Pick<
    TextFieldProps<string | File>,
    "helperMsg" | "value" | "onChange" | "required" | "error"
  >;
};

/**
 * A string that supports Thai and English, with the latter being optional.
 */
export type MultiLangString = {
  th: string;
  "en-US"?: string;
};
