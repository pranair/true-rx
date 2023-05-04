import React, { useEffect, useState } from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import TRMenu from '../../TRMenu';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/router'
import { Accordion, AccordionTab } from 'primereact/accordion';

export default function App() {
    const [data, setData] = useState({});
    const [medication, setMedication] = useState([]);
    const [prescription, setPrescription] = useState([]);
    const router = useRouter();


    useEffect(() => {
        if (Object.keys(data).length == 0) {
            const jwt = localStorage.getItem("currentID");
            const { pid } = router.query;

            if (pid != undefined) {
                fetch('/api/patient/' + pid, {
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
    }, [data, prescription, router.query]);

    return (
        <div>
            <TRMenu></TRMenu>
            <Card>
                <div className='text-lg ml-6 mr-6'>
                    <h1 className=''>Patient Details</h1>
                    <div className=''>
                        <div className='m-0 p-0'>
                            <div className="grid font-bold text-color-secondary">
                                <div className="col"><p>First Name</p></div>
                                <div className="col"><p>Last Name</p></div>
                                <div className="col"><p>Date of Birth</p></div>
                                <div className="col"><p>Phone Number</p></div>
                            </div>
                        </div>
                        <div className='m-0 p-0'>
                            <div className="grid font-bold">
                                <div className="col"><p>{data["name"]?.split(" ")[0]}</p></div>
                                <div className="col"><p>{data["name"]?.split(" ")[1]}</p></div>
                                <div className="col"><p>{new Date(data["dob"]).toDateString()}</p></div>
                                <div className="col"><p>{data["phone_number"]}</p></div>
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
                                <div className="col"><p>{data["email"]}</p></div>
                                <div className="col-9"><p>{data["address"]}</p></div>
                            </div>
                        </div>
                    </div>
                    <Accordion activeIndex={0}>
                        <AccordionTab header="Notes">
                            {
                                data["notes"]?.map((e, i) => (
                                    <p key={i}>{e}</p>
                                ))
                            }
                        </AccordionTab>
                        <AccordionTab header="Allergies">
                            <div className="card">
                                {
                                    // data["allergies"]?.map((e, i) => (
                                    //     <div className="grid m-0 p-0" key={i}>
                                    //         <div className="col"><p>{e}</p></div>
                                    //     </div>
                                    // ))
                                    data["allergies"] && Object.keys(data["allergies"])?.map((e, i) => (
                                        <div className="grid m-0 p-0 text-center" key={i}>
                                            <div className="col"><p>{e}</p></div>
                                            <div className="col text-red-600"><p>{data["allergies"][e]}</p></div>
                                        </div>
                                    ))
                                }
                            </div>
                        </AccordionTab>
                        <AccordionTab header="Medication">
                            <DataTable value={medication} className="w-full">
                                <Column field="medication_generic_name" header="Name"></Column>
                                <Column field="dosage" header="Dosage"></Column>
                                <Column field="due_date" header="Days Left"></Column>
                            </DataTable>
                        </AccordionTab>
                    </Accordion>
                </div>
            </Card>
        </div>
    );
}