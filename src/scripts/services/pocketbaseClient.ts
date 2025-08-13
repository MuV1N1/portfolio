import PocketBase from 'pocketbase';

export class PocketBaseClient {
    private pb = new PocketBase('https://muv1n-portfolio.pockethost.io/');
    get isAuthenticated() { return this.pb.authStore.isValid; }
    auth() { return this.pb.authStore; }
    collection(name: string) { return this.pb.collection(name); }
    delete(collection: string, id: string) { return this.collection(collection).delete(id); }
    create(collection: string, data: any) { return this.collection(collection).create(data); }
    update(collection: string, id: string, data: any) { return this.collection(collection).update(id, data); }
    getFullList(collection: string, params: any = {}) { return this.collection(collection).getFullList(params); }
    getOne(collection: string, id: string) { return this.collection(collection).getOne(id); }
}
