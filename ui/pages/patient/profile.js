import React, { use } from 'react';
import { useState, useEffect } from 'react';
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import TRMenu from '../TRMenu';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Panel } from 'primereact/panel';
import { TabView, TabPanel } from 'primereact/tabview';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/router'


const GeneralTab = (props) => {
    const firstName = props.data["name"]?.split(" ")[0];
    const lastName = props.data["name"]?.split(" ")[1];

    return (
        <div className='ml-3'>
            <div className='m-0 p-0'>
                <h2 className=''>Personal Details</h2>
                <div className="grid font-bold text-color-secondary">
                    <div className="col"><p>Last Name</p></div>
                    <div className="col"><p>First Name</p></div>
                    <div className="col"><p>Date of Birth</p></div>
                    <div className="col"><p>Phone Number</p></div>
                </div>
            </div>
            <div className='m-0 p-0'>
                <div className="grid font-bold">
                    <div className="col"><p>{lastName}</p></div>
                    <div className="col"><p>{firstName}</p></div>
                    <div className="col"><p>{new Date(props.data["dob"]).toDateString()}</p></div>
                    <div className="col"><p>{props.data["phone_number"]}</p></div>
                </div>
            </div>
            <div className='m-0 p-0'>
                <div className="grid font-bold text-color-secondary">
                    <div className="col"><p>Email</p></div>
                    <div className="col-9"><p>Address</p></div>
                </div>
            </div>
            <div className='m-0 p-0'>
                <div className="grid font-bold">
                    <div className="col"><p>{props.data["email"]}</p></div>
                    <div className="col-9"><p>{props.data["address"]}</p></div>
                </div>
                <Panel header="Notes" className=''>
                    {
                        props.data["notes"]?.map((e, i) => (
                            <p key={i}>{e}</p>
                        ))
                    }

                </Panel>
            </div>
        </div>
    )
}

const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const ageDifference = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifference);
    const age = ageDate.getUTCFullYear() - 1970;

    return (age > 0) ? age : 0;
};

export default function App() {
    const [data, setData] = useState({});
    const [medication, setMedication] = useState([]);
    const [prescription, setPrescription] = useState([]);

    useEffect(() => {
        if (Object.keys(data).length == 0) {
            const pid = localStorage.getItem("currentUserType");
            const jwt = localStorage.getItem("currentID");

            if (pid == 1) {
                fetch('/api/patient', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwt
                    },
                    // body: JSON.stringify({ "id": username, "password": password })
                }).then(response => response.json())
                    .then(response => {
                        console.log(response);
                        setData(response);
                        let diffDays;
                        let diffTime;
                        let temp = []
                        for (let med in response["medication"]) {
                            let item = response["medication"][med];
                            diffTime = new Date(item["due_date"]).getTime() - new Date().getTime();
                            diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                            item["due_date"] = diffDays;
                            temp.push(response["medication"][med]);
                        }
                        setMedication(temp);
                        temp = [];
                        for (let p in response["prescription"]) {
                            let item = response["prescription"][p];
                            item["date"] = new Date(item["date"]).toDateString();
                            temp.push(item);
                        }
                        setPrescription(temp);
                    });
            }
        }
    }, [data]);

    // TODO: Get rid of these fucking grids
    return (
        <div>
            <TRMenu></TRMenu>
            <div className='flex flex-wrap'>
                <div className='lg:w-2 sm:w-screen lg:flex-grow-0 flex-grow-1 mr-auto'>
                    <Card className="text-center" header="">
                        <div className="flex flex-column align-items-center justify-content-center ">
                            <Avatar label="T" className="mr-2" size="xlarge" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} />
                        </div>
                        <div className="font-bold">
                            <h1 className="m-0 mt-4  mb-2">{data["name"]}</h1>
                            <div className="grid m-0 p-0">
                                <div className="col"><p>Gender</p></div>
                                <div className="col"><p>{data["gender"]}</p></div>
                            </div>

                            <div className="grid m-0 p-0">
                                <div className="col"><p>Age</p></div>
                                <div className="col"><p>{calculateAge(data["dob"])}</p></div>
                            </div>

                            <div className="grid m-0 p-0">
                                <div className="col"><p>Weight</p></div>
                                <div className="col"><p>{data["weight"]}</p></div>
                            </div>
                        </div>
                    </Card>
                    <Card className='text-center mt-3'>
                        <div className="font-bold">
                            <h2 className='mt-0'>Allergies</h2>
                            {
                                data["allergies"]?.map((e, i) => (
                                    <div className="grid m-0 p-0" key={i}>
                                        <div className="col"><p>{e}</p></div>
                                    </div>
                                ))
                            }

                        </div>
                    </Card>
                </div>
                <Card id="general-tab" className='flex-grow-1 m-0 mt-2 lg:mt-0 lg:ml-3 w-9 lg:w-auto'>
                    <TabView>
                        <TabPanel header="General">
                            <GeneralTab data={data} />
                        </TabPanel>
                        <TabPanel header="Prescriptions">
                            <DataTable value={prescription}>
                                <Column style={{ width: '33%' }} field="prescription_id" header="ID"></Column>
                                <Column style={{ width: '33%' }} field="name" header="Doctor"></Column>
                                <Column style={{ width: '33%' }} field="date" header="Date"></Column>
                            </DataTable>
                        </TabPanel>
                        <TabPanel header="Current Medications">
                            <DataTable value={medication}>
                                <Column style={{ width: '33%' }} field="medication_generic_name" header="Name"></Column>
                                <Column style={{ width: '33%' }} field="dosage" header="Dosage"></Column>
                                <Column style={{ width: '33%' }} field="due_date" header="Days Left"></Column>
                            </DataTable>
                        </TabPanel>
                    </TabView>
                </Card>
            </div>
        </div>
    );
}