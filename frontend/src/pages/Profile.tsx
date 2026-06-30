import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{
      padding: '100px 4% 40px 4%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: 'var(--bg-black)',
      color: 'var(--text-white)',
    }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 600, borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '30px' }}>
          Account & Profile
        </h1>
        
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          {/* Avatar Area */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '4px',
              backgroundColor: 'var(--netflix-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3.5rem',
              fontWeight: 'bold',
              boxShadow: 'var(--shadow-card)',
            }}>
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <button style={{
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
            }}>
              Change Avatar
            </button>
          </div>
          
          {/* User Details Area */}
          <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Display Name</label>
              <input 
                type="text" 
                defaultValue={user?.name || 'Netflix Member'} 
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  backgroundColor: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '1rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Email Address</label>
              <input 
                type="email" 
                defaultValue={user?.email || 'member@netflixclone.com'} 
                disabled
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  backgroundColor: '#222',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#888',
                  fontSize: '1rem',
                  cursor: 'not-allowed',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Membership Plan</label>
              <div style={{
                padding: '15px',
                border: '1px solid #333',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Premium Ultra HD</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>4K + HDR • 4 Screens at once</div>
                </div>
                <span style={{
                  color: 'var(--netflix-red)',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}>
                  Active
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <button style={{
                backgroundColor: 'var(--text-white)',
                color: 'var(--bg-black)',
                padding: '10px 24px',
                fontWeight: 'bold',
                borderRadius: '4px',
              }}>
                Save Changes
              </button>
              <button 
                onClick={logout}
                style={{
                  border: '1px solid var(--netflix-red)',
                  backgroundColor: 'transparent',
                  color: 'var(--netflix-red)',
                  padding: '10px 24px',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
