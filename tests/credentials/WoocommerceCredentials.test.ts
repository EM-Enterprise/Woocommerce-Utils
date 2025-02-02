import { describe } from '@jest/globals'
import { getCredentials, setCredentials } from '@/api/Credentials'

describe('WoocommerceCredentials', () => {
  it('accessing credentials should throw an error if credentials are not set', () => {
    setCredentials(undefined!, true)

    expect(() => getCredentials()).toThrow(ReferenceError)
    expect(() => getCredentials()).toThrow('[Woocommerce-Utils]: Authorization - Credentials not set')
  })

  it('accessing credentials should return the credentials if set', () => {
    const credentials = {
      consumerKey: 'ck_1234567890',
      consumerSecret: 'cs_1234567890',
      url: 'https://example.com',
    }

    setCredentials(credentials)

    expect(getCredentials()).toEqual(credentials)
  })
})
