import { ZodError } from 'zod'
import { registerSchema } from '../user'

describe('LIBS_AUTHENTICATION', () => {
  it('REGISTER_SCHEMA_AS_EXPECTED', () => {
    const dataRequest = {
      name: 'Tai N',
      phoneNumber: '0919000000',
      pin: '1234',
    }
    const parsedRequest = registerSchema.parse(dataRequest)
    expect(parsedRequest).toMatchObject({
      name: 'Tai N',
      phoneNumber: '0919000000',
      pin: '1234',
    })
  })
  it('REGISTER_SCHEMA_ALL_EMPTY', () => {
    const dataRequest = {}
    const wrappedValidation = () => registerSchema.parse(dataRequest)
    expect(wrappedValidation).toThrowError(
      new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: ['name'],
          message: 'Required',
        },
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: ['phoneNumber'],
          message: 'Required',
        },
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: ['pin'],
          message: 'Required',
        },
      ])
    )
  })
  it('REGISTER_SCHEMA_NAME_EMPTY', () => {
    const dataRequest = { phoneNumber: '0909111222', pin: '1234' }
    const wrappedValidation = () => registerSchema.parse(dataRequest)
    expect(wrappedValidation).toThrowError(
      new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: ['name'],
          message: 'Required',
        },
      ])
    )
  })
  it('REGISTER_SCHEMA_PHONE_EMPTY', () => {
    const dataRequest = { name: 'Tai N', pin: '1234' }
    const wrappedValidation = () => registerSchema.parse(dataRequest)
    expect(wrappedValidation).toThrowError(
      new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: ['phoneNumber'],
          message: 'Required',
        },
      ])
    )
  })
  it('REGISTER_SCHEMA_PIN_EMPTY', () => {
    const dataRequest = { name: 'Tai N', phoneNumber: '0919000000' }
    const wrappedValidation = () => registerSchema.parse(dataRequest)
    expect(wrappedValidation).toThrowError(
      new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: ['pin'],
          message: 'Required',
        },
      ])
    )
  })
  it('REGISTER_SCHEMA_NAME_WRONG', () => {
    const dataRequest = { name: ' ', phoneNumber: '091900', pin: '1234' }
    const wrappedValidation = () => registerSchema.parse(dataRequest)
    expect(wrappedValidation).toThrowError(
      new ZodError([
        {
          validation: 'regex',
          code: 'invalid_string',
          message: 'Invalid',
          path: ['phoneNumber'],
        },
      ])
    )
  })
  it('REGISTER_SCHEMA_PHONE_WRONG', () => {
    const dataRequest = { name: 'Tai N', phoneNumber: '091900', pin: '1234' }
    const wrappedValidation = () => registerSchema.parse(dataRequest)
    expect(wrappedValidation).toThrowError(
      new ZodError([
        {
          validation: 'regex',
          code: 'invalid_string',
          message: 'Invalid',
          path: ['phoneNumber'],
        },
      ])
    )
  })
  it('REGISTER_SCHEMA_INVALID_PIN_SIZE', () => {
    const dataRequest = { name: 'Tai N', phoneNumber: '0919000000', pin: '12' }
    const wrappedValidation = () => registerSchema.parse(dataRequest)
    expect(wrappedValidation).toThrowError(
      new ZodError([
        {
          code: 'too_small',
          minimum: 4,
          type: 'string',
          inclusive: true,
          message: 'String must contain at least 4 character(s)',
          path: ['pin'],
        },
      ])
    )
  })
})
