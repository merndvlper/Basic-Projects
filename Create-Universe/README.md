# 🌌 Create-Universe

A blockchain-based simulation project developed with the **Move** programming language for the **Sui** network.

## 🚀 Overview

**Create-Universe** is a smart contract project that demonstrates how to model and manage complex entities as **Sui Objects**. It focuses on the fundamental concepts of the Move language, such as object ownership, capability-based access control, and on-chain state transitions.

## ✨ Key Features

* 🏗️ **Object-Centric Modeling:** Defines universal entities as unique Sui Objects with global identifiers (`UID`).
* 🔐 **Ownership Management:** Demonstrates how objects are created, transferred, and owned within the Sui ecosystem.
* ⚙️ **On-chain Logic:** Implements smart contract functions to manipulate the state of the "universe" directly on the blockchain.
* 🧩 **Modular Move Structure:** Organized into clear modules for better maintainability and testing.

## 🛠️ Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **Move** | Smart contract programming language |
| **Sui CLI** | Build and deployment tool |
| **Move.toml** | Package management and dependencies |

## 📦 Getting Started

### Prerequisites

* Sui CLI installed — [Sui Install Guide](https://docs.sui.io/build/install)

### Installation & Testing

1. Clone the repository:
   ```bash
   git clone https://github.com/merndvlper/Basic-Projects.git
2. Navigate to the project directory:
   ```bash
   cd Basic-Projects/Create-Universe/move
3. Build the contract:
   ```bash
   sui move build
5. Run tests:
   ```bash
   sui move test
6. Navigate to the UI folder:
   ```bash
   cd Create-Universe/UI
   npm install
   npm run dev
