import re

with open('frontend/src/components/Dashboard/CustomerLedgerModal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Change handlePrint logic
old_print = """  const handlePrint = () => {
    // Basic print trick: hide other elements via CSS, or just rely on standard print window
    window.print();
  };"""
new_print = """  const handlePrint = () => {
    window.open(`/print/ledger/${customer.id}`, '_blank');
  };"""

content = content.replace(old_print, new_print)

# Remove `print:hidden` classes from UI just to keep it clean, or keep them it's fine.
# Actually, the user won't print from the modal anymore, they'll just click it and it opens a new tab.

with open('frontend/src/components/Dashboard/CustomerLedgerModal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated handlePrint to open new tab")
