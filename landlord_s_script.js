const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 4000;

const db = mysql.createConnection({
  // host: '',
  // user: '',
  // password: '',
  // database: ''
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } 
  else {
    console.log('Connected to the database.');
  }
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files 

app.use('/real_estate_folder', express.static(path.join(__dirname, 'real_estate_folder')));

// Serve the login form

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/real_estate_folder/html_files/landlord_login.html'));
});

// Server the Create account form

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'real_estate_folder/html_files/landlord_signup.html'));
// });

// Handle login form submission

app.post('/login', (req, res) => {
  const { landlord_id, password_n } = req.body;

  if (!landlord_id || !password_n) {
    return res.status(400).json({ message: 'Both name and age are required.' });
  }

  const query = 'SELECT landlord_id, password_v FROM landlord WHERE landlord_id = ?';
  db.query(query, [landlord_id], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ message: 'Error logging in.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const user = results[0];

    if (password_n!=user.password_v) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    const userId = user.landlord_id;
    res.redirect(`/dashboard?userId=${userId}`); 
  });
});

// Handle create form submission

app.post('/submit_n', (req, res) => {
  const { first_name,last_name,cnic_no,contact_no,password_v } = req.body;

  const query = 'INSERT INTO landlord (first_name,last_name,cnic_no,contact_no,password_v) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [first_name,last_name,cnic_no,contact_no,password_v], (err, results) => {
    if (err) {
      console.error('Error in inserting user:', err);
      return res.status(500).json({ message: 'Error siginging in.' });
    }

    const userId = results.insertId;
    res.redirect(`/dashboard?userId=${userId}`); 
  });
});


// Serve the dashboard

app.get('/dashboard', (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).send('User ID is required.');
  }
  res.sendFile(path.join(__dirname, '/real_estate_folder/html_files/landlord_display.html'));
});


app.get('/properties', (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).send('User ID is required.');
  }
  res.sendFile(path.join(__dirname, '/real_estate_folder/html_files/landlord_property.html'));
});

app.get('/advertisements', (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).send('User ID is required.');
  }
  res.sendFile(path.join(__dirname, '/real_estate_folder/html_files/landlord_advertise.html'));
});

app.get('/profile', (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).send('User ID is required.');
  }
  res.sendFile(path.join(__dirname, '/real_estate_folder/html_files/landlord_profile.html'));
});

app.get('/agreement', (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).send('User ID is required.');
  }
  res.sendFile(path.join(__dirname, '/real_estate_folder/html_files/landlord_agreement.html'));
});




app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'real_estate_folder/html_files/chat.html'));
});



// ************************** Landlord Properties *************************************

// fetch properties of landlord

app.get('/properties/:userId', (req, res) => {
  const LandLord_landlord_id = req.params.userId;
  const query = 'SELECT * FROM property WHERE LandLord_landlord_id = ?';
  db.query(query, [LandLord_landlord_id], (err, results) => {
    if (err) {
      console.error('Error fetching properties:', err);
      return res.status(500).json({ message: 'Failed to fetch properties.' });
    }
    res.json(results);
  });
});

// Add a new property

