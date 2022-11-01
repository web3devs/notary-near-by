import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'

const WSContext = createContext({
    ws: null,
    msgs: [],
    join: async (orderID, publicKey, signature) => { console.log('not implemented') },
    sendMessage: async (orderID, message) => { console.log('not implemented') },
    ping: async (orderID) => { console.log('not implemented') },
})

export const useWS = () => useContext(WSContext)

export const WSProvider = ({ children }) => {
    const [ws, setWS] = useState(null);
    const [msgs, setMsgs] = useState([]);

    useEffect(() => {
        if (ws === null) {
            const w = new WebSocket('wss://fv7jlocwbk.execute-api.us-east-1.amazonaws.com/dev');
            w.onopen = function () {
                console.log("Connecting...");
                setWS(w);
            };
            w.onclose = function (evt) {
                console.log("I'm sorry. Bye!");
            };
            w.onmessage = function (evt) {
                if (evt.data !== '') {
                    const a = JSON.parse(evt.data);
                    if (a.action === 'message') {
                        setMsgs(msgs => [...msgs, a.data.message]);
                    }
                }
            };
            w.onerror = function (evt) {
                console.log("ERR: " + evt.data);
                w.close();
            };
        }
    }, [ws]);

    const join = async (orderID, publicKey, signature) => {
        ws.send(
            JSON.stringify({
                order_id: orderID,
                action: 'join',
                data: {
                    public_key: publicKey,
                    signature: signature,
                },
            })
        );
        setJoined(true)
    };

    const sendMessage = async (orderID, message) => {
        setMsgs([...msgs, `> ${message}`])
        await ws.send(
            JSON.stringify({
                order_id: orderID,
                action: "message",
                data: {
                    message: message,
                },
            })
        );
    };

    const ping = async (orderID) => {
        ws.send(JSON.stringify({
            action: 'ping',
            order_id: orderID,
        }));
    };

    const value = useMemo(
        () => ({
            ws,
            msgs,
            join,
            sendMessage,
            ping,
        }),
        [ws]
    )

    return <WSContext.Provider value={value}>{children}</WSContext.Provider>
}
