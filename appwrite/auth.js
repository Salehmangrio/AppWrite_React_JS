import { Client, Account, ID } from 'appwrite'
import conf from '../conf/conf.js'

export class AuthService {
    client = new Client();
    account;
    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectID)
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                return this.login({ email, password, })
            } else {
                return userAccount;
            }
        }
        catch (e) {
            console.error(e);            
        }
    }

    async login({ email, password }) {
        try {
            userSession = await this.account.createEmailSession(email, password);
            return userSession;
        } catch (e) { 
            console.error(e);
            
        }
    }

    async getCurrentUser(){
        try {
            return await this.account.get();
        } catch (e) {
            throw console.error(e);  
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (e) {
            console.error(e);  
        }
    }
}


const authService = new AuthService();

export default authService;  