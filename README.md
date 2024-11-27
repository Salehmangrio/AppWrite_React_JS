# Appwrite Integration Documentation

This documentation provides an overview of the configuration and functionality of Appwrite authentication and database operations in the project.<br>

- <a href="/main/What%20is%20Appwrite%3F%3F.md"> What is Appwrite in little Detail?</a>
## 1. **Appwrite Configuration (conf.js)**

The **`conf.js`** file stores the configuration settings for connecting to Appwrite services such as authentication, database, and storage. It uses environment variables for secure configuration.

### **File: `conf.js`**

```javascript
const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectID: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseID: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionID: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteBucketID: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
};

export default conf;
```

### **Environment Variables**:
- `VITE_APPWRITE_URL`: The URL for the Appwrite instance (e.g., `http://localhost/v1`).
- `VITE_APPWRITE_PROJECT_ID`: The unique project ID assigned to your Appwrite project.
- `VITE_APPWRITE_DATABASE_ID`: The ID for your Appwrite database.
- `VITE_APPWRITE_COLLECTION_ID`: The ID of the collection within the Appwrite database.
- `VITE_APPWRITE_BUCKET_ID`: The ID of the storage bucket for file management.

## 2. **Appwrite Authentication Service (AuthService.js)**

The **`AuthService`** class handles user authentication operations such as user creation, login, session management, and user retrieval. It uses the **Appwrite Account API** for managing users.

### **File: `AuthService.js`**

```javascript
import { Client, Account, ID } from 'appwrite';
import conf from '../conf/conf.js';

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectID);
        this.account = new Account(this.client);
    }

    // Create a new user account
    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (e) {
            throw console.error(e);
        }
    }

    // Login a user with email and password
    async login({ email, password }) {
        try {
            const userSession = await this.account.createEmailSession(email, password);
            return userSession;
        } catch (e) {
            throw console.error(e);
        }
    }

    // Get the current authenticated user's details
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (e) {
            throw console.error(e);
        }
    }

    // Logout the current user
    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (e) {
            throw console.error(e);
        }
    }
}

const authService = new AuthService();

export default authService;
```

### **Key Methods**:
- **createAccount({ email, password, name })**: Creates a new user account and logs them in.
- **login({ email, password })**: Logs in the user with email and password.
- **getCurrentUser()**: Retrieves the details of the current logged-in user.
- **logout()**: Logs out the user and deletes their sessions.

## 3. **Appwrite Database Service (Service.js)**

The **`Service`** class interacts with the Appwrite database, allowing you to create, update, delete, and retrieve documents. It also handles file uploads and deletion with the Appwrite storage service.

### **File: `Service.js`**

```javascript
import conf from '../appwrite/config.js';
import { Client, ID, Databases, Storage, Query } from 'appwrite';

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectID);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    // Create a new post document
    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug,
                {
                    title, content, featuredImage, status, userId
                }
            );
        } catch (e) {
            throw console.error(e);
        }
    }

    // Update an existing post document
    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug,
                {
                    title, content, featuredImage, status
                }
            );
        } catch (e) {
            throw console.error(e);
        }
    }

    // Delete a post document by its slug
    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug
            );
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    // Get all posts, with optional query filters
    async getAllPosts(queries = [Query.equal('status', 'active')]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                queries,
            );
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    // Get a single post document by its slug
    async getPost(slug) {
        try {
            const document = await this.databases.getDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug
            );
            return document.data;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    // Upload a file to the storage bucket
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketID,
                ID.unique(),
                file
            );
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    // Delete a file by its ID
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketID,
                fileId
            );
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    // Get file preview by file ID
    getFilePreview(fileId) {
        return this.bucket.getFilePreview(
            conf.appwriteBucketID,
            fileId
        );
    }
}

const service = new Service();

export default service;
```

### **Key Methods**:
- **createPost({ title, slug, content, featuredImage, status, userId })**: Creates a new post document.
- **updatePost(slug, { title, content, featuredImage, status })**: Updates an existing post.
- **deletePost(slug)**: Deletes a post by its slug.
- **getAllPosts(queries)**: Retrieves all posts, with optional query filters.
- **getPost(slug)**: Retrieves a single post by its slug.
- **uploadFile(file)**: Uploads a file to the storage bucket.
- **deleteFile(fileId)**: Deletes a file from the storage bucket by its ID.
- **getFilePreview(fileId)**: Retrieves the preview of a file stored in the bucket.

---

## 4. **Appwrite Setup**

1. **Launch Appwrite Dashboard**:  
   Once Appwrite is running, access the dashboard by navigating to [http://localhost](http://localhost) in your browser. Follow the on-screen instructions to complete the setup.

2. **Create a New Project**:  
   - Go to the **Projects** section in the dashboard.  
   - Click **Add Project** and provide a name for your project.  
   - Note the **Project ID**, as you'll need it for configuration.

3. **Configure API Keys** (Optional):  
   - Navigate to your project's **API Keys** section.  
   - Generate an API key with the required permissions for your services (e.g., database, storage).

4. **Set Up Database and Collections**:  
   - Go to the **Database** section.  
   - Create a new **Database** and note the **Database ID**.  
   - Inside the database, create collections for your data and note the **Collection IDs**.

5. **Set Up File Storage**:  
   - Navigate to **Storage**.  
   - Create a new bucket and note its **Bucket ID**.

6. **Update Environment Variables**:  
   In your `.env` file, add the following Appwrite variables:  
   ```plaintext
   VITE_APPWRITE_URL=http://localhost/v1
   VITE_APPWRITE_PROJECT_ID=<your_project_id>
   VITE_APPWRITE_DATABASE_ID=<your_database_id>
   VITE_APPWRITE_COLLECTION_ID=<your_collection_id>
   VITE_APPWRITE_BUCKET_ID=<your_bucket_id>
   ```

7. **Test the Connection**:  
   Use Appwrite's [Web SDK](https://appwrite.io/docs/getting-started-for-web) to confirm your configuration works correctly.

<br> <br>
### Add package in your react project:
```
npm install appwrite
```
- `appwrite`: SDK for interacting with the Appwrite backend platform.
You're all set! 🎉

## Conclusion

This setup provides an easy-to-use interface to manage users and interact with the Appwrite database and storage services. The `AuthService` handles user-related operations, while the `Service` class provides database and file management functionalities.

---

Feel free to modify or expand upon this documentation based on your specific use case or project requirements!
