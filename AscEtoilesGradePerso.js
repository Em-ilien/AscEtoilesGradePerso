registerPlugin({
    name: 'AscEtoilesGradePerso',
    version: '0',
    description: 'Script servant à changer son étoile quand on est Grade Perso.',
    author: 'Em_i <emiliencoss@gmail.com>',
    vars: [{
		name: "errorNoPerm",
		title: 'Message d\'erreur quand manque permissions',
        type: 'string',
        placeholder: "Erreur : vous n'avez pas les permissions."
    },{
        name: "modifs",
		title: 'Message quand modifications sur les groupes de serveurs effectuées',
        type: 'multiline',
        placeholder: "Les modifications ont été apportées. Veuillez vérifier qu'elles sont correctes, ou contactez un modérateur."
    },{
        name: "listColors",
		title: 'Liste des couleurs disponibles à afficher',
        type: 'multiline',
        placeholder: "Liste des couleurs disponibles : Rouge - Orange - Jaune - Vert Clair - Vert - Vert Foncé - Bleu Clair - Bleu Ciel - Bleu Foncé - Rose - Mauve - Violet - Gris - Blanc - Marron - Noir - Aucune - No-Poke - No-Mp"
    },{
        name: 'noSendMessage',
        title: 'Ne pas envoyer de message aux joueurs qui rejoignent le salon Changement de Titre/Etoile ?',
        type: 'checkbox'
    },{
        name: "msgOnJoin",
		title: 'Message à afficher quand un joueur rejoint le salon changement de titre',
        type: 'string',
        indent: 3,
        placeholder: "[b]Nouveau ![/b] Envoie-moi le nom d'une couleur pour changer d'étoile sur TS.",
        conditions: [{ field: 'noSendMessage', value: false }]
    }]
}, function (_, config, meta) {
    const event = require('event');
    const engine = require('engine');
    const backend = require("backend");

    const errorNoPerm = config.errorNoPerm || "Erreur : vous n'avez pas les permissions.";
    const modifs = config.modifs || "Les modifications ont été apportées. Veuillez vérifier qu'elles sont correctes, ou contactez un modérateur.";
    const listColors = config.listColors || "Liste des couleurs disponibles : Rouge - Orange - Jaune - Vert Clair - Vert - Vert Foncé - Bleu Clair - Bleu Ciel - Bleu Foncé - Rose - Mauve - Violet - Gris - Blanc - Marron - Noir - Aucune - No-Poke - No-Mp";
    const msgOnJoin = config.msgOnJoin || "[b]Nouveau ![/b] Envoie-moi le nom d'une couleur pour changer d'étoile sur TS.";

    function hasPermissions(client) {
        for (i in client.getServerGroups()) {
            const serverGroup = client.getServerGroups()[i];
            for (j in [156]) {
                const serverGroupToHave = [156][j];
                if (serverGroup.id() == serverGroupToHave)
                    return true;
            }
        }
        return false;
    }

    function isInChannelChangementEtoile(client) {
        if (client.getChannels()[0].id() == 1219296)
            return true;
        else
            return false;
    }

    event.on('chat', function(ev) {
        const msg = ev.text.toLowerCase();
        const client = ev.client;
        
        function setEtoile(star_chosen_id=null) {
            client.getServerGroups().forEach(serverGroup => {
                [260, 277, 278, 276, 266, 275, 271, 272, 273, 269, 282, 279, 274, 267, 264, 270].forEach(star_id => {
                    if (serverGroup.id() == star_id)
                        client.removeFromServerGroup(star_id);
                });
            });
    
            if (star_chosen_id != null)
                client.addToServerGroup(star_chosen_id);

            client.chat(modifs);
            return;
        }
        function setOrRemove(serverGroup_id) {
            let hasAlready = false;
            client.getServerGroups().forEach(serverGroup => {
                if (serverGroup.id() == serverGroup_id) {
                    hasAlready = true;
                    client.removeFromServerGroup(serverGroup_id);
                }
            });

            if (!hasAlready)
                client.addToServerGroup(serverGroup_id);
            return;
        }

        if (!isInChannelChangementEtoile(client))
            return;
        if (!hasPermissions(client)){
            client.chat(errorNoPerm);
            return;
        }

        function contains(str) {
            if (msg.includes(str))
                return true;
            else
                return false;
        }
        switch (true) {
            case contains("rouge"):
                setEtoile(260);
                break;
            case contains("orange"):
                setEtoile(277);
                break;
            case contains("jaune"):
                setEtoile(278);
                break;
            case contains("vert clair"):
                setEtoile(276);
                break;
            case contains("vert foncé"):
                setEtoile(275);
                break;
            case contains("vert"):
                setEtoile(266);
                break;
            case contains("bleu clair"):
                setEtoile(271);
                break;
            case contains("bleu ciel"):
                setEtoile(272);
                break;
            case contains("bleu foncé"):
                setEtoile(273);
                break;
            case contains("rose"):
                setEtoile(269);
                break;
            case contains("mauve"):
                setEtoile(282);
                break;
            case contains("violet"):
                setEtoile(279);
                break;
            case contains("gris"):
                setEtoile(274);
                break;
            case contains("blanc"):
                setEtoile(267);
                break;
            case contains("marron"):
                setEtoile(264);
                break;
            case contains("noir"):
                setEtoile(270);
                break;
            case contains("aucune"):
                setEtoile();
                break;
            case contains("poke"):
                setOrRemove(17);
                break;
            case contains("mp"):
                setOrRemove(18);
                break;
            default:
                client.chat(listColors + "\n[b]Dites-moi le nom d'une couleur d'étoile pour l'obtenir.[/b]");
                break;
        }
    });

    event.on('clientMove', function(ev) {
        if (!hasPermissions(ev.client))
            return;
        if (config.noSendMessage)
            return;

        if (ev.toChannel.id() == 1219296) {
            ev.client.chat(msgOnJoin + "\n" + listColors)
        }
    });
    
});
