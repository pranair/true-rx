import React, { useState, setState } from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Card } from 'primereact/card';
import TRMenu from '../TRMenu';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Steps } from 'primereact/steps';
import { Dropdown } from 'primereact/dropdown';


const BasicCard = (props) => {
    const [date, setDate] = useState(null);
    const [value, setValue] = useState("");

    return (
        <div className="overflow-hidden m-8">
            <h1 className="m-2 px-5 py-3">Patient</h1>
            <div className="flex">
                <div className="flex-1 align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText id="patient-name" type="text" placeholder="Name" className="min-w-full" />
                </div>
                <div className="flex align-items-center justify-content-center px-5 py-3">
                    <Calendar value={date} placeholder="Date of Birth" onChange={(e) => setDate(e.value)} />
                </div>
                <div className="flex align-items-center justify-content-center m-2 px-5 py-3 ">
                    <InputText id="patient-gender" type="text" placeholder="Gender" className="w-full" />
                </div>
            </div>
            <div className="flex">
                <div className="flex-auto align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText id="patient-phone" type="text" placeholder="Phone" className="w-full" />
                </div>
                <div className="flex-auto align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText id="patient-email" type="text" placeholder="E-Mail" className="w-full" />
                </div>
            </div>
            <div className="flex">
                <div className="flex-auto align-items-center justify-content-center m-2 px-5 py-3">
                    <InputTextarea placeholder="Address" value={value} onChange={(e) => setValue(e.target.value)} rows={2} cols={30} className="w-full" />
                </div>
            </div>
            <div className="flex align-items-center justify-content-center">
                <Button label="Add" className="w-20rem m-5 p-3" onClick={(e) => {
                    const name = document.getElementById("patient-name").value;
                    const gender = document.getElementById("patient-gender").value;
                    const phone = document.getElementById("patient-phone").value;
                    const email = document.getElementById("patient-email").value;

                    props.setValues(
                        {
                            ...props.values,
                            "date": date.toString(),
                            "address": value,
                            "name": name,
                            "gender": gender,
                            "phone": phone,
                            "email": email
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
        { name: 'High' }
    ];

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
                    setAllergen({
                        ...allergen,
                        [al]: severity.name,
                    });
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
                    console.log(props.values);
                }} />
            </div>
        </div>
    );
}

export default function App() {
    const [values, setValues] = useState({});
    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {
            label: 'Basic'
        },
        {
            label: 'Allergies'
        }
    ];


    if (activeIndex == 0) {
        return (
            <div>
                <TRMenu></TRMenu>
                <Card title="" header={<Steps className='pt-3' model={items} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />}>
                    <BasicCard values={values} setValues={setValues} setActiveIndex={setActiveIndex} />
                </Card>
            </div>
        );
    } else {
        return (
            <div>
                <TRMenu></TRMenu>
                <Card title="" header={<Steps className='pt-3' model={items} activeIndex={activeIndex} onSelect={(e) => { setActiveIndex(e.index) }} readOnly={false} />}>
                    <AllergiesCard values={values} setValues={setValues} setActiveIndex={setActiveIndex} />
                </Card>
            </div>
        );
    }
}