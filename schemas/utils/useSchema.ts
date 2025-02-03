import { z } from 'zod'
import { stripZodDefault } from '@/schemas/utils/stripZodDefaultValues'
import schemaDefaults, { SchemaOptionalProps } from '@/schemas/utils/schemaDefaults'

/**
 * A hook that provides utility functions for working with zod schemas
 * @param schema - The schema used by the utility functions that are exposed by this hook
 * @returns An object containing utility functions: getDummyObject, validateObject and safeParseObject based on the given schema
 * @internal
 */
export function useSchema<Type>(schema: z.ZodTypeAny) {
  /**
   * Validates a given object against a given schema. Throws an error if the object is invalid
   * @param object - The object to be validated
   */
  const validateObject = (object: any): Type | never => stripZodDefault(schema).parse(object)

  /**
   * Returns a dummy object based on a given schema
   * @param options - Defines how optional properties should be handled in terms of their instantiation (undefined / value)
   */
  function getDummyObject(options?: SchemaOptionalProps): Type {
    return schemaDefaults(schema, options)
  }

  /**
   * Safely parses an object against its schema and returns the result of the zod.safeParse method
   * @param rawCustomer - The object to be parsed / validated
   */
  const safeParseObject = (object: any): z.SafeParseReturnType<any, Type> => stripZodDefault(schema).safeParse(object)

  return {
    getDummyObject,
    validateObject,
    safeParseObject,
  }
}
