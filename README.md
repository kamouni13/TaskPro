\# TaskPro – Personal Workspace \& Productivity Platform



\*\*TaskPro\*\* is a modern productivity platform designed to help users organize projects, manage daily tasks, track progress, and keep important notes in one place.



Built with React and Laravel, TaskPro combines an interactive user interface with a RESTful API and a relational database.



\## ✨ Features



\- \*\*Dashboard\*\* – Overview of tasks, projects, progress, and productivity statistics.

\- \*\*Project Management\*\* – Create, update, delete, and track projects.

\- \*\*Task Management\*\* – Organize tasks with priorities, statuses, deadlines, and project assignments.

\- \*\*Kanban Board\*\* – Visualize and manage tasks across different workflow stages.

\- \*\*Calendar\*\* – View tasks and deadlines in a monthly calendar.

\- \*\*Notes\*\* – Create, edit, search, pin, and manage personal notes.

\- \*\*Statistics\*\* – Visual charts and productivity insights.

\- \*\*Settings\*\* – Customize display name, language, and appearance.

\- \*\*Help Center\*\* – Built-in guides and frequently asked questions.



\## 🛠️ Tech Stack



\### Frontend

\- React

\- Vite

\- Tailwind CSS

\- React Router DOM

\- Framer Motion

\- Axios

\- Recharts

\- Lucide React



\### Backend

\- PHP 8.2

\- Laravel 12

\- Laravel REST API

\- MySQL

\- Eloquent ORM



\### Development Tools

\- Git \& GitHub

\- Visual Studio Code

\- Composer

\- npm



\## 🎨 UI \& Experience



\- Modern SaaS dashboard design.

\- Dark and Light themes.

\- English and French languages.

\- Responsive layout for desktop, tablet, and mobile.

\- Interactive components and smooth animations.

\- Persistent demo data using browser LocalStorage.



\## 🏗️ Project Structure



```text

TaskPro/

│

├── frontend/          # React application

│   ├── public/

│   └── src/

│       ├── components/

│       ├── context/

│       ├── layouts/

│       ├── pages/

│       └── services/

│

├── backend/           # Laravel REST API

│   ├── app/

│   ├── database/

│   ├── routes/

│   └── tests/

│

└── README.md

```



\## 🚀 Getting Started



\### 1. Clone the repository



```bash

git clone YOUR\_REPOSITORY\_URL

cd TaskPro

```



\### 2. Run the Frontend



```bash

cd frontend

npm install

npm run dev

```



The frontend will be available at the local Vite development URL.



\### 3. Run the Backend



Open another terminal:



```bash

cd backend

composer install

```



Create your environment file:



```bash

copy .env.example .env

```



Generate the application key:



```bash

php artisan key:generate

```



Configure your MySQL database in `.env`, then run:



```bash

php artisan migrate

php artisan serve

```



The Laravel API will be available at:



`http://127.0.0.1:8000`



\## 🗄️ Database



TaskPro uses MySQL with Laravel migrations.



Main entities:



\- \*\*Projects\*\* – Project information and progress.

\- \*\*Tasks\*\* – Task details, priorities, statuses, and project relationships.

\- \*\*Notes\*\* – Personal notes and pinned items.



Project progress is calculated automatically based on completed tasks.



\## 🌐 Demo \& Deployment



The React frontend can be deployed independently using Vercel.



The public demo uses browser LocalStorage for visitor data. Each visitor's demo data remains stored locally in their own browser.



The Laravel backend is included in this repository as a standalone API and is intended to run locally. It is not hosted as part of the public Vercel demo.



\## 🔒 Security



\- Environment files and secrets are excluded from Git.

\- Dependencies and generated build files are excluded.

\- Database configuration is managed through environment variables.



\## 📌 Project Status



\*\*Development completed for the current feature scope.\*\*



Frontend pages, core CRUD operations, API endpoints, database relationships, and production build have been tested locally.



Further improvements and optimizations may be introduced in future versions.



\## 👨‍💻 Author



\*\*Mohamed Kamouni\*\*



Full Stack Developer



\- GitHub: \[kamouni13](https://github.com/kamouni13)



\---





