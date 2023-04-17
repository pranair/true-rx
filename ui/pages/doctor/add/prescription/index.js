import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import TRMenu from "../../TRMenu";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from "primereact/card";
import { InputTextarea } from 'primereact/inputtextarea';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';

const handleDoubleClick = (e) => {
    console.log(e);
}

export default function BasicDemo() {
    const [visible, setVisible] = useState(false);
    const [verified, setVerified] = useState(false);
    const [tableVisible, setTableVisible] = useState(false);
    const [qrval, setQRVal] = useState('');
    const [resolved, setResolved] = useState(false);
    const [meds, setMed] = React.useState([]);

    const footerContent = (
        <div className="progress_outer">
            {/*<ProgressBar mode="indeterminate" style={{ height: '6px', width:'30%', }}></ProgressBar>*/}
        </div>
    );

    const loadQRValue = () => {
        if (!resolved) {
            fetch('/api/patient/gen_qr', {
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(response => response.json())
                .then(response => {
                    console.log(resolved);
                    setResolved(true);
                    setQRVal(response["id"]);
                })
        }
    }

    const loadUserName = () => {
        fetch('/api/patient', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            }
        }).then(response => response.json())
        .then(response => {
            console.log(response["name"]);
        });
    }

    useEffect(() => {
        loadQRValue();
    }, []);

    const TRQRCode = () => {
        if (resolved == true) {
            return (
                <div id="qr-code" style={{ height: "auto", margin: "0 auto", maxWidth: 128, width: "100%" }}>
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={qrval}
                        viewBox={`0 0 256 256`} />
                </div>
            );
        } else {
            return (
                <div id="qr-code" style={{ height: "auto", margin: "0 auto", maxWidth: 128, width: "100%" }}>
                    <ProgressSpinner />
                </div>
            );
        }
    }

    const SSE = () => {
        var eventSource = new EventSource("http://127.0.0.1:5000/api/patient/verify_qr/" + qrval);
        eventSource.onmessage = function (e) {
            alert(e.data);
            setVisible(false);
            setTableVisible(true);
        };
    }

    if (!verified) {
        return (
            <div>
                <TRMenu></TRMenu>
                <div className="card flex justify-content-center">
                    <Button visible={!tableVisible} className="absolute top-50" label="Scan QR" icon="pi pi-external-link" onClick={() => setVisible(true)} />
                    <Dialog className="text-center" header="Scan this QR from your device" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent} draggable={false}>
                        <TRQRCode />
                        <SSE />
                    </Dialog>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <TRMenu></TRMenu>
                {/* <div className="card flex justify-content-center">
                <Button visible={!tableVisible} className="absolute top-50" label="Scan QR" icon="pi pi-external-link" onClick={() => setVisible(true)} />
                <Dialog className="text-center" header="Scan this QR from your device" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent} draggable={false}>
                        <TRQRCode/>
                        <SSE/>
                </Dialog>
            </div> */}
                <Card>
                    <h1 className="flex align-items-center justify-content-center">Mr. Renjith</h1>
                    <div className="flex align-items-center justify-content-center">
                        <DataTable selectionMode="single" value={meds} className="w-5 py-8" onRowDoubleClick={handleDoubleClick}>
                            <Column field="medication" header="Medication ID" className='disable-select'></Column>
                            <Column field="dosage" header="Dosage" className='disable-select'></Column>
                            <Column field="frequency" header="Times a day" className='disable-select'></Column>
                            <Column field="days" header="Total Days" className='disable-select'></Column>
                        </DataTable>
                    </div>
                    <div className="flex align-items-center justify-content-center">
                        <div className="w-3">
                            <div className="flex">
                                <InputText id="patient-med" type="text" placeholder="MedicationID" className="flex-auto h-3rem m-2 px-5 py-3" />
                            </div>
                            <div className="flex ">
                                <InputText id="patient-dose" type="text" placeholder="Dosage" className="flex-auto h-3rem m-2 px-5 py-3" />
                                {/* <Dropdown value={quantity} onChange={(e) => setSeverity(e.value)} options={states} optionLabel="name"
                            placeholder="Severity" className="flex-auto h-3rem m-2 px-5 " /> */}
                            </div>
                            <div className="flex ">
                                <InputText id="patient-freq" type="text" placeholder="Times a Day" className="flex-auto h-3rem m-2 px-5 py-3" />
                            </div>
                            <div className="flex ">
                                <InputText id="patient-days" type="text" placeholder="Total Day" className="flex-auto h-3rem m-2 px-5 py-3" />
                            </div>
                        </div>
                        <Button icon="pi pi-plus" className="h-3rem w-3rem align-items-center justify-content-center m-2 px-5 py-3" onClick={(e) => {
                            const md = document.getElementById("patient-med");
                            const freq = document.getElementById("patient-freq");
                            const dose = document.getElementById("patient-dose");
                            const days = document.getElementById("patient-days");
                            setMed([
                                ...meds,
                                {
                                    "medication": md.value,
                                    "dosage": dose.value,
                                    "frequency": freq.value,
                                    "days": days.value
                                }
                            ]);
                            md.value = "";
                            freq.value = "";
                            dose.value = "";
                            days.value = "";
                        }} />
                    </div>
                    <div className="flex m-6 align-items-center justify-content-center">
                        <InputTextarea autoResize placeholder="Description" className="w-8" value={""} onChange={(e) => setValue(e.target.value)} rows={4} cols={30} />
                    </div>
                    <div className="flex align-items-center justify-content-center">
                        <Button label="Done" className="w-20rem m-5 p-3" />
                    </div>
                </Card>
            </div>
        )
    }
}