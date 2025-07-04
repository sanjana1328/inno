import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NavigationBar from '../components/Navbar';
import { Hourglass as HourglassSplit, Clock } from 'lucide-react';

const PendingApprovalPage = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="pending-approval-page">
      <NavigationBar />
      
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-sm border-0 text-center">
              <Card.Body className="p-5">
                <div className="rounded-circle bg-warning bg-opacity-10 p-4 d-inline-flex mb-4">
                  <HourglassSplit size={64} className="text-warning" />
                </div>
                
                <h2 className="mb-3 fw-bold">Registration Pending Approval</h2>
                
                <p className="text-muted mb-4">
                  Thank you for registering with Innovest! Your application is currently being reviewed by our admin team. 
                  You'll receive a notification once your account has been approved.
                </p>
                
                <div className="d-flex align-items-center justify-content-center mb-4">
                  <Clock size={20} className="text-secondary me-2" />
                  <span className="text-secondary">Typical approval time: 24-48 hours</span>
                </div>
                
                {currentUser && (
                  <div className="bg-light p-3 rounded mb-4">
                    <h5>Registration Details</h5>
                    <p className="mb-1"><strong>Name:</strong> {currentUser.firstName} {currentUser.lastName}</p>
                    <p className="mb-1"><strong>Email:</strong> {currentUser.email}</p>
                    <p className="mb-1"><strong>Role:</strong> {currentUser.role === 'investor' ? 'Investor' : 'Innovator'}</p>
                    <p className="mb-0"><strong>Status:</strong> <span className="badge bg-warning">Pending</span></p>
                  </div>
                )}
                
                <div className="d-flex flex-column gap-2">
                  <Link to="/login" className="btn btn-outline-secondary">
                    Back to Login
                  </Link>
                  <button onClick={logout} className="btn btn-link text-muted">
                    Logout
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PendingApprovalPage;