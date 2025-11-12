# ContribHub - Quick Start Guide

## What's New? 🎉

Your ContribHub application now has **two powerful feature sets** in one unified platform:

### 1. Tool Contribution Platform (Original)
Submit Web3 tools with AI validation and earn cross-chain rewards

### 2. RPC Infrastructure Management (New!)
Contribute RPC endpoints to the Chain-Love repository with GitHub integration

## Running the Application

```bash
# Install dependencies (if not already done)
pnpm install

# Start development server
pnpm dev

# Open browser
http://localhost:3000
```

## Navigation Overview

The navigation bar now includes all features:

**Tool Contribution Section:**
- **Contribute Tools** → Submit Web3 tools to repository
- **Storage** → Manage your Filecoin storage

**RPC Management Section:**
- **Fork & PR** → Fork Chain-Love repo and create pull requests  
- **Add RPC** → Add new RPC endpoints to the database
- **Browse RPCs** → Search and explore all RPC endpoints

## Key Features by Route

### Tool Contribution Routes

#### `/` - Homepage
- Overview of ContribHub features
- Quick access to both feature sets
- Beautiful animated UI with call-to-action buttons

#### `/contribute` - Contribute Web3 Tools
- Submit tools with metadata
- Upload to IPFS/Filecoin storage
- AI-powered quality analysis
- Cross-chain reward selection

#### `/contribute/table` - View All Contributions
- Browse past contributions
- Track submission status
- View AI analysis results

#### `/manage-storage` - Storage Management
- Monitor Filecoin storage usage
- Manage datasets
- View storage costs and balances

### RPC Management Routes (New!)

#### `/fork-pr` - Fork & Create PR
1. Authenticate with GitHub (OAuth)
2. Fork the Chain-Love repository to your account
3. Create pull requests directly from the UI
4. Track your contributions

#### `/add-rpc` - Add RPC Endpoint
- User-friendly form to add RPC endpoints
- Validates input data
- Creates formatted PR automatically
- Supports multiple blockchain networks

#### `/rpc` - Browse RPC Endpoints
- Search across all RPC endpoints
- Filter by network, provider, chain
- View detailed endpoint information
- Copy RPC URLs with one click

## API Endpoints

### Tool Contribution APIs
- `POST /api/ipfs/upload` - Upload files to IPFS
- `POST /api/execute-swap` - Execute cross-chain token swaps
- `GET /api/geolocation` - Get user geolocation

### RPC Management APIs
- `GET /api/github/auth` - Start GitHub authentication
- `GET /api/github/callback` - OAuth callback handler
- `GET /api/github/check-auth` - Check auth status
- `POST /api/github/fork` - Fork repository
- `POST /api/github/create-pr` - Create pull request
- `POST /api/github/create-rpc-pr` - Create RPC-specific PR
- `GET /api/config` - Get app configuration
- `GET /api/all-rpc` - Fetch all RPC endpoints
- `GET /api/infrastructure-providers` - Get infrastructure providers

## Setup Requirements

### For Tool Contribution (Already Configured)
- Filecoin Calibration testnet access
- USDFC tokens (for storage payments)
- Web3 wallet (MetaMask, etc.)

### For RPC Management (New - Requires Setup)

1. **Create GitHub OAuth App**:
   ```
   1. Go to: https://github.com/settings/developers
   2. Click "New OAuth App"
   3. Set Application name: "ContribHub"
   4. Set Homepage URL: http://localhost:3000
   5. Set Callback URL: http://localhost:3000/api/github/callback
   6. Click "Register application"
   7. Note your Client ID and generate a Client Secret
   ```

2. **Add Environment Variables**:
   Create/update `.env.local`:
   ```bash
   # GitHub OAuth (for RPC features)
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GITHUB_APP_URL=http://localhost:3000/api/github/callback
   
   # Existing variables for tool contribution
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_id
   # ... keep your existing environment variables
   ```

3. **Restart the dev server** after adding environment variables

## Common Workflows

### Contributing a Web3 Tool

1. Navigate to homepage (`/`)
2. Click "Start Contributing" or use nav → "Contribute Tools"
3. Fill in tool details (name, description, category, etc.)
4. Select reward network (Base/Avalanche/Arbitrum)
5. Upload files to Filecoin storage
6. Submit for AI analysis
7. Track contribution in the table view

### Adding an RPC Endpoint

1. Navigate to `/fork-pr`
2. Click "Login with GitHub" to authenticate
3. Click "Fork Repository" (if not already forked)
4. Navigate to `/add-rpc`
5. Fill in RPC endpoint details:
   - Provider name
   - Network and chain
   - RPC URL
   - Node type, plan details
   - SLA information
6. Click "Create Pull Request"
7. PR will be automatically created in your fork
8. Submit PR to upstream Chain-Love repository

### Browsing RPC Endpoints

1. Navigate to `/rpc`
2. Use the search bar to find specific endpoints
3. Filter by network, provider, or chain
4. Click copy button to copy RPC URLs
5. View detailed information for each endpoint

## Tech Stack

- **Framework**: Next.js 15.3.2 (App Router)
- **UI**: React 19, Tailwind CSS 4, shadcn/ui
- **Web3**: Wagmi, RainbowKit, Viem
- **Storage**: Filecoin Synapse SDK
- **State**: TanStack Query, Zustand
- **Animations**: Framer Motion
- **Validation**: Zod

## Troubleshooting

### GitHub Authentication Not Working
- Ensure GitHub OAuth app is created
- Verify `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set
- Check callback URL matches your OAuth app settings
- Restart dev server after adding env variables

### IPFS Upload Failing
- Check wallet is connected
- Ensure sufficient USDFC balance for storage
- Verify Filecoin network connection

### Components Not Rendering
- Clear `.next` cache: `rm -rf .next`
- Reinstall dependencies: `pnpm install`
- Restart dev server

## Development Tips

1. **Hot Reload**: The app uses Turbopack for fast hot reloading
2. **Type Safety**: All routes and APIs are fully typed with TypeScript
3. **Styling**: Use Tailwind classes or shadcn/ui components
4. **State**: Use TanStack Query for server state, Zustand for client state
5. **Testing**: Test both feature sets independently

## Support & Documentation

- **Full Integration Details**: See `INTEGRATION_SUMMARY.md`
- **Filecoin Storage**: See main `README.md`
- **Swap Setup**: See `ONLYSWAP_SETUP.md`
- **Scripts**: See `scripts/README.md`

## What Changed?

✅ **Added**: RPC management features from `src` folder
✅ **Enhanced**: Navigation with all features
✅ **Unified**: Single cohesive application
✅ **Maintained**: All existing functionality intact
✅ **Improved**: Consistent styling and UX

The `src` folder is no longer needed - all functionality is now in the main app structure!

---

**Happy Contributing! 🚀**

