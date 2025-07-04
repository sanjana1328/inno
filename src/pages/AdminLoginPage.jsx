import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import NavigationBar from '../components/Navbar';
import { Shield } from 'lucide-react';

const AdminLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      await login(data.email, data.password, 'admin');
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials or ensure you have admin access.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <NavigationBar />
      
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex mb-3">
                    <Shield size={32} className="text-primary" />
                  </div>
                  <h2 className="fw-bold">Admin Login</h2>
                  <p className="text-muted">Access the Innovest administration panel</p>
                </div>
                
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      {...register('password', { required: 'Password is required' })}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={loading}
                      className="mt-3"
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </div>
                  
                  <div className="text-center mt-3">
                    <p className="mb-0">
                      <Link to="/login">Return to user login</Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLoginPage;