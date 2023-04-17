import React from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import TRMenu from '../TRMenu';
import { Panel } from 'primereact/panel';

export default function App() {
    return (
        <div>
            <TRMenu></TRMenu>
            <Panel header="Profile">
                <h1>Name</h1>
            </Panel>
        </div>
    );
}