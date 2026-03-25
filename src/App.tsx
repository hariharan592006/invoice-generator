import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import './App.css';

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number | string;
  price: number | string;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

function App() {
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: generateId(), name: '', quantity: 1, price: 0 }
  ]);

  const [companyDetails, setCompanyDetails] = useState({ name: '', email: '', phone: '' });
  const [clientDetails, setClientDetails] = useState({ name: '', email: '' });

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const q = Number(item.quantity) || 0;
      const p = Number(item.price) || 0;
      return sum + (q * p);
    }, 0);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 105, 20, { align: 'center' });
    
    // Company and Client info layout
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('From:', 20, 40);
    doc.text('Billed To:', 120, 40);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(companyDetails.name || 'Company Name', 20, 47);
    doc.text(clientDetails.name || 'Client Name', 120, 47);
    
    doc.setFont('helvetica', 'normal');
    let companyY = 54;
    if (companyDetails.email) { doc.text(companyDetails.email, 20, companyY); companyY += 7; }
    if (companyDetails.phone) { doc.text(companyDetails.phone, 20, companyY); companyY += 7; }
    
    if (clientDetails.email) { doc.text(clientDetails.email, 120, 54); }

    // Table Header
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 20, 85);
    doc.text('Qty', 140, 85, { align: 'right' });
    doc.text('Price', 190, 85, { align: 'right' });
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 88, 190, 88);
    
    // Table Rows
    doc.setFont('helvetica', 'normal');
    let y = 98;
    items.forEach(item => {
      doc.text(item.name || 'Item description', 20, y);
      doc.text(String(item.quantity || 1), 140, y, { align: 'right' });
      doc.text(`$${Number(item.price || 0).toFixed(2)}`, 190, y, { align: 'right' });
      y += 10;
    });
    
    // Total Section
    doc.line(130, y + 2, 190, y + 2);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 140, y + 12, { align: 'right' });
    doc.setFontSize(16);
    doc.text(`$${calculateTotal().toFixed(2)}`, 190, y + 12, { align: 'right' });
    
    doc.save('invoice.pdf');
  };

  const handleAddItem = () => {
    setItems([...items, { id: generateId(), name: '', quantity: 1, price: 0 }]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };
  return (
    <div className="app-container">
      <div className="invoice-card">
        <header className="invoice-header">
          <h1>Invoice Generator</h1>
          <button className="download-btn" onClick={handleDownloadPDF}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px', verticalAlign: 'text-bottom'}}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download PDF
          </button>
        </header>

        <div className="details-section">
          <div className="company-details">
            <h2>Company Details</h2>
            <div className="input-group">
              <label>Name</label>
              <input type="text" placeholder="Your Company Name" value={companyDetails.name} onChange={(e) => setCompanyDetails(prev => ({...prev, name: e.target.value}))} />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="company@example.com" value={companyDetails.email} onChange={(e) => setCompanyDetails(prev => ({...prev, email: e.target.value}))} />
            </div>
            <div className="input-group">
              <label>Phone</label>
              <input type="tel" placeholder="+1 (555) 000-0000" value={companyDetails.phone} onChange={(e) => setCompanyDetails(prev => ({...prev, phone: e.target.value}))} />
            </div>
          </div>

          <div className="client-details">
            <h2>Client Details</h2>
            <div className="input-group">
              <label>Name</label>
              <input type="text" placeholder="Client Name" value={clientDetails.name} onChange={(e) => setClientDetails(prev => ({...prev, name: e.target.value}))} />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="client@example.com" value={clientDetails.email} onChange={(e) => setClientDetails(prev => ({...prev, email: e.target.value}))} />
            </div>
          </div>
        </div>

        <div className="items-section">
          <h2>Items</h2>
          <div className="items-header">
            <span className="col-name">Item Name</span>
            <span className="col-qty">Quantity</span>
            <span className="col-price">Price</span>
          </div>

          {items.map((item) => (
            <div className="item-row" key={item.id}>
              <input 
                type="text" 
                className="col-name" 
                placeholder="Item name" 
                value={item.name}
                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
              />
              <input 
                type="number" 
                className="col-qty" 
                placeholder="1" 
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, 'quantity', e.target.value === '' ? '' : Number(e.target.value))}
              />
              <input 
                type="number" 
                className="col-price" 
                placeholder="0.00" 
                min="0"
                step="0.01"
                value={item.price}
                onChange={(e) => updateItem(item.id, 'price', e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
          ))}

          <button className="add-item-btn" onClick={handleAddItem}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px', verticalAlign: 'text-bottom'}}>
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Item
          </button>

          <div className="invoice-summary">
            <div className="summary-row total">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
