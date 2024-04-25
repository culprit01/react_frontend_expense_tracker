// App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';


function App() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category_id: ''
  });

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:8000/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/expenses', newExpense);
      setExpenses([...expenses, response.data]);
      setNewExpense({ description: '', amount: '', category_id: '' });
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/expenses/${id}`, {
        maxRedirects: 0,
        validateStatus: status => status < 400 // Do not throw for 3xx status codes
      });
      setExpenses(expenses.filter(expense => expense.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };
  
  
  return (
    <div>
      <h1>Expense Tracker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={newExpense.description}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Amount"
          name="amount"
          value={newExpense.amount}
          onChange={handleInputChange}
        />
        <select
          name="category_id"
          value={newExpense.category_id}
          onChange={handleInputChange}
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button type="submit">Add Expense</button>
      </form>
      <h2>Expenses</h2>
      <ul>
        {expenses.map(expense => (
          <li key={expense.id}>
            <p>{expense.description}</p>
            <p>{expense.amount}</p>
            <p>{expense.category.name}</p>
            <button onClick={() => handleDelete(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
