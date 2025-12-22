export const sumar = (a: number, b: number) => a + b;

export const dobleDe = (n: number) => n * 2;

export function ejemploDestructuracionUsuario() {
    const usuario = {
        nombre: "Alison",
        edad: 25,
    };
    const { nombre, edad } = usuario;
    return `${nombre} tiene ${edad} años`;
}