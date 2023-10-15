const Additivo = require ("../model/additivoModel");

module.exports.createAdditivo = (req, res) => {
    const nome = req.body.nome;
    const funzione = req.body.funzione;
    const origine = req.body.origine;
    const biodegradabilita = req.body.biodegradabilita;
    const fineVita = req.body.fineVita;
    const sds = req.body.sds;
    const compatibilitaRinforzi = req.body.compatibilitaRinforzi;
    const compatibilitaPolimeri = req.body.compatibilitaPolimeri;

    if(!nome || !funzione || !origine){
        res.status(400).send({
            status: 400,
            message: `Filend can't be empty`,
        });
    }
    const data = Additivo.create({
        nome : nome,
        funzione : funzione,
        origine : origine,
        biodegradabilita : biodegradabilita,
        fineVita : fineVita,
        sds : sds,
        compatibilitaRinforzi : compatibilitaRinforzi,
        compatibilitaPolimeri : compatibilitaPolimeri
    });

    if(data) {
        res.status(201).send({
            status: 201,
            message: `Additivo created successfully`
        })
    }else {
        res.status(500).send({
            status: 500,
            message: `Error creating additivo`,
        });
    }

}

module.exports.find = async (req, res) => {
    try {
        const nome = req.params.nome;

        if (!nome) {
            return res.status(400).json({
                status: 400,
                message: "Il nome non può essere vuoto."
            });
        }

        const additivo = await Additivo.findOne({ nome });

        if (!additivo) {
            return res.status(404).json({
                status: 404,
                message: "Additivo non trovato."
            });
        }

        res.status(201).json({
            status: 201,
            data: additivo,
            message: "Additivo modificato correttamente."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Errore del server."
        });
    }
}

module.exports.findAll = async (req, res) => {
    try {
        const additivi = await Additivo.find({}).sort({ nome: 1 });

        res.status(201).json({
            status: 201,
            data: additivi,
            message: "Tutti gli additivi trovati."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Errore del server."
        });
    }
}

module.exports.update = async (req, res) => {
    const nome = req.body.nome;
    const funzione = req.body.funzione;
    const origine = req.body.origine;
    const biodegradabilita = req.body.biodegradabilita;
    const fineVita = req.body.fineVita;
    const sds = req.body.sds;
    const compatibilitaRinforzi = req.body.compatibilitaRinforzi;
    const compatibilitaPolimeri = req.body.compatibilitaPolimeri;


    if (!nome || !funzione || !origine) {
        res.status(400).send({
            status: 400,
            message: `Content can't be empty`,
        });
    }

    try {
        const change = await Additivo.findOne({ nome: nome });

        if (change) {
            change.nome = nome;
            change.funzione = funzione;
            change.origine = origine;
            change.biodegradabilita = biodegradabilita;
            change.fineVita = fineVita;
            change.sds = sds;
            change.compatibilitaRinforzi = compatibilitaRinforzi;
            change.compatibilitaPolimeri = compatibilitaPolimeri;

            await change.save();
            res.status(201).send({
                status: 201,
                message: `Additivo updated successfully`,
            });
        } else {
            res.status(500).send({
                status: 500,
                message: `Additivo not updated, error.`,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 500,
            message: `An error occurred while updating the additivo.`,
        });
    }
}

module.exports.delete = (req, res) => {
    const nome = req.params.nome; // Otteniamo il nome dall'URL dei parametri

    if (!nome) {
        res.status(400).send({
            status: 400,
            message: "Name can't be empty!"
        });
        return;
    }

    Additivo.deleteOne({ nome: nome })
        .then(result => {
            if (result.deletedCount === 1) {
                res.status(201).send({
                    status: 201,
                    message: `Additivo with name '${nome}' was deleted successfully`
                });
            } else {
                res.status(404).send({
                    status: 404,
                    message: `Cannot delete Additivo with name '${nome}'. User not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                status: 500,
                message: `Could not delete Additivo with name '${nome}'.`
            });
        });
};

module.exports.filtraAdditivi = async (req, res) => {
    try {
        // Ottieni i criteri di filtraggio dalla richiesta come array
        const criteriFiltraggio = req.body.criteri;

        // Esegui il filtraggio dei polimeri in base ai criteri
        let additiviFiltrati = await Additivo.find({});

        criteriFiltraggio.forEach((criterio) => {
            const campo = criterio.campo;
            const operatore = criterio.operatore;
            const valore = criterio.valore;

            switch (operatore) {
                case 'uguale':
                    if (campo === 'compatibilitaPolimeri' || campo === 'compatibilitaRinforzi') {
                        // Filtra gli additivi in base alla compatibilità
                        additiviFiltrati = additiviFiltrati.filter((additivo) => {
                            return additivo[campo].includes(valore);
                        });
                    } else {
                        // Filtra gli additivi in base agli altri campi stringa
                        additiviFiltrati = additiviFiltrati.filter((additivo) => additivo[campo] === valore);
                    }
                    break;
            }
        });
        // Restituisci i polimeri filtrati come risposta
        res.status(201).json({
            status: 201,
            data: additiviFiltrati,
            message: 'Polimeri filtrati con successo',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: 'Errore del server durante il filtraggio dei polimeri',
        });
    }
};




