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
    allergies string[],
    notes string[]
);

create table doctor (
    doctor_id INT PRIMARY KEY,
    name string(20),
    password string(10)
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
    date date,
    note string,
    status bool
);

create table medication (
    medication_id int primary key,
    medication_brand_name string(20),
    medication_generic_name string(20),
    medication_cost int
);

CREATE TABLE prescription_items (
    prescription_id INTEGER REFERENCES prescription (prescription_id),
    medication_id   INTEGER REFERENCES medication (medication_id),
    quantity        INTEGER,
    dosage integer,
    days integer,
    PRIMARY KEY (
        prescription_id,
        medication_id
    )
);


INSERT INTO patient (patient_id, name, password, dob, gender, weight, phone_number, email, address, allergies, notes)
VALUES
(1, 'John Smith', 'password1', '1990-01-01', 'M', 70, '555-1234', 'john.smith@example.com', '123 Main St, Anytown, USA', '{peanuts}', '{none}'),
(2, 'Jane Doe', 'password2', '1995-05-05', 'F', 55, '555-5678', 'jane.doe@example.com', '456 Oak St, Anytown, USA', '{shellfish, pollen}', '{asthma}'),
(3, 'Bob Johnson', 'password3', '1985-10-10', 'M', 80, '555-4321', 'bob.johnson@example.com', '789 Elm St, Anytown, USA', '{none}', '{high blood pressure}'),
(4, 'Mary Smith', 'password4', '1980-07-15', 'F', 60, '555-8765', 'mary.smith@example.com', '321 Pine St, Anytown, USA', '{penicillin}', '{diabetes}'),
(5, 'David Lee', 'password5', '1975-03-20', 'M', 90, '555-2468', 'david.lee@example.com', '654 Cedar St, Anytown, USA', '{none}', '{none}');

INSERT INTO doctor (doctor_id, name, password)
VALUES
(1, 'Dr. Johnson', 'password1'),
(2, 'Dr. Lee', 'password2'),
(3, 'Dr. Smith', 'password3'),
(4, 'Dr. Wong', 'password4'),
(5, 'Dr. Patel', 'password5');

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
(1, 'Advil', 'Ibuprofen', 10),
(2, 'Tylenol', 'Acetaminophen', 8),
(3, 'Benadryl', 'Diphenhydramine', 15),
(4, 'Zyrtec', 'Cetirizine', 20),
(5, 'Singulair', 'Montelukast', 30);

INSERT INTO prescription VALUES
(1, 1, 1, '2022-02-01', 'Prescribed for headache', true),
(2, 1, 2, '2022-03-15', 'Prescribed for fever', true),
(3, 2, 1, '2022-04-20', 'Prescribed for allergy', false),
(4, 2, 2, '2022-05-12', 'Prescribed for back pain', true),
(5, 3, 1, '2022-06-30', 'Prescribed for sore throat', true);

INSERT INTO prescription_items VALUES
(1, 1, 2, 200, 2),
(1, 2, 1, 500, 3),
(2, 1, 1, 100, 1),
(3, 3, 3, 50, 5),
(4, 4, 2, 10, 7),
(4, 5, 1, 20, 10),
(5, 2, 3, 300, 4),
(5, 3, 2, 50, 7),
(5, 5, 1, 20, 30);
