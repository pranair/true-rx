import React, { useEffect, useState } from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import TRMenu from '../../TRMenu';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/router'


export default function App() {
    const [data, setData] = useState([]);
    const [metadata, setMetadata] = useState({});
    const router = useRouter();
    const { pid } = router.query;

    useEffect(() => {
        if (data.length == 0 && pid != undefined) {
            const jwt = localStorage.getItem("currentID");

            fetch('/api/prescription/' + pid, {
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
                    const metadata = {}
                    metadata["notes"] = response["note"];
                    metadata["date"] = response["date"];
                    metadata["patient"] = response["patient"];
                    delete response["note"];
                    delete response["date"];
                    delete response["patient"];
                    setMetadata(metadata);
                    for (const i in response) {
                        t.push(response[i]);
                    }
                    setData(t);
                });
            console.log(data);
        }
    });

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

    return (
        <div>
            <TRMenu></TRMenu>
            <Card>
                <div className='flex align-items-center justify-content-center'>
                    <h1 className="mr-4">{metadata["patient"]}</h1>
                    <p className='text-md'>{metadata["date"]}</p>
                </div>
                <div className="flex lg:m-6 m-0 flex-auto align-items-center justify-content-center">
                    <p className='w-8'>
                        {metadata["notes"]}
                    </p>
                </div>
                <div className="flex lg:m-6 m-0 flex-auto align-items-center justify-content-center">
                    <DataTable value={data} className="w-8">
                        <Column field="brand" header="Brand"></Column>
                        <Column field="generic" header="Generic"></Column>
                        <Column field="strength" header="Strength"></Column>
                        <Column field="days" header="Days"></Column>
                    </DataTable>
                </div>
                <div className="flex align-items-center justify-content-center">
                    <Button label="Done" className="w-20rem m-5 p-3" />
                </div>
            </Card>
        </div>
    );
}