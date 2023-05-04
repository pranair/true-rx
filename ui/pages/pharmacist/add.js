import React, { useState, useEffect, useCallback } from "react";
import QRCode from "react-qr-code";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import TRMenu from "./TRMenu";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from "primereact/card";
import { InputTextarea } from 'primereact/inputtextarea';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'next/router';
import { ConfirmPopup } from 'primereact/confirmpopup'; // To use <ConfirmPopup> tag
import { confirmPopup } from 'primereact/confirmpopup'; // To use confirmPopup method
import { io } from "socket.io-client";

const id_generator = (size = 6, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') => {
    var result = '';
    var charactersLength = chars.length;
    for (var i = 0; i < size; i++) {
        result += chars.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


const QRCodeView = (props) => {
    const [randomID, setRandomID] = useState("");

    useEffect(() => {
        fetch(`/api/verify_user?create=${randomID}`);
        let eventSource = new EventSource(`/api/verify_user?poll=${randomID}`);
        eventSource.onmessage = function (e) {
            if (e.data) {
                // setVerified(true);
                props.setUserID(e.data);
                eventSource.close();
            }
        };
    }, [props.userID, randomID, props]);

    if (randomID == "") {
        setRandomID(id_generator());
    }

    return (
        <div id="qr-code" style={{ height: "auto", margin: "0 auto", maxWidth: 128, width: "100%" }}>
            <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={randomID}
                viewBox={`0 0 256 256`} />
        </div>
    );
}

// // remove this component
// const QRDialog = (props) => {
//     const [dialogVisible, setDialogVisible] = useState(false);
//     const [visible, setVisible] = useState(false);

//     return (
//         <div className="flex h-screen m-0 p-0 justify-content-center align-items-center">
//             <ConfirmPopup />
//             <Button label="Verify" icon="pi pi-external-link" onClick={(e) => setDialogVisible(true)}></Button>
//             <Dialog className="text-center" header="Scan this QR from your device" visible={dialogVisible} style={{ width: '50vw' }} onHide={() => setDialogVisible(false)} draggable={false}>
//                 <QRCodeView userID={props.userID} setUserID={props.setUserID} />
//             </Dialog>
//         </div>
//     )
// }

function PrescriptionCard(props) {
    const [data, setData] = useState([]);
    const [metadata, setMetadata] = useState({});
    const [rich_editor_text, setRichEditorText] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (data.length == 0 && props.selected) {
            const jwt = localStorage.getItem("currentID");
            fetch('/api/prescription/' + props.selected, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                },
                // body: JSON.stringify({ "id": username, "password": password })
            }).then(response => response.json())
                .then(response => {
                    // use this method and remove "deleting"
                    // const { worth, …newPerson } = person;
                    // console.log(newPerson);
                    const t = [];
                    const { note, date, patient, patient_id, doctor, pharmacist, ...rest } = response;
                    const metadata = { note, date, patient, patient_id, doctor, pharmacist };
                    setRichEditorText(metadata["notes"]);
                    setMetadata(metadata);
                    for (const i in rest) {
                        t.push(rest[i]);
                    }
                    setData(t);
                });
        }
    }, [metadata, data, props.selected]);

    if (props.selected) {
        return (
            <Card>
                <div className='flex align-items-center justify-content-center'>
                    <a href={"/view/patient/" + metadata["patient_id"]} className='no-underline text-color'>
                        <h1 className="mr-4">{metadata["patient"]}</h1>
                    </a>
                    <p className='text-md'>{new Date(metadata["date"]).toDateString()}</p>
                </div>
                <div className="flex lg:m-6 m-0 flex-auto align-items-center justify-content-center">
                    <p className='w-8 disable-select'>
                        {rich_editor_text}
                    </p>
                </div>
                <div className="flex lg:m-6 m-0 flex-auto align-items-center justify-content-center">
                    <DataTable editMode="row" dataKey="id" value={data} className="w-8">
                        <Column field="brand" header="Brand"></Column>
                        <Column field="generic" header="Generic"></Column>
                        <Column field="dosage" header="Dosage"></Column>
                        <Column field="days" header="Days"></Column>
                    </DataTable>
                </div>
                <h3 className="flex align-items-center justify-content-center my-6">Prescription issued by {metadata["doctor"]}</h3>
                <h3 className="flex align-items-center justify-content-center mt-6">{metadata["pharmacist"] && "Medicine issued by " + metadata["pharmacist"]}</h3>
                <div className="flex align-items-center justify-content-center">
                    {metadata["pharmacist"] == null &&
                        <Button label="Done" className="w-20rem m-5 p-3" onClick={() => {
                            const jwt = localStorage.getItem("currentID");
                            fetch('/api/prescription/' + props.selected + "?type=issue", {
                                method: 'PATCH',
                                headers: {
                                    'Accept': 'application/json',
                                    'Authorization': 'Bearer ' + jwt
                                }
                            });
                            props.setSelected("");
                        }} />}
                </div>
            </Card>
        );
    } else {
        return (<></>);
    }
}

