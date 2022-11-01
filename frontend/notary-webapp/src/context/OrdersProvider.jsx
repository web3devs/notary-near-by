import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const OrdersContext = createContext({
    // isConnected: false,
    // login: () => {
    //     console.error('not implemented')
    // },
    // logout: () => {
    //     console.error('not implemented')
    // }
})

export const useOrders = () => useContext(OrdersContext)

export const OrdersProvider = ({ children }) => {
    

    // useEffect(() => {
    //     if (ws === null) {
    //         const w = new WebSocket('wss://fv7jlocwbk.execute-api.us-east-1.amazonaws.com/dev');
    //         w.onopen = function () {
    //             console.log("Connecting...");
    //             setWS(w);
    //         };
    //         w.onclose = function (evt) {
    //             console.log("I'm sorry. Bye!");
    //         };
    //         w.onmessage = function (evt) {
    //             if (evt.data !== '') {
    //                 const a = JSON.parse(evt.data);
    //                 if (a.action === 'message') {
    //                     setMsgs(msgs => [...msgs, a.data.message]);
    //                 }
    //             }
    //         };
    //         w.onerror = function (evt) {
    //             console.log("ERR: " + evt.data);
    //             w.close();
    //         };

    //     }
    // }, [ws]);


    // useEffect(() => {
    //     registerCallback('auth', () => {
    //         setAccountAddress(getAccountAddress())
    //     })
    //     return () => {
    //         unregisterCallback('auth')
    //     }
    // }, [])
    // const [accountAddress, setAccountAddress] = useState(null)

    // const isConnected = useMemo(() => {
    //     return !!accountAddress
    // }, [accountAddress])

    // const logout = () => {
    //     console.error('not implemented')
    // }

    // const login = () => {
    //     connectToWallet()
    // }

    const create = async () => {
        console.log('Orders: create');
    };

    const getOne = async (id) => {
        console.log(`Orders: get ${id}`);
    };

    const getAll = async () => {
        console.log(`Orders: get all`);
    };

    const getByOwner = async (ownerAddress) => {
        console.log(`Orders: get by owner ${ownerAddress}`);

        const baseURL = 'https://nrsqfdo2y0.execute-api.us-east-1.amazonaws.com'
        const url = `${baseURL}/orders/${ownerAddress}/by-owner`;

        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            // redirect: 'follow', // manual, *follow, error
            // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            // body: JSON.stringify(data) // body data type must match "Content-Type" header
        });

        return response.json();
    };

    const value = useMemo(
        () => ({
            create,
            getOne,
            getAll,
            getByOwner,
        }),
        []
    )

    return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}
