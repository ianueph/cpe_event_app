-- Clear existing data
TRUNCATE TABLE attendees RESTART IDENTITY CASCADE;
TRUNCATE TABLE events RESTART IDENTITY CASCADE;
TRUNCATE TABLE students RESTART IDENTITY CASCADE;

-- Seed students
INSERT INTO students (first_name, last_name, middle_initial, program, current_year, ue_email, contact_number, student_number) VALUES
('Juan', 'Dela Cruz', 'M', 'BSCS', '3rd', 'juan.delacruz@ue.edu.ph', '09171234567', '20220000001'),
('Maria', 'Santos', 'L', 'BSIT', '2nd', 'maria.santos@ue.edu.ph', '09181234567', '20220000002'),
('Pedro', 'Penduko', 'T', 'BSCE', '4th', 'pedro.penduko@ue.edu.ph', '09191234567', '20220000003'),
('Ana', 'Lopez', 'B', 'BSIS', '1st', 'ana.lopez@ue.edu.ph', '09201234567', '20220000004'),
('Liza', 'Reyes', 'C', 'BSCS', '3rd', 'liza.reyes@ue.edu.ph', '09211234567', '20220000005');

-- Seed events
INSERT INTO events (event_name, event_description, event_type, "date", start_time, end_time, registration_fee, oic) VALUES
('Tech Summit 2025', 'A conference for tech enthusiasts.', 'Conference', '2025-08-15', '2025-08-15 09:00:00+08', '2025-08-15 17:00:00+08', 150.00, 'Prof. Reyes'),
('Career Sports', 'Meet potential employers and learn about careers.', 'Sports', '2025-09-10', '2025-09-10 10:00:00+08', '2025-09-10 15:00:00+08', 0.00, 'Dean Morales'),
('Hackathon 2025', 'Coding Whatever for UE students.', 'Whatever', '2025-07-20', '2025-07-20 08:00:00+08', '2025-07-20 20:00:00+08', 200.00, 'Engr. Robles'),
('Leadership Conference', 'Leadership skills training.', 'Conference', '2025-10-05', '2025-10-05 13:00:00+08', '2025-10-05 18:00:00+08', 50.00, 'Dr. Lim'),
('Entrepreneurship Meeting', 'Startups and innovation insights.', 'Meeting', '2025-06-25', '2025-06-25 14:00:00+08', '2025-06-25 17:00:00+08', 75.00, 'Prof. Tan');

-- Seed attendees (20 total)
INSERT INTO attendees (payment, student_number, event_id) VALUES
(150.00, '20220000001', 1),
(0.00,   '20220000002', 2),
(200.00, '20220000003', 3),
(50.00,  '20220000004', 4),
(75.00,  '20220000005', 5),
(150.00, '20220000002', 1),
(0.00,   '20220000003', 2),
(200.00, '20220000004', 3),
(50.00,  '20220000005', 4),
(75.00,  '20220000001', 5),
(150.00, '20220000003', 1),
(0.00,   '20220000004', 2),
(200.00, '20220000005', 3),
(50.00,  '20220000001', 4),
(75.00,  '20220000002', 5),
(150.00, '20220000004', 1),
(0.00,   '20220000005', 2),
(200.00, '20220000001', 3),
(50.00,  '20220000002', 4),
(75.00,  '20220000003', 5);
