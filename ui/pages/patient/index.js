import React from 'react';
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

const Divider = ({ children }) => {
    return (
        <div className="container">
            <div className="border" />
            <span className="content">
                {children}
            </span>
            <div className="border" />
        </div>
    );
};

const GeneralTab = (props) => {
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
                    <div className="col"><p>Renjith</p></div>
                    <div className="col"><p>Thejus</p></div>
                    <div className="col"><p>{props.data["dob"]}</p></div>
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
                <Panel header="Notes" className='mt-5'>
                    <p>{(props.data.notes || [])[0]}</p>
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
    const items = [
        { label: 'General', icon: 'pi pi-fw pi-home' },
        { label: 'Calender', icon: 'pi pi-fw pi-calendar' },
        { label: 'Family', icon: 'pi pi-fw pi-users' },
        { label: 'Prescriptions', icon: 'pi pi-fw pi-file' },
        // { label: 'Notes', icon: 'pi pi-fw pi-pencil' }
    ];
    const [data, setData] = useState({});
    const [date, setDate] = useState(null);

    const loadData = async () => {
        // fetch('/api/patient/15', {
        //     headers: {
        //         'Accept': 'application/json'
        //     }
        // })
        //     .then(response => response.json())
        //     .then(response => {
        //         setData(response);
        //     });
        const resp = await fetch('/api/patient/15');
        const json = await resp.json();
        setData(json);
    }


    useEffect(() => {
        loadData();
    }, []);

    const products = [
        {
            brand: "Dolo",
            name: "Paracetamol",
            strength: "500mg",
            days: "10",
        },
        {
            brand: "Dolo",
            name: "Paracetamol",
            strength: "500mg",
            days: "10",
        },
        {
            brand: "Dolo",
            name: "Paracetamol",
            strength: "500mg",
            days: "10",
        },
        {
            brand: "Dolo",
            name: "Paracetamol",
            strength: "500mg",
            days: "10",
        },
        {
            brand: "Dolo",
            name: "Paracetamol",
            strength: "500mg",
            days: "10",
        },
    ]

    // TODO: Get rid of these fucking grids
    return (
        <div>
            <TRMenu></TRMenu>
            <div className='flex flex-wrap'>
                {/*<MegaMenu className="w-auto" model={items} orientation="vertical" breakpoint="767px" />*/}
                <div className='lg:w-3 sm:w-screen lg:flex-grow-0 flex-grow-1 mr-auto'>
                    <Card className="" header="">
                        <div className="flex flex-column align-items-center justify-content-center ">
                            <Avatar label="T" className="mr-2" size="xlarge" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} />
                        </div>
                        <div className="ml-2 font-bold">
                            <h1 className="m-0 mt-4  mb-2">{data["name"]}</h1>
                            <div className="grid m-0 p-0">
                                <div className="col"><p>Gender</p></div>
                                <div className="col"><p>{data["gender"]}</p></div>
                            </div>

                            <div className="grid m-0 p-0">
                                <div className="col"><p>Age</p></div>
                                <div className="col"><p>{calculateAge(Number(data["age"]))}</p></div> 
                            </div>

                            <div className="grid m-0 p-0">
                                <div className="col"><p>Weight</p></div>
                                <div className="col"><p>{data["weight"]}</p></div>
                            </div>
                        </div>
                    </Card>
                    <Card className='mt-3'>
                        <div className="ml-2 font-bold">
                            <h2 className='mt-0'>Allergies</h2>
                            <div className="grid m-0 p-0">
                                <div className="col"><p>{(data.allergies || [])[0]}</p></div>
                                <div className="col"><p>High</p></div>
                            </div>

                            <div className="grid m-0 p-0">
                                <div className="col"><p>{(data.allergies || [])[1]}</p></div>
                                <div className="col"><p className='text-red-500'>Extremely High</p></div>
                            </div>
                        </div>
                    </Card>
                </div>
                <Card id="general-tab" className='flex-grow-1 m-0 mt-2 lg:mt-0 lg:ml-3 w-9 lg:w-auto'>
                    <TabView>
                        <TabPanel header="General">
                            <GeneralTab data={data} />
                        </TabPanel>
                        <TabPanel header="Calender">
                            <div className=" flex justify-content-center">
                                <Calendar value={date} className="w-full border-transparent" onChange={(e) => setDate(e.value)} inline showWeek />
                            </div>
                        </TabPanel>
                        <TabPanel header="Prescriptions">
                            <div className="card">
                                <DataTable value={products}>
                                    <Column field="brand" header="Brand Name"></Column>
                                    <Column field="name" header="Generic Name"></Column>
                                    <Column field="strength" header="Strength"></Column>
                                    <Column field="days" header="Days"></Column>
                                </DataTable>
                            </div>
                        </TabPanel>
                    </TabView>
                </Card>
            </div>
        </div>
    );
}