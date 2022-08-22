/*Déclaration des CONSTANTE*/
const TAB_COULEUR_BTN = ['violet', 'lightblue', 'green', 'yellow', 'orange', 'red']
const NB_MAX_ESSAI = 12;

/*Récupération le bouton valider et message*/
let btnValider = document.getElementById('btn-valider');
let resultat = document.getElementById('champmessage');
let historique = document.getElementById('historique');
let dragDepartEl;
let nbEssai = 0;
let couleurTrouve = 0;
let gagne = false;
let tabCouleurCache = ['', '', '', ''];

function handleDragDepart(btn) {
    dragDepartEl = this;

    btn.dataTransfer.effectAllowed = 'move';
}

function handleDragFin(btn) {
    this.style.opacity = '1';

    items.forEach(function (item) {
        item.classList.remove('over');
    });
}

function handleDragOver(btn) {
    btn.preventDefault();
    return false;
}

function handleDragEntrer(btn) {
    this.classList.add('over');
}

function handleDragSortie(btn) {
    this.classList.remove('over');
}

function handleDrop(btn) {
    btn.stopPropagation();

    if (dragDepartEl !== this) {
        let couleur = dragDepartEl.style.backgroundColor;
        let texte = dragDepartEl.textContent;
        this.style.backgroundColor = couleur;
        this.textContent = texte;
    }

    return false;
}

let items = document.querySelectorAll('.btn-drag');
let i = 0;
items.forEach(function (item) {
    let couleurStyle = 'background-color:' + TAB_COULEUR_BTN[i] + ';';
    item.setAttribute('style', couleurStyle);
    item.addEventListener('dragstart', handleDragDepart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEntrer);
    item.addEventListener('dragleave', handleDragSortie);
    item.addEventListener('dragend', handleDragFin);
    item.addEventListener('drop', handleDrop);
    i++
});

let tabBtnChoix = document.querySelectorAll('.btn-choix');
tabBtnChoix.forEach(element => {
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragenter', handleDragEntrer);
    element.addEventListener('dragleave', handleDragSortie);
    element.addEventListener('dragend', handleDragFin);
    element.addEventListener('drop', handleDrop);
});

/*Fonction qui rendu un entier aléatoire en min et max*/
function aleatoireBorne(min, max) {
    let nombreAleatoire = 0;
    nombreAleatoire = Math.random() * (max - min) + min;
    nombreAleatoire = Math.floor(nombreAleatoire);
    return nombreAleatoire;
}

function creationElClassContent(div, className, textContent) {
    let obj = document.createElement(div);
    obj.className = className;
    if (textContent != '') {
        obj.textContent = textContent;
    }
    return obj;
}


function partieMasterMind() {
    couleurTrouve = 0;
    if (nbEssai == 0) {
        /*CREATION DE LA COMBINAISON CACHEE*/
        for (let index = 0; index < tabCouleurCache.length; index++) {
            let lacouleur = TAB_COULEUR_BTN[aleatoireBorne(0, 5)];
            if (index > 0) {
                while ((tabCouleurCache.indexOf(lacouleur) >= 0)) {
                    lacouleur = TAB_COULEUR_BTN[aleatoireBorne(0, 5)];
                }
            }
            tabCouleurCache[index] = lacouleur;
            console.log(tabCouleurCache[index]);
            gagne = false;
        }
    } else {
        if (gagne != true) {
            if ((nbEssai < NB_MAX_ESSAI)) {
                /*AFFICHAGE*/

                let objCol1 = creationElClassContent('col', 'col-2', "");
                /*document.createElement('col');
                objCol1.className = "col-1";*/
                historique.appendChild(objCol1);

                let objIndex = creationElClassContent('div', 'alert alert-secondary', nbEssai);
                /*document.createElement('div');
                objIndex.className = ('alert alert-secondary')
                objIndex.textContent = nbEssai;*/
                objCol1.appendChild(objIndex);

                let objCol5 = creationElClassContent('col', 'col-5', "");
                /*document.createElement('col');
                objCol5.className = "col-5";*/
                historique.appendChild(objCol5);

                let objInputGroup = creationElClassContent('div', 'input-group my-1', "");
                /*document.createElement('div');
                objInputGroup.className = "input-group my-1";*/
                objCol5.appendChild(objInputGroup);

                let nouvObj;
                tabBtnChoix.forEach(element => {
                    nouvObj = element.cloneNode(true);
                    nouvObj.removeAttribute('id');
                    objInputGroup.appendChild(nouvObj);
                });

                /*TRAITEMENT*/
                /*DETERMINE LA CORESPONDANCE DE LA COMBINAISON*/
                objCol5 = creationElClassContent('col', 'col-5', "");
                historique.appendChild(objCol5);
                objInputGroup = creationElClassContent('div', 'input-group my-1', "");
                objCol5.appendChild(objInputGroup);

                for (let i = 0; i < tabBtnChoix.length; i++) {
                    let couleur = tabBtnChoix[i].style.backgroundColor;
                    let trouveCouleur = tabCouleurCache.indexOf(couleur);
                    if (trouveCouleur < 0) {
                        /*Pas la bonne couleur -> noir*/
                        let couleurNoir = 'background-color: black;';
                        let nouvObjNok = nouvObj.cloneNode(true);
                        nouvObjNok.setAttribute('style', couleurNoir);
                        nouvObjNok.removeAttribute('id');
                        objInputGroup.appendChild(nouvObjNok);
                    }
                    if (trouveCouleur >= 0) {
                        /*existe mais*/
                        if (trouveCouleur == i) {
                            /*OK bonne endroit -> vert*/
                            let couleurLgreen = 'background-color: lightgreen;';
                            let nouvObjOk = nouvObj.cloneNode(true);
                            nouvObjOk.setAttribute('style', couleurLgreen);
                            nouvObjOk.removeAttribute('id');
                            objInputGroup.appendChild(nouvObjOk);
                            couleurTrouve += 1;
                        } else {
                            /*Pas au bonne endroit -> blanc*/
                            let couleurWhite = 'background-color: white;';
                            let nouvObjEn = nouvObj.cloneNode(true);
                            nouvObjEn.setAttribute('style', couleurWhite);
                            nouvObjEn.removeAttribute('id');
                            objInputGroup.appendChild(nouvObjEn);
                        }
                    }
                }
            } else {
                /*AFFICAHE DU RESULTAT*/
                resultat.className = "alert alert-danger";
                resultat.textContent = "Perdu !!!, Recharger la page pour une nouvelle partie";
            }
            /*AFFICAHE DU RESULTAT*/
            if (couleurTrouve >= tabCouleurCache.length) {
                resultat.className = "alert alert-success m-1";
                resultat.textContent = "Bravo vous avez trouvé en " + (NB_MAX_ESSAI - nbEssai) + " essai !";
                gagne = true;
            }
        }
    }

    /*CONSOMMATION D'UN ESSAI*/
    nbEssai += 1;
}

btnValider.addEventListener('click', partieMasterMind);
partieMasterMind();