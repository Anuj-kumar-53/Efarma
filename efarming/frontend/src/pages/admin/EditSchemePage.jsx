// src/pages/admin/EditSchemePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Plus, X, ArrowLeft, Trash2 } from 'lucide-react';
import { schemeAPI } from '../../services/api';
import toast from 'react-hot-toast';

const EditSchemePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    benefits: '',
    officialLink: '',
    sourceWebsite: '',
    category: 'Agriculture',
    tags: [],
    eligibility: {
      age: { min: '', max: '' },
      income: { min: '', max: '' },
      gender: 'Both',
      state: [],
      caste: [],
      occupation: [],
      landHolding: { min: '', max: '' }
    },
    requiredDocuments: [],
    lastDate: '',
    isActive: true,
    targetAudience: []
  });
  
  const [tagInput, setTagInput] = useState('');
  const [documentInput, setDocumentInput] = useState('');
  const [stateInput, setStateInput] = useState('');
  const [casteInput, setCasteInput] = useState('');
  const [occupationInput, setOccupationInput] = useState('');
  const [audienceInput, setAudienceInput] = useState('');

  const categories = [
    'Education',
    'Health',
    'Farmer',
    'Women',
    'Housing',
    'Agriculture',
    'Livestock',
    'Irrigation',
    'Subsidy',
    'Loan',
    'Insurance'
  ];

  const genders = ['Male', 'Female', 'Both', 'Other'];

  useEffect(() => {
    fetchScheme();
  }, [id]);

  const fetchScheme = async () => {
    setLoading(true);
    try {
      const response = await schemeAPI.getById(id);
      if (response.data.success) {
        const scheme = response.data.data;
        
        // Format dates
        const lastDate = scheme.lastDate 
          ? new Date(scheme.lastDate).toISOString().split('T')[0]
          : '';
        
        setFormData({
          title: scheme.title || '',
          description: scheme.description || '',
          benefits: scheme.benefits || '',
          officialLink: scheme.officialLink || '',
          sourceWebsite: scheme.sourceWebsite || '',
          category: scheme.category || 'Agriculture',
          tags: scheme.tags || [],
          eligibility: {
            age: {
              min: scheme.eligibility?.age?.min || '',
              max: scheme.eligibility?.age?.max || ''
            },
            income: {
              min: scheme.eligibility?.income?.min || '',
              max: scheme.eligibility?.income?.max || ''
            },
            gender: scheme.eligibility?.gender || 'Both',
            state: scheme.eligibility?.state || [],
            caste: scheme.eligibility?.caste || [],
            occupation: scheme.eligibility?.occupation || [],
            landHolding: {
              min: scheme.eligibility?.landHolding?.min || '',
              max: scheme.eligibility?.landHolding?.max || ''
            }
          },
          requiredDocuments: scheme.requiredDocuments || [],
          lastDate: lastDate,
          isActive: scheme.isActive !== false,
          targetAudience: scheme.targetAudience || []
        });
      } else {
        toast.error('Scheme not found');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error fetching scheme:', error);
      toast.error('Failed to load scheme');
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = type === 'checkbox' ? checked : value;
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAddToArray = (field, value, inputSetter) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      inputSetter('');
    }
  };

  const handleRemoveFromArray = (field, valueToRemove) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== valueToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Prepare data
      const dataToSend = {
        ...formData,
        eligibility: {
          ...formData.eligibility,
          age: {
            min: formData.eligibility.age.min ? Number(formData.eligibility.age.min) : 0,
            max: formData.eligibility.age.max ? Number(formData.eligibility.age.max) : null
          },
          income: {
            min: formData.eligibility.income.min ? Number(formData.eligibility.income.min) : 0,
            max: formData.eligibility.income.max ? Number(formData.eligibility.income.max) : null
          },
          landHolding: {
            min: formData.eligibility.landHolding.min ? Number(formData.eligibility.landHolding.min) : 0,
            max: formData.eligibility.landHolding.max ? Number(formData.eligibility.landHolding.max) : null
          }
        }
      };

      const response = await schemeAPI.updateScheme(id, dataToSend);
      
      if (response.data.success) {
        toast.success('Scheme updated successfully!');
        navigate('/admin/dashboard');
      } else {
        toast.error(response.data.message || 'Failed to update scheme');
      }
    } catch (error) {
      console.error('Update scheme error:', error);
      toast.error(error.response?.data?.message || 'Failed to update scheme');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this scheme?')) return;
    
    try {
      await schemeAPI.deleteScheme(id);
      toast.success('Scheme deleted successfully');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Failed to delete scheme');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded-xl mb-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>
        
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
          Delete Scheme
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Scheme</h1>
        <p className="text-gray-600">Update scheme details</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 mb-8">
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scheme Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter scheme title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="input-field"
                placeholder="Enter scheme description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits *
              </label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                required
                rows={4}
                className="input-field"
                placeholder="Describe scheme benefits"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Official Application Link *
                </label>
                <input
                  type="url"
                  name="officialLink"
                  value={formData.officialLink}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="https://example.com/apply"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Website *
                </label>
                <input
                  type="url"
                  name="sourceWebsite"
                  value={formData.sourceWebsite}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Date
                </label>
                <input
                  type="date"
                  name="lastDate"
                  value={formData.lastDate}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Tags</h2>
            
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddToArray('tags', tagInput, setTagInput))}
                className="input-field"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={() => handleAddToArray('tags', tagInput, setTagInput)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <div
                  key={tag}
                  className="flex items-center gap-1 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveFromArray('tags', tag)}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Eligibility Criteria</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Age
                </label>
                <input
                  type="number"
                  name="eligibility.age.min"
                  value={formData.eligibility.age.min}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 18"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Age
                </label>
                <input
                  type="number"
                  name="eligibility.age.max"
                  value={formData.eligibility.age.max}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Annual Income (₹)
                </label>
                <input
                  type="number"
                  name="eligibility.income.min"
                  value={formData.eligibility.income.min}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 100000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Annual Income (₹)
                </label>
                <input
                  type="number"
                  name="eligibility.income.max"
                  value={formData.eligibility.income.max}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 600000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="eligibility.gender"
                value={formData.eligibility.gender}
                onChange={handleChange}
                className="input-field"
              >
                {genders.map(gender => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
            </div>

            {/* States */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Eligible States
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={stateInput}
                  onChange={(e) => setStateInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddToArray('eligibility.state', stateInput, setStateInput))}
                  className="input-field"
                  placeholder="Add a state"
                />
                <button
                  type="button"
                  onClick={() => handleAddToArray('eligibility.state', stateInput, setStateInput)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.eligibility.state.map(state => (
                  <div
                    key={state}
                    className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {state}
                    <button
                      type="button"
                      onClick={() => handleRemoveFromArray('eligibility.state', state)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Required Documents</h2>
            
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={documentInput}
                onChange={(e) => setDocumentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddToArray('requiredDocuments', documentInput, setDocumentInput))}
                className="input-field"
                placeholder="Add a required document"
              />
              <button
                type="button"
                onClick={() => handleAddToArray('requiredDocuments', documentInput, setDocumentInput)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              {formData.requiredDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{doc}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFromArray('requiredDocuments', doc)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Target Audience</h2>
            
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={audienceInput}
                onChange={(e) => setAudienceInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddToArray('targetAudience', audienceInput, setAudienceInput))}
                className="input-field"
                placeholder="Add target audience"
              />
              <button
                type="button"
                onClick={() => handleAddToArray('targetAudience', audienceInput, setAudienceInput)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.targetAudience.map(audience => (
                <div
                  key={audience}
                  className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                >
                  {audience}
                  <button
                    type="button"
                    onClick={() => handleRemoveFromArray('targetAudience', audience)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Mark as active scheme
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="h-5 w-5" />
              )}
              <span>{saving ? 'Updating...' : 'Update Scheme'}</span>
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="btn-outline"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditSchemePage;