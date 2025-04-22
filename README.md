# EduCheck Frontend

EduCheck is a decentralized application (dApp) frontend built on the MultiversX dApp template, leveraging Next.js and the `@multiversx/sdk-dapp`. This project addresses issues of counterfeit certifications and unverifiable CV credentials by utilizing blockchain technology for secure, immutable credential verification.

---

## Key Highlights

### Foundation & Technology Stack
- **Next.js & MultiversX SDK:**  
  The front end is developed using Next.js, incorporating the `@multiversx/sdk-dapp` for seamless MultiversX Blockchain interactions, also connecting to the web2 user based NestJS system where all the data about the courses and assessments are set.
  
- **Blockchain Integration:**  
  Certificate hashes are verified and stored immutably on the blockchain, ensuring long-term authenticity. You can also log in with a web2 web wallet or the non custodial xPortal wallet.

- **Supporting Technologies:**  
  Incorporates smart contracts for validation (currently a ping pong transaction for mocking) and various React ecosystem tools (e.g., React Query, Tailwind, Zod, RHF, Zustand).
  Makes the MultiversX blockchain for signing documents ( currently only .txt formats for mocking ).

### Functionalities
- **Certificate Upload & Validation:**  
  Learners can upload and validate certificates securely on the blockchain.

- **Assessment Integration:**  
  Assessments reinforce the credibility of certificates.

- **Admin Interface:**  
  Provides admins with ability to manage web2 users, courses and assignments.

### Development & Testing
- **Environment Setup:**  
  - Configure `next.config.js` to transpile packages for the MultiversX SDK:
    ```js
    /** @type {import('next').NextConfig} */
    const nextConfig = {
      transpilePackages: ['@multiversx/sdk-dapp']
    };

    module.exports = nextConfig;
    ```
  - Use commands like `yarn start-testnet`, `yarn start-devnet`, or `yarn start-mainnet` to run the development server.
  
- **Testing:**  
  Comprehensive testing strategies include:
  - Unit Testing (using Jest)
  - E2E Testing using Cypress
