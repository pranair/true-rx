CREATE TABLE patient (
    patient_id INT PRIMARY KEY,
    name string(20),
    password string(10),
    dob DATE,
    gender string(3),
    weight INT,
    phone_number string(20),
    email string(30),
    address string(100),
    allergies jsonb,
    notes string[],
    uid int
);

create table doctor (
    doctor_id INT PRIMARY KEY,
    email string(30),
    name string(20),
    password string(10),
    degree_specialisation string(100),
    license_number string(100),
    hospital_name string(100)
);

CREATE TABLE pharmacist (
    pharmacist_id INT PRIMARY KEY,
    email string(30),
    name string(20),
    password string(10),
    pharmacy_name string(100),
    license_number string(100),
    phone_number string(20),
    address string(100)
);

CREATE TABLE patient_doctors (
    patient_id INT,
    doctor_id INT,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id),
    primary key (
        patient_id,
        doctor_id
    )
);

create table prescription (
    prescription_id INT PRIMARY KEY,
    patient_id int REFERENCES patient (patient_id),
    doctor_id int REFERENCES doctor (doctor_id),
    pharmacist_id int REFERENCES pharmacist (pharmacist_id),
    date date,
    date_given date,
    note string,
    status bool
);

create table medication (
    medication_id int primary key,
    medication_brand_name string,
    medication_generic_name string,
    otc bool
);

CREATE TABLE prescription_items (
    prescription_id INTEGER REFERENCES prescription (prescription_id),
    medication_id   INTEGER REFERENCES medication (medication_id),
    frequency        INTEGER,
    dosage integer,
    days integer,
    PRIMARY KEY (
        prescription_id,
        medication_id
    )
);


INSERT INTO patient (patient_id, name, password, dob, gender, weight, phone_number, email, address, allergies, notes, uid)
VALUES
(1, 'John Smith', 'password1', '1990-01-01', 'M', 70, '555-1234', 'john.smith@example.com', '123 Main St, Anytown, USA', '{"Peanuts":"Severe"}', '{none}', 3432),
(2, 'Jane Doe', 'password2', '1995-05-05', 'F', 55, '555-5678', 'jane.doe@example.com', '456 Oak St, Anytown, USA', '{"Shellfish": "Mild", "Pollen": "Mild"}', '{asthma}', 3424),
(3, 'Bob Johnson', 'password3', '1985-10-10', 'M', 80, '555-4321', 'bob.johnson@example.com', '789 Elm St, Anytown, USA', NULL, '{High Blood Pressure}', 2348),
(4, 'Mary Smith', 'password4', '1980-07-15', 'F', 60, '555-8765', 'mary.smith@example.com', '321 Pine St, Anytown, USA', '{"Penicillin": "Severe"}', '{Diabetes}', 2381),
(5, 'David Lee', 'password5', '1975-03-20', 'M', 90, '555-2468', 'david.lee@example.com', '654 Cedar St, Anytown, USA', NULL, '{none}', 2891);

INSERT INTO doctor (doctor_id, email, name, password, degree_specialisation, license_number, hospital_name)
VALUES
(1, 'johnson@mail.com', 'Don Johnson', 'password1','M.D., Cardiology', 'L1234', 'St. Mary Medical Center'),
(2, 'lee@mail.com', 'Stan Lee', 'password2', 'M.D., Pediatrics', 'L5678', 'Children Hospital of Philadelphia'),
(3, 'smith@mail.com', 'Will Smith', 'password3', 'M.D., Neurology', 'L9101', 'University of California, San Francisco Medical Center'),
(4, 'wong@mail.com', 'King Wong', 'password4', 'M.D., Dermatology', 'L2345', 'Massachusetts General Hospital'),
(5, 'patel@mail.com', 'Yung Patel', 'password5', 'M.D., Oncology', 'L6789', 'Johns Hopkins Hospital');

INSERT INTO patient_doctors (patient_id, doctor_id)
VALUES
(1, 1),
(2, 1),
(3, 2),
(4, 3),
(5, 4);

--INSERT INTO prescription (prescription_id, patient_id, doctor_id, date, note, status)
--VALUES
--(1, 1, 1, '2022-01-01', 'Prescription note for John Smith', true),
--(2, 2, 1, '2022-02-02', 'Prescription note for Jane Doe', false),
--(3, 3, 2, '2022-03-03', 'Prescription note for Bob Johnson', true),
--(4, 4, 3, '2022-04-04', 'Prescription note for Mary Smith', true),
--(5, 5, 4, '2022-05-05', 'Prescription note for David Lee', false);

INSERT INTO medication VALUES
(1, 'Advil', 'Ibuprofen', 'yes'),
(2, 'Tylenol', 'Acetaminophen', 'yes'),
(3, 'Benadryl', 'Diphenhydramine', 'yes'),
(4, 'Zyrtec', 'Cetirizine', 'yes'),
(5, 'Singulair', 'Montelukast', 'yes');

INSERT INTO pharmacist (pharmacist_id, email, name, password, pharmacy_name, license_number, phone_number, address)
VALUES (1, 'jane.doe@pharmacy.com', 'Jane Doe', 'pass123', 'ABC Pharmacy', '12345', '555-555-5555', '456 Main St, Suite 100');

INSERT INTO pharmacist (pharmacist_id, email, name, password, pharmacy_name, license_number, phone_number, address)
VALUES (2, 'john.smith@pharmacy.com', 'John Smith', 'pass456', 'XYZ Pharmacy', '67890', '555-555-5556', '789 Main St, Suite 200');


INSERT INTO prescription VALUES
(1, 1, 1, 1, '2022-02-01', '2022-02-10', 'Prescribed for headache', true),
(2, 1, 2, 2, '2022-03-15', '2022-03-16', 'Prescribed for fever', true),
(3, 2, 1, NULL, '2022-04-20', NULL,  'Prescribed for allergy', false),
(4, 2, 2, 2, '2022-05-12', '2022-05-14', 'Prescribed for back pain', true),
(5, 3, 1, 2, '2022-06-30', '2022-06-30', 'Prescribed for sore throat', true);

INSERT INTO prescription_items VALUES
(1, 1, 2, 200, 2000),
(1, 2, 1, 500, 3000),
(2, 1, 1, 100, 1),
(3, 3, 3, 50, 5),
(4, 4, 2, 10, 7),
(4, 5, 1, 20, 10),
(5, 2, 3, 300, 4),
(5, 3, 2, 50, 7),
(5, 5, 1, 20, 30);

