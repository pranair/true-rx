import React from 'react';
import { Menubar } from 'primereact/menubar';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Cookies from 'js-cookie'
import { useRouter } from 'next/router';

const TRMenu = () => {
    const router = useRouter();

    const items = [
        {
            label: 'Profile',
            icon: 'pi pi-fw pi-user',
            url: '/'
        },
        {
            label: 'Logout',
            icon: 'pi pi-fw pi-power-off',
            command: () => {
                Cookies.remove('jwt');
                Cookies.remove('usertype');
                router.push('/');
            }
        },
    ];

    const start = <img alt="logo" src="/l.jpg" height="35" className="logo"></img>;
    // const end = <InputText placeholder="Search" type="text" />;
    const end = "";
    return (
        <div className="card">
            <Menubar model={items} start={start} end={end} className="mb-2" />
        </div>
    );
}


export default TRMenu;