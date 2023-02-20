import React from 'react'; 
import { Menubar } from 'primereact/menubar';
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";


const TRMenu = () => {
    const items = [
        {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            url: '/new'
        },
        {
            label: 'Stats',
            icon: 'pi pi-fw pi-chart-bar',
        },
        {
            label: 'Profile',
            icon: 'pi pi-fw pi-user',
        },
        {
            label: 'Logout',
            icon: 'pi pi-fw pi-power-off'
        },
        {
            label: 'User',
            icon: 'pi pi-fw pi-eye',
            url: '/patient'
        }
    ];

    const start = <img alt="logo" src="l.jpg" height="35" className="logo"></img>;
    // const end = <InputText placeholder="Search" type="text" />;
    const end = "";
    return (
        <div className="card">
            <Menubar model={items} start={start} end={end}/>
        </div>
    );
}

export default TRMenu;