import { useRouter } from 'next/router'
import { useEffect } from 'react';

function MyApp() {
    const router = useRouter();
    useEffect(() => {
        router.push("/patient/profile");
    })

}

export default MyApp
