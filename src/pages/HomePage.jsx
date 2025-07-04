import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { TrendingUp, Lightbulb, Users, ArrowRight } from 'lucide-react';
import NavigationBar from '../components/Navbar';

const HomePage = () => {
  return (
    <div className="home-page">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="align-items-center py-5">
            <Col lg={6} className="slide-in">
              <h1 className="display-4 fw-bold mb-4">Connecting Brilliant Ideas with Smart Capital</h1>
              <p className="lead mb-4">
                Innovest is the premier platform where innovators with groundbreaking ideas meet investors looking for the next big opportunity.
              </p>
              <div className="d-flex gap-3">
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="light" 
                  size="lg" 
                  className="fw-semibold"
                >
                  Get Started
                </Button>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-light" 
                  size="lg"
                >
                  Login
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center fade-in d-none d-lg-block">
              <img 
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Innovators and Investors" 
                className="img-fluid rounded shadow-lg" 
                style={{ maxHeight: '400px' }}
              />
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 fw-bold">How Innovest Works</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="custom-card h-100 text-center p-4">
                <Card.Body>
                  <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex mb-3">
                    <Lightbulb size={32} className="text-primary" />
                  </div>
                  <h3 className="h4 mb-3">Innovators</h3>
                  <p className="text-muted">
                    Showcase your innovative ideas and connect with investors who can help bring your vision to life.
                  </p>
                  <Button variant="outline-primary" as={Link} to="/register" className="mt-3">
                    Join as Innovator
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="custom-card h-100 text-center p-4">
                <Card.Body>
                  <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex mb-3">
                    <TrendingUp size={32} className="text-primary" />
                  </div>
                  <h3 className="h4 mb-3">Investors</h3>
                  <p className="text-muted">
                    Discover promising opportunities and connect with innovative entrepreneurs seeking capital and expertise.
                  </p>
                  <Button variant="outline-primary" as={Link} to="/register" className="mt-3">
                    Join as Investor
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="custom-card h-100 text-center p-4">
                <Card.Body>
                  <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex mb-3">
                    <Users size={32} className="text-primary" />
                  </div>
                  <h3 className="h4 mb-3">Admin Mediation</h3>
                  <p className="text-muted">
                    Our team ensures quality connections by vetting all participants before they join the platform.
                  </p>
                  <Button variant="outline-primary" as={Link} to="/register" className="mt-3">
                    Learn More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center mb-5 fw-bold">Success Stories</h2>
          <Row className="g-4">
            <Col md={6}>
              <Card className="custom-card h-100 p-4 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center mb-4">
                    <img 
                      src="https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                      alt="Innovator" 
                      className="rounded-circle me-3" 
                      width="60" 
                      height="60"
                      style={{ objectFit: 'cover' }}
                    />
                    <div>
                      <h5 className="mb-0">Sarah Johnson</h5>
                      <p className="text-muted mb-0">Tech Entrepreneur</p>
                    </div>
                  </div>
                  <p className="mb-0">
                    "Through Innovest, I connected with investors who not only funded my startup but provided valuable mentorship. We've now grown to a team of 25 with customers in 12 countries."
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="custom-card h-100 p-4 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center mb-4">
                    <img 
                      src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                      alt="Investor" 
                      className="rounded-circle me-3" 
                      width="60" 
                      height="60"
                      style={{ objectFit: 'cover' }}
                    />
                    <div>
                      <h5 className="mb-0">Michael Chen</h5>
                      <p className="text-muted mb-0">Angel Investor</p>
                    </div>
                  </div>
                  <p className="mb-0">
                    "Innovest's curation process saves me countless hours. I've invested in three startups through the platform, and two have already exceeded my ROI expectations."
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* CTA Section */}
      <section className="py-5 bg-secondary text-white">
        <Container className="text-center py-4">
          <h2 className="fw-bold mb-4">Ready to Connect?</h2>
          <p className="lead mb-4 mx-auto" style={{ maxWidth: '700px' }}>
            Whether you're an innovator with the next big idea or an investor looking for opportunity, Innovest is your bridge to success.
          </p>
          <Button 
            as={Link} 
            to="/register" 
            variant="light" 
            size="lg" 
            className="fw-semibold d-inline-flex align-items-center"
          >
            Join Innovest Today
            <ArrowRight size={18} className="ms-2" />
          </Button>
        </Container>
      </section>
      
      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <Container>
          <Row>
            <Col md={6}>
              <h5 className="mb-3">Innovest</h5>
              <p className="text-muted">Connecting Brilliant Ideas with Smart Capital since 2023.</p>
            </Col>
            <Col md={6} className="text-md-end">
              <p className="mb-0 text-muted">© 2023 Innovest. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;