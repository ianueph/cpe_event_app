import { ZodError } from "zod/v4"
import { validateId, validatePagination } from "../../src/cpe_event_api/utils/validation"
import createHttpError, { HttpError } from "http-errors"

describe('validatePagination', () => {
    it('should return the same thing that was inputted if validated', () => {
        const pagination = {
            page: 1,
            size: 5,
        }

        const result = validatePagination(pagination) 

        expect(result).toEqual(pagination)
    }),

    it('should throw out values that are too high', () => {
        const pagination = {
            page: 10000000000,
            size: 231231241,
        }

        expect(() => {
            validatePagination(pagination)
        }).toThrow(createHttpError.BadRequest)
    }),

    it('should throw out values that are less than 1', () => {
        const pagination = {
            page: 0,
            size: -5,
        }

        expect(() => {
            validatePagination(pagination)
        }).toThrow(createHttpError.BadRequest)
    })
})

describe('validateId', () => {
    it('should return the same value that was inputted', () => {
        const id = 25

        expect(validateId(id)).toEqual(id)
    })

    it('should coerce a string number', () => {
        const id = '25'

        expect(validateId(id)).toEqual(25)
    })

    it('should throw out strings with letters', () => {
        const id = 'twenty-five'

        expect(() => {
            validateId(id)
        }).toThrow(createHttpError.BadRequest)
    })
})