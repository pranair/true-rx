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
        
    }, []);

    return (
        <div>
            <TRMenu></TRMenu>
            <Card>
                <div className='text-lg ml-6 mr-6'>
                    <h1 className=''>Doctor Details</h1>
                    <div className=''>
                        <div className='m-0 p-0'>
                            <div className="grid font-bold text-color-secondary">
                                <div className="col"><p>First Name</p></div>
                                <div className="col"><p>Last Name</p></div>
                                <div className="col"><p>Email</p></div>
                                <div className="col"><p>Specialization</p></div>
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
                                <div className="col"><p>License Number</p></div>
                                <div className="col-9"><p>Hospital Name</p></div>
                            </div>
                        </div>
                        <div className='m-0 p-0'>
                            <div className="grid font-bold">
                                <div className="col"><p>{data["email"]}</p></div>
                                <div className="col-9"><p>{data["address"]}</p></div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </Card>
        </div>
    );
}