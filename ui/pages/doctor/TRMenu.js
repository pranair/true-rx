import React from 'react'; 
import { Menubar } from 'primereact/menubar';
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";


const TRMenu = () => {
    const items = [
        {
            label: '',
            icon: 'pi pi-fw pi-plus',
            items : [
                {
                    label: 'Patient',
                },
                {
                    label: 'Prescription',
                    url: '/doctor/add/prescription'
                }
            ]
        },
        {
            label: 'Patient List',
            icon: 'pi pi-fw pi-user',
        },
        {
            label: 'Schedule',
            icon: 'pi pi-fw pi-calendar',
        },
        {
            label: 'Logout',
            icon: 'pi pi-fw pi-power-off'
        },
    ];

    const start = <img alt="logo" src="/l.jpg" height="35" className="logo"></img>;
    // const end = <InputText placeholder="Search" type="text" />;
    const end = "";
    return (
        <div className="card">
            <Menubar model={items} start={start} end={end} className="mb-2"/>
        </div>
    );
}

export default TRMenu;