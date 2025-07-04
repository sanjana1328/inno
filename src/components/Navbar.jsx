import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, Lightbulb, LogOut } from 'lucide-react';

const NavigationBar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const getLogo = () => {
    if (currentUser?.role === 'investor') {
      return <Briefcase className="me-2" size={24} />;
    } else if (currentUser?.role === 'innovator') {
      return <Lightbulb className="me-2" size={24} />;
    } else {
      return (
        <div className="d-flex align-items-center">
          <Briefcase className="me-1" size={20} />
          <Lightbulb className="me-2" size={20} />
        </div>
      );
    }
  };

  const getNavItems = () => {
    if (!currentUser) {
      return (
        <>
          <Nav.Link as={Link} to="/login" className="me-3">Login</Nav.Link>
          <Nav.Link as={Link} to="/register" className="me-3">Register</Nav.Link>
          <Button
            as={Link}
            to="/admin/login"
            variant="outline-primary"
            size="sm"
            className="ms-2"
          >
            Admin Login
          </Button>
        </>
      );
    }
    
    return (
      <>
        {currentUser.role === 'admin' && (
          <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link>
        )}
        {currentUser.role === 'investor' && (
          <Nav.Link as={Link} to="/investor/dashboard">Dashboard</Nav.Link>
        )}
        {currentUser.role === 'innovator' && (
          <Nav.Link as={Link} to="/innovator/dashboard">Dashboard</Nav.Link>
        )}
        <Button 
          variant="outline-danger" 
          size="sm" 
          onClick={handleLogout}
          className="ms-3 d-flex align-items-center"
        >
          <LogOut size={16} className="me-1" />
          Logout
        </Button>
      </>
    );
  };

  return (
    <Navbar expand="lg" className="navbar-custom py-2">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          {getLogo()}
          <span className="fw-bold">Innovest</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="align-items-center">
            {getNavItems()}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;