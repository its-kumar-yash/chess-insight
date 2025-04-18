
# ♟️ ChessInsight

A free chess analysis tool that helps players improve their game by providing professional-level analysis without premium subscriptions.

![alt text](/public/demo.png)
![alt text](/public/demo2.png)
![alt text](/public/demo3.png)

## 🚀 Features

- ♟ Upload PGN or fetch games from Chess.com/Lichess
- 🔍 Analyze each move with Stockfish via chess-api.com
- 🎯 Move categorization: Book, Brilliant, Blunder, etc.
- 🧭 Move navigation with visual arrows
- 🕰 Full game replay with progress control
- 🔐 User login via Google
- 💾 Save analyzed games and revisit anytime
- 🧮 View Statistics based on the analyzed games 

## 🧪 Setup & Run Locally

### 🔧 Clone the repo

```bash
git clone https://github.com/its-kumar-yash/chess-insight.git
cd chess-insight
```

### Create .env file
```bash
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_SECRET=
DATABASE_URL=
```

### 📦 Install dependencies

```bash
npm install
```

### ▶️ Run the app

```bash
npm run dev
```

## 📁 Tech Stack

- 🧱 Next.js
- ♻️ TypeScript
- 📦 Zustand (state management)
- ♟ react-chessboard
- 🔍 chess-api.com (Stockfish analysis)
- 🎨 Tailwind CSS
- 🔒 NextAuth
- 🗃️ Neon DB
- ♻️ Prisma ORM

## 📈 Roadmap

- [x] Game Analysis from PGN  
- [x] Highlight Move Categories  
- [x] Best Move Arrows  
- [x] Add User Profiles & Dashboard  
- [x] Save Analyzed Games to DB  
- [x] Add Evaluation Graph  

## 🧑‍💻 Contributing

Contributions, suggestions, and ideas are welcome!  
Feel free to fork the project and submit a PR. Make sure to lint and test your changes.

## 📝 License

MIT License © [LICENCE](/LICENCE)

## Acknowledgments

- Chess.com and Lichess for inspiration
- Chess-API.com for analysis capabilities
- All contributors who help improve this platform


Created with ♟️ for chess enthusiasts everywhere
