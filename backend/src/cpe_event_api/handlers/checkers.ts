import db from "../db"

export async function eventIdExists(id : number) : Promise<boolean> {
    const result = await db.query({
        name: 'check-event-exists',
        text: 'SELECT 1 FROM events WHERE event_id = $1',
        values: [id]
    })

    return result.rows.length > 0;      
}

export async function studentNumberExists(student_number : string) : Promise<boolean> {
    const result = await db.query({
        name: 'check-student-exists',
        text: 'SELECT 1 FROM students WHERE student_number = $1',
        values: [student_number]
    })

    return result.rows.length > 0;      
}

export async function attendeeIdExists(id : number) : Promise<boolean> {
    const result = await db.query({
        name: 'check-attendee-exists',
        text: 'SELECT 1 FROM attendees WHERE id = $1',
        values: [id]
    })

    return result.rows.length > 0;     
}
