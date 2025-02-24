import { z } from 'zod'

/**
 * Recursively unwraps ZodDefault<T> and returns a schema with the same shape but without the `.default()` wrappers.
 * @internal
 */
export type StripZodDefault<T extends z.ZodTypeAny> =
  // If it's a ZodDefault wrapper, unwrap its inner type and strip that too
  T extends z.ZodDefault<infer Inner>
    ? StripZodDefault<Inner>
    : // If it's a ZodObject, reconstruct the shape
      T extends z.ZodObject<infer Shape, infer UnknownKeys, infer Catchall>
      ? z.ZodObject<{ [K in keyof Shape]: StripZodDefault<Shape[K]> }, UnknownKeys, Catchall>
      : // If it's a ZodArray, strip the element type
        T extends z.ZodArray<infer Element, infer ArrayCardinality>
        ? z.ZodArray<StripZodDefault<Element>, ArrayCardinality>
        : // If it's an optional, strip what's inside the optional
          T extends z.ZodOptional<infer InnerOpt>
          ? z.ZodOptional<StripZodDefault<InnerOpt>>
          : // If it's a nullable, strip what's inside the nullable
            T extends z.ZodNullable<infer InnerNull>
            ? z.ZodNullable<StripZodDefault<InnerNull>>
            : // If it's a union, intersection, effects, etc., you could handle them here similarly
              // For now we leave them as-is:
              T

/**
 * Recursively unwraps ZodDefault<T> and returns a schema with the same shape but without the `.default()` wrappers.
 * @param schema
 * @internal
 */
export function stripZodDefault<Schema extends z.ZodTypeAny>(schema: Schema): StripZodDefault<Schema> {
  switch (schema._def.typeName) {
    // 1) If it's z.default(...), unwrap
    case z.ZodFirstPartyTypeKind.ZodDefault: {
      const inner = (schema as unknown as z.ZodDefault<z.ZodTypeAny>)._def.innerType
      return stripZodDefault(inner) as StripZodDefault<Schema>
    }

    // 2) If it's an object, strip each property
    case z.ZodFirstPartyTypeKind.ZodObject: {
      const objSchema = schema as unknown as z.ZodObject<any>
      const newShape: Record<string, z.ZodTypeAny> = {}
      for (const key in objSchema.shape) {
        newShape[key] = stripZodDefault(objSchema.shape[key])
      }
      return z.object(newShape) as StripZodDefault<Schema>
    }

    // 3) If it's an array, strip its element
    case z.ZodFirstPartyTypeKind.ZodArray: {
      const arrSchema = schema as unknown as z.ZodArray<z.ZodTypeAny>
      const elementStripped = stripZodDefault(arrSchema.element)
      return z.array(elementStripped) as StripZodDefault<Schema>
    }

    // 4) If it's optional, unwrap the inner type, strip, reapply optional
    case z.ZodFirstPartyTypeKind.ZodOptional: {
      const unwrapped = (schema as unknown as z.ZodOptional<z.ZodTypeAny>).unwrap()
      const strippedInner = stripZodDefault(unwrapped)
      return z.optional(strippedInner) as StripZodDefault<Schema>
    }

    // 5) If it's nullable, unwrap the inner type, strip, reapply nullable
    case z.ZodFirstPartyTypeKind.ZodNullable: {
      const unwrapped = (schema as unknown as z.ZodNullable<z.ZodTypeAny>).unwrap()
      const strippedInner = stripZodDefault(unwrapped)
      return z.nullable(strippedInner) as StripZodDefault<Schema>
    }

    default:
      return schema as StripZodDefault<Schema>
  }
}
