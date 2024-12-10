
# CampusCrew Project

CampusCrew is a platform designed to empower PFW students by enabling them to create and avail services seamlessly. Whether it's offering tutoring, organizing events, or providing other forms of assistance, CampusCrew bridges the gap between service providers and seekers within the student community.

Here is the link to website: https://campuscrew.onrender.com/

---

## Setup Guide

Follow these steps to set up and run the CampusCrew project:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd campuscrew
```

### 2. Install Python and Pip
Ensure Python and pip are installed on your system. Download Python from the [official Python website](https://www.python.org/).

### 3. Set Up a Python Virtual Environment
Run the following commands to create and activate a virtual environment:

#### On Unix or macOS:
```bash
python -m venv venv
source venv/bin/activate
```

#### On Windows:
```bash
python -m venv venv
venv\Scripts\activate
```

### 4. Install Backend Dependencies
Navigate to the `campuscrew-be` folder and run:
```bash
pip install -r requirements.txt
```

---

## Configuring Supabase

### Access Supabase Project
1. Obtain access to the CampusCrew Supabase project.
2. Open the `config.py` file and update the following variables:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SECRET_KEY`

### Retrieve Values from Supabase:
- **SUPABASE_URL**:  
  Found under `Project Settings -> API -> Project URL`.

- **SUPABASE_KEY**:  
  Found under `Project Settings -> API -> Project API Keys -> Public`.

- **SECRET_KEY**:  
  Found under `Project Settings -> API -> Project API Keys -> Secret`.

---

## Frontend Setup

### 1. Prerequisites
Ensure the following are installed on your system:
- **Node.js** (v16 or later): Download from the [Node.js official website](https://nodejs.org/).
- **npm**: Comes bundled with Node.js.
- **yarn**: Optional, but recommended. Install globally using:
  ```bash
  npm install -g yarn
  ```

### 2. Install Frontend Dependencies
Run the following command in the project root:
```bash
npm install
```

### 3. Start the Frontend
Launch the development server using:
```bash
npm start
```

---

## Running Cypress Tests

1. Install Cypress dependencies:
   ```bash
   npm install
   ```
2. Run tests:
   ```bash
   npm run test
   ```