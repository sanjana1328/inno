import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import NavigationBar from '../components/Navbar';
import { VALIDATION } from '../config';

const RegisterPage = () => {
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      await authRegister({
        ...data,
        role
      });
      
      toast.success('Registration successful! Awaiting admin approval.');
      navigate('/pending-approval');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Role-specific form fields
  const renderRoleSpecificFields = () => {
    if (role === 'investor') {
      return (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Investment Focus</Form.Label>
            <Form.Select
              {...register('investmentFocus', { required: 'Investment focus is required' })}
              isInvalid={!!errors.investmentFocus}
            >
              <option value="">Select investment focus</option>
              <option value="tech">Technology</option>
              <option value="health">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="energy">Energy</option>
              <option value="consumer">Consumer Products</option>
              <option value="other">Other</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.investmentFocus?.message}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Investment Range</Form.Label>
            <Form.Select
              {...register('investmentRange', { required: 'Investment range is required' })}
              isInvalid={!!errors.investmentRange}
            >
              <option value="">Select investment range</option>
              <option value="seed">Seed ($10K - $100K)</option>
              <option value="angel">Angel ($100K - $500K)</option>
              <option value="seriesA">Series A ($500K - $2M)</option>
              <option value="seriesB">Series B ($2M - $10M)</option>
              <option value="seriesC">Series C ($10M+)</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.investmentRange?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </>
      );
    } else if (role === 'innovator') {
      return (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Industry</Form.Label>
            <Form.Select
              {...register('industry', { required: 'Industry is required' })}
              isInvalid={!!errors.industry}
            >
              <option value="">Select industry</option>
              <option value="software">Software</option>
              <option value="hardware">Hardware</option>
              <option value="biotech">Biotech</option>
              <option value="fintech">Fintech</option>
              <option value="cleantech">CleanTech</option>
              <option value="ecommerce">E-commerce</option>
              <option value="other">Other</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.industry?.message}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Project Stage</Form.Label>
            <Form.Select
              {...register('projectStage', { required: 'Project stage is required' })}
              isInvalid={!!errors.projectStage}
            >
              <option value="">Select project stage</option>
              <option value="concept">Concept</option>
              <option value="prototype">Prototype</option>
              <option value="mvp">MVP</option>
              <option value="market">In Market</option>
              <option value="scaling">Scaling</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.projectStage?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </>
      );
    }
    
    return null;
  };

  return (
    <div className="register-page">
      <NavigationBar />
      
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4 p-md-5">
                <h2 className="text-center mb-4 fw-bold">Join Innovest</h2>
                
                {error && <Alert variant="danger">{error}</Alert>}
                
                {!role ? (
                  <div className="text-center">
                    <h4 className="mb-4">I am a...</h4>
                    <Row className="g-3">
                      <Col md={6}>
                        <Card 
                          className="h-100 p-4 custom-card"
                          onClick={() => setRole('investor')}
                          style={{ cursor: 'pointer' }}
                        >
                          <Card.Body className="text-center">
                            <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex mb-3">
                              <svg width="32" height="32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.5 6.5h11v11h-11v-11Z"></path>
                                <path d="m21 2-7.5 7.5"></path>
                                <path d="m15.5 7.5 3 3L22 7l-3-3"></path>
                                <path d="M4.783 19.043 2.542 21.27a.3.3 0 0 0 .211.514h9.495a.3.3 0 0 0 .211-.514l-2.226-2.226"></path>
                                <path d="M14.74 11.265 21 17.5"></path>
                                <path d="M8.502 5 3 10.588"></path>
                              </svg>
                            </div>
                            <h5>Investor</h5>
                            <p className="text-muted mb-0">
                              Looking to fund innovative projects and startups
                            </p>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card 
                          className="h-100 p-4 custom-card"
                          onClick={() => setRole('innovator')}
                          style={{ cursor: 'pointer' }}
                        >
                          <Card.Body className="text-center">
                            <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex mb-3">
                              <svg width="32" height="32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2v5"></path>
                                <path d="M10 7h4"></path>
                                <path d="M5.941 5.941 8.77 8.77"></path>
                                <path d="M2 12h5"></path>
                                <path d="m5.941 18.059 2.829-2.829"></path>
                                <path d="M7 17h10"></path>
                                <path d="M17 12a5 5 0 1 0-5 5"></path>
                              </svg>
                            </div>
                            <h5>Innovator</h5>
                            <p className="text-muted mb-0">
                              Have a great idea or project seeking investment
                            </p>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            type="text"
                            {...register('firstName', { 
                              required: 'First name is required',
                              minLength: {
                                value: VALIDATION.NAME_MIN_LENGTH,
                                message: `First name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`
                              },
                              maxLength: {
                                value: VALIDATION.NAME_MAX_LENGTH,
                                message: `First name cannot exceed ${VALIDATION.NAME_MAX_LENGTH} characters`
                              }
                            })}
                            isInvalid={!!errors.firstName}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.firstName?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            {...register('lastName', { 
                              required: 'Last name is required',
                              minLength: {
                                value: VALIDATION.NAME_MIN_LENGTH,
                                message: `Last name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`
                              },
                              maxLength: {
                                value: VALIDATION.NAME_MAX_LENGTH,
                                message: `Last name cannot exceed ${VALIDATION.NAME_MAX_LENGTH} characters`
                              }
                            })}
                            isInvalid={!!errors.lastName}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.lastName?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    
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
                        {...register('password', { 
                          required: 'Password is required',
                          minLength: {
                            value: VALIDATION.PASSWORD_MIN_LENGTH,
                            message: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`
                          }
                        })}
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        {...register('phone', { 
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[0-9+-\s()]{7,20}$/,
                            message: 'Invalid phone number'
                          }
                        })}
                        isInvalid={!!errors.phone}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Bio</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        {...register('bio', { 
                          required: 'Bio is required',
                          maxLength: {
                            value: VALIDATION.BIO_MAX_LENGTH,
                            message: `Bio cannot exceed ${VALIDATION.BIO_MAX_LENGTH} characters`
                          }
                        })}
                        isInvalid={!!errors.bio}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.bio?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    {renderRoleSpecificFields()}
                    
                    <div className="d-grid gap-2">
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={loading}
                        className="mt-3"
                      >
                        {loading ? 'Registering...' : 'Register'}
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setRole('')}
                        disabled={loading}
                      >
                        Back to Role Selection
                      </Button>
                    </div>
                    
                    <div className="text-center mt-3">
                      <p className="mb-0">
                        Already have an account? <Link to="/login">Login here</Link>
                      </p>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;