import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Table, ListGroup, Modal } from 'react-bootstrap';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import NavigationBar from '../components/Navbar';
import { API_URL } from '../config';
import { Lightbulb, User, PlusCircle, MessageCircle, BarChart2, Briefcase, Heart, Mail } from 'lucide-react';

const InnovatorDashboard = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="innovator-dashboard">
      <NavigationBar />
      
      <Container fluid>
        <Row>
          <Col md={3} lg={2} className="sidebar py-4">
            <div className="d-flex flex-column">
              <h5 className="px-3 mb-4">Innovator Dashboard</h5>
              
              <Link to="/innovator/dashboard" className="sidebar-link mb-2">
                <BarChart2 size={18} className="me-2" />
                Overview
              </Link>
              
              <Link to="/innovator/dashboard/projects" className="sidebar-link mb-2">
                <Lightbulb size={18} className="me-2" />
                My Projects
              </Link>
              
              <Link to="/innovator/dashboard/messages" className="sidebar-link mb-2">
                <MessageCircle size={18} className="me-2" />
                Messages
              </Link>
              
              <Link to="/innovator/dashboard/profile" className="sidebar-link mb-2">
                <User size={18} className="me-2" />
                My Profile
              </Link>
            </div>
          </Col>
          
          <Col md={9} lg={10} className="py-4">
            <Routes>
              <Route index element={<InnovatorOverview />} />
              <Route path="projects" element={<InnovatorProjects />} />
              <Route path="messages" element={<InnovatorMessages />} />
              <Route path="profile" element={<InnovatorProfile />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const InnovatorOverview = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/innovator/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };
  
  const totalLikes = projects.reduce((sum, project) => sum + project.likes.length, 0);
  const totalInterested = projects.reduce((sum, project) => sum + project.interestedInvestors.length, 0);
  
  return (
    <div className="innovator-overview">
      <h3 className="mb-4">Welcome back, {currentUser?.firstName}!</h3>
      
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="dashboard-stats">
            <h2 className="mb-0">{projects.length}</h2>
            <p className="mb-0">Projects</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-stats">
            <h2 className="mb-0">{totalLikes}</h2>
            <p className="mb-0">Total Likes</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-stats">
            <h2 className="mb-0">{totalInterested}</h2>
            <p className="mb-0">Interested Investors</p>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Card className="custom-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Recent Projects</h5>
                <Button 
                  as={Link} 
                  to="/innovator/dashboard/projects" 
                  variant="outline-primary"
                  size="sm"
                >
                  View All Projects
                </Button>
              </div>
              
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : projects.length > 0 ? (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Industry</th>
                        <th>Stage</th>
                        <th>Likes</th>
                        <th>Interested</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.slice(0, 5).map((project) => (
                        <tr key={project._id}>
                          <td>{project.title}</td>
                          <td>
                            <Badge bg="info">{project.industry}</Badge>
                          </td>
                          <td>
                            <Badge bg="secondary">{project.projectStage}</Badge>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Heart size={16} className="text-danger me-1" />
                              {project.likes.length}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Briefcase size={16} className="text-primary me-1" />
                              {project.interestedInvestors.length}
                            </div>
                          </td>
                          <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <Lightbulb size={48} className="text-muted mb-3" />
                  <p className="mb-3">You haven't created any projects yet.</p>
                  <Button 
                    as={Link} 
                    to="/innovator/dashboard/projects" 
                    variant="primary"
                  >
                    Create Your First Project
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const InnovatorProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    industry: '',
    projectStage: '',
    fundingNeeded: ''
  });
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/innovator/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/projects`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Project created successfully!');
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        industry: '',
        projectStage: '',
        fundingNeeded: ''
      });
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  };
  
  const showProjectDetails = (project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };
  
  return (
    <div className="innovator-projects">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">My Projects</h3>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <PlusCircle size={18} className="me-2" />
          New Project
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : projects.length > 0 ? (
        <Row className="g-4">
          {projects.map((project) => (
            <Col md={6} lg={4} key={project._id}>
              <Card className="custom-card h-100">
                <Card.Body>
                  <div className="mb-3 d-flex justify-content-between align-items-start">
                    <Badge bg="info">{project.industry}</Badge>
                    <Badge bg="secondary">{project.projectStage}</Badge>
                  </div>
                  
                  <h5 className="mb-3">{project.title}</h5>
                  <p className="text-muted mb-3">
                    {project.description.length > 150 
                      ? `${project.description.substring(0, 150)}...` 
                      : project.description}
                  </p>
                  
                  <div className="mb-3">
                    <small className="text-muted">Funding Needed:</small>
                    <div className="fw-bold">${project.fundingNeeded.toLocaleString()}</div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <Heart size={18} className="text-danger me-1" />
                      <span>{project.likes.length} likes</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <Briefcase size={18} className="text-primary me-1" />
                      <span>{project.interestedInvestors.length} interested</span>
                    </div>
                  </div>
                  
                  <div className="d-grid">
                    <Button 
                      variant="outline-primary" 
                      onClick={() => showProjectDetails(project)}
                    >
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="custom-card text-center py-5">
          <Card.Body>
            <Lightbulb size={48} className="text-muted mb-3" />
            <h5>No Projects Yet</h5>
            <p className="text-muted mb-3">Share your innovative ideas with potential investors.</p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Create Your First Project
            </Button>
          </Card.Body>
        </Card>
      )}
      
      {/* Create Project Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateProject}>
            <Form.Group className="mb-3">
              <Form.Label>Project Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Industry</Form.Label>
                  <Form.Select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    required
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
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Project Stage</Form.Label>
                  <Form.Select
                    value={formData.projectStage}
                    onChange={(e) => setFormData({ ...formData, projectStage: e.target.value })}
                    required
                  >
                    <option value="">Select stage</option>
                    <option value="concept">Concept</option>
                    <option value="prototype">Prototype</option>
                    <option value="mvp">MVP</option>
                    <option value="market">In Market</option>
                    <option value="scaling">Scaling</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Funding Needed ($)</Form.Label>
              <Form.Control
                type="number"
                value={formData.fundingNeeded}
                onChange={(e) => setFormData({ ...formData, fundingNeeded: e.target.value })}
                required
                min="0"
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Project
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      
      {/* Project Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Project Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject && (
            <>
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <Badge bg="info" className="me-2">{selectedProject.industry}</Badge>
                    <Badge bg="secondary">{selectedProject.projectStage}</Badge>
                  </div>
                  <div className="text-muted">
                    Created: {new Date(selectedProject.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <h4>{selectedProject.title}</h4>
                <p className="text-muted">{selectedProject.description}</p>
                
                <div className="bg-light p-3 rounded mb-4">
                  <h6>Funding Details</h6>
                  <p className="mb-0">
                    <strong>Amount Needed:</strong> ${selectedProject.fundingNeeded.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <h6>Project Stats</h6>
                <div className="d-flex gap-4">
                  <div>
                    <div className="d-flex align-items-center text-danger mb-2">
                      <Heart size={18} className="me-2" />
                      <strong>{selectedProject.likes.length}</strong>
                    </div>
                    <small className="text-muted">Likes</small>
                  </div>
                  <div>
                    <div className="d-flex align-items-center text-primary mb-2">
                      <Briefcase size={18} className="me-2" />
                      <strong>{selectedProject.interestedInvestors.length}</strong>
                    </div>
                    <small className="text-muted">Interested Investors</small>
                  </div>
                </div>
              </div>
              
              {selectedProject.interestedInvestors.length > 0 && (
                <div>
                  <h6>Interested Investors</h6>
                  <ListGroup variant="flush">
                    {selectedProject.interestedInvestors.map((investor) => (
                      <ListGroup.Item key={investor._id} className="px-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div>{investor.firstName} {investor.lastName}</div>
                            <small className="text-muted">
                              {investor.investmentFocus} · {investor.investmentRange}
                            </small>
                          </div>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            href={`mailto:${investor.email}`}
                          >
                            <Mail size={16} className="me-1" />
                            Contact
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const InnovatorMessages = () => {
  return (
    <div className="innovator-messages">
      <h3 className="mb-4">Messages</h3>
      <p className="text-muted">This feature will be implemented in the next iteration.</p>
    </div>
  );
};

const InnovatorProfile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (currentUser) {
      setProfile(currentUser);
      setLoading(false);
    }
  }, [currentUser]);
  
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="innovator-profile">
      <h3 className="mb-4">My Profile</h3>
      
      <Card className="custom-card mb-4">
        <Card.Body>
          <Row>
            <Col md={3} className="text-center mb-4 mb-md-0">
              <div 
                className="rounded-circle bg-primary bg-opacity-10 p-4 d-inline-flex mb-3"
                style={{ width: '120px', height: '120px' }}
              >
                <Lightbulb size={64} className="text-primary" />
              </div>
              <h5>{profile?.firstName} {profile?.lastName}</h5>
              <p className="text-muted mb-0">Innovator</p>
            </Col>
            
            <Col md={9}>
              <Table>
                <tbody>
                  <tr>
                    <th style={{ width: '30%' }}>Email</th>
                    <td>{profile?.email}</td>
                  </tr>
                  <tr>
                    <th>Phone</th>
                    <td>{profile?.phone}</td>
                  </tr>
                  <tr>
                    <th>Industry</th>
                    <td>{profile?.industry}</td>
                  </tr>
                  <tr>
                    <th>Project Stage</th>
                    <td>{profile?.projectStage}</td>
                  </tr>
                  <tr>
                    <th>Bio</th>
                    <td>{profile?.bio}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default InnovatorDashboard;