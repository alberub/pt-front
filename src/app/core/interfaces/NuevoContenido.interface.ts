export interface NuevoContenido{
    titulo: string;
    descripcion: string;
    creditos: string;
    categoria: string;
    tematica: string;
    video_url: string;
    archivo: File | null;
}