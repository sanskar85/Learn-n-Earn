import { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { RefreshToken } from "./API"

export const LoginRoute = ({ component: Component, setTitle, ...rest }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            if (isMounted) {
                const logged = await RefreshToken();
                setLoggedIn(logged);
                setLoading(false);
            }
        };
        fetchData();
        return () => { isMounted = false };
    }, []);


    if (loading) {
        return <></>;
    }

    return (
        <Route
            {...rest}
            render={(props) =>
                loggedIn ? (
                    <Redirect to={`/`} />
                ) : (
                    <Component {...props} setTitle={setTitle} />
                )
            }
        />
    )
}


export const InterviewRoute = ({ component: Component, setTitle, ...rest }) => {

    return (
        <Route
            {...rest}
            render={(props) =>
                <Component {...props} setTitle={setTitle} />

            }
        />
    )
}


export const DashboardRoute = ({ component: Component, setTitle, ...rest }) => {
    const [loggedIn, setLoggedIn] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            if (isMounted) {
                const logged = await RefreshToken();
                setLoggedIn(logged);
                setLoading(false);
            }

        };
        fetchData();
        return () => { isMounted = false };
    }, []);

    if (loading) {
        return <></>;
    }
    return (
        <Route
            {...rest}
            render={(props) =>
                !loggedIn ? (
                    <Redirect to={`/login`} />
                ) : (
                    <Component {...props} setTitle={setTitle} />
                )
            }
        />
    )
}


