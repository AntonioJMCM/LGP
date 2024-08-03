import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import './Sidebar.scss';

class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: false
        };
    }
    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }
    render() {
        return (
            <Navbar className={'sidebar sticky-top flex-column flex-nowrap justify-content-between ' + (this.state.collapsed ? 'toggled' : '')}>
                <NavbarBrand className="sidebar-brand">
                    <img className="sidebar-avatar" src={this.props.picture} alt="sidebar_avatar"></img>
                </NavbarBrand>
                <div className="text-center d-none d-md-inline">
                    <button className="rounded-circle border-0" id="sidebarToggle" onClick={this.toggleNavbar}></button>
                </div>
                <Nav vertical className="navigation">
                    <NavItem>
                        <NavLink className="d-flex align-items-center" href="#">
                            <i className="fas fa-home fa-fw"></i>
                            <span>Início</span>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="d-flex align-items-center" href="#">
                            <i className="fas fa-user-alt fa-fw"></i>
                            <span>Perfil</span>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="d-flex align-items-center" href="#">
                            <i className="fas fa-history fa-fw"></i>
                            <span>Histórico</span>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="d-flex align-items-center" href="#">
                            <i className="fas fa-graduation-cap fa-fw"></i>
                            <span>Avaliações</span>
                        </NavLink>
                    </NavItem>
                    <NavItem className="mt-auto">
                        <NavLink className="d-flex align-items-center" href="#">
                            <i className="fas fa-sign-out-alt fa-fw"></i>
                            <span>Sair</span>
                        </NavLink>
                    </NavItem>
                </Nav>
            </Navbar>
        );
    }
}

export default Sidebar;