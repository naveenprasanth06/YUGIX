import { useState, useEffect } from 'react';
import { FiUser, FiCamera, FiSave, FiEdit2, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    location: 'New York, USA',
    bio: 'API Testing Enthusiast',
    profilePhoto: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <div className="profile-photo-container">
            <div className="profile-photo">
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt="Profile" />
              ) : (
                <div className="profile-photo-placeholder">
                  <FiUser />
                </div>
              )}
              {isEditing && (
                <label className="photo-upload-btn">
                  <FiCamera />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
            <h2>{user.name}</h2>
            <p className="user-role">{user.bio}</p>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <FiMail />
              <div>
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{user.email}</p>
                )}
              </div>
            </div>

            <div className="detail-item">
              <FiPhone />
              <div>
                <label>Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={user.phone}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{user.phone}</p>
                )}
              </div>
            </div>

            <div className="detail-item">
              <FiMapPin />
              <div>
                <label>Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={user.location}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{user.location}</p>
                )}
              </div>
            </div>

            <div className="detail-item">
              <FiUser />
              <div>
                <label>Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={user.bio}
                    onChange={handleInputChange}
                    rows="3"
                  />
                ) : (
                  <p>{user.bio}</p>
                )}
              </div>
            </div>
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <button 
                className="save-btn"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : (
                  <>
                    <FiSave /> Save Changes
                  </>
                )}
              </button>
            ) : (
              <button 
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                <FiEdit2 /> Edit Profile
              </button>
            )}
          </div>

          {success && (
            <div className="success-message">
              Profile updated successfully!
            </div>
          )}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 