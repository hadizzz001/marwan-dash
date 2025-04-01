'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Upload from '../components/Upload'; 

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const ManageCategory = () => {
  const [editFormData, setEditFormData] = useState({
    id: '',
    desc: '', 
    img: [],
  }); 
  const [img, setImg] = useState([]);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
 

  const quillModules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['bold', 'italic', 'underline'],
      [{ align: [] }],
      ['link'],
      ['clean'],
    ],
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/home', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) {
          setEditFormData({
            id: data[0].id,
            desc: data[0].desc, 
            img: data[0].img,
          });
          setImg(data[0].img);
        }
      } else {
        console.error('Failed to fetch Home');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/home?id=${encodeURIComponent(editFormData.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          desc: editFormData.desc, 
          img: img,
        }),
      });

      if (res.ok) {
        setMessage('Home updated successfully!');
        fetchCategories();
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while updating the Home.');
    }
  };

  const handleImgChange = (url) => {
    if (url) {
      setImg(url);
      setEditFormData((prevState) => ({ ...prevState, img: url }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Home</h1>
      <form onSubmit={handleEditSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Description</label>
          <ReactQuill
            theme="snow"
            value={editFormData.desc}
            onChange={(value) => setEditFormData({ ...editFormData, desc: value })}
            modules={quillModules}
          />
        </div>

 

 

        <Upload onImagesUpload={handleImgChange} />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update Home
        </button>
      </form>

      
    </div>
  );
};

export default ManageCategory;
