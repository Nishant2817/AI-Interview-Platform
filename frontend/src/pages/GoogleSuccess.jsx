import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function GoogleSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const token = searchParams.get("token");

        if (token) {
            localStorage.setItem("access_token", token);

            toast.success("Google Login Successful 🎉");

            setTimeout(() => {
                navigate("/dashboard", { replace: true });
        }, 1000);
    } else {
        toast.error("Google Login Failed");
        navigate("/login");
    }
    }, []);

    return <p>Logging in...</p>;
}
