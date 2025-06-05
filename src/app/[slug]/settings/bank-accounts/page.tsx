import React from 'react'
import BankAccountList from '../components/accounts/BankAccountList'

const BankAccountsPage = () => {
    return (
        <div className="bank-accounts-container">
            <h1>Company Bank Accounts</h1>
            <BankAccountList />
        </div>
    );
};

export default BankAccountsPage;