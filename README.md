# Real Estate Management System with Real-Time Chat

This project is a full-stack real estate management platform that allows **landlords** to manage and advertise their properties, and **tenants** to browse, communicate, and manage their profiles. It includes a real-time chat system that enables direct communication between tenants and landlords via **WebSockets**.

---
# Preview

<img width="1919" height="778" alt="image" src="https://github.com/user-attachments/assets/db495bae-1312-4429-b8bc-8097f6f0e51d" />


---

## Table of Contents
- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
- [SQL Database Schema](#-sql-database-schema)
- [How the Chat System Works](#-how-the-chat-system-works)
- [Roles & Access](#-roles--access)
- [Screenshots / UI Highlights](#-screenshots--ui-highlights)
- [Credits](#-credits)


---

## Features

### Landlord:
- Add, edit, delete properties.
- Manage Agreements with tenants.
- Advertise selected properties.
- Manage advertisements with rent, status, and expense.
- View and update profile.

### Tenant:
- Browse advertised properties.
- Make agreement with landlords.
- View landlord contact through ads.
- Engage in real-time chat with landlord.
- View and update profile (except user ID).

### Chat (Shared):
- Built with WebSockets using `Socket.IO`.
- Live multi-user chat (tenant ↔ landlord).
- Messages include sender identity and timestamps.
- Switchable role selector (for testing/demo).

---

## Technologies Used

- **Backend**: Node.js, Express.js, Socket.IO
- **Frontend**: HTML, CSS, JavaScript, jQuery
- **Database**: MySQL
- **Real-time**: WebSockets (Socket.IO)
- **Server Files**: `tenant_t_script.js`, `landlord_s_script.js`, `chat_server.js`

---

## Project Structure

```
project-root/
├── chat_server.js
├── tenant_t_script.js
├── landlord_s_script.js
├── real_estate_folder/
│   ├── html_files/
│   │   ├── All html files
│   ├── css_files/
│   │   └── All css files
│   └── js_scripts/
│       └── All jsfiles of client side
├── README.md

```

---

## Setup Instructions

### 1. Install dependencies

```bash
npm install express mysql2 body-parser ws
```

### 2. Create MySQL Database
Create database in MYSQL Workbench locally




### 3. Start Servers

```bash
# Terminal 1 - WebSocket Chat Server
node chat_server.js

# Terminal 2 - Tenant Server
node tenant_t_script.js

# Terminal 3 - Landlord Server
node landlord_s_script.js
```

### 4. Open in Browser

- `http://localhost:3000` → Tenant Dashboard  
- `http://localhost:4000` → Landlord Dashboard  

Then click **Chat** from either dashboard.

---

## SQL Database Schema

```sql
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  cnic_no VARCHAR(15),
  contact_no VARCHAR(20),
  role ENUM('tenant', 'landlord')
);

...

```

---

## How the Chat System Works

- `chat_server.js` runs a WebSocket server on port 5000.
- `chat.html` connects using the browser via Web sockets.
- Both tenants and landlords can join the chatroom.
- Messages are timestamped and styled based on role.
- All users receive real-time broadcasts.

---

## Roles & Access

| Role     | Server Script          | Features Enabled                           |
|----------|------------------------|--------------------------------------------|
| Landlord | `landlord_s_script.js` | Dashboard, Property, Ads, Profile, Chat, Agreements     |
| Tenant   | `tenant_t_script.js`   | Dashboard, View Ads, Profile, Chat, Agreements          |

---

## Screenshots / UI Highlights


### Dashboard
![alt text](/real_estate_folder/web_pics/image-11.png)

### Agreement Between Landlord & Tenant
![alt text](/real_estate_folder/web_pics/image-6.png)
![alt text](/real_estate_folder/web_pics/image-7.png)


### Landlord Managing properties
![alt text](/real_estate_folder/web_pics/image-4.png)

![alt text](/real_estate_folder/web_pics/image-5.png)

### Tenant viewing advertised properties
![alt text](/real_estate_folder/web_pics/image-3.png)

### Managing Your profile
![alt text](/real_estate_folder/web_pics/image-1.png)

![alt text](/real_estate_folder/web_pics/image-2.png)

### Chat System Between Tenant and a Landlord
![alt text](/real_estate_folder/web_pics/image.png)



---

## Credits

- Developed by: **Syed Areeb Ashraf**
- Student of: FAST-NUCES (KHI Campus)
- Course: **DataBase Management System / Computer Networks**
