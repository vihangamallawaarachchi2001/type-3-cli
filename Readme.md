# **Type-3 CLI Tool**

[![npm version](https://img.shields.io/npm/v/type-3-cli?label=version)](https://www.npmjs.com/package/type-3-cli)
[![License](https://img.shields.io/npm/l/type-3-cli)](LICENSE)

Type-3 CLI is a powerful command-line tool designed to scaffold backend applications with minimal effort. Whether you're building a simple API or a full-fledged application with authentication, database integration, and logging, Type-3 CLI has got you covered. It supports both **TypeScript** and **JavaScript**, works seamlessly with popular databases like MongoDB, MySQL, and PostgreSQL, and provides robust features for modern development workflows.

> **Beta Release**: This is a beta version of the tool. Please report any bugs or issues on the [GitHub repository](https://github.com/vihangamallawaarachchi2001/type-3-cli).

---

## **Features**

✅ **Language Support**:
- Generate projects in **TypeScript** or **JavaScript**.

✅ **Database Integration**:
- Supports **MongoDB**, **MySQL**, **PostgreSQL**, or **No Database** setups.

✅ **Authentication**:
- Built-in support for JWT-based authentication (optional).

✅ **Logging**:
- Integrated Winston and Morgan logging utilities (optional).

✅ **Customizable Configuration**:
- Choose your preferred package manager (`npm`, `yarn`, `pnpm`).
- Configure environment variables via `.env`.

✅ **Project Structure**:
- Automatically generates a clean, modular project structure with:
  - Controllers
  - Services
  - Routes
  - Models
  - Middleware
  - Utilities

✅ **Fallback "Hello World"**:
- Generates a simple "Hello World" API when no database is selected.

---

## **Installation**

To install the Type-3 CLI globally, run:

```bash
npm install -g type-3-cli@beta
```

Or, if you're using `yarn`:

```bash
yarn global add type-3-cli@beta
```

Verify the installation by checking the version:

```bash
type-3 --version
```

---

## **Usage**

### **1. Initialize a New Project**

Run the following command to create a new project:

```bash
type-3 init
```

This will prompt you to answer a series of questions about your project configuration.

### **2. Example Workflow**

```bash
type-3 init
```

#### Prompts:

1. **Project Name**
   - my-api
  
2. **Programming Language**:
   - TypeScript or JavaScript?

3. **Database**:
   - MongoDB, MySQL, PostgreSQL, or None?

4. **Authentication**:
   - Include JWT-based authentication? (Yes/No)

5. **Logging**:
   - Include logging utilities? (Yes/No)

6. **Package Manager**:
   - npm, yarn, or pnpm?

7. **Project Name**:
   - Confirm the project name.

Once you've answered all prompts, the CLI will generate the project structure and install dependencies automatically.

---

## **Generated Project Structure**

Here’s an example of the generated project structure:

```
my-api/
├── src/
│   ├── config/         # Database and other configurations
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Authentication middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Logger utilities
│   └── server.ts       # Entry point
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── package.json        # Dependencies and scripts
├── README.md           # Project documentation
└── tsconfig.json       # TypeScript configuration (if applicable)
```

---

## **Running the Application**

### **Development Mode**
Navigate to the project directory and start the development server:

```bash
cd my-api
npm run dev
```

or

```bash
yarn run dev
```

or

```bash
pnpm run dev
```

The server will start on `http://localhost:3000` by default.

### **Production Build**
For TypeScript projects, build the project first:

```bash
npm run build
```

Then start the production server:

```bash
npm run start
```

---

## **Configuration**

### **Environment Variables**
Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
NODE_ENV=development
DB_URL=mongodb://localhost:27017/mydatabase
JWT_SECRET=your-secret-key
LOG_LEVEL=info
```

Adjust these values based on your project's requirements.

---

## **Contributing**

We welcome contributions from the community! Here’s how you can help:

1. **Fork the Repository**:
   - Fork the [GitHub repository](https://github.com/vihangamallawaarachchi2001/type-3-cli).

2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/your-username/type-3-cli.git
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Make Changes**:
   - Add features, fix bugs, or improve documentation.

5. **Test Your Changes**:
   ```bash
   npm test
   ```

6. **Submit a Pull Request**:
   - Push your changes and open a pull request against the `main` branch.

---

## **Reporting Issues**

If you encounter any bugs or have feature requests, please open an issue on the [GitHub repository](https://github.com/vihangamallawaarachchi2001/type-3-cli/issues).

### **Before Opening an Issue**:
- Check the existing issues to avoid duplicates.
- Provide detailed information about the problem, including steps to reproduce it.

---

## **Roadmap**

### **📌 Phase 1: Beta Release**
- **Status**: ✅ Developed  
- **Focus**: Core Features  
- **Key Deliverables**:
  - Project scaffolding (structured folder generation).
  - Authentication utilities (JWT, bcrypt, OAuth-ready templates).
  - Logger setup (Winston/Pino-based logging).
  - Sample route, controller, and service generation.
  - `.gitignore`, `.env`, and `README` auto-setup.
  - Database connection support (MongoDB, PostgreSQL, MySQL).
- **Release Plan**:
  - Public Beta Launch.
  - Gather feedback from early adopters.
  - Fix bugs and minor refinements.

---

### **🚀 Phase 2: Stability & DX Enhancements (v1.0 Stable Release)**  
- **Focus**: Developer Experience (DX) and Stability  
- **Key Deliverables**:
  - **Typescript-first mode** (`--typescript` flag).
  - Unit testing setup (Jest + Supertest).
  - Error-handling middleware.
  - Command-line help/docs (`type-3 --help`).
  - ESM & CommonJS support.
  - Performance optimizations (Compression, Helmet, PM2-ready configurations).
- **Release Plan**:
  - v1.0 Stable Release 🚀
  - Community adoption and early contributor onboarding.

---

### **🌟 Phase 3: Developer Productivity & Scalability Features (v2.0 - Advanced Features)**  
- **Focus**: Advanced Features for Scalability and Productivity  
- **Key Deliverables**:
  - **Database model generator**: `type-3 generate model <name>`.
  - Auto API documentation (Swagger/OpenAPI integration).
  - Middleware generator: `type-3 generate middleware <name>`.
  - Role-based Access Control (RBAC) template.
  - Background job support (BullMQ integration).
  - CLI-based authentication setup (`--auth=jwt` / `--auth=oauth` options).
- **Release Plan**:
  - v2.0 release with database models & API docs.
  - Extend testing capabilities.
  - Create interactive CLI prompts.

---

### **🔥 Phase 4: Advanced Automation & Deployment Features (v3.0 - Enterprise Ready)**  
- **Focus**: Enterprise-Grade Features and Automation  
- **Key Deliverables**:
  - Multi-tenancy support.
  - Microservices-ready scaffolding.
  - GraphQL integration option.
  - CI/CD pipeline generator: `type-3 setup ci --github-actions`.
  - Auto Dockerfile & Kubernetes configs: `type-3 setup docker`.
  - Plugin System: `type-3 add plugin <name>`.
- **Release Plan**:
  - Establish Type-3 as the industry standard for Express app generation.
  - Open-source contribution expansion.

---

## **Overall Timeline**

| **Phase**               | **Version**  | **Timeline**       |
|--------------------------|--------------|--------------------|
| **Beta Release**         | v0.x         | Q1 2025           |
| **Stable v1.0**          | v1.0         | Q2 2025           |
| **Advanced Features**    | v2.0         | Q3 2025           |
| **Enterprise Readiness** | v3.0         | Q4 2025           |

---

## **License**

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## **Acknowledgments**

- Inspired by tools like [Express Generator](https://expressjs.com/en/starter/generator.html) and [NestJS CLI](https://docs.nestjs.com/cli/usages).
- Built with ❤️ using Node.js and JavaScript.

---

## **Contact**

For questions or feedback, feel free to reach out:

- GitHub: [@vihangamallawaarachchi2001](https://github.com/vihangamallawaarachchi2001/type-3-cli)
- Email: vihanganethusara00@gmail.com

---

### **Explore Type-3 CLI ! 🚀**

---