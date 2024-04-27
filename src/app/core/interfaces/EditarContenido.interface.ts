export interface EditarContenido{
    titulo: string;
    desc: string;
    video_url: string;
    archivo: File | null;
    uid: string;
}