import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import type { ReactElement } from "react";

const TokenChecker = ({ children }: { children: ReactElement }) => {
    const token = Cookies.get('accessToken')
    if (!token) return <Navigate to="/" />;
    return <>{children}</>;
};

export default TokenChecker;
