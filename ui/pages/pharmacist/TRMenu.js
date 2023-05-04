import React, {useEffect} from 'react'; 
import { Menubar } from 'primereact/menubar';
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Image } from 'primereact/image';
import Cookies from 'js-cookie'
import { useRouter } from 'next/router';


const TRMenu = () => {
    const router = useRouter();

    const items = [
        {
            label: '',
            icon: 'pi pi-fw pi-plus',
            url: '/pharmacist/add'
        },
        {
            label: 'List',
            icon: 'pi pi-fw pi-user',
            items : [
                {
                    label: 'Patient List'
                },
                {
                    label: 'Prescription List'
                }
            ]
        },
        {
            label: 'Logout',
            icon: 'pi pi-fw pi-power-off',
            command: () => {
                console.log("hi");
                Cookies.remove('jwt');
                Cookies.remove('usertype');
                router.push('/');
            }
        },
    ];

    const start = <Image alt="logo" src="/l.jpg" height="35" className="logo"></Image>;
    // const end = <InputText placeholder="Search" type="text" />;
    const end = "";
    return (
        <div className="card">
            <Menubar model={items} start={start} end={end} className="mb-2"/>
        </div>
    );
}

export default TRMenu;