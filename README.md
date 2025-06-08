# GetThatJob - AI-Powered Resume Optimization Platform

A Next.js application that leverages AI to optimize resumes for specific companies and roles, featuring vector-based similarity search, intelligent resume parsing, and development-friendly testing modes.

## 🚀 Features

### Core Functionality
- **AI-Powered Resume Analysis**: Uses Cohere AI to generate semantic embeddings for intelligent resume analysis
- **Vector Database Storage**: Stores resume data in Zilliz Cloud for fast similarity searches
- **Company-Specific Optimization**: Tailors resume recommendations based on target companies
- **Resume Parsing**: Automatically extracts structured data from PDF resumes
- **Similarity Search**: Finds and ranks similar resumes based on vector similarity

### Development Features
- **Development Mode**: Bypass authentication for easier testing and development
- **Dual Upload Interface**: Upload both personal resumes and comparison files
- **Comprehensive Testing**: Built-in test suite for validating the entire vector pipeline
- **Error Handling**: Robust error handling with detailed logging
- **Type Safety**: Full TypeScript support with flexible data types

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes     │    │   AI Services   │
│                 │    │                  │    │                 │
│ • React/Next.js │◄──►│ • /resumeparser   │◄──►│ • Cohere AI     │
│ • DevMode UI    │    │ • /cleanparsed   │    │ • Vector Gen    │
│ • File Upload   │    │ • /vectorize     │    │                 │
│                 │    │ • /search-resumes│    └─────────────────┘
└─────────────────┘    └──────────────────┘               ▲
                                ▲                         │
                                │                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   Data Flow      │    │  Zilliz Cloud   │
                       │                  │    │                 │
                       │ 1. Parse PDF     │    │ • Vector Store  │
                       │ 2. Clean Data    │    │ • Similarity    │
                       │ 3. Vectorize     │    │ • Search Index  │
                       │ 4. Store & Search│    │                 │
                       └──────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React**: Component-based UI

### Backend & APIs
- **Next.js API Routes**: Serverless API endpoints
- **NextAuth.js**: Authentication (bypassed in dev mode)
- **PDF Parsing**: Resume content extraction

### AI & Vector Services
- **Cohere AI**: Text embedding generation
- **Zilliz Cloud**: Vector database and similarity search
- **Vector Embeddings**: Semantic similarity matching

### Development Tools
- **ESLint**: Code linting
- **Comprehensive Test Suite**: Vector pipeline validation
- **Development Mode**: Auth-bypass for testing

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Cohere AI API key
- Zilliz Cloud account

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GetThatJob
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your API keys and configuration:
   ```env
   # Zilliz Cloud Configuration
   ZILLIZ_ENDPOINT=https://your-cluster.zillizcloud.com
   ZILLIZ_TOKEN=your_zilliz_token

   # Cohere AI Configuration  
   COHERE_API_KEY=your_cohere_api_key

   # NextAuth Configuration
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000

   # Development Mode (optional)
   DEV_MODE=true
   NODE_ENV=development
   ```

