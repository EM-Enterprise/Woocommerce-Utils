import * as dotenv from 'dotenv'
import { setCredentials } from '@/api/Credentials'
import { z } from 'zod'
import { errorMap } from 'zod-validation-error'

dotenv.config()
z.setErrorMap(errorMap)

setCredentials({
  consumerKey: process.env.CONSUMER_KEY!,
  consumerSecret: process.env.CONSUMER_SECRET!,
  url: process.env.DOMAIN!,
})
