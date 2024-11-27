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
        }
        catch (e) {
            throw console.error(e);
        }
    }
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
        }
        catch (e) {
            throw console.error(e);
        }

    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug
            );
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }

    async getAllPosts(queries = [Query.equal('satus', 'active')]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                queries,
            )
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    async getPost(slug) {
        try {
            const document = await this.databases.getDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug
            );
            return document.data;
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }

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

    async deleteFile(fileId) {
        try {
            await t.Client.deleteFile(
                conf.appwriteBucketID,
                fileId
            )
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    getFilePreview(fileId) {
        return this.Client.getFilePreview(
            conf.appwriteBucketID,
            fileId
        )
    }
}

const service = new Service()
export default service;