function PrescriptionListCard(props) {
    const handleDoubleClick = (e) => {
        props.setSelected(e["data"]["id"]);
    }

    const [data, setData] = useState([]);

    useEffect(() => {
        if (data.length == 0 && props.userID) {
            // const id = localStorage.getItem("currentID");
            const jwt = localStorage.getItem("currentID");
            fetch(`/api/patient/recent/prescriptions?patient=${props.userID}`, {
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
                    for (const i in response) {
                        response[i]["date"] = new Date(response[i]["date"]).toDateString();
                        t.push(response[i]);
                    }
                    setData(t);
                });
        }
    }, [data, props.userID, props.selected]);

    if (!props.selected) {
        return (
            <div>
                <div className='flex flex-wrap'>
                    <div className=' sm:w-screen lg:flex-grow-0 flex-grow-1'>
                        <Card className="" header="">
                            <h1 className='text-center'>Recent Prescriptions of {data[0]?.pname}</h1>
                            <div className='flex flex-column align-items-center'>
                                <DataTable selectionMode="single" value={data} className="w-8 py-8" onRowDoubleClick={handleDoubleClick}>
                                    <Column field="id" header="ID" className='disable-select'></Column>
                                    <Column field="dname" header="Doctor Name" className='disable-select'></Column>
                                    <Column field="date" header="Date" className='disable-select'></Column>
                                    <Column field="status" header="Status" className='disable-select'></Column>
                                </DataTable>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        )
    } else {
        return (<></>);
    }
}

export default function ValidatePrescription() {
    const [userID, setUserID] = useState("");
    const [selectedPrescription, setSelectedPrescription] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            setSelectedPrescription("");
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
    }, [escFunction]);

    if (!userID) {
        return (
            <>
                <TRMenu />
                <div className="flex h-screen justify-content-center align-items-center">
                    <ConfirmPopup />
                    <Button label="Verify" icon="pi pi-external-link" onClick={(e) => setDialogVisible(true)}></Button>
                    <Dialog className="text-center" header="Scan this QR from your device" visible={dialogVisible} style={{ width: '50vw' }} onHide={() => setDialogVisible(false)} draggable={false}>
                        <QRCodeView userID={userID} setUserID={setUserID} />
                    </Dialog>
                </div>
            </>
        )
    } else {
        return (
            <div>
                <TRMenu></TRMenu>
                {/* using key here is a hack. maybe remove this */}
                <PrescriptionListCard key={selectedPrescription+1} userID={userID} selected={selectedPrescription} setSelected={setSelectedPrescription} />
                <PrescriptionCard key={selectedPrescription} userID={userID} selected={selectedPrescription} setSelected={setSelectedPrescription} />
            </div>
        );
    }
}
