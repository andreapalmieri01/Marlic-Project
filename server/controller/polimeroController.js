const Polimero = require("../model/polimeroModel");
const Additivo = require("../model/additivoModel");
const {update} = require("./additivoController");


module.exports.createPolimero = (req, res) => {
    const nome = req.body.nome;
    const origine = req.body.origine;
    const classe = req.body.classe;
    const pesoMolecolarePonderale = req.body.pesoMolecolarePonderale;
    const pesoMolecolarePonderaleMax = req.body.pesoMolecolarePonderaleMax;
    const pesoMolecolareNumerico = req.body.pesoMolecolareNumerico;
    const pesoMolecolareNumericoMax = req.body.pesoMolecolareNumericoMax;
    const temperaturaFusione = req.body.temperaturaFusione;
    const temperaturaFusioneMax = req.body.temperaturaFusioneMax;
    const temperaturaRammollimento = req.body.temperaturaRammollimento;
    const temperaturaRammollimentoMax = req.body.temperaturaRammollimentoMax;
    const temperaturaTransizioneVetrosa = req.body.temperaturaTransizioneVetrosa;
    const temperaturaTransizioneVetrosaMax = req.body.temperaturaTransizioneVetrosaMax;
    const temperaturaCristallizzazione = req.body.temperaturaCristallizzazione;
    const temperaturaCristallizzazioneMax = req.body.temperaturaCristallizzazioneMax;
    const gradoDiRamificazione = req.body.gradoDiRamificazione;
    const cristallinita = req.body.cristallinita;
    const viscositaTaglio = req.body.viscositaTaglio;
    const viscositaTaglioMax = req.body.viscositaTaglioMax;
    const densita = req.body.densita;
    const densitaMax = req.body.densitaMax;
    const durezza = req.body.durezza;
    const tensileStrength = req.body.tensileStrength;
    const tensileStrengthMax = req.body.tensileStrengthMax;
    const torsionalStrength = req.body.torsionalStrength;
    const torsionalStrengthMax = req.body.torsionalStrengthMax;
    const impactStrength = req.body.impactStrength;
    const impactStrengthMax = req.body.impactStrengthMax;
    const elongazioneRottura = req.body.elongazioneRottura;
    const elongazioneRotturaMax = req.body.elongazioneRotturaMax;
    const moduloElastico = req.body.moduloElastico;
    const moduloElasticoMax = req.body.moduloElasticoMax;
    const fineVita = req.body.fineVita;
    const sds = req.body.sds;
    const compatibilitaRinforzi = req.body.compatibilitaRinforzi;
    const compatibilitaAdditivi = req.body.compatibilitaAdditivi;

    if (!nome || !origine || !classe) {
        res.status(400).send({
            status: 400,
            message: "Content can't be empty!"
        });
        return;
    }

    const data = Polimero.create({
        nome: nome,
        origine: origine,
        classe: classe,
        pesoMolecolarePonderale: pesoMolecolarePonderale,
        pesoMolecolarePonderaleMax: pesoMolecolarePonderaleMax,
        pesoMolecolareNumerico: pesoMolecolareNumerico,
        pesoMolecolareNumericoMax: pesoMolecolareNumericoMax,
        temperaturaFusione: temperaturaFusione,
        temperaturaFusioneMax: temperaturaFusioneMax,
        temperaturaRammollimento: temperaturaRammollimento,
        temperaturaRammollimentoMax: temperaturaRammollimentoMax,
        temperaturaTransizioneVetrosa: temperaturaTransizioneVetrosa,
        temperaturaTransizioneVetrosaMax: temperaturaTransizioneVetrosaMax,
        temperaturaCristallizzazione: temperaturaCristallizzazione,
        temperaturaCristallizzazioneMax: temperaturaCristallizzazioneMax,
        gradoDiRamificazione: gradoDiRamificazione,
        cristallinita: cristallinita,
        viscositaTaglio: viscositaTaglio,
        viscositaTaglioMax: viscositaTaglioMax,
        densita: densita,
        densitaMaX: densitaMax,
        durezza: durezza,
        tensileStrength: tensileStrength,
        tensileStrengthMax: tensileStrengthMax,
        torsionalStrength: torsionalStrength,
        torsionalStrengthMax: torsionalStrengthMax,
        impactStrength: impactStrength,
        impactStrengthMax: impactStrengthMax,
        elongazioneRottura: elongazioneRottura,
        elongazioneRotturaMax: elongazioneRotturaMax,
        moduloElastico: moduloElastico,
        moduloElasticoMax: moduloElasticoMax,
        fineVita: fineVita,
        sds: sds,
        compatibilitaRinforzi: compatibilitaRinforzi,
        compatibilitaAdditivi: compatibilitaAdditivi
    });

    if (data) {
        res.status(201).send({
            status: 201,
            message: `Polimero created successfully`
        });
    } else {
        res.status(500).send({
            status: 500,
            message: `Error creating polimero`,
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

        const polimero= await Polimero.findOne({ nome });

        if (!polimero) {
            return res.status(404).json({
                status: 404,
                message: "Polimero non trovato."
            });
        }

        res.status(201).json({
            status: 201,
            data: polimero,
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
        const polimeri = await Polimero.find({}).sort({ nome: 1 });

        res.status(201).json({
            status: 201,
            data: polimeri,
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
    const origine = req.body.origine;
    const classe = req.body.classe;
    const pesoMolecolarePonderale = req.body.pesoMolecolarePonderale;
    const pesoMolecolarePonderaleMax = req.body.pesoMolecolarePonderaleMax;
    const pesoMolecolareNumerico = req.body.pesoMolecolareNumerico;
    const pesoMolecolareNumericoMax = req.body.pesoMolecolareNumericoMax;
    const temperaturaFusione = req.body.temperaturaFusione;
    const temperaturaFusioneMax = req.body.temperaturaFusioneMax;
    const temperaturaRammollimento = req.body.temperaturaRammollimento;
    const temperaturaRammollimentoMax = req.body.temperaturaRammollimentoMax;
    const temperaturaTransizioneVetrosa = req.body.temperaturaTransizioneVetrosa;
    const temperaturaCristallizzazione = req.body.temperaturaCristallizzazione;
    const temperaturaCristallizzazioneMax = req.body.temperaturaCristallizzazioneMax;
    const gradoDiRamificazione = req.body.gradoDiRamificazione;
    const cristallinita = req.body.cristallinita;
    const viscositaTaglio = req.body.viscositaTaglio;
    const viscositaTaglioMax = req.body.viscositaTaglioMax;
    const densita = req.body.densita;
    const densitaMax = req.body.densitaMax;
    const durezza = req.body.durezza;
    const tensileStrength = req.body.tensileStrength;
    const tensileStrengthMax = req.body.tensileStrengthMax;
    const torsionalStrength = req.body.torsionalStrength;
    const torsionalStrengthMax = req.body.torsionalStrengthMax;
    const impactStrength = req.body.impactStrength;
    const impactStrengthMax = req.body.impactStrengthMax;
    const elongazioneRottura = req.body.elongazioneRottura;
    const elongazioneRotturaMax = req.body.elongazioneRotturaMax;
    const moduloElastico = req.body.moduloElastico;
    const moduloElasticoMax = req.body.moduloElasticoMax;
    const biodegradabilita = req.body.biodegradabilita;
    const fineVita = req.body.fineVita;
    const sds = req.body.sds;
    const compatibilitaRinforzi = req.body.compatibilitaRinforzi;
    const compatibilitaAdditivi = req.body.compatibilitaAdditivi;

    if (!nome || !classe || !origine) {
        res.status(400).send({
            status: 400,
            message: `Content can't be empty`,
        });
    }

    try {

        const updatedPolimero = await Polimero.findOne({ nome: nome });

        if (updatedPolimero) {
            updatedPolimero.nome = nome;
            updatedPolimero.origine = origine;
            updatedPolimero.classe = classe;
            updatedPolimero.pesoMolecolarePonderale = pesoMolecolarePonderale;
            updatedPolimero.pesoMolecolarePonderaleMax = pesoMolecolarePonderaleMax;
            updatedPolimero.pesoMolecolareNumerico = pesoMolecolareNumerico;
            updatedPolimero.pesoMolecolareNumericoMax = pesoMolecolareNumericoMax;
            updatedPolimero.temperaturaFusione = temperaturaFusione;
            updatedPolimero.temperaturaFusioneMax = temperaturaFusioneMax;
            updatedPolimero.temperaturaRammollimento = temperaturaRammollimento;
            updatedPolimero.temperaturaRammollimentoMax = temperaturaRammollimentoMax;
            updatedPolimero.temperaturaTransizioneVetrosa = temperaturaTransizioneVetrosa;
            updatedPolimero.temperaturaCristallizzazione = temperaturaCristallizzazione;
            updatedPolimero.temperaturaCristallizzazioneMax = temperaturaCristallizzazioneMax;
            updatedPolimero.gradoDiRamificazione = gradoDiRamificazione;
            updatedPolimero.cristallinita = cristallinita;
            updatedPolimero.viscositaTaglio = viscositaTaglio;
            updatedPolimero.viscositaTaglioMax = viscositaTaglioMax;
            updatedPolimero.densita = densita;
            updatedPolimero.densitaMax = densitaMax;
            updatedPolimero.durezza = durezza;
            updatedPolimero.tensileStrength = tensileStrength;
            updatedPolimero.tensileStrengthMax = tensileStrengthMax;
            updatedPolimero.torsionalStrength = torsionalStrength;
            updatedPolimero.torsionalStrengthMax = torsionalStrengthMax;
            updatedPolimero.impactStrength = impactStrength;
            updatedPolimero.impactStrengthMax = impactStrengthMax;
            updatedPolimero.elongazioneRottura = elongazioneRottura;
            updatedPolimero.elongazioneRotturaMax = elongazioneRotturaMax;
            updatedPolimero.moduloElastico = moduloElastico;
            updatedPolimero.moduloElasticoMax = moduloElasticoMax;
            updatedPolimero.biodegradabilita = biodegradabilita;
            updatedPolimero.fineVita = fineVita;
            updatedPolimero.sds = sds;
            updatedPolimero.compatibilitaRinforzi = compatibilitaRinforzi;
            updatedPolimero.compatibilitaAdditivi = compatibilitaAdditivi;

            await updatedPolimero.save();
            res.status(201).send({
                status: 201,
                message: `Polimero updated successfully`,
            });
        } else {
            res.status(500).send({
                status: 500,
                message: `Polimero not updated, error.`,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 500,
            message: `An error occurred while updating the polimero.`,
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

    Polimero.deleteOne({ nome: nome })
        .then(result => {
            if (result.deletedCount === 1) {
                res.status(201).send({
                    status: 201,
                    message: `Polimero with name '${nome}' was deleted successfully`
                });
            } else {
                res.status(404).send({
                    status: 404,
                    message: `Cannot delete Polimero with name '${nome}'. User not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                status: 500,
                message: `Could not delete Polimero with name '${nome}'.`
            });
        });
};

module.exports.filtraPolimeri = async (req, res) => {
    try {
        // Ottieni i criteri di filtraggio dalla richiesta come array
        const criteriFiltraggio = req.body.criteri;

        // Esegui il filtraggio dei polimeri in base ai criteri
        let polimeriFiltrati = await Polimero.find({});

        criteriFiltraggio.forEach((criterio) => {
            const campo = criterio.campo;
            const operatore = criterio.operatore;
            const valore = criterio.valore;

            switch (operatore) {
                case 'maggiore':
                    polimeriFiltrati = polimeriFiltrati.filter((polimero) => polimero[campo] > valore);
                    break;
                case 'minore':
                    polimeriFiltrati = polimeriFiltrati.filter((polimero) => polimero[campo] < valore);
                    break;
                case 'uguale':
                    if (campo === 'compatibilitaAdditivi' || campo === 'compatibilitaRinforzi') {
                        // Filtra i polimeri in base alla compatibilità
                        polimeriFiltrati = polimeriFiltrati.filter((polimero) => {
                            return polimero[campo].includes(valore);
                        });
                    } else {
                        // Filtra i polimeri in base agli altri campi
                        polimeriFiltrati = polimeriFiltrati.filter((polimero) => polimero[campo] == valore);
                    }
                    break;
            }
        });

        // Restituisci i polimeri filtrati come risposta
        res.status(201).json({
            status: 201,
            data: polimeriFiltrati,
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

