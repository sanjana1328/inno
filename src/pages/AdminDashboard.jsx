import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import NavigationBar from '../components/Navbar';
import { API_URL, STATUS } from '../config';
import { Users, CheckCircle, XCircle, User, BarChart, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="admin-dashboard">
      <NavigationBar />
      
      <Container fluid>
        <Row>
          <Col md={3} lg={2} className="sidebar py-4">
            <div className="d-flex flex-column">
              <h5 className="px-3 mb-4">Admin Panel</h5>
              
              <Link to="/admin/dashboard" className="sidebar-link mb-2">
                <BarChart size={18} className="me-2" />
                Dashboard
              </Link>
              
              <Link to="/admin/dashboard/pending" className="sidebar-link mb-2">
                <Users size={18} className="me-2" />
                Pending Approvals
              </Link>
              
              <Link to="/admin/dashboard/users" className="sidebar-link mb-2">
                <User size={18} className="me-2" />
                Users
              </Link>
              
              <Link to="/admin/dashboard/settings" className="sidebar-link mb-2">
                <Settings size={18} className="me-2" />
                Settings
              </Link>
            </div>
          </Col>
          
          <Col md={9} lg={10} className="py-4">
            <Routes>
              <Route index element={<AdminOverview />} />
              <Route path="pending" element={<PendingApprovals />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    investors: 0,
    innovators: 0,
    recentApprovals: []
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching admin stats', error);
        toast.error('Failed to load dashboard data');
      }
    };
    
    fetchStats();
  }, []);
  
  return (
    <div className="admin-overview">
      <h3 className="mb-4">Admin Dashboard</h3>
      
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="dashboard-stats">
            <h2 className="mb-0">{stats.totalUsers}</h2>
            <p className="mb-0">Total Users</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stats">
            <h2 className="mb-0">{stats.pendingApprovals}</h2>
            <p className="mb-0">Pending Approvals</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stats">
            <h2 className="mb-0">{stats.investors}</h2>
            <p className="mb-0">Investors</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stats">
            <h2 className="mb-0">{stats.innovators}</h2>
            <p className="mb-0">Innovators</p>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={8}>
          <Card className="custom-card h-100">
            <Card.Body>
              <h5 className="mb-3">Recent Approvals</h5>
              
              {stats.recentApprovals.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentApprovals.map((user) => (
                      <tr key={user._id}>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.role}</td>
                        <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
                        <td>
                          <Badge bg={user.status === STATUS.APPROVED ? 'success' : 'danger'}>
                            {user.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">No recent approvals</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="custom-card h-100">
            <Card.Body>
              <h5 className="mb-3">Quick Actions</h5>
              <div className="d-grid gap-2">
                <Button as={Link} to="/admin/dashboard/pending" variant="primary">
                  <Users size={16} className="me-2" />
                  View Pending Approvals
                </Button>
                <Button as={Link} to="/admin/dashboard/users" variant="outline-secondary">
                  <User size={16} className="me-2" />
                  Manage Users
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const PendingApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  useEffect(() => {
    fetchPendingUsers();
  }, []);
  
  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/admin/users/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingUsers(response.data);
    } catch (error) {
      console.error('Error fetching pending users', error);
      toast.error('Failed to load pending approval requests');
    } finally {
      setLoading(false);
    }
  };
  
  const handleApprove = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/admin/users/${userId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('User approved successfully');
      fetchPendingUsers();
    } catch (error) {
      console.error('Error approving user', error);
      toast.error('Failed to approve user');
    }
  };
  
  const handleReject = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/admin/users/${userId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('User rejected');
      fetchPendingUsers();
    } catch (error) {
      console.error('Error rejecting user', error);
      toast.error('Failed to reject user');
    }
  };
  
  const showUserDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };
  
  return (
    <div className="pending-approvals">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Pending Approvals</h3>
        <Button variant="outline-primary" size="sm" onClick={fetchPendingUsers}>
          Refresh
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : pendingUsers.length > 0 ? (
        <Card className="custom-card">
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg={user.role === 'investor' ? 'info' : 'warning'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button size="sm" variant="link" className="p-0 me-2" onClick={() => showUserDetails(user)}>
                          Details
                        </Button>
                        <Button size="sm" variant="success" onClick={() => handleApprove(user._id)}>
                          <CheckCircle size={16} />
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleReject(user._id)}>
                          <XCircle size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ) : (
        <Card className="custom-card text-center py-5">
          <Card.Body>
            <div className="mb-3">
              <CheckCircle size={48} className="text-success" />
            </div>
            <h5>No Pending Approvals</h5>
            <p className="text-muted">All registration requests have been processed.</p>
          </Card.Body>
        </Card>
      )}
      
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Row>
              <Col md={6}>
                <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Phone:</strong> {selectedUser.phone}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                <p><strong>Registration Date:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
              </Col>
              <Col md={6}>
                <p><strong>Bio:</strong></p>
                <p className="text-muted">{selectedUser.bio}</p>
                
                {selectedUser.role === 'investor' && (
                  <>
                    <p><strong>Investment Focus:</strong> {selectedUser.investmentFocus}</p>
                    <p><strong>Investment Range:</strong> {selectedUser.investmentRange}</p>
                  </>
                )}
                
                {selectedUser.role === 'innovator' && (
                  <>
                    <p><strong>Industry:</strong> {selectedUser.industry}</p>
                    <p><strong>Project Stage:</strong> {selectedUser.projectStage}</p>
                  </>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={() => {
            handleApprove(selectedUser._id);
            setShowDetailsModal(false);
          }}>
            Approve
          </Button>
          <Button variant="danger" onClick={() => {
            handleReject(selectedUser._id);
            setShowDetailsModal(false);
          }}>
            Reject
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    fetchUsers();
  }, [filter]);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const endpoint = filter === 'all' 
        ? `${API_URL}/api/admin/users` 
        : `${API_URL}/api/admin/users?role=${filter}`;
      
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="user-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>User Management</h3>
        <div className="d-flex align-items-center">
          <Form.Select 
            size="sm" 
            className="me-2" 
            style={{ width: '150px' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="investor">Investors</option>
            <option value="innovator">Innovators</option>
          </Form.Select>
          <Button variant="outline-primary" size="sm" onClick={fetchUsers}>
            Refresh
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : users.length > 0 ? (
        <Card className="custom-card">
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg={user.role === 'investor' ? 'info' : 'warning'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td>
                      <Badge 
                        bg={
                          user.status === STATUS.APPROVED 
                            ? 'success' 
                            : user.status === STATUS.PENDING 
                            ? 'warning' 
                            : 'danger'
                        }
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ) : (
        <Card className="custom-card text-center py-5">
          <Card.Body>
            <h5>No Users Found</h5>
            <p className="text-muted">No users match the current filter.</p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

const AdminSettings = () => {
  return (
    <div className="admin-settings">
      <h3 className="mb-4">Admin Settings</h3>
      
      <Card className="custom-card mb-4">
        <Card.Body>
          <h5 className="mb-3">Account Settings</h5>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Admin Email Notifications</Form.Label>
              <Form.Check 
                type="switch"
                id="notification-switch"
                label="Receive email notifications for new registrations"
                defaultChecked
              />
            </Form.Group>
            <Button variant="primary">Save Settings</Button>
          </Form>
        </Card.Body>
      </Card>
      
      <Card className="custom-card">
        <Card.Body>
          <h5 className="mb-3">System Information</h5>
          <p><strong>Platform Version:</strong> 1.0.0</p>
          <p><strong>Last Database Backup:</strong> {new Date().toLocaleDateString()}</p>
          <p><strong>Active Admins:</strong> 1</p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminDashboard;