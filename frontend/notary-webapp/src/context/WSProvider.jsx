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
        console.log('WS: ', ws)
        if (ws === null || (ws && ws.readyState >= 2)) {
            const w = new WebSocket('wss://fv7jlocwbk.execute-api.us-east-1.amazonaws.com/dev');
            w.onopen = function () {
                console.log("Connecting...");
                setWS(() => w);
            };
            w.onclose = function (evt) {
                console.log("I'm sorry. Bye!");
                setWS(() => null);
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
                setWS(() => null);
            };
        }
    }, [ws]);

    const join = async (orderID, publicKey, signature, role) => {
        await ws.send(
            JSON.stringify({
                order_id: orderID,
                action: 'join',
                data: {
                    public_key: publicKey,
                    signature: signature,
                    role: role,
                },
            })
        );
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

    const ceremonyAction = async (orderID, publicKey, signature, action) => {
        await ws.send(
            JSON.stringify({
                order_id: orderID,
                action: `ceremony-${action}`,
                data: {
                    public_key: publicKey,
                    signature: signature,
                },
            })
        );
    }

    const value = useMemo(
        () => ({
            ws,
            msgs,
            join,
            sendMessage,
            ping,
            ceremonyAction,
        }),
        [ws, msgs]
    )

    return <WSContext.Provider value={value}>{children}</WSContext.Provider>
}
