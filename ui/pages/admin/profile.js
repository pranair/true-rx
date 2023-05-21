import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import TRMenu from '../TRMenu';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    return (
        <div className='h-screen m-0 p-0 overflow-hidden'>
            <TRMenu />
            <div className='h-full m-0 p-0 flex flex-column gap-4 justify-content-center align-items-center h-full'>
                <a href="/admin/add/doctor"><Button label='Add Doctor' /></a>
                <a href="/admin/add/pharmacist"><Button label='Add Pharmacist' /></a>
            </div>
        </div>
    );
}

export default MyApp;