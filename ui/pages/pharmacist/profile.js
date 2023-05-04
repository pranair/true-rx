import React, { useEffect, useState } from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import TRMenu from './TRMenu';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/router'

export default function App() {
    const router = useRouter()

    const handleDoubleClick = (e) => {
        // console.log(e);
        router.push("/view/prescription/" + e["data"]["id"])
    }

    const [data, setData] = useState([]);
    let items = [
        { label: 'New', icon: 'pi pi-fw pi-plus' },
        { label: 'Delete', icon: 'pi pi-fw pi-trash' }
    ];

    useEffect(() => {
        if (data.length == 0) {
            // const id = localStorage.getItem("currentID");
            const jwt = localStorage.getItem("currentID");

            fetch('/api/pharmacist/recent/prescriptions', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                },
                // body: JSON.stringify({ "id": username, "password": password })
            }).then(response => response.json())
                .then(response => {
                    const t = [];
                    console.log(response);
                    for (const i in response) {
                        response[i]["date"] = new Date(response[i]["date"]).toDateString();
                        t.push(response[i]);
                    }
                    setData(t);
                });
        }
    });

    return (
        <div>
            <TRMenu></TRMenu>
            <div className='flex flex-wrap'>
                <div className=' sm:w-screen lg:flex-grow-0 flex-grow-1'>
                    <Card className="" header="">
                        <h1 className='text-center'>Recent Prescriptions</h1>
                        <div className='flex flex-column align-items-center'>
                            <DataTable selectionMode="single" value={data} className="w-8 py-8" onRowDoubleClick={handleDoubleClick}>
                                <Column field="id" header="ID" className='disable-select'></Column>
                                <Column field="name" header="Patient Name" className='disable-select'></Column>
                                <Column field="date" header="Date" className='disable-select'></Column>
                                <Column field="status" header="Status" className='disable-select'></Column>
                            </DataTable>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}