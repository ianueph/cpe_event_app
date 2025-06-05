import { ZodError } from "zod/v4"
import { validatePagination } from "../../src/cpe_event_api/utils/validation"

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
        }).toThrow(ZodError)
    }),

    it('should throw out values that are less than 1', () => {
        const pagination = {
            page: 0,
            size: -5,
        }

        expect(() => {
            validatePagination(pagination)
        }).toThrow(ZodError)
    })
})