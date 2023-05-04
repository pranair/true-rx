import React, { use, useEffect, useState } from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import TRMenu from '../../TRMenu';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/router';
import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';


export default function App() {
    const [data, setData] = useState([]);
    const [metadata, setMetadata] = useState({});
    const [is_doctor, setIsdoctor] = useState(false);
    const [rich_editor_text, setRichEditorText] = useState("");
    const [editDescription, setEditDescription] = useState(false)
    const router = useRouter();
    const { pid } = router.query;

    const onRowEditComplete = (e) => {
        const newData = e["newData"]
        const index = e["index"]
        console.log(newData);
        const jwt = localStorage.getItem("currentID");
        fetch('/api/prescription/' + pid + "?type=medication", {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify(newData)
        });
        data[index] = newData;
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    useEffect(() => {
        if (data.length == 0 && pid != undefined) {
            setIsdoctor(localStorage.getItem("currentUserType") == '0');
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
                    console.log(response);
                    const t = [];
                    const metadata = {}
                    metadata["notes"] = response["note"];
                    metadata["date"] = response["date"];
                    metadata["patient"] = response["patient"];
                    metadata["patient_id"] = response["patient_id"];
                    metadata["doctor"] = response["doctor"];
                    metadata["pharmacist"] = response["pharmacist"];
                    setRichEditorText(metadata["notes"]);
                    delete response["note"];
                    delete response["date"];
                    delete response["patient"];
                    delete response["doctor"];
                    delete response["patient_id"];
                    delete response["pharmacist"]
                    setMetadata(metadata);
                    for (const i in response) {
                        t.push(response[i]);
                    }
                    setData(t);
                });
        }
    }, [is_doctor, metadata, data, pid]);

    return (
        <div>
            <TRMenu></TRMenu>
            <Card>
                <div className='flex align-items-center justify-content-center'>
                    <a href={"/view/patient/" + metadata["patient_id"]} className='no-underline text-color'>
                        <h1 className="mr-4 hover:text-600">{metadata["patient"]}</h1>
                    </a>
                    <p className='text-md'>{metadata["date"] && new Date(metadata["date"]).toDateString()}</p>
                </div>
                <div className="flex lg:m-6 m-0 flex-auto align-items-center justify-content-center">
                    <Tooltip target=".description" content={'Edit'} />
                    {
                        !editDescription &&
                        <p className='w-8 disable-select hover:text-600' onDoubleClick={(e) => {
                            console.log(e);
                            if (is_doctor)
                                setEditDescription(true);
                        }}>
                            {rich_editor_text}
                        </p>
                    }
                </div>
                {
                    editDescription &&
                    <div className="flex flex-column flex-wrap justify-content-center align-items-center gap-3 mt-3">
                        <InputTextarea value={rich_editor_text} onChange={(e) => setRichEditorText(e.target.value)} rows={10} cols={80} />
                        <div className='flex gap-4'>
                            <Button type="submit" label="Save" onClick={(e) => {
                                setEditDescription(false);
                                const jwt = localStorage.getItem("currentID");
                                fetch('/api/prescription/' + pid + "?type=note", {
                                    method: 'PATCH',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + jwt
                                    },
                                    body: JSON.stringify({ "note": rich_editor_text })
                                });
                            }} />
                            <Button label="Cancel" onClick={(e) => {
                                setEditDescription(false);
                            }} />
                        </div>
                    </div>
                }
                <div className="flex lg:m-6 m-0 flex-auto align-items-center justify-content-center">
                    <DataTable editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} value={data} className="w-8">
                        <Column field="brand" header="Brand"></Column>
                        <Column field="generic" header="Generic"></Column>
                        <Column editor={(options) => textEditor(options)} field="dosage" header="Dosage"></Column>
                        <Column editor={(options) => textEditor(options)} field="days" header="Days"></Column>
                        {is_doctor && <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>}
                    </DataTable>
                </div>
                <div className="flex align-items-center justify-content-center">
                    {/* <Button label="Done" className="w-20rem m-5 p-3" /> */}
                </div>
                <h3 className="flex align-items-center justify-content-center my-5">Prescription issued by {metadata["doctor"]}</h3>
                <h3 className="flex align-items-center justify-content-center mt-6">{metadata["pharmacist"] && "Medication issued by " + metadata["pharmacist"]}</h3>
            </Card>
        </div>
    );
}