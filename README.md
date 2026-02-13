## AYEM DAO Backend

REST API service that syncs blockchain events and provides data about DAO proposals and votes.

**Part of a full-stack DAO project:**

- [Live Demo](https://dao-front.vercel.app) - Try the DAO in action
- [Contracts Repository](https://github.com/Emelya99/dao) - Smart contracts implementation
- [Frontend Repository](https://github.com/Emelya99/dao-front) - Web interface for interacting with the DAO

### Features

- **Blockchain event sync**: Continuously polls the blockchain for new proposals and votes, stores them in memory
- **SIWE authentication**: Sign-In with Ethereum flow for wallet-based user authentication
- **REST API**: Endpoints to get proposals, voting results, authenticate users, and request test tokens
- **Event handling**: Processes `ProposalCreated`, `ProposalExecuted`, and `Vote` events automatically. Dynamically starts polling each new proposal contract to track votes
- **Error handling**: Retry logic with exponential backoff for RPC calls
- **Historical sync**: Optional startup sync of past events via `LOAD_ARCHIVE_ON_START` flag

### Tech stack

- **Language**: TypeScript `^5.9.3`
- **Runtime**: Node.js
- **Framework**: Express `^5.1.0`
- **Blockchain**: ethers.js `^6.15.0`
- **Authentication**: SIWE (Sign-In with Ethereum) `^3.0.0`

### API Endpoints

- `GET /proposals` - Get all proposals
- `GET /proposals/:id` - Get proposal details
- `GET /results/:id` - Get voting results with individual votes
- `GET /auth/nonce` - Get nonce for SIWE authentication
- `POST /auth/verify` - Verify SIWE signature
- `POST /faucet` - Request governance tokens (testnet only)

### Environment Variables

```env
RPC_URL=<Hoodi Network RPC endpoint>
DAO_ADDRESS=<DAO contract address>
TOKEN_ADDRESS=<AYEMToken contract address>
PRIVATE_KEY=<Wallet private key for faucet>
PORT=3000
POOLING_INTERVAL=3000
LOAD_ARCHIVE_ON_START=false
START_BLOCK=<optional starting block>
```

### Running

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### How It Works

1. **Two polling loops**: 
   - DAO contract polling: Monitors `ProposalCreated` and `ProposalExecuted` events
   - Proposal contract polling: Dynamically starts for each new proposal to track `Vote` events
2. **Event processing**: When a new proposal is created, service discovers its contract address and starts tracking votes
3. **Storage**: All data is kept in memory (Map-based) for fast API responses
4. **API**: Frontend requests data from this service instead of querying the blockchain directly

**Note**: In-memory storage was chosen for simplicity. The blockchain is the source of truth. For production, this could be migrated to a database (PostgreSQL/MongoDB) with the same sync logic.

