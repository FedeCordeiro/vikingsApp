class Enemigo {
    constructor() {
        this.enemigo = document.createElement("div");
        this.enemigo.classList.add("enemigo"); 
        document.getElementById("game").appendChild(this.enemigo);
    }

    eliminar() {
        // Eliminar el enemigo del DOM
        if (this.enemigo && this.enemigo.parentNode) {
            this.enemigo.parentNode.removeChild(this.enemigo);
        }
    }

    status() {
        return this.enemigo.getBoundingClientRect();
    }
}