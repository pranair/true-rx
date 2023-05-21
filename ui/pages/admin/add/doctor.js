import React, { useState, useEffect } from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Card } from 'primereact/card';
import TRMenu from '../../TRMenu';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';


const BasicCard = () => {

    const router = useRouter();

    return (
        <div className="overflow-hidden m-8">
            <h1 className="m-2 px-5 py-3">Doctor</h1>
            <div className="flex">
                <div className="flex-1 align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText id="doctor-name" type="text" placeholder="Name" className="min-w-full" />
                </div>
                <div className="flex-auto align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText placeholder="Specialization" id="doctor-specialization" className="min-w-full" />
                </div>
            </div>
            <div className="flex">
                <div className="flex-auto align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText id="doctor-phone" type="text" placeholder="Phone" className="w-full" />
                </div>
                <div className="flex-auto align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText id="doctor-email" type="text" placeholder="E-Mail" className="w-full" />
                </div>
                <div className="flex-auto align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText placeholder="Hospital" id="doctor-hospital" className="w-full" />
                </div>
            </div>
            <div className="flex">
                <div className="flex-auto align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText id="doctor-license" type="text" placeholder="License Number" className="w-full" />
                </div>
                <div className="flex-auto align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText id="doctor-password" type="text" placeholder="Password" className="w-full" />
                </div>
            </div>
            <div className="flex align-items-center justify-content-center">
                <Button label="Add" className="w-20rem m-5 p-3" onClick={(e) => {
                    const name = document.getElementById("doctor-name").value;
                    const phone = document.getElementById("doctor-phone").value;
                    const email = document.getElementById("doctor-email").value;
                    const license = document.getElementById("doctor-license").value;
                    const password = document.getElementById("doctor-password").value;
                    const specialization = document.getElementById("doctor-specialization").value;
                    const hospital = document.getElementById("doctor-hospital").value;


                    // TODO: highlight red for empty or invalid values

                    console.log(
                        {
                            "name": name,
                            "password": password,
                            "phone": phone,
                            "email": email,
                            "specialization": specialization,
                            "license": license,
                            "hospital": hospital
                        });

                    const values =  {
                        "name": name,
                        "password": password,
                        "phone": phone,
                        "email": email,
                        "specialization": specialization,
                        "license": license,
                        "hospital": hospital
                    };

                    const jwt = localStorage.getItem("currentID");
                    fetch("/api/doctor", {
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
                            console.log(response);
                            // setSendData(false);
                            // router.push("/view/patient/" + response["pid"])
                        })

                }} />
            </div>
        </div>
    );
}


export default function App() {

    return (
        <div>
            <TRMenu></TRMenu>
            <Card title="">
                <BasicCard />
            </Card>
        </div>
    );
}