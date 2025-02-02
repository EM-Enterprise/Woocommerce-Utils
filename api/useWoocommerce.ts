import Woocommerce from '@woocommerce/woocommerce-rest-api'
import { getCredentials } from '@/api/Credentials'
import { z } from 'zod'

export interface ErrorResponse {
  response: {
    data: any
  }
}

export interface SuccessfulResponse<T> {
  data: T
}

const endpointSchema = z.string().refine((val) => !val.startsWith('/'), {
  message: "Endpoint cannot start with '/'",
  path: ['endpoint'],
})

let wm: Woocommerce = undefined as any

export function useWoocommerce() {
  wm = new Woocommerce(getCredentials())

  return { get: GetResource, post: () => null, put: () => null, delete: () => null }
}

/**
 * Creates a URLSearchParams object from a given filters / params object.
 */
export function createSearchParams(filters: object | undefined) {
  if (!filters) return new URLSearchParams()

  const searchParams = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      searchParams.append(key, value.join(','))
    } else {
      searchParams.append(key, value.toString())
    }
  })

  return searchParams
}

/**
 * Fetches a resource using the woocommerce api and parses the response.
 * @param route The route that is to be fetched.
 * @param params The parameters that are to be used to filter the fetched resource.
 */
async function GetResource<ResourceType>(route: string, params?: object): Promise<ResourceType | never> {
  const endpoint = endpointSchema.parse(route + '?' + createSearchParams(params))
  const response = await wm.get(endpoint)

  if (response.status !== 200 || !response.data) throw new Error(`Failed to fetch resource. -> ${response}`)

  return response.data as ResourceType
}
