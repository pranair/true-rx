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

    const handleLogin = () => {
        fetch("/api/login/admin", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"password": password })
        }).then(response => response.json())
            .then(response => {
                if (!response["error"]) {
                    console.log(response);
                    localStorage.setItem("currentID", response["access_token"]);
                    localStorage.setItem("currentUserType", "3");
                    Cookies.set('jwt', response["access_token"], { expires: cookieExpire });
                    Cookies.set('usertype', "3", { expires: cookieExpire });
                    router.push("/admin/profile");
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
                <h1 className="text-center">Admin Login</h1>
                <div className='flex flex-column flex justify-content-center align-items-center'>
                    <div className="flex m-3">
                        <span className="p-float-label w-full">
                            <Password onKeyDown={(e) => {if (e.code=='Enter') {handleLogin()}}} id="password" value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} />
                            <label htmlFor="password">Password</label>
                        </span>
                    </div>
                    <Button className='mt-3 w-8' label="Sign In" onClick={(e) => {
                        handleLogin();
                    }} />
                    {error && <p className='text-red-500'>Invalid Credentials</p>}
                </div>
            </div>
        </div>
    );
}