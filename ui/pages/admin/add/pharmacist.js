import React, { useState, useEffect } from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Card } from 'primereact/card';
import TRMenu from '../../TRMenu';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import { InputTextarea } from 'primereact/inputtextarea';


const BasicCard = () => {
    const [address, setAddress] = useState("")
    const router = useRouter();

    return (
        <div className="overflow-hidden m-8">
            <h1 className="m-2 px-5 py-3">Pharmacist</h1>
            <div className="flex">
                <div className="flex-1 align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText id="pharmacist-name" type="text" placeholder="Name" className="min-w-full" />
                </div>
                <div className="flex-auto align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText placeholder="Pharmacy Name" id="pharmacist-pharmacy" className="min-w-full" />
                </div>
            </div>
            <div className="flex">
                <div className="flex-auto align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText id="pharmacist-phone" type="text" placeholder="Phone" className="w-full" />
                </div>
                <div className="flex-auto align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText id="pharmacist-email" type="text" placeholder="E-Mail" className="w-full" />
                </div>
            </div>
            <div className="flex">
                <div className="flex-auto align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText id="pharmacist-license" type="text" placeholder="License Number" className="w-full" />
                </div>
                <div className="flex-auto align-items-center justify-content-center m-2 px-5 py-3">
                    <InputText id="pharmacist-password" type="text" placeholder="Password" className="w-full" />
                </div>
            </div>
            <div className="flex">
                <div className="flex-auto align-items-center justify-content-center m-2 px-5 py-3">
                    <InputTextarea placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} rows={3} cols={30} className="w-full" />
                </div>
            </div>
            <div className="flex align-items-center justify-content-center">
                <Button label="Add" className="w-20rem m-5 p-3" onClick={(e) => {
                    const name = document.getElementById("pharmacist-name").value;
                    const phone = document.getElementById("pharmacist-phone").value;
                    const email = document.getElementById("pharmacist-email").value;
                    const license = document.getElementById("pharmacist-license").value;
                    const password = document.getElementById("pharmacist-password").value;
                    const pharmacy = document.getElementById("pharmacist-pharmacy").value;


                    // TODO: highlight red for empty or invalid values

                    const values = {
                        "name": name,
                        "password": password,
                        "phone": phone,
                        "email": email,
                        "address": address,
                        "license": license,
                        "pharmacy": pharmacy
                    };

                    console.log(values);

                    const jwt = localStorage.getItem("currentID");
                    fetch("/api/pharmacist", {
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
                            router.push("/admin/profile");
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