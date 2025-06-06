
#  QuestNest

**QuestNest** adalah platform web inovatif yang menggabungkan manajemen tugas dengan elemen permainan (gamification) untuk meningkatkan produktivitas individu dan tim. Dengan sistem XP, badge, dan leaderboard, menyelesaikan tugas menjadi lebih menyenangkan, memotivasi, dan penuh tantangan.

## Contributors
- [Audy Natalie Cecilia Rumahorbo](https://github.com/audynatalie) - 2306266962
- [Muhammad Raditya Alif Nugroho](https://github.com/dityalif) - 2306212745
- [Alfonsus Tanara Gultom](https://github.com/alfons07) - 2306267126
- [Samih Bassam](https://github.com/BlueBerryCakeee) - 2306250623 


##  Tech Stack:

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) 


##  Fitur Utama

- ✅ **Manajemen Tugas Interaktif**  
  Buat, kelola, dan tandai tugas sebagai selesai untuk mendapatkan XP.

- 🏆 **Badge Achievement**  
  Kumpulkan berbagai badge eksklusif berdasarkan performa dan pencapaian pribadi.

- 📈 **Leaderboard Tim & Global**  
  Bersaing secara sehat dengan rekan tim atau seluruh komunitas pengguna.

- 🤝 **Kolaborasi Tim**  
  Bentuk challenge bersama, selesaikan misi kolektif, dan tingkatkan produktivitas tim.

- 🔄 **Gamifikasi Aktivitas Sehari-hari**  
  Ubah rutinitas menjadi pengalaman seperti bermain game yang rewarding dan seru.

## Diagram

ERD 

![proyek akhirr_sbd_erd.drawio](https://hackmd.io/_uploads/By0CupKZlg.png)

UML 

![Untitled Diagram.drawio](https://hackmd.io/_uploads/Byy7-Mqble.png)

Flowchart 

![Flowchart_QuestNest](https://hackmd.io/_uploads/H1U38l9bxe.jpg)



## Tables 

### 1. Users

This table stores information about users of the QuestNest application.

- id
- name
- username
- email
- password
- xp
- level
- avatar
- created_at

### 2. Challenges

This table stores information about challenges that users can participate in.

- id
- title
- description
- category
- difficulty
- points
- type
- deadline
- creator_id
- created_at

### 3. Teams

This table stores information about teams that users can join.

- id
- name
- description
- creator_id
- created_at

### 4. Badges

This table stores information about achievement badges that users can earn.

- id
- name
- description
- condition

### 5. User_Badges

This table manages the relationship between users and the badges they have earned.

- id
- user_id
- badge_id
- earned_at
- progress

### 6. Leaderboards

This table stores leaderboard information for users and teams.

- id
- type
- reference_id
- xp
- period

### 7. Team_Members

This table manages the membership of users in teams.

- id
- team_id
- user_id
- role
- joined_at

### 8. Team_Challenges

This table manages the assignment of challenges to teams.

- id
- team_id
- challenge_id
- assigned_at

### 9. Challenge_Participants

This table tracks users and teams participating in challenges.

- id
- challenge_id
- user_id
- team_i


## Instalasi

### Prasyarat
- Node.js (v14.x atau yang lebih baru)
- npm atau yarn
- PostgreSQL (v13.x atau yang lebih baru)

### Langkah 1: Clone Repository
```bash
git clone https://github.com/dityalif/Quest-Nest.git
cd Quest-Nest
```

### Langkah 2: Instalasi Backend
```bash
# Masuk ke direktori backend
cd backend

# Install dependencies
npm install
# atau menggunakan yarn
yarn install

# Konfigurasi environment variables
cp .env.example .env
# Sesuaikan konfigurasi database dan credential lainnya di file .env

# Setup database
npm run db:migrate
# atau menggunakan yarn
yarn db:migrate

# (Opsional) Isi database dengan data awal
npm run db:seed
# atau menggunakan yarn
yarn db:seed

# Jalankan server backend
npm run dev
# atau menggunakan yarn
yarn dev
```

Server backend akan berjalan pada `http://localhost:5000` (atau port yang dikonfigurasi di .env).

### Langkah 3: Instalasi Frontend
```bash
# Masuk ke direktori frontend (dari root project)
cd frontend

# Install dependencies
npm install
# atau menggunakan yarn
yarn install

# Konfigurasi environment variables
cp .env.example .env
# Sesuaikan konfigurasi API endpoint dan credential lainnya di file .env

# Jalankan aplikasi frontend
npm run dev
# atau menggunakan yarn
yarn dev
```

Aplikasi frontend akan berjalan pada `http://localhost:3000` (atau port yang dikonfigurasi).

### Langkah 4: Akses Aplikasi
Buka browser dan akses aplikasi melalui:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`

## Progress Report 
![WhatsApp Image 2025-05-20 at 21.31.57_8704020a](https://hackmd.io/_uploads/ryEKfz5Zxx.jpg)

![WhatsApp Image 2025-05-20 at 21.31.58_7cb0529b](https://hackmd.io/_uploads/r12oGMcblx.jpg)













