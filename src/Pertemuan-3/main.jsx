import { createRoot } from "react-dom/client";
import Tailwindcss from "./Tailwindcss";
import "./tailwind.css";
import Typography from "./Typography";
import FlexboxGrid from "./FlexboxGrid";
import UserForm from "./UserForm";
import HitungGajiForm from "./HitungGajiForm";
createRoot(document.getElementById("root"))
    .render(
        <div>
            <Tailwindcss/>
            <Typography />
            <FlexboxGrid />
            <UserForm />
            <HitungGajiForm />
        </div>,
    );