import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CategorySelect from "@/components/molecules/CategorySelect";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { transactionService } from "@/services/api/transactionService";
import { categoryService } from "@/services/api/categoryService";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
const TransactionModal = ({ isOpen, onClose, transaction = null, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    category: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd")
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (transaction) {
setFormData({
        amount: transaction.amount_c.toString(),
        type: transaction.type_c,
        category: transaction.category_c?.Id || '',
        description: transaction.description_c,
        date: format(new Date(transaction.date_c), "yyyy-MM-dd")
      });
    } else {
      setFormData({
        amount: "",
        type: "expense",
        category: "",
        description: "",
        date: format(new Date(), "yyyy-MM-dd")
      });
    }
  }, [transaction, isOpen]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const transactionData = {
amount_c: parseFloat(formData.amount),
        type_c: formData.type,
        description_c: formData.description,
        date_c: new Date(formData.date).toISOString(),
        created_at_c: new Date().toISOString(),
        category_c: formData.category ? parseInt(formData.category) : null
      };

      if (transaction) {
        await transactionService.update(transaction.Id, transactionData);
        toast.success("Transaction updated successfully");
      } else {
        await transactionService.create(transactionData);
        toast.success("Transaction added successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to save transaction");
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
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {transaction ? "Edit Transaction" : "Add Transaction"}
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
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    type="input"
                    inputType="number"
                    label="Amount"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    required
                  />
                  <FormField
                    type="select"
                    label="Type"
                    value={formData.type}
                    onChange={(e) => {
                      handleChange("type", e.target.value);
                      handleChange("category", "");
                    }}
                    options={[
                      { value: "expense", label: "Expense" },
                      { value: "income", label: "Income" }
                    ]}
                    required
                  />
                </div>

                <FormField
<CategorySelect
                  label="Category"
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  type={formData.type}
                  placeholder="Select a category"
                  required
                />

                <FormField
                  type="input"
                  label="Description"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  required
                />

                <FormField
                  type="input"
                  inputType="date"
                  label="Date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
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
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      transaction ? "Update Transaction" : "Add Transaction"
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

export default TransactionModal;