import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import './Topbar.scss';

class Topbar extends Component {
  render() {
    return (
      <Navbar expand="md" className="header">
        <NavbarBrand>
          <h1>Perfil</h1>
        </NavbarBrand>
        <Nav className="ml-auto d-flex align-items-center" navbar>
          <NavItem>
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2" />
              <div className="input-group-append">
                <button className="btn btn-primary" type="button" id="button-addon2">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </NavItem>
          <NavItem className="mr-2 ml-4">
            <NavLink href="#" className="float-right" id="userDropdown" aria-expanded="false">
              <i className="fas fa-bell fa-fw"></i>
              <span className="badge">1</span>
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default Topbar;