import { Sidebar, Menu, MenuItem, SubMenu, useProSidebar } from "react-pro-sidebar";

import { FaBars, FaHome, FaSearch, FaEdit, FaPlus } from "react-icons/fa"
import './Sidebar.css'
import { Link } from "react-router-dom";
import { useState } from "react";

function Layout() {

    const { collapseSidebar, toggleCollapsed, collapsed } = useProSidebar();
    return <Sidebar defaultCollapsed={true} backgroundColor='rgb(10,20,60)' className='sidebar' style={{ color: 'white', height: '100vh' }} rootStyles={{
        border: 0,
    }}>
        <Menu iconShape="square" className="menu">
            <MenuItem id='menu' onClick={() => collapseSidebar()}><FaBars color="white" /></MenuItem>
            <MenuItem className="menu-item" component={<Link to="/" />} icon={<FaHome className="menu-icon" />}>Home</MenuItem>
            <MenuItem className="menu-item" component={<Link to="/trackme" />} icon={<FaSearch className="menu-icon" />}>Find</MenuItem>
            <MenuItem className="menu-item" component={<Link to="/register" />} icon={<FaPlus className="menu-icon" />}>Register</MenuItem>
            <MenuItem className="menu-item" component={<Link to="/modify" />} icon={<FaEdit className="menu-icon" />}>Manage</MenuItem>
        </Menu>
    </Sidebar >
}

export default Layout;