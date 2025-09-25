import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { categoryService } from "@/services/api/categoryService";

const CategorySelect = ({ 
  label = "Category",
  value,
  onChange,
  type = "expense", // expense or income
  placeholder = "Select a category",
  required = false,
  className,
  ...props 
}) => {
  const [categories, setCategories] = useState([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customCategoryData, setCustomCategoryData] = useState({
    name: "",
    type: type,
    color: "#3b82f6"
  });
  const [loading, setLoading] = useState(false);

  const colorOptions = [
    { value: "#3b82f6", label: "Blue" },
    { value: "#10b981", label: "Green" },
    { value: "#f59e0b", label: "Orange" },
    { value: "#ef4444", label: "Red" },
    { value: "#8b5cf6", label: "Purple" },
    { value: "#06b6d4", label: "Cyan" },
    { value: "#84cc16", label: "Lime" },
    { value: "#f97316", label: "Orange" }
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const getFilteredCategories = () => {
    return categories
      .filter(cat => cat.type_c === type)
      .map(cat => ({ value: cat.Id, label: cat.name_c }));
  };

  const handleSelectChange = (e) => {
    if (e.target.value === "__ADD_CUSTOM__") {
      setShowCustomModal(true);
      setCustomCategoryData({
        name: "",
        type: type,
        color: "#3b82f6"
      });
    } else {
      onChange(e);
    }
  };

  const handleCustomCategorySubmit = async (e) => {
    e.preventDefault();
    if (!customCategoryData.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setLoading(true);
    try {
      const newCategory = await categoryService.create({
        name_c: customCategoryData.name.trim(),
        type_c: customCategoryData.type,
        color_c: customCategoryData.color,
        is_default_c: false
      });

      if (newCategory) {
        // Refresh categories list
        await loadCategories();
        
        // Select the newly created category
        const syntheticEvent = {
          target: {
            value: newCategory.Id.toString()
          }
        };
        onChange(syntheticEvent);

        toast.success("Category created successfully");
        setShowCustomModal(false);
      }
    } catch (error) {
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomInputChange = (field, value) => {
    setCustomCategoryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      <Select
        label={label}
        value={value}
        onChange={handleSelectChange}
        options={getFilteredCategories()}
        placeholder={placeholder}
        required={required}
        className={className}
        allowCustom={true}
        customOptionLabel="+ Add Custom Category"
        {...props}
      />

      <AnimatePresence>
        {showCustomModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={() => !loading && setShowCustomModal(false)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle bg-white shadow-xl rounded-2xl transform transition-all relative"
              >
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Create Custom Category
                    </h3>
                    <button
                      onClick={() => !loading && setShowCustomModal(false)}
                      disabled={loading}
                      className="p-1.5 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                      <ApperIcon name="X" size={18} />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleCustomCategorySubmit} className="p-6 space-y-4">
                  <Input
                    label="Category Name"
                    value={customCategoryData.name}
                    onChange={(e) => handleCustomInputChange("name", e.target.value)}
                    placeholder="Enter category name"
                    required
                    disabled={loading}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Color
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => handleCustomInputChange("color", color.value)}
                          disabled={loading}
                          className={`
                            w-full h-10 rounded-lg border-2 transition-all duration-200
                            ${customCategoryData.color === color.value 
                              ? "border-gray-800 scale-105" 
                              : "border-gray-200 hover:border-gray-400"
                            }
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                          style={{ backgroundColor: color.value }}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowCustomModal(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Creating...</span>
                        </div>
                      ) : (
                        "Create Category"
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CategorySelect;