app.post('/properties/:userId', (req, res) => {
  const LandLord_landlord_id = req.params.userId;
  const { property_value, address, type, size, no_prev_residents } = req.body;
  const query = `INSERT INTO property ( property_value, address, type, size, no_prev_residents,LandLord_landlord_id) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [property_value, address, type, size, no_prev_residents,LandLord_landlord_id], (err) => {
    if (err) {
      console.error('Error adding property:', err);
      return res.status(500).json({ message: 'Failed to add property.' });
    }
    res.json({ message: 'Property added successfully!' });
  });
});


// Update Property

app.put('/properties/:userId/:id', (req, res) => {
  const LandLord_landlord_id = req.params.userId; 
  const property_id = req.params.id; 
  const { property_value, address, type, size, no_prev_residents } = req.body;
  const query = `UPDATE property SET property_value = ?, address = ?, type = ?, size = ?, no_prev_residents = ? WHERE property_id = ? AND Landlord_landlord_id = ?`;

  db.query(query, [property_value,address,type,size,no_prev_residents,property_id,LandLord_landlord_id], (err) => {
    if (err) {
      console.error('Error updating property:', err);
      return res.status(500).json({ message: 'Failed to update property.' });
    }
    res.json({ message: 'Property updated successfully!' });
  });
});

// Delete Property

app.delete('/properties/:userId/:id', (req, res) => {
  const LandLord_landlord_id = req.params.userId; 
  const property_id = req.params.id; 
  const query = 'DELETE FROM property WHERE property_id = ? AND LandLord_landlord_id = ?';

  db.query(query, [property_id, LandLord_landlord_id], (err) => {
    if (err) {
      console.error('Error deleting property:', err);
      return res.status(500).json({ message: 'Failed to delete property.' });
    }
    res.json({ message: 'Property deleted successfully!' });
  });
});

// ******************************* Advertisement**********************************

// fetch advertisements for LandLord

app.get('/advertisements/:userId', (req, res) => {
  const LandLord_landlord_id = req.params.userId;
  const query = `
    SELECT a.advertising_id, a.advertising_expense, a.status, a.demanded_rent, a.Property_property_id
    FROM advertising a
    JOIN property p ON a.Property_property_id = p.property_id
    WHERE p.Landlord_landlord_id = ?`;

  db.query(query, [LandLord_landlord_id], (err, results) => {
    if (err) {
      console.error('Error fetching advertisements:', err);
      return res.status(500).json({ message: 'Failed to fetch advertisements.' });
    }
    res.json(results);
  });
});

// Add Advertisiments for Landlord

app.post('/advertisements/:userId', (req, res) => {
  const LandLord_landlord_id = req.params.userId;
  const { advertising_expense, status, demanded_rent, property_id } = req.body;
  const checkPropertyQuery = ` SELECT * FROM property 
    WHERE property_id = ? AND Landlord_landlord_id = ?`;

  db.query(checkPropertyQuery, [property_id, LandLord_landlord_id], (err, results) => {
    if (err) {
      console.error('Error checking property:', err);
      return res.status(500).json({ message: 'Failed to verify property.' });
    }
    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid property or unauthorized action.' });
    }
    const Property_property_id=property_id;
    const insertQuery = `
      INSERT INTO advertising ( advertising_expense, status, demanded_rent, Property_property_id)
      VALUES (?, ?, ?, ?)
    `;

    db.query(insertQuery, [advertising_expense, status, demanded_rent, Property_property_id], (err, results) => {
      if (err) {
        console.error('Error adding advertisement:', err);
        return res.status(500).json({ message: 'Failed to add advertisement.' });
      }
      res.json({ message: 'Advertisement added successfully!' });
    });
  });
});


// Update Avertisments For Landlord

app.put('/advertisements/:userId/:id', (req, res) => {
  const LandLord_landlord_id = req.params.userId;
  const advertising_id = req.params.id;
  const { advertising_expense, status, demanded_rent } = req.body;

  const query = `
    UPDATE advertising a JOIN property p ON a.Property_property_id = p.property_id
    SET a.advertising_expense = ?, a.status = ?, a.demanded_rent = ?
    WHERE a.advertising_id = ? AND p.Landlord_landlord_id = ?`;

  db.query(query, [advertising_expense, status, demanded_rent, advertising_id, LandLord_landlord_id], (err) => {
    if (err) {
      console.error('Error updating advertisement:', err);
      return res.status(500).json({ message: 'Failed to update advertisement.' });
    }
    res.json({ message: 'Advertisement updated successfully!' });
  });
});


// DELETE Advertisments for Landlord

app.delete('/advertisements/:userId/:id', (req, res) => {
  const LandLord_landlord_id = req.params.userId;
  const advertising_id = req.params.id;

  const query = `
    DELETE a FROM advertising a JOIN property p ON a.Property_property_id = p.property_id
    WHERE a.advertising_id = ? AND p.LandLord_landlord_id = ?`;

  db.query(query, [advertising_id, LandLord_landlord_id], (err) => {
    if (err) {
      console.error('Error deleting advertisement:', err);
      return res.status(500).json({ message: 'Failed to delete advertisement.' });
    }
    res.json({ message: 'Advertisement deleted successfully!' });
  });
});

// *************************** Landlord Profile ******************************8

// Fetch Landlord Profile

app.get('/profile/:userId', (req, res) => {
  const landlord_id = req.params.userId;

  const profileQuery = `
    SELECT landlord.landlord_id AS landlord_id, landlord.first_name, landlord.last_name, landlord.cnic_no, landlord.contact_no, 
    COUNT(property.property_id) AS no_of_properties_owned
    FROM landlord LEFT JOIN property ON landlord.landlord_id = property.Landlord_landlord_id
    WHERE landlord.landlord_id = ?
    GROUP BY landlord.landlord_id;
  `;

  db.query(profileQuery, [landlord_id], (err, results) => {
    if (err) {
      console.error('Error fetching profile:', err);
      return res.status(500).json({ message: 'Failed to fetch profile.' });
    }
    res.json(results[0]);
  });
});


// Update Landlord profile

app.put('/profile/:userId', (req, res) => {
  const landlord_id = req.params.userId;
  const { first_name, last_name, cnic_no, contact_no } = req.body;

  const updateQuery = `
    UPDATE landlord
    SET first_name = ?, last_name = ?, cnic_no = ?, contact_no = ?
    WHERE landlord_id = ?;
  `;

  db.query(updateQuery, [first_name, last_name, cnic_no, contact_no, landlord_id], (err) => {
    if (err) {
      console.error('Error updating profile:', err);
      return res.status(500).json({ message: 'Failed to update profile.' });
    }
    res.json({ message: 'Profile updated successfully!' });
  });
});

//  *************************** Agreements Display ******************************


function getLandlordId(req) {
    return req.params.userId || req.body.user_id || req.query.user_id || 1; 
}

app.get('/api/agreement/requests/:userId', (req, res) => {
  const landlord_id = req.params.userId
  const LandLord_landlord_id = landlord_id;

    db.query('SELECT a.*, p.LandLord_landlord_id FROM agreement a JOIN property p ON a.Property_property_id = p.property_id WHERE p.LandLord_landlord_id = ? AND a.status = "pending"', [LandLord_landlord_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results.map(r => ({ property_id: r.Property_property_id, tenant_id: r.Tenant_tenant_id })));
    });
});

//  Confimation by landlord 
app.post('/api/agreement/confirm/:userId', (req, res) => {
    const { property_id, tenant_id, duration, deposit, rent_amount, rent_increase_x_months } = req.body;
    console.log('Received for confirm:', { property_id, tenant_id, duration, deposit, rent_amount, rent_increase_x_months });
    const Property_property_id = property_id;
    const Tenant_tenant_id = tenant_id;
    db.query('UPDATE agreement SET duration=?, deposit=?, rent_amount=?, rent_increase_x_months=?, status="landlord_filled" WHERE Property_property_id=? AND Tenant_tenant_id=? AND status="pending"',
        [duration, deposit, rent_amount, rent_increase_x_months, Property_property_id, Tenant_tenant_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        console.log('Landlord confirm update result:', result);
        res.json({ success: true });
    });
});

app.post('/api/agreement/exit/:userId', (req, res) => {
    const { property_id, tenant_id } = req.body;
    const Property_property_id = property_id;
    const Tenant_tenant_id = tenant_id;
    db.query('UPDATE agreement SET status = "cancelled" WHERE Property_property_id=? AND Tenant_tenant_id=? AND status IN ("pending", "landlord_filled")', [Property_property_id, Tenant_tenant_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.get('/api/agreements/all/:userId', (req, res) => {
    const landlord_id = req.params.userId;
    const LandLord_landlord_id = landlord_id;
    db.query(`SELECT a.*, t.first_name AS tenant_first_name, t.last_name AS tenant_last_name, p.address
              FROM agreement a
              JOIN property p ON a.Property_property_id = p.property_id
              JOIN tenant t ON a.Tenant_tenant_id = t.tenant_id
              WHERE p.LandLord_landlord_id = ?
              ORDER BY a.status, a.agreement_id DESC`, [LandLord_landlord_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const grouped = { pending: [], landlord_filled: [], active: [], cancelled: [] };
        results.forEach(ag => {
            if (grouped[ag.status]) grouped[ag.status].push(ag);
        });
        res.json(grouped);
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
