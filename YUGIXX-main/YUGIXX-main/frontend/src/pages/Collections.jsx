import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Collections.css';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newCollection, setNewCollection] = useState({ name: '', description: '', tags: '' });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/collections', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCollections(response.data);
    } catch (err) {
      setError('Failed to fetch collections');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollection.name.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/collections',
        {
          name: newCollection.name,
          description: newCollection.description,
          tags: newCollection.tags.split(',').map(t => t.trim()).filter(Boolean)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCollections([...collections, response.data]);
      setNewCollection({ name: '', description: '', tags: '' });
      setSuccess('Collection created!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to create collection');
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/collections/${collectionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCollections(collections.filter(c => c._id !== collectionId));
      setSuccess('Collection deleted!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to delete collection');
    }
  };

  if (loading) return <div className="loading">Loading collections...</div>;

  return (
    <div className="collections">
      <div className="collections-header">
        <h1>API Collections</h1>
        <form onSubmit={handleCreateCollection} className="create-collection-form">
          <input
            type="text"
            value={newCollection.name}
            onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
            placeholder="Collection name"
            required
          />
          <input
            type="text"
            value={newCollection.description}
            onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
            placeholder="Description (optional)"
          />
          <input
            type="text"
            value={newCollection.tags}
            onChange={(e) => setNewCollection({ ...newCollection, tags: e.target.value })}
            placeholder="Tags (comma separated)"
          />
          <button type="submit">Create Collection</button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="collections-grid">
        {collections.map(collection => (
          <div key={collection._id} className="collection-card">
            <div className="collection-header">
              <h2>{collection.name}</h2>
              <button
                onClick={() => handleDeleteCollection(collection._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
            <div className="collection-meta">
              <span className="desc">{collection.description || 'No description'}</span>
              <span className="tags">
                {collection.tags && collection.tags.length > 0
                  ? collection.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)
                  : <span className="tag">No tags</span>
                }
              </span>
            </div>
            <div className="collection-stats">
              <span>{collection.requests?.length || 0} requests</span>
              <span>{collection.lastUpdated ? new Date(collection.lastUpdated).toLocaleString() : 'Never updated'}</span>
            </div>
            <div className="collection-actions">
              <button className="view-btn">View Requests</button>
              <button className="edit-btn">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections; 