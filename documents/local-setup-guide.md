# bbus-fe

# 🚀 **Step-by-Step Guide to Set Up & Start `bbus-fe` Project**

---

## **1️⃣ System Requirements**
Before starting, ensure you have the following installed:

✅ **Node.js**: Version **16+** (Preferably **LTS**)
✅ **pnpm**: Package manager (Version **8+**)
✅ **Git**: To clone the repository
✅ **Vite**: (Already included in the project)

### 👉 **Check installed versions**

Run the following commands to check if the required tools are installed:

```sh
node -v  # Check Node.js version
pnpm -v  # Check pnpm version
git --version  # Check Git version
```

---

## **2️⃣ Clone the repository**

Use Git to clone the project:

```sh
git clone https://github.com/YOUR_USERNAME/dnthchung-bbus-fe.git
```

Replace `YOUR_USERNAME` with the actual repository owner if needed.

Move into the project directory:

```sh
cd dnthchung-bbus-fe/fe
```

---

## **3️⃣ Install dependencies**

Run the following command to install all necessary dependencies:

```sh
pnpm install
```

This will install all required packages based on `package.json`.

---

## **4️⃣ Set up environment variables**

The project requires a `.env` file. You can generate it using:

```sh
pnpm env:init
```

If the `.env` file does not exist, create it manually by copying `.env.example`:

```sh
cp .env.example .env
```

Then, open `.env` and update values as needed:

```
VITE_API_URL=http://localhost:4004
```

---

## **5️⃣ Start the development server**

Now, you can run the project in development mode:

```sh
pnpm dev
```

The project will start, and you should see output similar to:

```
VITE v6.x running at:
  ➜ Local: http://localhost:5173/
```

Open `http://localhost:5173/` in your browser to view the application.

---

## **6️⃣ Build the project (Optional)**

To create a production-ready build, run:

```sh
pnpm build
```

This will generate optimized files in the `dist/` folder.

To preview the build:

```sh
pnpm preview
```

---

## **7️⃣ Lint & Format Code (Optional, Recommended for Development)**

### **Check for linting errors**
```sh
pnpm lint
```

### **Check code formatting**
```sh
pnpm format:check
```

### **Automatically format code**
```sh
pnpm format
```

---

## **8️⃣ Troubleshooting**

### ❌ `pnpm` not found?
If you don’t have `pnpm` installed, install it with:

```sh
npm install -g pnpm
```

### ❌ Port conflict on `5173`?
Change the port in `vite.config.ts`:

```ts
export default defineConfig({
  server: {
    port: 3000, // Change this to another port
  }
})
```

Then restart the server:

```sh
pnpm dev
```

---

## **🎉 You're ready to go!**
Now you have successfully set up and started the `bbus-fe` project. 🚀
For further development, follow the project structure and contribute as needed!
