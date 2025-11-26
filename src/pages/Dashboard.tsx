import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dashboard</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Bienvenido, {user?.name || user?.email}!</p>
        <button 
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '15px', 
        borderRadius: '5px' 
      }}>
        <h3>Tu información:</h3>
        <p><strong>Email:</strong> {user?.email}</p>
        {user?.name && <p><strong>Nombre:</strong> {user.name}</p>}
      </div>
    </div>
  );
};

export default Dashboard;