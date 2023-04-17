import {useState} from 'react';
import TRMenu from "../TRMenu.js";
import { QrReader } from 'react-qr-reader';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';

const Test = (props) => {
    const [data, setData] = useState('No result');
    const [name, setName] = useState('prath');
    const [value, setValue] = useState('');
    var x = [];

    const handleChange = (e) => {
    	setValue(e.target.value);
       	setName(e.target.value);
    }

    return (
        <>
        <Card>
        <QrReader
        className="progress_outer video-padding"
        onResult={(result, error) => {
            if (!!result) {
            	setData(result?.text);
            	const name = document.getElementById("input-text").value
                fetch('/api/patient/addq', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({"queue": result?.text, "id": name})
                });
            }

            // if (!!error) {
            //     console.log(error);
            // }
        }}
        style={{ width: '100%' }}
        constraints={{
            facingMode: 'environment'
        }}
        />
        <InputText id="input-text" className="progress_outer" value={value} onChange={handleChange} />
        <p className="progress_outer">{data}</p>
        </Card>
        </>
    );
}

export default function Home() {
    // fetch('/api/patient/addq', {
        //     method: 'POST',
        //     headers: {
            //         'Accept': 'application/json',
            //         'Content-Type': 'application/json'
            //     },
        //     body: JSON.stringify({"queue": "LAM2X5", "id": "prath"})
        // });
    return (
        <div>
        <TRMenu></TRMenu>
        <Test/>
        </div>
    );
}
