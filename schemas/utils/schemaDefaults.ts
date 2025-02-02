import { z, ZodTypeAny } from 'zod'

/**
 * The default size of an array.
 * @internal
 */
export const DEFAULT_ARRAY_SIZE = 5

/**
 * @internal
 */
export interface SchemaOptionalProps {
  includeOptional_PrimitiveProperties?: boolean
  includeOptional_NonPrimitiveProperties?: boolean
}

/**
 * Returns a default values for a given schema.
 * @param schema The schema to generate default values for.
 * @param options,includeOptional_PrimitiveProperties If true, optinal primitive properties such as strings, numbers, and booleans are going to be instantiated.
 * @param options,includeOptional_NonPrimitiveProperties If true, non-primitive properties such as objects and arrays are going to instantiated as well.
 * @internal
 */
export default function schemaDefaults<Schema extends z.ZodFirstPartySchemaTypes>(
  schema: Schema,
  options: SchemaOptionalProps = { includeOptional_PrimitiveProperties: true, includeOptional_NonPrimitiveProperties: false },
): z.TypeOf<Schema> {
  if (options.includeOptional_PrimitiveProperties === undefined) options.includeOptional_PrimitiveProperties = true

  switch (schema._def.typeName) {
    case z.ZodFirstPartyTypeKind.ZodDefault:
      return schema._def.defaultValue()

    case z.ZodFirstPartyTypeKind.ZodObject: {
      return Object.fromEntries(Object.entries((schema as z.SomeZodObject).shape).map(([key, value]) => [key, schemaDefaults(value, options)]))
    }
    case z.ZodFirstPartyTypeKind.ZodString:
      return ''
    case z.ZodFirstPartyTypeKind.ZodNull:
      return null
    case z.ZodFirstPartyTypeKind.ZodNullable:
      return null
    case z.ZodFirstPartyTypeKind.ZodUndefined:
      return undefined
    case z.ZodFirstPartyTypeKind.ZodUnknown:
      return undefined

    // etc
    case z.ZodFirstPartyTypeKind.ZodArray: {
      const arraySchema = schema as z.ZodArray<any>
      const elementSchema = arraySchema.element

      const elements = Array.from({ length: DEFAULT_ARRAY_SIZE }).map(() => schemaDefaults(elementSchema, options)) as z.TypeOf<Schema>
      return elements
    }

    case z.ZodFirstPartyTypeKind.ZodOptional:
      const strippedOptionalSchema = (schema as z.ZodOptional<ZodTypeAny>).unwrap()

      switch (strippedOptionalSchema._def.typeName) {
        case z.ZodFirstPartyTypeKind.ZodObject:
          return options.includeOptional_NonPrimitiveProperties ? schemaDefaults(strippedOptionalSchema, options) : undefined

        case z.ZodFirstPartyTypeKind.ZodArray:
          return options.includeOptional_NonPrimitiveProperties ? schemaDefaults(strippedOptionalSchema, options) : undefined
      }

      return options.includeOptional_PrimitiveProperties ? schemaDefaults(strippedOptionalSchema, options) : undefined

    case z.ZodFirstPartyTypeKind.ZodNumber:
      return 0

    case z.ZodFirstPartyTypeKind.ZodBoolean:
      return false

    case z.ZodFirstPartyTypeKind.ZodAny:
      return undefined

    case z.ZodFirstPartyTypeKind.ZodCatch:
      return schema._def.catchValue.call(null, {} as any)

    default:
      throw new Error(`Unsupported type ${(schema as any)._def.typeName}`)
  }
}
