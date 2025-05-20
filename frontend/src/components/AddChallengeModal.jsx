import { useState } from 'react';
import { FaTimes, FaTrophy, FaMedal, FaAward } from 'react-icons/fa';

const AddChallengeModal = ({ onClose, onAddChallenge }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Easy',
    points: 50,
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'points' ? parseInt(value) || 0 : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddChallenge(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold text-primary">Create New Challenge</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Challenge Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter a catchy title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Describe the challenge and its requirements"
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., Fitness, Education, Programming"
            />
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="difficulty" className="block text-gray-700 font-medium mb-2">
              Difficulty Level
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="points" className="block text-gray-700 font-medium mb-2">
              Points Value
            </label>
            <div className="flex items-center">
              <input
                type="range"
                id="points"
                name="points"
                min="10"
                max="100"
                step="5"
                value={formData.points}
                onChange={handleChange}
                className="w-full mr-4"
              />
              <span className="flex items-center justify-center bg-primary text-white w-12 h-8 rounded-md">
                {formData.points}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span className="flex items-center"><FaAward className="mr-1" /> Easy</span>
              <span className="flex items-center"><FaMedal className="mr-1" /> Medium</span>
              <span className="flex items-center"><FaTrophy className="mr-1" /> Hard</span>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors"
            >
              Create Challenge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChallengeModal;