const fs = require('fs');

function animateTable(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');

  if (!c.includes('import { motion } from "framer-motion";')) {
    c = c.replace('import { Link } from "react-router-dom";', 'import { Link } from "react-router-dom";\nimport { motion } from "framer-motion";');
    // If it didn't replace, try another common import
    if (!c.includes('import { motion } from "framer-motion";')) {
        c = c.replace('import { useState, useEffect } from "react";', 'import { useState, useEffect } from "react";\nimport { motion } from "framer-motion";');
    }
  }

  c = c.replace(
    '<tbody className="divide-y divide-gray-50">',
    `<motion.tbody
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                }}
                className="divide-y divide-gray-50"
              >`
  );

  // For OrdersManager
  c = c.replace(
    /<tr key=\{o\.id\} className="hover:bg-slate-50\/50 transition">/g,
    `<motion.tr
                    variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                    whileHover={{ scale: 1.01, backgroundColor: "#f8fafc", transition: { duration: 0.2 } }}
                    key={o.id}
                    className="hover:bg-blue-50/50 transition-colors duration-150"
                  >`
  );

  // For ProductManager
  c = c.replace(
    /<tr key=\{p\.id\} className="hover:bg-slate-50\/50 transition">/g,
    `<motion.tr
                    variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                    whileHover={{ scale: 1.01, backgroundColor: "#f8fafc", transition: { duration: 0.2 } }}
                    key={p.id}
                    className="hover:bg-blue-50/50 transition-colors duration-150"
                  >`
  );

  // For CustomersManager
  c = c.replace(
    /<tr key=\{u\.id\} className="hover:bg-slate-50\/50 transition">/g,
    `<motion.tr
                    variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                    whileHover={{ scale: 1.01, backgroundColor: "#f8fafc", transition: { duration: 0.2 } }}
                    key={u.id}
                    className="hover:bg-blue-50/50 transition-colors duration-150"
                  >`
  );
  
  // For CategoryManager
  c = c.replace(
    /<tr key=\{c\.id\} className="hover:bg-slate-50\/50 transition">/g,
    `<motion.tr
                    variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                    whileHover={{ scale: 1.01, backgroundColor: "#f8fafc", transition: { duration: 0.2 } }}
                    key={c.id}
                    className="hover:bg-blue-50/50 transition-colors duration-150"
                  >`
  );

  c = c.replace(/<\/tr>/g, '</motion.tr>');
  c = c.replace(/<\/tbody>/g, '</motion.tbody>');

  fs.writeFileSync(filePath, c, 'utf8');
}

['src/pages/Dashboard/OrdersManager.jsx', 'src/pages/Dashboard/ProductManager.jsx', 'src/pages/Dashboard/CustomersManager.jsx', 'src/pages/Dashboard/CategoryManager.jsx'].forEach(animateTable);
console.log("Done");
