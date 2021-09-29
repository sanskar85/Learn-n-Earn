import {  useEffect, useState } from "react";
import { LogoIcon, UserIcon } from "../assets/Images";
import "./NavigationBar.css"
import $ from "jquery";
import { MyProfile,FetchImage } from "../controllers/API";

const NavigationBar = () => {
    const [name,setName] = useState("");
    const [photo,setPhoto] = useState("");
    useEffect(() => {
        let mounted = true;
        function displayClock() {
            if (mounted) {
                var display = new Date().toLocaleTimeString();
                $("#time").text(display);
                setTimeout(displayClock, 1000);
            }
        }
        async function fetchName() {
            const data = await MyProfile();
            if (mounted) {
                setName(data.profile.name);
                setPhoto(data.profile.photo);
            }
        }
        displayClock();
        fetchName();
        return () => {
            mounted = false;
        }
    }, [])
    return (
        <div className="navigation-wrapper justify-content-between">
            <span><LogoIcon className="logo" /></span>
            <div className="menu-wrapper">
                <span className="nav-menu" id="time"></span>
                <span className="nav-menu"><UserIcon src={FetchImage(photo)} style={{width:"30px",height:"30px",borderRadius:"100%"}} className="nav-menu-icon" />{name}</span>
            </div>
        </div>

    );
}
export default NavigationBar;