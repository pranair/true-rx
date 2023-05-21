import React, { use, useState } from 'react';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

export default function Home() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [active, setActive] = useState([true, false, false]);
    const [error, setError] = useState(false);
    // let cookieExpire = 1 / 48;
    let cookieExpire = 0.5;
    const router = useRouter();
    const apiLinks = [
        "/api/login/doctor",
        "/api/login/patient",
        "/api/login/pharmacist"
    ];
    const profileLinks = [
        "/doctor/profile",
        "/patient/profile",
        "/pharmacist"
    ];

    const handleLogin = () => {
        fetch(apiLinks[active.indexOf(true)], {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "id": username, "password": password })
        }).then(response => response.json())
            .then(response => {
                if (!response["error"]) {
                    console.log(response);
                    localStorage.setItem("currentID", response["access_token"]);
                    localStorage.setItem("currentUserType", active.indexOf(true).toString());
                    localStorage.setItem("currentUserID", username);
                    Cookies.set('jwt', response["access_token"], { expires: cookieExpire });
                    Cookies.set('usertype', active.indexOf(true).toString(), { expires: cookieExpire });
                    router.push(profileLinks[active.indexOf(true)]);
                } else {
                    console.log("error");
                    setError(true);
                }
                // localStorage.setItem(username, response["access_token"]);
            });
    }

    return (
        <div className="flex justify-content-center align-items-center text-center">
            <div className='h-full mt-8 pt-5'>
                <h1 className="text-center">Login</h1>
                <div className='flex m-4'>
                    <div className=''>
                        <Avatar size="large" className="m-4 mb-0 p-overlay-badge" image="/doctor.svg" onClick={(e) => {
                            setActive([true, false, false]);
                        }}>
                            {active[0] && <Badge icon="pi pi-check" value="✓" />}
                        </Avatar>
                        <p className='m-0 mb-3 text-color-secondary'>Doctor</p>
                    </div>
                    <div>
                        <Avatar size="large" className="m-4 mb-0 p-overlay-badge" image="/patient.svg" onClick={(e) => {
                            setActive([false, true, false]);
                        }}>
                            {active[1] && <Badge icon="pi pi-check" value="✓" />}
                        </Avatar>
                        <p className='m-0 mb-3 text-color-secondary'>Patient</p>
                    </div>
                    <div>
                        <Avatar size="large" className="m-4 mb-0 p-overlay-badge" image="/pharmacist.svg" onClick={(e) => {
                            setActive([false, false, true]);
                        }}>
                            {active[2] && <Badge icon="pi pi-check" value="✓" />}
                        </Avatar>
                        <p className='m-0 mb-3 text-color-secondary'>Pharmacist</p>
                    </div>
                </div>
                <div className='flex flex-column flex justify-content-center align-items-center'>
                    <div className="flex m-3">
                        <span className="p-float-label">
                            <InputText onKeyDown={(e) => {if (e.code=='Enter') {handleLogin()}}} className='w-20rem ' id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            <label htmlFor="username">Username</label>
                        </span>
                    </div>
                    <div className="flex m-3">
                        <span className="p-float-label w-full">
                            <Password onKeyDown={(e) => {if (e.code=='Enter') {handleLogin()}}} id="password" value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} />
                            <label htmlFor="password">Password</label>
                        </span>
                    </div>
                    <Button className='mt-3 w-8' label="Sign In" onClick={(e) => {
                        console.log(apiLinks[active.indexOf(true)]);
                        handleLogin();
                    }} />
                    {error && <p className='text-red-500'>Invalid Credentials</p>}
                    {/* {active[1] && <a className='mt-4 no-underline text-primary-500 hover:text-primary-700' href="google.com">Create an Account</a>} */}
                </div>
            </div>
        </div>
    );
}