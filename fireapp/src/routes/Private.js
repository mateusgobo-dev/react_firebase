import {useState, useEffect} from "react";
import {auth} from "../firebase";
import {onAuthStateChanged} from "firebase/auth";
import {Navigate} from "react-router-dom";

export default function Private({children}) {
    const [loading, setLoading] = useState(true);
    const [signed, setSigned] = useState(true);

    useEffect(() => {
        async function checkLogin() {
            onAuthStateChanged(auth, (user) => {
                if (!user) {
                    setLoading(false);
                    setSigned(false)
                } else {
                    const userData = {
                        uuid: user.uid,
                        email: user.email,
                    }
                    localStorage.setItem("userData", JSON.stringify(userData))
                    setSigned(true);
                    setLoading(false);
                }
            });
        }
        checkLogin();
    }, []);

    if (loading) {
        return (<div>Loading...</div>);
    }
    if (!signed) {
        return <Navigate to="/"></Navigate>
    }

    return children;
}