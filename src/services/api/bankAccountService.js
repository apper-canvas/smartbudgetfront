import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class BankAccountService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'bank_accounts_c';
  }

  async getAll() {
    try {
      await delay(300);
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "account_name_c"}},
          {"field": {"Name": "current_balance_c"}},
          {"field": {"Name": "account_type_c"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Bank account fetch failed: ${response.message}`);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching bank accounts:", error?.response?.data?.message || error);
      toast.error("Failed to load bank accounts");
      return [];
    }
  }

  async getById(id) {
    try {
      await delay(300);
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "account_name_c"}},
          {"field": {"Name": "current_balance_c"}},
          {"field": {"Name": "account_type_c"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(`Bank account fetch failed: ${response.message}`);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching bank account ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to load bank account");
      return null;
    }
  }

  async create(accountData) {
    try {
      await delay(300);
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: accountData.Name || '',
          Tags: accountData.Tags || '',
          account_name_c: accountData.account_name_c || '',
          current_balance_c: parseFloat(accountData.current_balance_c) || 0,
          account_type_c: accountData.account_type_c || ''
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Bank account creation failed: ${response.message}`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} bank account:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          toast.success("Bank account created successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating bank account:", error?.response?.data?.message || error);
      toast.error("Failed to create bank account");
      return null;
    }
  }

  async update(id, accountData) {
    try {
      await delay(300);
      
      // Only include Updateable fields and Id
      const params = {
        records: [{
          Id: parseInt(id),
          Name: accountData.Name || '',
          Tags: accountData.Tags || '',
          account_name_c: accountData.account_name_c || '',
          current_balance_c: parseFloat(accountData.current_balance_c) || 0,
          account_type_c: accountData.account_type_c || ''
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Bank account update failed: ${response.message}`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} bank account:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          toast.success("Bank account updated successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating bank account:", error?.response?.data?.message || error);
      toast.error("Failed to update bank account");
      return null;
    }
  }

  async delete(id) {
    try {
      await delay(300);
      
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Bank account deletion failed: ${response.message}`);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} bank account:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        if (successful.length > 0) {
          toast.success("Bank account deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting bank account:", error?.response?.data?.message || error);
      toast.error("Failed to delete bank account");
      return false;
    }
  }
}

export default new BankAccountService();