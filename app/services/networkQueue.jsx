class NetworkQueue {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
    }

    /**
     * Ajouter une action dans la file
     * @param {Function} action 
     */
    addToQueue(action) {
        this.queue.push(action);
        console.log('Action ajoutée à la file', this.queue);
    }


    async processQueue() {
        if (this.isProcessing) return;

        this.isProcessing = true;

        while (this.queue.length > 0) {
            const action = this.queue.shift();

            try {
                await action();
                console.log('Action exécutée avec succès');
            } catch (error) {
                console.error('Erreur lors de l’exécution de l’action, réajoutée dans la file', error);
                this.queue.push(action);
                break;
            }
        }

        this.isProcessing = false;
    }


    clearQueue() {
        this.queue = [];
    }
}

const networkQueue = new NetworkQueue();
export default networkQueue;
