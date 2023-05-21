import React, { useState, useEffect, useMemo } from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Card } from 'primereact/card';
import TRMenu from '../../TRMenu';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Steps } from 'primereact/steps';
import { Dropdown } from 'primereact/dropdown';
import { useRouter } from 'next/router';


const BasicCard = (props) => {
    const [date, setDate] = useState(null);
    const [address, setAddress] = useState("");
    const [name, setName] = useState("");
    const [weight, setWeight] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [uid, setUid] = useState("");
    const [password, setPassword] = useState("");

    useState(() => {
        setAddress(props.values["address"]);
        setName(props.values["name"]);
        setWeight(props.values["weight"]);
        setGender(props.values["gender"]);
        setPhone(props.values["phone"]);
        setEmail(props.values["email"]);
        setUid(props.values["uid"]);
        setPassword(props.values["password"]);
        setDate(new Date(props.values["date"]));
    }, []);

    return (
        <div className="overflow-hidden m-8">
            <h1 className="m-2 px-5 py-3">Patient</h1>
            <div className="flex">
                <div className="flex-1 align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText value={name} id="patient-name" type="text" placeholder="Name" className="min-w-full" />
                </div>
                <div className="flex align-items-center justify-content-center px-5 py-3">
                    <Calendar value={date} placeholder="Date of Birth" onChange={(e) => { console.log(e.value); setDate(e.value) }} />
                </div>
                <div className="flex align-items-center justify-content-center m-2 px-5 py-3 ">
                    <InputText value={weight} id="patient-weight" type="text" placeholder="Weight" className="w-full" />
                </div>
                <div className="flex align-items-center justify-content-center m-2 px-5 py-3 ">
                    <InputText value={gender} id="patient-gender" type="text" placeholder="Gender" className="w-full" />
                </div>
            </div>
            <div className="flex">
                <div className="flex-auto align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText value={phone} id="patient-phone" type="text" placeholder="Phone" className="w-full" />
                </div>
                <div className="flex-auto align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText value={email} id="patient-email" type="text" placeholder="E-Mail" className="w-full" />
                </div>
            </div>
            <div className="flex">
                <div className="flex-auto align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText value={uid} id="patient-uid" type="text" placeholder="UID" className="w-full" />
                </div>
                <div className="flex-auto align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText value={password} id="patient-password" type="text" placeholder="Password" className="w-full" />
                </div>
            </div>
            <div className="flex">
                <div className="flex-auto align-items-center justify-content-center m-2 px-5 py-3">
                    <InputTextarea placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} rows={3} cols={30} className="w-full" />
                </div>
            </div>
            <div className="flex align-items-center justify-content-center">
                <Button label="Add" className="w-20rem m-5 p-3" onClick={(e) => {
                    const name = document.getElementById("patient-name").value;
                    const gender = document.getElementById("patient-gender").value;
                    const phone = document.getElementById("patient-phone").value;
                    const email = document.getElementById("patient-email").value;
                    const weight = document.getElementById("patient-weight").value;
                    const uid = document.getElementById("patient-uid").value;
                    const password = document.getElementById("patient-password").value;

                    // TODO: highlight red for empty or invalid values

                    props.setValues(
                        {
                            ...props.values,
                            "date": date.toUTCString(),
                            "address": address,
                            "name": name,
                            "gender": gender,
                            "phone": phone,
                            "email": email,
                            "weight": weight,
                            "uid": uid,
                            "password": password,
                        }
                    )
                    props.setActiveIndex(1);
                }} />
            </div>
        </div>
    );
}


