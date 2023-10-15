const Rinforzo = require("../model/rinforzoModel");
const Polimero = require("../model/polimeroModel");


module.exports.createRinforzo = (req, res) => {
    const nome = req.body.nome;
    const tipo = req.body.tipo;
    const geometria = req.body.geometria;
    const origine = req.body.origine;
    const trattamentiChimici = req.body.trattamentiChimici;
    const tensileStrength = req.body.tensileStrength;
    const tensileStrengthMax = req.body.tensileStrengthMax;
    const compressionalStrength = req.body.compressionalStrength;
    const compressionalStrengthMax = req.body.compressionalStrengthMax
    const flexuralStrength = req.body.flexuralStrength;
    const flexuralStrengthMax = req.body.flexuralStrengthMax
    const torsionalStrength = req.body.torsionalStrength;
    const torsionalStrengthMax = req.body.torsionalStrengthMax;
    const impactStrength = req.body.impactStrength;
    const impactStrengthMax = req.body.impactStrengthMax;
    const elongazioneRottura = req.body.elongazioneRottura;
    const elongazioneRotturaMax = req.body.elongazioneRotturaMax;
    const biodegradabilita = req.body.biodegradabilita;
    const fineVita = req.body.fineVita;
    const sds = req.body.sds;
    const compatibilitaPolimeri = req.body.compatibilitaPolimeri;
    const compatibilitaAdditivi = req.body.compatibilitaAdditivi;

    if (!nome || !origine || !tipo || !geometria) {
        res.status(400).send({
            status: 400,
            message: "Content can't be empty!"
        });
        return;
    }

    const data = Rinforzo.create({
        nome: nome,
        tipo: tipo,
        geometria : geometria,
        origine: origine,
        trattamentiChimici: trattamentiChimici,
        tensileStrength: tensileStrength,
        tensileStrengthMax: tensileStrengthMax,
        compressionalStrength: compressionalStrength,
        compressionalStrengthMax: compressionalStrengthMax,
        flexuralStrength: flexuralStrength,
        flexuralStrengthMax: flexuralStrengthMax,
        torsionalStrength: torsionalStrength,
        torsionalStrengthMax: torsionalStrengthMax,
        impactStrength: impactStrength,
        impactStrengthMax: impactStrengthMax,
        elongazioneRottura: elongazioneRottura,
        elongazioneRotturaMax: elongazioneRotturaMax,
        biodegradabilita: biodegradabilita,
        fineVita: fineVita,
        sds: sds,
        compatibilitaPolimeri: compatibilitaPolimeri,
        compatibilitaAdditivi: compatibilitaAdditivi
    });

    if (data) {
        res.status(201).send({
            status: 201,
            message: `Rinforzo created successfully`
        });
    } else {
        res.status(500).send({
            status: 500,
            message: `Error creating Rinforzo`,
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

        const rinforzo= await Rinforzo.findOne({ nome });

        if (!rinforzo) {
            return res.status(404).json({
                status: 404,
                message: "Polimero non trovato."
            });
        }

        res.status(201).json({
            status: 201,
            data: rinforzo,
            message: "Polimero modificato correttamente."
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
        const rinforzi = await Rinforzo.find({}).sort({ nome: 1 });

        res.status(201).json({
            status: 201,
            data: rinforzi,
            message: "Tutti gli polimeri trovati."
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
    const tipo = req.body.tipo;
    const geometria = req.body.geometria;
    const origine = req.body.origine;
    const trattamentiChimici = req.body.trattamentiChimici;
    const tensileStrength = req.body.tensileStrength;
    const tensileStrengthMax = req.body.tensileStrengthMax;
    const compressionalStrength = req.body.compressionalStrength;
    const compressionalStrengthMax = req.body.compressionalStrengthMax
    const flexuralStrength = req.body.flexuralStrength;
    const flexuralStrengthMax = req.body.flexuralStrengthMax
    const torsionalStrength = req.body.torsionalStrength;
    const torsionalStrengthMax = req.body.torsionalStrengthMax;
    const impactStrength = req.body.impactStrength;
    const impactStrengthMax = req.body.impactStrengthMax;
    const elongazioneRottura = req.body.elongazioneRottura;
    const elongazioneRotturaMax = req.body.elongazioneRotturaMax;
    const biodegradabilita = req.body.biodegradabilita;
    const fineVita = req.body.fineVita;
    const sds = req.body.sds;
    const compatibilitaPolimeri = req.body.compatibilitaPolimeri;
    const compatibilitaAdditivi = req.body.compatibilitaAdditivi;

    if (!nome || !tipo || !origine || !geometria) {
        res.status(400).send({
            status: 400,
            message: `Content can't be empty`,
        });
    }

    try {

        const updatedRinforzo = await Rinforzo.findOne({ nome: nome });

        if (updatedRinforzo) {
            updatedRinforzo.nome = nome;
            updatedRinforzo.tipo = tipo;
            updatedRinforzo.geometria = geometria;
            updatedRinforzo.origine = origine;
            updatedRinforzo.trattamentiChimici = trattamentiChimici,
            updatedRinforzo.tensileStrength = tensileStrength;
            updatedRinforzo.tensileStrengthMax = tensileStrengthMax;
            updatedRinforzo.compressionalStrength = compressionalStrength,
            updatedRinforzo.compressionalStrengthMax = compressionalStrengthMax,
            updatedRinforzo.flexuralStrength = flexuralStrength,
            updatedRinforzo.flexuralStrengthMax = flexuralStrengthMax,
            updatedRinforzo.torsionalStrength = torsionalStrength;
            updatedRinforzo.torsionalStrengthMax = torsionalStrengthMax;
            updatedRinforzo.impactStrength = impactStrength;
            updatedRinforzo.impactStrengthMax = impactStrengthMax;
            updatedRinforzo.elongazioneRottura = elongazioneRottura;
            updatedRinforzo.elongazioneRotturaMax = elongazioneRotturaMax,
            updatedRinforzo.biodegradabilita = biodegradabilita;
            updatedRinforzo.fineVita = fineVita;
            updatedRinforzo.sds = sds;
            updatedRinforzo.compatibilitaRinforzi = compatibilitaPolimeri;
            updatedRinforzo.compatibilitaAdditivi = compatibilitaAdditivi;

            await updatedRinforzo.save();
            res.status(201).send({
                status: 201,
                message: `Rinforzo updated successfully`,
            });
        } else {
            res.status(500).send({
                status: 500,
                message: `Rinforzo not updated, error.`,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 500,
            message: `An error occurred while updating the rinforzo.`,
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

    Rinforzo.deleteOne({ nome: nome })
        .then(result => {
            if (result.deletedCount === 1) {
                res.status(201).send({
                    status: 201,
                    message: `Rinforzo with name '${nome}' was deleted successfully`
                });
            } else {
                res.status(404).send({
                    status: 404,
                    message: `Cannot delete Rinforzo with name '${nome}'. User not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                status: 500,
                message: `Could not delete Rinforzo with name '${nome}'.`
            });
        });
};

module.exports.filtraRinforzi = async (req, res) => {
    try {
        // Ottieni i criteri di filtraggio dalla richiesta come array
        const criteriFiltraggio = req.body.criteri;

        // Esegui il filtraggio dei rinforzi in base ai criteri
        let rinforziFiltrati = await Rinforzo.find({});

        criteriFiltraggio.forEach((criterio) => {
            const campo = criterio.campo;
            const operatore = criterio.operatore;
            const valore = criterio.valore;

            switch (operatore) {
                case 'maggiore':
                    rinforziFiltrati = rinforziFiltrati.filter((rinforzo) => rinforzo[campo] > valore);
                    break;
                case 'minore':
                    rinforziFiltrati = rinforziFiltrati.filter((rinforzo) => rinforzo[campo] < valore);
                    break;
                case 'uguale':
                    if (campo === 'compatibilitaPolimeri' || campo === 'compatibilitaAdditivi') {
                        // Filtra i rinforzi in base alla compatibilità
                        rinforziFiltrati = rinforziFiltrati.filter((rinforzo) => {
                            return rinforzo[campo].includes(valore);
                        });
                    } else {
                        // Filtra i rinforzi in base agli altri campi
                        rinforziFiltrati = rinforziFiltrati.filter((rinforzo) => rinforzo[campo] == valore);
                    }
                    break;
            }
        });

        // Restituisci i rinforzi filtrati come risposta
        res.status(201).json({
            status: 201,
            data: rinforziFiltrati,
            message: 'Rinforzi filtrati con successo',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: 'Errore del server durante il filtraggio dei rinforzi',
        });
    }
};