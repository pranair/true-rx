import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import TRMenu from '../TRMenu';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import Link from 'next/link';

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    return (
        <div className='h-screen m-0 p-0 overflow-hidden'>
            <TRMenu />
            <div className='h-full m-0 p-0 flex flex-column gap-4 justify-content-center align-items-center h-full'>
                <Link href="/admin/add/doctor"><Button label='Add Doctor' /></Link>
                <Link href="/admin/add/pharmacist"><Button label='Add Pharmacist' /></Link>
            </div>
        </div>
    );
}

export default MyApp;