import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import TRMenu from "../TRMenu.js";
import { ProgressSpinner } from 'primereact/progressspinner';

export default function BasicDemo() {
    const [visible, setVisible] = useState(false);
    const [qrval, setQRVal] = useState('');
    const [resolved, setResolved] = useState(false);
    const footerContent = (
        <div className="progress_outer">
            {/*<ProgressBar mode="indeterminate" style={{ height: '6px', width:'30%', }}></ProgressBar>*/}
        </div>
    );

    const loadQRValue = () => {
        fetch('/api/patient/gen_qr', {
            headers: {
            'Accept': 'application/json'
        }})
        .then(response => response.json())
        .then(response => {
            setResolved(true);
            setQRVal(response["id"]);
        })
    }



    useEffect(() => {
        loadQRValue();
    }, []);

    const TRQRCode = () => {
        console.log(qrval)
        if (resolved == true) {
            return (                
                <div id="qr-code" style={{ height: "auto", margin: "0 auto", maxWidth: 128, width: "100%" }}>
                    <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={qrval}
                    viewBox={`0 0 256 256`}/>
                </div>
            );
        } else {
            return (
            <div id="qr-code"style={{ height: "auto", margin: "0 auto", maxWidth: 128, width: "100%" }}>
                <ProgressSpinner/>     
            </div>
            );
        }
    }
    
    const SSE = () => {
        var eventSource = new EventSource("http://127.0.0.1:5000/api/patient/verify_qr/" + qrval);
            eventSource.onmessage = function(e) {
            alert(e.data);
        };
    }

    return (
        <div>
            <TRMenu></TRMenu>
            <div className="card flex justify-content-center">
                <Button className="absolute top-50" label="Scan QR" icon="pi pi-external-link" onClick={() => setVisible(true)} />
                <Dialog className="text-center" header="Scan this QR from your device" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent} draggable={false}>
                        <TRQRCode/>
                        <SSE/>
                </Dialog>
            </div>
        </div>
    )
}