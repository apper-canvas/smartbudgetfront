import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { goalService } from "@/services/api/goalService";

const GoalModal = ({ isOpen, onClose, goal = null, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    targetDate: format(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), "yyyy-MM-dd")
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        targetDate: format(new Date(goal.targetDate), "yyyy-MM-dd")
      });
    } else {
      setFormData({
        name: "",
        targetAmount: "",
        currentAmount: "0",
        targetDate: format(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), "yyyy-MM-dd")
      });
    }
  }, [goal, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount || 0),
        targetDate: new Date(formData.targetDate).toISOString(),
        createdAt: goal?.createdAt || new Date().toISOString()
      };

      if (goal) {
        await goalService.update(goal.Id, goalData);
        toast.success("Goal updated successfully");
      } else {
        await goalService.create(goalData);
        toast.success("Goal created successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to save goal");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle bg-white shadow-xl rounded-2xl transform transition-all relative"
            >
              <div className="bg-gradient-to-r from-success-500 to-success-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {goal ? "Edit Goal" : "Create Goal"}
                  </h3>
                  <button
                    onClick={onClose}
                    className="p-1.5 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
                  >
                    <ApperIcon name="X" size={18} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <FormField
                  type="input"
                  label="Goal Name"
                  placeholder="e.g., Emergency Fund, Vacation"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    type="input"
                    inputType="number"
                    label="Target Amount"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={formData.targetAmount}
                    onChange={(e) => handleChange("targetAmount", e.target.value)}
                    required
                  />
                  <FormField
                    type="input"
                    inputType="number"
                    label="Current Amount"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={formData.currentAmount}
                    onChange={(e) => handleChange("currentAmount", e.target.value)}
                  />
                </div>

                <FormField
                  type="input"
                  inputType="date"
                  label="Target Date"
                  value={formData.targetDate}
                  onChange={(e) => handleChange("targetDate", e.target.value)}
                  required
                />

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="success"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      goal ? "Update Goal" : "Create Goal"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GoalModal;