4. **Run tests to validate setup**
   ```bash
   node test-complete.js
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Configuration

### Zilliz Cloud Setup
1. Create a Zilliz Cloud account at [cloud.zilliz.com](https://cloud.zilliz.com)
2. Create a new cluster
3. Get your endpoint URL and API token
4. The application will automatically create the required collection schema

### Cohere AI Setup
1. Sign up at [cohere.ai](https://cohere.ai)
2. Get your API key from the dashboard
3. The application uses the `embed-english-v3.0` model for embeddings

### Development Mode
Enable development mode to bypass authentication:
```env
DEV_MODE=true
NODE_ENV=development
```

This allows you to:
- Upload resumes without signing in
- Test the vector pipeline directly
- Upload comparison files for similarity testing

## 🚦 Usage

### Development Mode
1. Navigate to the homepage
2. The development interface will be visible when `DEV_MODE=true`
3. Upload a resume PDF using the "Upload Resume" section
4. Upload comparison resumes using the "Upload Comparison File" section
5. View results and similarity scores

### Production Mode
1. Users sign in via NextAuth
2. Upload resume through the authenticated interface
3. Specify target company for optimization
4. View analysis and recommendations

### API Endpoints

#### `/api/resumeparser`
- **Method**: POST
- **Purpose**: Parse PDF resume to extract text content
- **Input**: PDF file upload
- **Output**: Extracted text content

#### `/api/cleanparsed`
- **Method**: POST  
- **Purpose**: Clean and structure parsed resume data
- **Input**: Raw resume text
- **Output**: Structured resume object

#### `/api/vectorize`
- **Method**: POST
- **Purpose**: Generate embeddings and store in vector database
- **Input**: Structured resume data
- **Output**: Success confirmation with vector ID

#### `/api/search-resumes`
- **Method**: POST
- **Purpose**: Find similar resumes using vector search
- **Input**: Query text or resume data
- **Output**: Ranked list of similar resumes

## 🧪 Testing

### Comprehensive Test Suite
Run the complete test suite to validate your setup:

```bash
node test-complete.js
```

The test suite validates:
- ✅ Environment configuration
- ✅ Zilliz Cloud connectivity  
- ✅ Cohere AI integration
- ✅ Resume processing pipeline
- ✅ Vector operations
- ✅ Development mode workflow

### Individual Component Testing
For specific component testing, you can also run:

```bash
# Test only vector integration
node test-vector-integration.js
```

### Test Results
The test suite provides detailed feedback:
- **Green ✅**: Tests passing
- **Red ❌**: Tests failing with error details
- **Yellow ⚠️**: Warnings or missing optional components

## 🗂️ Project Structure

```
GetThatJob/
├── src/
│   └── app/
│       ├── components/
│       │   └── devresumeupload.tsx    # Development upload interface
│       ├── api/
│       │   ├── resumeparser/           # PDF parsing endpoint
│       │   ├── cleanparsed/           # Data cleaning endpoint  
│       │   ├── vectorize/             # Vector generation endpoint
│       │   └── search-resumes/        # Similarity search endpoint
│       ├── lib/
│       │   ├── zilliz.ts              # Zilliz Cloud service
│       │   └── cohere.ts              # Cohere AI service
│       ├── types/
│       │   └── resume.ts              # TypeScript type definitions
│       └── page.tsx                   # Main application page
├── test-complete.js                   # Comprehensive test suite
├── test-vector-integration.js         # Vector-specific tests
├── .env.example                       # Environment template
├── README.md                          # This file
└── package.json                       # Dependencies and scripts
```

## 🔍 Key Components

### DevResumeUpload Component
Located in `src/app/components/devresumeupload.tsx`
- Development-friendly upload interface
- Dual upload capability (personal + comparison resumes)
- Progress tracking and error handling
- Bypass authentication in dev mode

### Vector Services

#### Zilliz Service (`src/app/lib/zilliz.ts`)
- Connection management
- Collection schema creation
- Vector storage and retrieval
- Similarity search operations

#### Cohere Service (`src/app/lib/cohere.ts`)
- Text embedding generation
- Batch processing support
- Error handling and retries
- Type-safe resume data processing

### API Route Processing

#### Resume Parser (`/api/resumeparser`)
- PDF file processing
- Text extraction
- Error handling for various PDF formats

#### Clean Parsed (`/api/cleanparsed`)
- Data structure validation
- Field standardization
- **Note**: Vectorization removed to prevent double processing

#### Vectorize (`/api/vectorize`)
- Embedding generation
- Vector database storage
- Metadata association
- Success/failure tracking

## 🐛 Troubleshooting

### Common Issues

#### Environment Variables
- **Issue**: Missing or invalid API keys
- **Solution**: Verify all required variables in `.env` file
- **Test**: Run `node test-complete.js` to validate configuration

#### Zilliz Connection
- **Issue**: Connection timeout or authentication failure
- **Solution**: Check endpoint URL format and token validity
- **Test**: Look for "Zilliz Cloud Connectivity" test results

#### Cohere API
- **Issue**: Embedding generation failures
- **Solution**: Verify API key and rate limits
- **Test**: Check "Cohere AI Integration" test output

#### Double Vectorization (Fixed)
- **Issue**: Resumes being vectorized twice
- **Solution**: Vectorization logic removed from `/api/cleanparsed`
- **Verification**: Only `/api/vectorize` should handle vector operations

### Development Mode Issues
- **Issue**: Development interface not visible
- **Solution**: Ensure `DEV_MODE=true` in environment
- **Check**: Look for development sections on the homepage

### File Upload Issues
- **Issue**: PDF parsing failures
- **Solution**: Ensure PDF is text-based (not scanned image)
- **Test**: Try with a simple PDF first

## 🔐 Security Considerations

### Development vs Production
- **Development**: Authentication bypassed for testing
- **Production**: Full NextAuth.js authentication required
- **API Keys**: Store in environment variables, never commit to code

### Data Privacy
- Vector embeddings contain semantic information about resumes
- Ensure proper access controls in production
- Consider data retention policies

## 📈 Performance

### Vector Operations
- Embedding generation: ~1-2 seconds per resume
- Vector search: Sub-second response times
- Batch processing: Supported for multiple resumes

### Optimization Tips
- Use batch embedding for multiple resumes
- Implement proper error handling and retries
- Monitor API rate limits (Cohere)

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Run tests: `node test-complete.js`
4. Make changes with proper TypeScript types
5. Test thoroughly in development mode
6. Submit pull request

### Code Style
- Use TypeScript for type safety
- Follow existing naming conventions
- Add comprehensive error handling
- Update tests for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Getting Help
1. Check the troubleshooting section above
2. Run the test suite for diagnostic information
3. Review API endpoint responses for error details
4. Check environment variable configuration

### Documentation
- **API Documentation**: See individual route files for detailed parameter info
- **Type Definitions**: Check `src/app/types/resume.ts` for data structures
- **Test Examples**: Review test files for usage patterns

### Contact
For additional support or questions about the GetThatJob platform, please refer to the project repository or documentation.

---

**Built with ❤️ using Next.js, TypeScript, Cohere AI, and Zilliz Cloud**
