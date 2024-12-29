import { getConsoleLogPrefix } from '../../getConsoleLogPrefix.js';
import type { GbnfGrammarGenerator } from '../GbnfGrammarGenerator.js';
import type { GbnfTerminal } from '../GbnfTerminal.js';
import { GbnfAnyJson } from '../terminals/GbnfAnyJson.js';
import { GbnfArray } from '../terminals/GbnfArray.js';
import { GbnfBoolean } from '../terminals/GbnfBoolean.js';
import { GbnfFormatString } from '../terminals/GbnfFormatString.js';
import { GbnfNull } from '../terminals/GbnfNull.js';
import { GbnfNumber } from '../terminals/GbnfNumber.js';
import { GbnfObjectMap } from '../terminals/GbnfObjectMap.js';
import { GbnfOr } from '../terminals/GbnfOr.js';
import { GbnfString } from '../terminals/GbnfString.js';
import { GbnfStringValue } from '../terminals/GbnfStringValue.js';
import {
  type GbnfJsonSchema,
  isGbnfJsonArraySchema,
  isGbnfJsonBasicSchemaIncludesType,
  isGbnfJsonBasicStringSchema,
  isGbnfJsonConstSchema,
  isGbnfJsonEnumSchema,
  isGbnfJsonFormatStringSchema,
  isGbnfJsonObjectSchema,
  isGbnfJsonOneOfSchema,
} from '../types.js';
import { GbnfJsonScopeState } from './GbnfJsonScopeState.js';
import { getGbnfJsonTerminalForLiteral } from './getGbnfJsonTerminalForLiteral.js';

export function getGbnfJsonTerminalForGbnfJsonSchema(
  schema: GbnfJsonSchema,
  grammarGenerator: GbnfGrammarGenerator,
  scopeState: GbnfJsonScopeState = new GbnfJsonScopeState(),
): GbnfTerminal {
  if (isGbnfJsonOneOfSchema(schema)) {
    const values = schema.oneOf.map((altSchema) => getGbnfJsonTerminalForGbnfJsonSchema(altSchema, grammarGenerator, scopeState));

    return new GbnfOr(values);
  }
  if (isGbnfJsonConstSchema(schema)) {
    return getGbnfJsonTerminalForLiteral(schema.const);
  }
  if (isGbnfJsonEnumSchema(schema)) {
    return new GbnfOr(schema.enum.map((item) => getGbnfJsonTerminalForLiteral(item)));
  }
  if (isGbnfJsonObjectSchema(schema)) {
    const propertiesEntries = Object.entries(schema.properties ?? {});

    let maxProperties = schema.maxProperties;
    if (schema.properties != null && maxProperties != null && maxProperties < propertiesEntries.length) {
      console.warn(
        getConsoleLogPrefix(true, false),
        `maxProperties (${maxProperties}) must be greater than or equal to properties object keys number (${propertiesEntries.length}). Using properties object keys number as maxProperties.`,
      );
      maxProperties = propertiesEntries.length;
    }

    return new GbnfObjectMap({
      fields: propertiesEntries.map(([propName, propSchema]) => {
        return {
          required: true,
          key: new GbnfStringValue(propName),
          value: getGbnfJsonTerminalForGbnfJsonSchema(propSchema, grammarGenerator, scopeState.getForNewScope()),
        };
      }),
      additionalProperties:
        schema.additionalProperties == null || schema.additionalProperties === false
          ? undefined
          : schema.additionalProperties === true
            ? new GbnfAnyJson(scopeState.getForNewScope())
            : getGbnfJsonTerminalForGbnfJsonSchema(schema.additionalProperties, grammarGenerator, scopeState.getForNewScope()),
      minProperties: schema.minProperties,
      maxProperties,
      scopeState,
    });
  }
  if (isGbnfJsonArraySchema(schema)) {
    let maxItems = schema.maxItems;
    if (schema.prefixItems != null && maxItems != null && maxItems < schema.prefixItems.length) {
      console.warn(
        getConsoleLogPrefix(true, false),
        `maxItems (${maxItems}) must be greater than or equal to prefixItems array length (${schema.prefixItems.length}). Using prefixItems length as maxItems.`,
      );
      maxItems = schema.prefixItems.length;
    }

    return new GbnfArray({
      items:
        schema.items == null
          ? undefined
          : getGbnfJsonTerminalForGbnfJsonSchema(schema.items, grammarGenerator, scopeState.getForNewScope()),
      prefixItems:
        schema.prefixItems == null
          ? undefined
          : schema.prefixItems.map((item) => getGbnfJsonTerminalForGbnfJsonSchema(item, grammarGenerator, scopeState.getForNewScope())),
      minItems: schema.minItems,
      maxItems,
      scopeState,
    });
  }
  if (isGbnfJsonBasicStringSchema(schema)) {
    const minLength = Math.max(0, schema.minLength ?? 0);
    let maxLength = schema.maxLength;
    if (maxLength != null && maxLength < minLength) {
      console.warn(
        getConsoleLogPrefix(true, false),
        `maxLength (${maxLength}) must be greater than or equal to minLength (${minLength}). Using minLength as maxLength.`,
      );
      maxLength = minLength;
    }

    return new GbnfString({
      minLength,
      maxLength,
    });
  }
  if (isGbnfJsonFormatStringSchema(schema)) return new GbnfFormatString(schema.format);

  const terminals: GbnfTerminal[] = [];

  if (isGbnfJsonBasicSchemaIncludesType(schema, 'string')) terminals.push(new GbnfString());

  if (isGbnfJsonBasicSchemaIncludesType(schema, 'number')) terminals.push(new GbnfNumber({ allowFractional: true }));

  if (isGbnfJsonBasicSchemaIncludesType(schema, 'integer')) terminals.push(new GbnfNumber({ allowFractional: false }));

  if (isGbnfJsonBasicSchemaIncludesType(schema, 'boolean')) terminals.push(new GbnfBoolean());

  if (isGbnfJsonBasicSchemaIncludesType(schema, 'null')) terminals.push(new GbnfNull());

  return new GbnfOr(terminals);
}