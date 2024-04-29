export class Usuario{
    
    email: string;
    fechaCreacion: Date;
    role: string;
    uid: string;
    username: string;

    constructor(email: string, fechaCreacion: Date, role: string, uid: string, username: string) {
        this.email = email;
        this.fechaCreacion = fechaCreacion;
        this.role = role;
        this.uid = uid;
        this.username = username;
    }
}