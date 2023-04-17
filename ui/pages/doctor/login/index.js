import React, { useState } from 'react';
import { Divider } from 'primereact/divider';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'


export default function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter()

    const header = (
        <h1 className='progress_outer pt-3'>Login</h1>
    );

    const footer = (
        <div className="flex flex-wrap justify-content-center gap-2">
            <Button label="Sign in" />
        </div>
    );
    return (
        <Card id="login-box" header={header} className="md:w-5 w-max md:m-0">
            <div className="card">
                <div className="flex flex-column md:flex-row">
                    <div className="w-full md:w-5 flex flex-column align-items-s justify-content-center gap-3 ml-5">
                        <div className="flex flex-wrap justify-content-center align-items-center gap-2 pb-3">
                            <span className="p-float-label">
                                <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                <label htmlFor="username">Username</label>
                            </span>
                        </div>
                        <div className="flex flex-wrap justify-content-center align-items-center gap-2 pb-3">
                            <span className="p-float-label">
                                <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} />
                                <label htmlFor="password">Password</label>
                            </span>
                        </div>
                        <Button label="Login" icon="pi pi-user" className="w-10rem mx-auto flex flex-wrap justify-content-center align-items-center gap-2" onClick={(e) => {
                            fetch('/api/login/doctor', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ "id": username, "password": password })
                            }).then(response => response.json())
                                .then(response => {
                                    console.log(response);
                                    localStorage.setItem("currentID", response["access_token"]);
                                    localStorage.setItem("currentUserType", "0");
                                    Cookies.set('jwt', response["access_token"], {expires:1/1440});
                                    Cookies.set('usertype', "0", {expires:1/1440});
                                    router.push('/doctor/profile');
                                    // localStorage.setItem(username, response["access_token"]);
                                });
                        }}></Button>
                    </div>
                    <div className="w-full md:w-2">
                        <Divider layout="vertical" className="md:flex">
                            <b>OR</b>
                        </Divider>
                    </div>
                    <div className="w-full md:w-5 flex align-items-center justify-content-center py-5">
                        <Button label="Scan QR" icon="pi pi-user-plus" className="p-button-success" onClick={(e) => {

                        }}></Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}