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
import { TabView, TabPanel } from 'primereact/tabview';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { AutoComplete } from 'primereact/autocomplete';
import { useRouter } from "next/router";


const handleDoubleClick = (e) => {
    // console.log(e);
}

export default function BasicDemo() {
    const [visible, setVisible] = useState(false);
    const [emailDialogVisible, setEmailDialogVisible] = useState(false);
    const [verifyUserInput, setVerifyUserInput] = useState([]);
    const [verified, setVerified] = useState(false);
    const [username, setUsername] = useState("");
    const [patient_name, setPatientName] = useState("");
    const [tableVisible, setTableVisible] = useState(false);
    const [qrval, setQRVal] = useState('');
    const [resolved, setResolved] = useState(false);
    const [meds, setMed] = React.useState([]);
    const [items, setItems] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [value, setValue] = useState('');
    const [currentMedicineID, setCurrentMedicineID] = useState("");
    const [description_value, setDescriptionValue] = useState("");
    const router = useRouter();


    const search = (event) => {
        fetch('/api/prescription/medicine/get', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "query": event.query })
        })
            .then(response => response.json())
            .then(response => {
                if (response["result"]) {
                    delete response["result"];
                    const temp = [];
                    for (let i in response["data"]) {
                        temp.push(response["data"][i]["brand_name"]);
                    }
                    setSuggestions(response["data"]);
                    setItems(temp);
                }
            })
        // setItems([...Array(10).keys()].map(item => event.query + '-' + item));
    }

    const [data, setData] = useState({});
    const [medication, setMedication] = useState([]);
    const [prescription, setPrescription] = useState([]);

    const footerContent = (
        <div className="progress_outer">
            {/*<ProgressBar mode="indeterminate" style={{ height: '6px', width:'30%', }}></ProgressBar>*/}
        </div>
    );

    const rowDeleteBody = (clicked_row) => {
        return (
            <Button icon="pi pi-times" className=" text-color bg-white border-white" onClick={(e) => {
                // let _meds = [...meds];
                let new_meds = meds.filter(item => item["medication"] != clicked_row["medication"]);
                setMed(new_meds);
            }} />
        )
    }

    const loadQRValue = () => {
        if (!resolved) {
            fetch('/api/patient/gen_qr', {
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(response => response.json())
                .then(response => {
                    setResolved(true);
                    setQRVal(response["id"]);
                })
        }
    }

    const loadUserName = () => {
        if (username != "") {
            const jwt = localStorage.getItem("currentID");
            fetch('/api/patient/email/' + username, {
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
                    setPatientName(response["name"]);
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

    // useEffect(() => {
    //     loadQRValue();
    // }, []);

    useEffect(() => {
        loadUserName();
    }, [username])

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
        var eventSource = new EventSource("/api/patient/verify_qr/" + qrval);
        eventSource.onmessage = function (e) {
            setUsername(e.data);
            // alert(e.data);
            setVisible(false);
            setTableVisible(true);
            setVerified(true);
        };
    }

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
                    setVerified(true);
                    props.setUserID(e.data);
                    eventSource.close();
                }
            };
        }, []);

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

    if (!verified) {
        return (
            <div>
                <TRMenu></TRMenu>
                <div className="card flex justify-content-center">
                    <div className="absolute top-50 flex gap-5">
                        <Button visible={!tableVisible} label="Scan QR" icon="pi pi-external-link" onClick={() => setVisible(true)} />
                        <p>OR</p>
                        <Button visible={!tableVisible} label="Enter Email" icon="pi pi-external-link" onClick={() => setEmailDialogVisible(true)} />
                    </div>
                    <Dialog className="text-center" header="Scan this QR from your device" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent} draggable={false}>
                        {/* <TRQRCode />
                        <SSE /> */}
                        <QRCodeView userID={username} setUserID={setUsername} />
                    </Dialog>
                    <Dialog className="text-center" visible={emailDialogVisible} header="Enter the Email" draggable={false} style={{ width: '50vw' }} onHide={() => setEmailDialogVisible(false)}>
                        {
                            (verifyUserInput == false) ?
                                <div className="flex flex-column align-items-center">
                                    <InputText className="m-5 w-6" id="user-email" />
                                    <Button label="Verify" className="w-4" onClick={(e) => {
                                        const email = document.getElementById("user-email");
                                        const jwt = localStorage.getItem("currentID");
                                        fetch('/api/patient/email/' + email.value, {
                                            method: 'GET',
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json',
                                                'Authorization': 'Bearer ' + jwt
                                            }
                                        })
                                            .then(response => response.json())
                                            .then(response => setVerifyUserInput([response["name"], response["uid"], email.value]));
                                    }} />
                                </div> :
                                <div>
                                    <h3>Name: {verifyUserInput[0]}</h3>
                                    <h3>UID: {verifyUserInput[1]}</h3>
                                    <Button className="m-3" label="Verify" onClick={(e) => {
                                        setUsername(verifyUserInput[2]);
                                        setVerified(true);
                                    }}></Button>
                                </div>
                        }
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
                <Card id="general-tab">
                    <TabView>
                        <TabPanel className="w-full" header="Add">
                            <>
                                <h1 className="flex align-items-center justify-content-center">{patient_name}</h1>
                                <div className="flex align-items-center justify-content-center">
                                    <DataTable selectionMode="single" value={meds} className="w-5 py-8" onRowDoubleClick={handleDoubleClick}>
                                        <Column field="medication" header="Medication ID" className='disable-select'></Column>
                                        <Column field="dosage" header="Dosage" className='disable-select'></Column>
                                        <Column field="frequency" header="Times a day" className='disable-select'></Column>
                                        <Column field="days" header="Total Days" className='disable-select'></Column>
                                        <Column body={rowDeleteBody} header="Actions" >
                                        </Column>
                                    </DataTable>
                                </div>
                                <div className="flex align-items-center justify-content-center">
                                    <div className="flex flex-column gap-3 w-3">
                                        <div className="flex">
                                            {/* <InputText id="patient-med" type="text" placeholder="MedicationID" className="flex-auto h-3rem m-2 px-5 py-3"/> */}
                                            <AutoComplete value={value} onChange={(e) => setValue(e.value)} id="patient-med" type="text" placeholder="MedicationID"
                                                className="flex-auto m-2 h-3rem w-8 w-full" suggestions={items} completeMethod={search} onSelect={(e) => {
                                                    const ret = Object.keys(suggestions).filter(item => suggestions[item]["brand_name"] == e.value)[0];
                                                    setCurrentMedicineID(suggestions[ret]["id"]);
                                                    console.log(suggestions[ret]);
                                                }} />
                                        </div>
                                        <div className="flex ">
                                            <InputText id="patient-dose" type="text" placeholder="Dosage" className="flex-auto h-3rem m-2" />
                                            {/* <Dropdown value={quantity} onChange={(e) => setSeverity(e.value)} options={states} optionLabel="name"
                            placeholder="Severity" className="flex-auto h-3rem m-2 px-5 " /> */}
                                        </div>
                                        <div className="flex ">
                                            <InputText id="patient-freq" type="text" placeholder="Times a Day" className="flex-auto h-3rem m-2" />
                                        </div>
                                        <div className="flex ">
                                            <InputText id="patient-days" type="text" placeholder="Total Day" className="flex-auto h-3rem m-2" />
                                        </div>
                                    </div>
                                    <Button icon="pi pi-plus" className="h-3rem w-3rem align-items-center justify-content-center m-2 px-5 py-3" onClick={(e) => {
                                        // const md = document.getElementById("patient-med");
                                        const freq = document.getElementById("patient-freq");
                                        const dose = document.getElementById("patient-dose");
                                        const days = document.getElementById("patient-days");
                                        if (value != "" && dose.value != "" && freq.value != "" && days.value != "") {
                                            setMed([
                                                ...meds,
                                                {
                                                    "medication": value,
                                                    "dosage": dose.value,
                                                    "frequency": freq.value,
                                                    "days": days.value,
                                                    "id": currentMedicineID
                                                }
                                            ]);
                                            console.log(meds)
                                            setValue("");
                                            freq.value = "";
                                            dose.value = "";
                                            days.value = "";
                                        }
                                    }} />
                                </div>
                                <div className="flex m-6 align-items-center justify-content-center">
                                    <InputTextarea autoResize placeholder="Description" className="w-8" value={description_value} onChange={(e) => { setDescriptionValue(e.target.value) }} rows={4} cols={30} />
                                </div>
                                <div className="flex align-items-center justify-content-center">
                                    <Button label="Done" className="w-20rem m-5 p-3" onClick={(e) => {
                                        const doctor = localStorage.getItem("currentUserID");
                                        const jwt = localStorage.getItem("currentID");
                                        const ret = {
                                            "doctor_email": doctor,
                                            "patient_email": data["email"],
                                            "note": description_value,
                                            "items": {
                                                ...meds
                                            }
                                        }
                                        fetch("/api/prescription/add", {
                                            method: 'POST',
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json',
                                                'Authorization': 'Bearer ' + jwt
                                            },
                                            body: JSON.stringify(ret)
                                        })
                                            .then(response => response.json())
                                            .then(response => {
                                                router.push("/view/prescription/" + response["id"])
                                            });
                                    }} />
                                </div>
                            </>
                        </TabPanel>
                        <TabPanel className="w-full" header={<div>View</div>}>
                            <>
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
                            </>
                        </TabPanel>
                    </TabView>
                </Card>
            </div>
        )
    }
}
