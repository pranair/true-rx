import React from 'react'; 
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import TRMenu from "../../TRMenu";
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function App() {

    return (
        <div>
            <TRMenu></TRMenu>
            <Card>
                <h1 className='text-center'>Prescription</h1>
                <br></br>
                <h2>Name Surname, 23</h2>
                <h2>27.02.2023</h2>
                
                <DataTable className='mb-3' showGridlines tableStyle={{ minWidth: '50rem' }}>
                    <Column field="code" header="Code"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="category" header="Category"></Column>
                    <Column field="quantity" header="Quantity"></Column>
                </DataTable>

                <Card title="Notes">
                    <p className="m-0">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae 
                        numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
                    </p>
                </Card>
            </Card>
        </div>
    );
}