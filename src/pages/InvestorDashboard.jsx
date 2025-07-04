import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Modal } from 'react-bootstrap';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import NavigationBar from '../components/Navbar';
import { API_URL } from '../config';
import { 
  Briefcase, 
  User, 
  Search, 
  Bookmark, 
  MessageCircle, 
  BarChart2, 
  Lightbulb,
  Heart,
  Mail
} from 'lucide-react';

const InvestorDashboard = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="investor-dashboard">
      <NavigationBar />
      
      <Container fluid>
        <Row>
          <Col md={3} lg={2} className="sidebar py-4">
            <div className="d-flex flex-column">
              <h5 className="px-3 mb-4">Investor Dashboard</h5>
              
              <Link to="/investor/dashboard" className="sidebar-link mb-2">
                <BarChart2 size={18} className="me-2" />
                Overview
              </Link>
              
              <Link to="/investor/dashboard/discover" className="sidebar-link mb-2">
                <Search size={18} className="me-2" />
                Discover Projects
              </Link>
              
              <Link to="/investor/dashboard/saved" className="sidebar-link mb-2">
                <Bookmark size={18} className="me-2" />
                Saved Projects
              </Link>
              
              <Link to="/investor/dashboard/messages" className="sidebar-link mb-2">
                <MessageCircle size={18} className="me-2" />
                Messages
              </Link>
              
              <Link to="/investor/dashboard/profile" className="sidebar-link mb-2">
                <User size={18} className="me-2" />
                My Profile
              </Link>
            </div>
          </Col>
          
          <Col md={9} lg={10} className="py-4">
            <Routes>
              <Route index element={<InvestorOverview />} />
              <Route path="discover" element={<DiscoverProjects />} />
              <Route path="saved" element={<SavedProjects />} />
              <Route path="messages" element={<InvestorMessages />} />
              <Route path="profile" element={<InvestorProfile />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const InvestorOverview = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/projects`, {
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
  
  const likedProjects = projects.filter(project => 
    project.likes.includes(currentUser?._id)
  );
  
  const interestedProjects = projects.filter(project => 
    project.interestedInvestors.includes(currentUser?._id)
  );
  
  return (
    <div className="investor-overview">
      <h3 className="mb-4">Welcome back, {currentUser?.firstName}!</h3>
      
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="dashboard-stats">
            <h2 className="mb-0">{projects.length}</h2>
            <p className="mb-0">Available Projects</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-stats">
            <h2 className="mb-0">{likedProjects.length}</h2>
            <p className="mb-0">Liked Projects</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-stats">
            <h2 className="mb-0">{interestedProjects.length}</h2>
            <p className="mb-0">Interested In</p>
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
                  to="/investor/dashboard/discover" 
                  variant="outline-primary"
                  size="sm"
                >
                  Discover More
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
                  {projects.slice(0, 6).map((project) => (
                    <Col md={6} lg={4} key={project._id}>
                      <ProjectCard 
                        project={project}
                        currentUser={currentUser}
                        onUpdate={fetchProjects}
                      />
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-5">
                  <Lightbulb size={48} className="text-muted mb-3" />
                  <p className="mb-3">No projects available at the moment.</p>
                  <Button 
                    as={Link} 
                    to="/investor/dashboard/discover" 
                    variant="primary"
                  >
                    Discover Projects
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

const ProjectCard = ({ project, currentUser, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const hasLiked = project.likes.includes(currentUser?._id);
  const hasExpressedInterest = project.interestedInvestors.includes(currentUser?._id);
  
  const handleLike = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/projects/${project._id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onUpdate();
      toast.success(hasLiked ? 'Project unliked' : 'Project liked');
    } catch (error) {
      console.error('Error liking project:', error);
      toast.error('Failed to like project');
    } finally {
      setLoading(false);
    }
  };
  
  const handleExpressInterest = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/projects/${project._id}/interest`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onUpdate();
      toast.success('Interest expressed successfully');
      setShowModal(false);
    } catch (error) {
      console.error('Error expressing interest:', error);
      toast.error('Failed to express interest');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
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
            <Button 
              variant={hasLiked ? "danger" : "outline-danger"}
              size="sm"
              onClick={handleLike}
              disabled={loading}
            >
              <Heart size={16} className="me-1" />
              {project.likes.length}
            </Button>
            
            <Button
              variant={hasExpressedInterest ? "primary" : "outline-primary"}
              size="sm"
              onClick={() => !hasExpressedInterest && setShowModal(true)}
              disabled={loading || hasExpressedInterest}
            >
              {hasExpressedInterest ? (
                <>
                  <Mail size={16} className="me-1" />
                  Contact
                </>
              ) : (
                "Express Interest"
              )}
            </Button>
          </div>
          
          <div className="d-flex align-items-center">
            <div 
              className="rounded-circle bg-secondary me-2" 
              style={{ width: '30px', height: '30px', overflow: 'hidden' }}
            >
              <Lightbulb className="p-1 text-white" />
            </div>
            <div>
              <small className="text-muted">
                By {project.innovator.firstName} {project.innovator.lastName}
              </small>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Express Interest</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you interested in investing in "{project.title}"? The innovator will be notified and receive your contact information.
          </p>
          <div className="bg-light p-3 rounded">
            <h6>Your Information</h6>
            <p className="mb-1"><strong>Name:</strong> {currentUser?.firstName} {currentUser?.lastName}</p>
            <p className="mb-1"><strong>Email:</strong> {currentUser?.email}</p>
            <p className="mb-1"><strong>Investment Focus:</strong> {currentUser?.investmentFocus}</p>
            <p className="mb-0"><strong>Investment Range:</strong> {currentUser?.investmentRange}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleExpressInterest}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm Interest'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const DiscoverProjects = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/projects`, {
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
  
  return (
    <div className="discover-projects">
      <h3 className="mb-4">Discover Projects</h3>
      
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
              <ProjectCard 
                project={project}
                currentUser={currentUser}
                onUpdate={fetchProjects}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="custom-card text-center py-5">
          <Card.Body>
            <Lightbulb size={48} className="text-muted mb-3" />
            <h5>No Projects Available</h5>
            <p className="text-muted">Check back later for new opportunities.</p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

const SavedProjects = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const savedProjects = response.data.filter(project => 
        project.likes.includes(currentUser?._id)
      );
      setProjects(savedProjects);
    } catch (error) {
      console.error('Error fetching saved projects:', error);
      toast.error('Failed to load saved projects');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="saved-projects">
      <h3 className="mb-4">Saved Projects</h3>
      
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
              <ProjectCard 
                project={project}
                currentUser={currentUser}
                onUpdate={fetchProjects}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="custom-card text-center py-5">
          <Card.Body>
            <Bookmark size={48} className="text-muted mb-3" />
            <h5>No Saved Projects</h5>
            <p className="text-muted mb-3">You haven't saved any projects yet.</p>
            <Button 
              as={Link} 
              to="/investor/dashboard/discover" 
              variant="primary"
            >
              Discover Projects
            </Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

const InvestorMessages = () => {
  return (
    <div className="investor-messages">
      <h3 className="mb-4">Messages</h3>
      <p className="text-muted">This feature will be implemented in the next iteration.</p>
    </div>
  );
};

const InvestorProfile = () => {
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
    <div className="investor-profile">
      <h3 className="mb-4">My Profile</h3>
      
      <Card className="custom-card mb-4">
        <Card.Body>
          <Row>
            <Col md={3} className="text-center mb-4 mb-md-0">
              <div 
                className="rounded-circle bg-primary bg-opacity-10 p-4 d-inline-flex mb-3"
                style={{ width: '120px', height: '120px' }}
              >
                <Briefcase size={64} className="text-primary" />
              </div>
              <h5>{profile?.firstName} {profile?.lastName}</h5>
              <p className="text-muted mb-0">Investor</p>
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
                    <th>Investment Focus</th>
                    <td>{profile?.investmentFocus}</td>
                  </tr>
                  <tr>
                    <th>Investment Range</th>
                    <td>{profile?.investmentRange}</td>
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

export default InvestorDashboard;