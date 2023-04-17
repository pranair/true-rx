// import {useState} from 'react';
// import {Button} from 'primereact/button';
// import TRMenu from "../TRMenu.js";

// export default function Home() {
//     return (
//         <div>
//             <TRMenu></TRMenu>  
//         </div>
//     );
// }


import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { CustomerService } from '../../CustomerService.js';
import TRMenu from "../TRMenu.js";
import { useRouter } from 'next/router'

export default function CustomStorageDoc(props) {

    const [customers, setCustomers] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    });
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const representatives = [
        { name: "Amy Elsner", image: 'amyelsner.png' },
        { name: "Anna Fali", image: 'annafali.png' },
        { name: "Asiya Javayant", image: 'asiyajavayant.png' },
        { name: "Bernardo Dominic", image: 'bernardodominic.png' },
        { name: "Elwin Sharvill", image: 'elwinsharvill.png' },
        { name: "Ioni Bowcher", image: 'ionibowcher.png' },
        { name: "Ivan Magalhaes", image: 'ivanmagalhaes.png' },
        { name: "Onyama Limba", image: 'onyamalimba.png' },
        { name: "Stephen Shaw", image: 'stephenshaw.png' },
        { name: "XuXue Feng", image: 'xuxuefeng.png' }
    ];
    const statuses = [
        'unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'
    ];
    

    useEffect(() => {
        CustomerService.getCustomersMedium().then(data => setCustomers(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onCustomSaveState = (state) => {
        sessionStorage.setItem('dt-state-demo-custom', JSON.stringify(state));
    }

    const onCustomRestoreState = () => {
        return JSON.parse(sessionStorage.getItem('dt-state-demo-custom'));
    }

    const countryBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="vertical-align-middle disable-select">{rowData.country.name}</span>
            </React.Fragment>
        );
    }

    const representativeBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="vertical-align-middle disable-select">{rowData.representative.name}</span>
            </React.Fragment>
        );
    }

    const representativeFilterTemplate = (options) => {
        return <MultiSelect value={options.value} options={representatives} itemTemplate={representativesItemTemplate} onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" />;
    }

    const representativesItemTemplate = (option) => {
        return (
            <div className="p-multiselect-representative-option">
                <span className="vertical-align-middle disable-select">{option.name}</span>
            </div>
        );
    }

    const statusBodyTemplate = (rowData) => {
        return <span className={`customer-badge status-${rowData.status}` + " disable-select"}>{rowData.status}</span>;
    }

    const statusFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
    }

    const statusItemTemplate = (option) => {
        return <span className={`customer-badge status-${option}` + "disable-select"}>{option}</span>;
    }

    const onGlobalFilterChange = (event) => {
        const value = event.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
    };

    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Global Search"/>
            </span>
        );
    }

    const header = renderHeader();
    const router = useRouter();

    const handleSelection = (e) => {
        router.push("/")
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="vertical-align-middle disable-select">{rowData.id}</span>
            </React.Fragment>
        );
    }
    
    if (props.visible == false) {
        return null;
    }
    return (
        <div>
            <DataTable showGridlines value={customers} paginator rows={10} header={header} filters={filters} onFilter={(e) => setFilters(e.filters)} onRowDoubleClick={handleSelection}
                selection={selectedCustomer} onSelectionChange={e => setSelectedCustomer(e.value)} selectionMode="single" dataKey="id" responsiveLayout="scroll"
                stateStorage="custom" customSaveState={onCustomSaveState} customRestoreState={onCustomRestoreState} emptyMessage="No customers found.">
                <Column field="name" body={nameBodyTemplate} header="ID" sortable filter filterPlaceholder="Search by name"></Column>
                <Column header="Date" body={countryBodyTemplate} sortable sortField="country.name" filter filterField="country.name" filterPlaceholder="Search by country"></Column>
                <Column header="Doctor" body={representativeBodyTemplate} sortable sortField="representative.name" filter filterField="representative" showFilterMatchModes={false} filterElement={representativeFilterTemplate} filterMenuStyle={{ width: '14rem' }}></Column>
                <Column field="status" header="Status" body={statusBodyTemplate} sortable filter filterElement={statusFilterTemplate} filterMenuStyle={{ width: '14rem' }}></Column>
            </DataTable>
        </div>
    );
}