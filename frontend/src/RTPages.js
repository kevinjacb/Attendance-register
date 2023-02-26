import React, { useState, useRef } from "react";
import "./RTPages.css";
import { FaUpload } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function _Track() {

    const [imageUrl, setImageUrl] = useState('./images/avatar.png');
    const [file, setFile] = useState(null);
    const [subState, setSubState] = useState(false);
    const [{ name, email }, setDetails] = useState({ name: '', email: '' });

    const searchFor = (e) => {
        e.preventDefault();
        console.log("Searching");
        const url = 'http://localhost:8000/findmatch';

        const data = new FormData();
        data.append('image', file);

        fetch(url, {
            method: 'POST',
            body: data
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                const key = Object.keys(res)[0];
                const value = res[key];
                if (key === 'success') {
                    toast.success(value);
                    setSubState(true);
                    setDetails({ name: res['name'], email: res['email'] });
                }
                else {
                    toast.error(value);
                    setSubState(false);
                    setDetails({ name: '', email: '' });
                }
            });
    }

    const uploadHandler = (e) => {
        e.preventDefault();
        // console.log("Upload button clicked"); // debug
        const nfile = e.target.files[0];
        console.log(nfile.type);
        setFile(nfile);
        setImageUrl(URL.createObjectURL(nfile));
    }

    return <div className="track">
        <div className="track-blur">
            <div className="track-components">
                <div id='track-img-container'>
                    <img className="hover-item-img" id="avatar" src={imageUrl} alt="avatar" />
                    <label htmlFor="track-img-inp" id="track-img-overlay" className="hover-item-overlay"><FaUpload /></label>
                    <input id="track-img-inp" name="image-input" type="file" style={{ display: 'none' }} onChange={uploadHandler}></input>
                </div>
                <text id="track-button" type='button' onClick={searchFor}>FIND ME</text>
                <Link to="/register" id="track-to-register" >REGISTER</Link>
            </div>

            <ToastContainer style={{ position: 'absolute', color: "white" }} position="bottom-center" autoClose={3000} newestOnTop={true} pauseOnHover={true} />
            {subState ? <DisplayDetails title="USER DETAILS:" name={name} email={email} image={imageUrl} /> : null}
        </div>
    </div>

}

function _Register() {


    const [imageUrl, setImageUrl] = useState('./images/avatar.png');
    const fileInpRef = useRef(null);
    const [subState, setSubState] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const notify = (msg, status) => {
        if (status == 0)
            toast.success(msg, { position: toast.POSITION.BOTTOM_CENTER, autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: false, progress: undefined, });
        else
            toast.error(msg, { position: toast.POSITION.BOTTOM_CENTER, autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: false, progress: undefined, })
    };
    const registerHandler = (e) => {
        e.preventDefault();
        console.log("Register button clicked",);
        const formdata = new FormData();
        const file = fileInpRef.current.files[0];

        if (name.length == 0 || email.length == 0 || file == undefined) {
            notify("Please fill all the fields", 1);
            return;
        }


        formdata.append('name', name);
        formdata.append('email', email);
        formdata.append('uimage', file, file.name);

        const url = 'http://localhost:8000/uploadimage';
        fetch(url, {
            method: 'POST',
            body: formdata
        })
            .then(res => res.json())
            .then(data => {
                const key = Object.keys(data)[0];
                const value = Object.values(data)[0];
                console.log(key)
                if (key === 'success') {
                    notify("Successfully registered ", 0);
                    setSubState(0); // 0 means success
                } else if (key === 'error') {
                    notify(value, 1);
                    setSubState(1); // 1 means error
                }
            }
            )

    }

    const uploadHandler = (e) => {
        e.preventDefault();
        console.log("Upload button clicked");
        setImageUrl(URL.createObjectURL(fileInpRef.current.files[0]));
    }

    return <div className="register">
        <div className="register-blur">
            <div className="register-components">

                <div id='register-img-container'>
                    <img className="register-components hover-item-img" id="avatar" src={imageUrl} alt="avatar" />
                    <label htmlFor="register-img-inp" id="register-img-overlay" className="hover-item-overlay"><FaUpload /></label>
                    <input id="register-img-inp" type="file" name="image" onChange={uploadHandler} style={{ display: 'none' }} ref={fileInpRef}></input>
                </div>
                <form id="register-form" onSubmit={registerHandler}>
                    <input className="register-text-input" type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} /><br></br>
                    <input className="register-text-input" type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    <input id='register-button' type="submit" value="REGISTER" />
                </form>
                <Link to="/trackme" id="register-to-track">FIND ME</Link>
            </div>
            <ToastContainer style={{ position: 'absolute', color: "white" }} position="bottom-center" autoClose={3000} newestOnTop={true} pauseOnHover={true} />
            {(subState == 0) ? <DisplayDetails title="REGISTERED DETAILS:" name={name} email={email} image={imageUrl} /> : null}
        </div>
    </div>
}


function DisplayDetails(props) {
    return <div className="details">
        <div className="details-components">
            <h1 color="white" id="details-title">{props.title}</h1>
            {(props.image != undefined) ? <img src={props.image} alt="avatar" id="details-img" /> : null}
            <p><span id="details-name-heading">NAME: </span><span id="details-name">{props.name}</span></p>
            <p><span id="details-email-heading">EMAIL: </span><span id="details-email">{props.email}</span></p>
            <p></p>
        </div>
    </div>
}


export const Track = _Track;
export const Register = _Register;