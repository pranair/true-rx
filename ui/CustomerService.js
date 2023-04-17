import React, { useState, useEffect } from 'react';

export const CustomerService = {
        getData() {
            return [
                {
                    id: 1000,
                    name: '1000',
                    country: {
                        name: '18/11/2022',
                        code: 'dz'
                    },
                    company: 'Doc',
                    date: '2015-09-13',
                    status: 'not given',
                    verified: true,
                    activity: 17,
                    representative: {
                        name: 'Doc',
                        image: 'ionibowcher.png'
                    },
                    balance: 70663
                },
                {
                    id: 1001,
                    name: '1000',
                    country: {
                        name: '18/11/2022',
                        code: 'dz'
                    },
                    company: 'Doc',
                    date: '2015-09-13',
                    status: 'not given',
                    verified: true,
                    activity: 17,
                    representative: {
                        name: 'Doc',
                        image: 'ionibowcher.png'
                    },
                    balance: 70663
                },
                {
                    id: 1002,
                    name: '1000',
                    country: {
                        name: '18/11/2022',
                        code: 'dz'
                    },
                    company: 'Doc',
                    date: '2015-09-13',
                    status: 'not given',
                    verified: true,
                    activity: 17,
                    representative: {
                        name: 'Doc',
                        image: 'ionibowcher.png'
                    },
                    balance: 70663
                },
                {
                    id: 1003,
                    name: '1000',
                    country: {
                        name: '18/11-2022',
                        code: 'dz'
                    },
                    company: 'Doc',
                    date: '2015-09-13',
                    status: 'not given',
                    verified: true,
                    activity: 17,
                    representative: {
                        name: 'Doc',
                        image: 'ionibowcher.png'
                    },
                    balance: 70663
                },
                {
                    id: 1004,
                    name: '1000',
                    country: {
                        name: '18/11/2022',
                        code: 'dz'
                    },
                    company: 'Doc',
                    date: '2015-09-13',
                    status: 'not given',
                    verified: true,
                    activity: 17,
                    representative: {
                        name: 'Doc',
                        image: 'ionibowcher.png'
                    },
                    balance: 70663
                },
            ];
        },

        getCustomersSmall() {
            return Promise.resolve(this.getData().slice(0, 10));
        },

        getCustomersMedium() {
            return Promise.resolve(this.getData().slice(0, 50));
        },

        getCustomersLarge() {
            return Promise.resolve(this.getData().slice(0, 200));
        },

        getCustomersXLarge() {
            return Promise.resolve(this.getData());
        },

        getCustomers(params) {
            const queryParams = params
                ? Object.keys(params)
                      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                      .join('&')
                : '';

            return fetch('https://www.primefaces.org/data/customers?' + queryParams).then((res) => res.json());
        }
    };
    