import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Modifypage.css'


function ModifyPage() {
    const [details, setDetails] = useState([["Loading...", ""]]);
    const [valid, setValidity] = useState(false);
    const [popup, setPopup] = useState(false);
    const [popupDetails, setPopupDetails] = useState([["", ""]]);

    useEffect(() => {
        const url = 'http://localhost:8000/getall';
        fetch(url)
            .then(res => res.json())
            .then(res => {
                console.log(res['data'].length);
                if (res['data'].length > 0) {
                    setDetails(res['data']);
                    setValidity(true);
                }
                else {
                    setValidity(false);
                    setDetails([["No data", ""]]);
                }
            })
    }, [popup]);

    const dataHandler = (e) => {
        if (e[1].length == 0) return;
        console.log(e);
        setPopupDetails(e);
        setPopup(true);
    }

    const exitPopup = () => {
        setPopupDetails([["", ""]]);
        setPopup(false);
    }


    return (
        <div className="modify">
            <div className="modify-blur">
                <h1>Registered Users:</h1>
                <div className="table">
                    <table id="modify-table" style={{ "border-bottom-left-radius": (!valid) ? "0" : "30px", "border-bottom-right-radius": (!valid) ? "0" : "30px" }}>
                        <tr id="table-heads">
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                        {details.map((detail) => {
                            return (
                                <tr className="table-data" style={{ "text-align": (!valid) ? "end" : "center" }} onClick={() => dataHandler(detail)}>
                                    <td>{detail[0]}</td>
                                    <td>{detail[1]}</td>
                                </tr>
                            );
                        })}
                    </table>
                    {(popup) ? <Popup handleClose={exitPopup} details={popupDetails} /> : null}
                </div>
            </div>
        </div>
    );
}


function Popup(props) {

    const [edit, setEdit] = useState(false);
    const [nameEdit, setNameEdit] = useState(props.details[0]);
    const [emailEdit, setEmailEdit] = useState(props.details[1]);

    const notify = (msg, status) => {
        if (status == 0) {
            toast.success(msg);
        }
        else {
            toast.error(msg);
        }
    };

    const editHandler = () => {

        if (!edit) {
            setEdit(!edit);
            return
        }
        const url = 'http://localhost:8000/editvalue';
        const data = new FormData();
        data.append('newName', nameEdit);
        data.append('newEmail', emailEdit);
        data.append('oldName', props.details[0]);
        data.append('oldEmail', props.details[1]);

        fetch(url,
            {
                method: 'POST',
                body: data
            })
            .then(res => res.json())
            .then(res => {
                console.log(res);// debug
                if (res['status'] == 'ok') {
                    notify("Updated successfully", 0);
                } else {
                    notify("Error updating", 1);
                    setEdit(!edit);
                }
            })
    }


    const deleteHandler = () => {
        const url = 'http://localhost:8000/deletevalue';
        const data = new FormData();
        data.append('name', props.details[0]);
        data.append('email', props.details[1]);

        fetch(url,
            {
                method: 'POST',
                body: data
            })
            .then(res => res.json())
            .then(res => {
                console.log(res);// debug
                if (res['status'] == 'ok') {
                    notify("Deleted successfully", 0);
                    props.handleClose();
                } else {
                    notify("Error deleting", 1);
                }
            }
            );
    }



    return (
        <div className="popup-blur">
            <div className="popup-box">
                <span id="heading-wrapper">
                    <h1 id="details-heading">Details</h1>
                    <span className="close-icon" onClick={props.handleClose}>x</span>
                </span>
                {(!edit) ?
                    <span id="details-wrapper">
                        <p className="details-sect"><span id="name-heading">Name: </span>{props.details[0]}</p>
                        <p className="details-sect"><span id="email-heading">Email: </span>{props.details[1]}</p>
                    </span>
                    :
                    <span id="details-wrapper">
                        <p className="details-sect"><span id="name-heading">Name: </span><input type='text' value={nameEdit} onChange={(e) => setNameEdit(e.target.value)} className='popup-input' /></p>
                        <p className="details-sect"><span id="email-heading">Email: </span><input type='text' value={emailEdit} onChange={(e) => setEmailEdit(e.target.value)} className='popup-input' /></p>
                    </span>}
                <span id="button-wrapper">
                    <button className="buttons" id="edit-button" onClick={editHandler}>{(!edit) ? "Edit" : "Save"}</button>
                    <button className="buttons" id="delete-button" onClick={deleteHandler}>Delete</button>
                </span>
                <ToastContainer style={{ position: 'absolute', color: "white" }} position="bottom-center" autoClose={3000} newestOnTop={true} pauseOnHover={true} />
            </div>
        </div>
    );
}

export default ModifyPage;