const AllergiesCard = (props) => {
    const [severity, setSeverity] = useState(null);
    const [allergen, setAllergen] = React.useState({});
    const states = [
        { name: 'Low' },
        { name: 'Medium' },
        { name: 'High' },
        { name: 'None' }
    ];

    useEffect(() => {
        if (props.values["allergies"]) {
            setAllergen(props.values["allergies"]);
        }
    }, []);

    return (
        <div className="flex flex-column overflow-hidden m-8">
            <h1 className="m-2 py-3">Allergies</h1>
            <div className="font-bold flex flex-column text-center">
                {/* <div className="grid m-0 p-0">
                    <div id="test" className="col"><p>Nuts</p></div>
                    <div className="col"><p>High</p></div>
                </div>
                <div className="grid m-0 p-0">
                    <div className="col"><p>Supply</p></div>
                    <div className="col"><p className='text-red-500'>Extremely High</p></div>
                </div> */}
                {/* <AllergenTable data={allergen} /> */}
                {
                    Object.keys(allergen).map((e, i) => (
                        <div className="grid m-0 p-0" key={i}>
                            <div className="col"><p>{e}</p></div>
                            <div className="col"><p className='text-red-500'>{allergen[e]}</p></div>
                        </div>
                    ))
                }
            </div>
            <div className="flex align-items-center justify-content-center">
                <div className="flex w-full">
                    <InputText id="patient-allergen" type="text" placeholder="Allergen" className="flex-auto h-3rem m-2 px-5 py-3" />
                </div>
                <div className="flex w-full">
                    {/* <InputText type="text" placeholder="Severity" className="flex-auto h-3rem m-2 px-5 py-3" /> */}
                    <Dropdown value={severity} onChange={(e) => setSeverity(e.value)} options={states} optionLabel="name"
                        placeholder="Severity" className="flex-auto h-3rem m-2 px-5 " />
                </div>
                <Button icon="pi pi-plus" className="h-3rem w-3rem align-items-center justify-content-center m-2 px-5 py-3" onClick={(e) => {
                    const al = document.getElementById("patient-allergen").value;
                    if (severity.name == 'None') {
                        const temp = allergen;
                        delete temp[al];
                        console.log(temp);
                        setAllergen({ ...temp });
                    } else {
                        setAllergen({
                            ...allergen,
                            [al]: severity.name,
                        });
                    }
                }} />
            </div>
            <div className="flex align-items-center justify-content-center">
                <Button label="Add" className="w-20rem m-5 p-3" onClick={(e) => {
                    props.setValues(
                        {
                            ...props.values,
                            "allergies": {
                                ...allergen
                            }
                        }
                    );
                    props.setActiveIndex(2);
                }} />
            </div>
        </div>
    );
}

export default function App() {
    const [values, setValues] = useState({});
    const [activeIndex, setActiveIndex] = useState(0);
    const [patientNote, setPatientNote] = useState("");
    const [sendData, setSendData] = useState(false);
    const items = [
        {
            label: 'Basic'
        },
        {
            label: 'Allergies'
        },
        {
            label: 'Notes'
        }
    ];
    const router = useRouter();

    useEffect(() => {
        if (sendData) {
            const jwt = localStorage.getItem("currentID");
            fetch("/api/patient", {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                },
                body: JSON.stringify(values)
            })
                .then(response => response.json())
                .then(response => {
                    setSendData(false);
                    router.push("/view/patient/" + response["pid"])
                })
        }
    }, [sendData]);

    if (activeIndex == 0) {
        return (
            <div>
                <TRMenu></TRMenu>
                <Card title="" header={<Steps readOnly={false} className='pt-3' model={items} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} />}>
                    <BasicCard values={values} setValues={setValues} setActiveIndex={setActiveIndex} />
                </Card>
            </div>
        );
    } else if (activeIndex == 1) {
        return (
            <div>
                <TRMenu></TRMenu>
                <Card title="" header={<Steps className='pt-3' model={items} activeIndex={activeIndex} onSelect={(e) => { setActiveIndex(e.index) }} readOnly={false} />}>
                    <AllergiesCard values={values} setValues={setValues} setActiveIndex={setActiveIndex} />
                </Card>
            </div>
        );
    } else {
        return (
            <div>
                <TRMenu></TRMenu>
                <Card title="" header={<Steps className='pt-3' model={items} activeIndex={activeIndex} onSelect={(e) => { setActiveIndex(e.index) }} readOnly={false} />}>
                    <div className='flex flex-column align-items-center gap-5 px-8 m-8'>
                        <InputTextarea id="patient-note" value={patientNote} onChange={(e) => setPatientNote(e.target.value)} rows={7} cols={80} />
                        <Button className='w-4' label='Add Patient' onClick={(e) => {
                            const note = document.getElementById("patient-note").value;
                            setValues(
                                {
                                    ...values,
                                    "notes": patientNote.split("\n")
                                }
                            );
                            setSendData(true);
                        }} />
                    </div>
                </Card>
            </div>
        );
    }
}