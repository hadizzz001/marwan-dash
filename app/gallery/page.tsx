'use client';

import { useState, useEffect } from 'react';  
import Upload from '../components/Upload';

const ManageArticles = () => {
  const [editFormData, setEditFormData] = useState({ id: '', img: [], type: '' });
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]); 
  const [editMode, setEditMode] = useState(false);
 
  // Fetch all articles
  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/gallery', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      } else {
        console.error('Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Handle image uploads
  const handleImgChange = (uploadedImages) => {
    setEditFormData((prev) => ({ ...prev, img: uploadedImages }));
  };

  // Handle type selection
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setEditFormData((prev) => ({ ...prev, type: newType }));
  };

  // Edit article
  const handleEdit = (article) => {
    setEditMode(true);
    setEditFormData({
      id: article.id, 
      img: article.img,
      type: article.type || '', // Handle cases where type might be missing
    }); 
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/gallery?id=${encodeURIComponent(editFormData.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ img: editFormData.img, type: editFormData.type }),
      });

      if (res.ok) {
        setEditFormData({ id: '', img: [], type: '' });
        setEditMode(false);
        fetchArticles();
        window.location.href = "/gallery";
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`); 
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while updating the article.'); 
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Pics</h1>
      
      {editMode && (
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <Upload onImagesUpload={handleImgChange} />
          </div>

          {/* Image Type Dropdown */}
          <div>
            <label className="block font-medium mb-1">Select Image Type:</label>
            <select
              value={editFormData.type}
              onChange={handleTypeChange}
              className="border p-2 w-full"
              required
            >
              <option value="">Select Type</option>
              <option value="Children and youth">Children and youth</option>
              <option value="Corporation Training">Corporation Training</option>
              <option value="E-Government Training">E-Government Training</option>
            </select>
          </div>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            Update Pics
          </button>
        </form>
      )}

      {message && <p className="mt-4">{message}</p>}

      <h2 className="text-xl font-bold mt-8">All Pics</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
        <thead>
          <tr> 
            <th className="border border-gray-300 p-2">Images</th>
            <th className="border border-gray-300 p-2">Type</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.length > 0 ? (
            articles.map((article) => (
              <tr key={article.id}> 
                <td className="border border-gray-300 p-2">
                  <div className="flex space-x-2">
                    {article.img.map((imgUrl, index) => (
                      <img key={index} src={imgUrl} alt="Article Image" className="w-16 h-16 object-cover border" />
                    ))}
                  </div>
                </td>
                <td className="border border-gray-300 p-2 text-center">{article.type}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => handleEdit(article)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="border border-gray-300 p-2 text-center">
                No Pics found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageArticles;
