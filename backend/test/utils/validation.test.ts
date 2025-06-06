import { validateId, validatePagination, validateResponse } from "../../src/cpe_event_api/utils/validation"
import createHttpError from "http-errors"
import { eventResponseSchema } from "../../../shared/zod_schemas/events"
import { attendeeResponseSchema } from "../../../shared/zod_schemas/attendees"
import { idSchema } from "../../../shared/zod_schemas/metadata"

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

describe('validateResponse', () => {
    const eventResponse = {
        "data": [
            {
                "id": 1,
                "event_name": "bruh",
                "event_description": "A conference for tech enthusiasts.",
                "event_type": "Conference",
                "date": new Date("2025-08-15T00:00:00.000Z"),
                "start_time": new Date("2025-08-15T01:00:00.000Z"),
                "end_time": new Date("2025-08-15T09:00:00.000Z"),
                "registration_fee": 150,
                "oic": "Prof. Reyes",
                "links": [
                    {
                        "rel": "self",
                        "href": "/events/1"
                    }
                ]
            },
            {
                "id": 2,
                "event_name": "Career Sports",
                "event_description": "Meet potential employers and learn about careers.",
                "event_type": "Sports",
                "date": new Date("2025-09-10T00:00:00.000Z"),
                "start_time": new Date("2025-09-10T02:00:00.000Z"),
                "end_time": new Date("2025-09-10T07:00:00.000Z"),
                "registration_fee": 0,
                "oic": "Dean Morales",
                "links": [
                    {
                        "rel": "self",
                        "href": "/events/2"
                    }
                ]
            },
        ],
        "meta": {
            "pagination": {
                "page": 1,
                "size": 5,
                "offset": 0,
                "total_entries": 5,
                "total_pages": 1
            }
        },
        "links": [
            {
                "rel": "self",
                "href": "/events/?page=1&size=5"
            }
        ]    
    }
    const attendeeResponse = {
        "data": [
            {
                "id": 20,
                "payment": 75,
                "student_number": "20220000003",
                "event_id": 5,
                "links": [
                    {
                        "rel": "self",
                        "href": "/attendees/20"
                    },
                    {
                        "rel": "event",
                        "href": "/attendees/event/5"
                    },
                    {
                        "rel": "student",
                        "href": "/attendees/student_number/20220000003"
                    }
                ]
            }
        ],
        "meta": {
            "pagination": {
                "page": 1,
                "size": 1,
                "offset": 0,
                "total_entries": 20,
                "total_pages": 20
            }
        },
        "links": [
            {
                "rel": "self",
                "href": "/attendees/?page=1&size=1"
            },
            {
                "rel": "next",
                "href": "/attendees/?page=2&size=1"
            }
        ]
    }   

    it('should return the same value that was inputted', () => {
        expect(validateResponse(eventResponse, eventResponseSchema)).toEqual(eventResponse)
        expect(validateResponse(attendeeResponse, attendeeResponseSchema)).toEqual(attendeeResponse)
    }),

    it('should throw out bad responses ie one that is way too long', () => {
        let bad_response = eventResponse
        bad_response.data[0].oic = "ssdjkfhaksdfhaksdfkadfhkadhfkadhfkjadhfkjahdfklasdfaskdfjakdjfasdfkjahdfkjasdfhajdfhakjdhaskdjfadfjkadfkajsdfaskjdfasdjfhasdfkjashdfkasjdfjadfhkadjfhakjdfhjakdfhkajsdfhkjdfhkadjfhakjdfhaskjdfhask"
    
        expect(() => {
            validateResponse(bad_response, eventResponseSchema)
        }).toThrow(createHttpError.BadRequest)
    })
})