import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import StatsCard from '@/components/molecules/StatsCard';
import bankAccountService from '@/services/api/bankAccountService';
import { cn } from '@/utils/cn';

const ACCOUNT_TYPES = [
  { value: 'Checking', label: 'Checking' },
  { value: 'Savings', label: 'Savings' },
  { value: 'Credit Card', label: 'Credit Card' },
  { value: 'Money Market', label: 'Money Market' }
];

const getAccountTypeColor = (type) => {
  switch (type) {
    case 'Checking': return 'blue';
    case 'Savings': return 'green';
    case 'Credit Card': return 'red';
    case 'Money Market': return 'purple';
    default: return 'gray';
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount || 0);
};

function BankAccountModal({ isOpen, onClose, account, onSave }) {
  const [formData, setFormData] = useState({
    Name: '',
    Tags: '',
    account_name_c: '',
    current_balance_c: '',
    account_type_c: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (account) {
      setFormData({
        Name: account.Name || '',
        Tags: account.Tags || '',
        account_name_c: account.account_name_c || '',
        current_balance_c: account.current_balance_c || '',
        account_type_c: account.account_type_c || ''
      });
    } else {
      setFormData({
        Name: '',
        Tags: '',
        account_name_c: '',
        current_balance_c: '',
        account_type_c: ''
      });
    }
    setErrors({});
  }, [account, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.account_name_c.trim()) {
      newErrors.account_name_c = 'Account name is required';
    }
    
    if (!formData.account_type_c) {
      newErrors.account_type_c = 'Account type is required';
    }
    
    if (!formData.current_balance_c || isNaN(parseFloat(formData.current_balance_c))) {
      newErrors.current_balance_c = 'Valid balance is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      let result;
      if (account) {
        result = await bankAccountService.update(account.Id, formData);
      } else {
        result = await bankAccountService.create(formData);
      }
      
      if (result) {
        onSave();
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {account ? 'Edit Bank Account' : 'Add Bank Account'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Name *
            </label>
            <Input
              value={formData.account_name_c}
              onChange={(e) => handleChange('account_name_c', e.target.value)}
              placeholder="Enter account name"
              error={errors.account_name_c}
            />
            {errors.account_name_c && (
              <p className="text-sm text-error-600 mt-1">{errors.account_name_c}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type *
            </label>
            <Select
              value={formData.account_type_c}
              onChange={(value) => handleChange('account_type_c', value)}
              placeholder="Select account type"
              options={ACCOUNT_TYPES}
              error={errors.account_type_c}
            />
            {errors.account_type_c && (
              <p className="text-sm text-error-600 mt-1">{errors.account_type_c}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Balance *
            </label>
            <Input
              type="number"
              step="0.01"
              value={formData.current_balance_c}
              onChange={(e) => handleChange('current_balance_c', e.target.value)}
              placeholder="0.00"
              error={errors.current_balance_c}
            />
            {errors.current_balance_c && (
              <p className="text-sm text-error-600 mt-1">{errors.current_balance_c}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <Input
              value={formData.Name}
              onChange={(e) => handleChange('Name', e.target.value)}
              placeholder="Optional display name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <Input
              value={formData.Tags}
              onChange={(e) => handleChange('Tags', e.target.value)}
              placeholder="Comma-separated tags"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {account ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <ApperIcon name={account ? "Save" : "Plus"} size={16} className="mr-2" />
                  {account ? 'Update Account' : 'Create Account'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BankAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const loadAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bankAccountService.getAll();
      setAccounts(data || []);
    } catch (err) {
      setError('Failed to load bank accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleCreate = () => {
    setSelectedAccount(null);
    setModalOpen(true);
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setModalOpen(true);
  };

  const handleDelete = async (account) => {
    if (!window.confirm(`Are you sure you want to delete "${account.account_name_c}"?`)) {
      return;
    }

    const success = await bankAccountService.delete(account.Id);
    if (success) {
      loadAccounts();
    }
  };

  const handleModalSave = () => {
    loadAccounts();
  };

  const totalBalance = accounts.reduce((sum, account) => sum + (parseFloat(account.current_balance_c) || 0), 0);
  const accountsByType = accounts.reduce((acc, account) => {
    const type = account.account_type_c || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAccounts} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bank Accounts</h1>
          <p className="text-gray-600 mt-1">Manage your bank accounts and balances</p>
        </div>
        <Button onClick={handleCreate} variant="primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Account
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Balance"
          value={totalBalance}
          icon="DollarSign"
          variant="primary"
        />
        <StatsCard
          title="Total Accounts"
          value={accounts.length}
          icon="CreditCard"
          variant="default"
        />
        <StatsCard
          title="Account Types"
          value={Object.keys(accountsByType).length}
          icon="Layers"
          variant="default"
        />
      </div>

      {/* Accounts List */}
      {accounts.length === 0 ? (
        <Empty
          title="No bank accounts yet"
          message="Get started by adding your first bank account to track your finances"
          actionLabel="Add Account"
          onAction={handleCreate}
          icon="CreditCard"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <Card key={account.Id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {account.account_name_c}
                  </h3>
                  {account.Name && (
                    <p className="text-sm text-gray-600 mb-2">{account.Name}</p>
                  )}
                  <Badge
                    variant={getAccountTypeColor(account.account_type_c)}
                    className="text-xs"
                  >
                    {account.account_type_c}
                  </Badge>
                </div>
                <div className="flex space-x-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(account)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ApperIcon name="Edit2" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(account)}
                    className="text-gray-500 hover:text-error-600"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Current Balance</span>
                  <span className={cn(
                    "text-lg font-bold",
                    parseFloat(account.current_balance_c) >= 0 
                      ? "text-success-600" 
                      : "text-error-600"
                  )}>
                    {formatCurrency(account.current_balance_c)}
                  </span>
                </div>
              </div>

              {account.Tags && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex flex-wrap gap-1">
                    {account.Tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                      <Badge key={index} variant="gray" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <BankAccountModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        account={selectedAccount}
        onSave={handleModalSave}
      />
    </div>
  );
}

export default BankAccounts;