/* ******************************************************************
 * Constantes de configuration
 */
const apiKey = "276cd03c-ca98-439b-bbec-57813a1807cf";
const url = "https://lifap5.univ-lyon1.fr";

/* ******************************************************************
 * Gestion des tabs "Voter" et "Toutes les citations"
 ******************************************************************** */

/**
 * Affiche/masque les divs "div-duel" et "div-tout"
 * selon le tab indiqué dans l'état courant.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majTab(etatCourant) {
  console.log("CALL majTab");
  const dDuel = document.getElementById("div-duel");
  const dTout = document.getElementById("div-tout");
  const tDuel = document.getElementById("tab-duel");
  const tTout = document.getElementById("tab-tout");
  if (etatCourant.tab === "duel") {
    dDuel.style.display = "flex";
    tDuel.classList.add("is-active");
    dTout.style.display = "none";
    tTout.classList.remove("is-active");
  } else {
    dTout.style.display = "flex";
    tTout.classList.add("is-active");
    dDuel.style.display = "none";
    tDuel.classList.remove("is-active");
  }
}

/**
 * Mets au besoin à jour l'état courant lors d'un click sur un tab.
 * En cas de mise à jour, déclenche une mise à jour de la page.
 *
 * @param {String} tab le nom du tab qui a été cliqué
 * @param {Etat} etatCourant l'état courant
 */
function clickTab(tab, etatCourant) {
  console.log(`CALL clickTab(${tab},...)`);
  if (etatCourant.tab !== tab) {
    etatCourant.tab = tab;
    majPage(etatCourant);
  }
}

/**
 * Enregistre les fonctions à utiliser lorsque l'on clique
 * sur un des tabs.
 *
 * @param {Etat} etatCourant l'état courant
 */
function registerTabClick(etatCourant) {

  console.log("CALL registerTabClick");
  document.getElementById("tab-duel").onclick = () =>
    clickTab("duel", etatCourant);
  document.getElementById("tab-tout").onclick = () =>
    clickTab("tout", etatCourant);
}



/**
 * Retourne un tableau contenant les données du serveur
 *
 * @param {Etat} etatCourant l'état courant
 * @return un tableau
 */
function tabCitation(etatCourant) {
  return  `
          <tr>
            <td class="classe"></td> 
            <td class="char">${etatCourant.character}</td>
            <td class="quote">  ${etatCourant.quote}</td> 
          </tr>`; 
}

/**
 * Transforme des citations en un tableau HTML
 *
 * @param {Etat} etatCourant l'état courant
 * @preturn un tableau modifié
 */
 function TransformeHTML(etatCourant) {
  return Array.from(etatCourant).map(tabCitation).join('\n');
}

/**
 * Incrémente de 1 le nombre de la colonne 'classement'
 *
 * @param {Etat} etatCourant l'état courant
 */
 function classementEntier(tab) {
  let a = document.getElementById('tbody')
  let b =  a.getElementsByClassName('classe');
  for ( let i in tab) {
    b[i].innerHTML = parseInt(i,10) + 1; //incrementer le classement de 1 en commençant par 1
  }
}
   

/**
 * Tirer deux citations au hasard parmi l’ensemble des citations disponibles sur le serveur 
 * Remplace les citations de l’onglet “Voter”
 *
 * @param {Etat} etatCourant l'état courant
 */
function duel(etatCourant) {
  let entierAleatoire = Math.floor(Math.random() * (etatCourant.length - 0 + 1)) + 0;
  let entierAleatoire1 = Math.floor(Math.random() * (etatCourant.length - 0 + 1)) + 0;

  document.getElementById('cit1').innerHTML = etatCourant[entierAleatoire].quote;
  const img1 = document.getElementById('img1');
  img1.src = etatCourant[entierAleatoire].image;
  if (etatCourant[entierAleatoire].characterDirection === 'Right') img1.style.transform = "scaleX(-1)";

  document.getElementById('cit2').innerHTML = etatCourant[entierAleatoire1].quote;
  const img2 = document.getElementById('img2');
  img2.src = etatCourant[entierAleatoire1].image;
  if (etatCourant[entierAleatoire1].characterDirection === 'Right') img2.style.transform = "scaleX(1)";
}



/**
 * Affiche des détails d'une citation lors d'un clic
 *
 * @param {Etat} etatCourant l'état courant
 */
 function detail(etatCourant) {   

  for (let i in etatCourant) {  
    let body = document.getElementById('tbody');
    let tr = body.querySelectorAll('tr'); //sélectionne les lignes
    let btn = document.createElement('button');
    btn.classList= "icon has-text-info fas fa-info-circle ";
    tr[i].append(btn);

  btn.addEventListener('click', () => { 
    modal.classList.add('is-active');
    let res = document.getElementById('detail'); //recupere le span où on ecrit les infos d'une citation
    delete etatCourant[i].scores; //supprime les scores
    delete etatCourant[i]._id; //supprime les id
    let tabString = JSON.stringify(etatCourant[i]); //transforme en chaine pour l'affichage;

    let newTab = tabString.split(','); //ça marche pas
    res.innerHTML = newTab;
    })  
  }

  let modalBg = document.querySelector('.modal-background');
  let modal = document.querySelector('.modal');
  modalBg.addEventListener('click', () => modal.classList.remove('is-active')); //fenetre modal se ferme si bg cliqué
}




/**
 * Ajoute une citation via un formulaire
 *
 * @param {} none
 */
function ajouter() {
  let myHeaders = new Headers({
  "accept": "application/JSON",
  "Content-Type": "application/JSON",
  "x-api-key": apiKey
  });

  let data = { //recupere données du formulaire pour les envoyer au serveur 
  quote: document.getElementById('citation').value,
  character: document.getElementById('perso').value,
  image: document.getElementById('image').value,
  characterDirection: document.getElementById('direct').value,
  origin: document.getElementById('origine').value
  };

  if(document.getElementById('citation').value != "" && document.getElementById('origine').value != "" && document.getElementById('perso').value != "") {
    fetch(url + "/citations", { method: 'POST', headers: myHeaders, body:JSON.stringify(data) }) //ajout des citations au serveur
   .then(reponse => reponse.json()) //transforme données en json
    .then(reponse2 =>  { alert('la citation a bien été ajoutée !');  
    })
  } 

  else alert('Merci de remplir les champs obligatoires (avec un *)');
}

/**
 * Ajoute boutons pour modifier une citation ajoutée par un utilisateur
 * Affiche un formulaire pré-rempli
 *
 * @param {Etat} etatCourant l'état courant
 */
function modifier(etatCourant) {

  for (let i in etatCourant) {
    let form = document.getElementById('formulaire');
    form.style.display = 'none';
    if(etatCourant[i].addedBy === 'p1907992' || etatCourant[i].addedBy === 'p1925003') { // si on a ajouté une citation
      let id = etatCourant[i]._id;
      let j = parseInt(i,10) + 1;; // = i+ 1
      let a = document.querySelectorAll('tr')[j]; //retourne la ligne ajoutée par p1907992 ou p1925003  
      let btn = document.createElement('button');
      a.appendChild(btn);
      btn.innerHTML = 'modifier';
      btn.onclick = () => { form.style.display = 'block';
        formPreRempli(etatCourant,i);
      }
    }
  }
}


/**
 * Envoie les modifications au serveur via la méthode POST
 *
 * @param {Etat} etatCourant l'état courant
 */
 function envoiModification() {
  let myHeaders = new Headers({
    "accept": "application/JSON",
    "Content-Type": "application/JSON",
    "x-api-key": apiKey
  });

  let data = { //recupere données du formulaire pour les envoyer au serveur 
    quote: document.getElementById('citation2').value,
    character: document.getElementById('perso2').value,
    image: document.getElementById('image2').value,
    characterDirection: document.getElementById('direct2').value,
    origin: document.getElementById('origine2').value
  };

  fetch(url + "/citations", { method: 'POST', headers: myHeaders, body:JSON.stringify(data)}) //ajout des citations au serveur
  .then(reponse => reponse.json()) //transforme données en json
  .then(reponse2 =>  alert('la citation a bien été modifiée !'));
              
}



/**
 * Affiche un formulaire pré-rempli
 *
 * @param {Etat,i} etatCourant l'état courant et i l'indice
 */
function formPreRempli(etatCourant, i) {
  document.getElementById("citation2").value =  etatCourant[i].quote;
  document.getElementById("perso2").value =  etatCourant[i].character;
  document.getElementById("image2").value =  etatCourant[i].image;
  document.getElementById("direct2").value =  etatCourant[i].characterDirection;
  document.getElementById("origine2").value =  etatCourant[i].origin;
}





/* ******************************************************************
 * Gestion de la boîte de dialogue (a.k.a. modal) d'affichage de
 * l'utilisateur.
 * ****************************************************************** */

/**
 * Fait une requête GET authentifiée sur /whoami
 * @returns une promesse du login utilisateur ou du message d'erreur
 * @param {api} api une clé API
 */
function fetchWhoami(api) {
  return fetch(url + "/whoami" , { headers: { "x-api-key": api } }) 
    .then((response) => response.json())
    .then((jsonData) => {
      if (jsonData.status && Number(jsonData.status) != 200) {
        return { err: jsonData.message };
      }
      return jsonData;
    })
    .catch((erreur) => ({ err: erreur }));
}
/**
 * Vérifie que la clé API est valide
 *
 * @param {} none
 */
function requete() {
  var key_test = document.getElementById("api").value;
  ok = lanceWhoamiEtInsereLogin(key_test);
}


/*
 * Fait une requête sur le serveur et insère le login dans
 * la modale d'affichage de l'utilisateur.
 * @param {k} k une clé API
 * @returns Une promesse de mise à jour*/
function lanceWhoamiEtInsereLogin(k) {
  return fetchWhoami(k).then((data) => {
    const elt = document.getElementById("elt-affichage-login");
    const ok = data.err === undefined;
    if (!ok) {
      document.getElementById('btn-open-login-modal').innerHTML = 'Connexion';
      elt.innerHTML = `<span class="is-error">${data.err}</span>`;
    }
    else {
      elt.innerHTML = `Bonjour ${data.login}.`;
      document.getElementById("btn-close-login-modal2").onclick = () => {
      document.getElementById('btn-open-login-modal').innerHTML = 'Deconnexion';
      } 
  return ok;
    }
  })
}



/**
 * Affiche ou masque la fenêtre modale de login en fonction de l'état courant.
 * Change la valeur du texte affiché en fonction de l'état
 *
 * @param {Etat} etatCourant l'état courant
 */
function majModalLogin(etatCourant) {
  const modalClasses = document.getElementById("mdl-login").classList;
  if (etatCourant.loginModal) {
    modalClasses.add("is-active");
    const elt = document.getElementById("elt-affichage-login");

    const ok = etatCourant.login !== undefined;
    if (!ok) {
      elt.innerHTML = `<span class="is-error">${etatCourant.errLogin}</span>`;
    } else {
      elt.innerHTML = `Bonjour ${etatCourant.login}.`;
    }
  } else {
    modalClasses.remove("is-active");
  }
}


/**
 * Affiche ou masque la fenêtre modale de login en fonction de l'état courant.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majModalLogin(etatCourant) {
  const modalClasses = document.getElementById("mdl-login").classList;
  if (etatCourant.loginModal) {
    modalClasses.add("is-active");
    lanceWhoamiEtInsereLogin();
  } else {
    modalClasses.remove("is-active");
  }
}

/**
 * Déclenche l'affichage de la boîte de dialogue du nom de l'utilisateur.
 * @param {Etat} etatCourant
 */
function clickFermeModalLogin(etatCourant) {
  etatCourant.loginModal = false;
  majPage(etatCourant);
}

/**
 * Déclenche la fermeture de la boîte de dialogue du nom de l'utilisateur.
 * @param {Etat} etatCourant
 */
function clickOuvreModalLogin(etatCourant) {
  etatCourant.loginModal = true;
  majPage(etatCourant);
}

/**
 * Enregistre les actions à effectuer lors d'un click sur les boutons
 * d'ouverture/fermeture de la boîte de dialogue affichant l'utilisateur.
 * @param {Etat} etatCourant
 */
function registerLoginModalClick(etatCourant) {
  document.getElementById("btn-close-login-modal1").onclick = () =>
    clickFermeModalLogin(etatCourant);
  document.getElementById("btn-close-login-modal2").onclick = () =>
    clickFermeModalLogin(etatCourant);
  document.getElementById("btn-open-login-modal").onclick = () =>
    clickOuvreModalLogin(etatCourant);
}

/* ******************************************************************
 * Initialisation de la page et fonction de mise à jour
 * globale de la page.
 * ****************************************************************** */

/**
 * Mets à jour la page (contenu et événements) en fonction d'un nouvel état.
 *
 * @param {Etat} etatCourant l'état courant
 */


/**
 * Affiche ou masque la fenêtre modale de login en fonction de l'état courant.
 * Change la valeur du texte affiché en fonction de l'état
 *
 * @param {Etat} etatCourant l'état courant
 */
function majModalLogin(etatCourant) {
  const modalClasses = document.getElementById("mdl-login").classList;
  if (etatCourant.loginModal) {
    modalClasses.add("is-active");
    const elt = document.getElementById("elt-affichage-login");

    const ok = etatCourant.login !== undefined;
    if (!ok) {
      elt.innerHTML = `<span class="is-error">${etatCourant.errLogin}</span>`;
    } else {
      elt.innerHTML = `Bonjour ${etatCourant.login}.`;
    }
  } else {
    modalClasses.remove("is-active");
  }
}


/**
 * Filtre les personnages via un input
 *
 * @param {Etat} etatCourant l'état courant
 */

function filtrerPersonnage(etatCourant) {
  let body = document.getElementById('tbody'); 
  const filtrePerso = document.getElementById('filtreperso');
  filtrePerso.addEventListener('keyup', (e) => {
    const term = e.target.value.toLowerCase(); //récupére le input filtrePerso
    const perso = body.getElementsByClassName('char');
    Array.from(perso).forEach((unPerso) => {
    const elt = unPerso.innerHTML;
    if(elt.toLowerCase().indexOf(term) != -1 ) //verifie si term est dans elt, indexof renvoie 1 si vrai, -1 sinon
      unPerso.style.display = 'block'; //visible
    else unPerso.style.display = 'none'; //invisible
    })
  })
}

/**
 * Filtre les citations via un input
 *
 * @param {Etat} etatCourant l'état courant
 */
function filtrerCitation(etatCourant) {
  let body = document.getElementById('tbody');
  const filtrePerso = document.getElementById('filtrecit');
  filtrePerso.addEventListener('keyup', (e) => {
    const term = e.target.value.toLowerCase();
    const cit = body.getElementsByClassName('quote');
    Array.from(cit).forEach((uneCit) => {
    const elt = uneCit.innerHTML;
    if(elt.toLowerCase().indexOf(term) != -1 ) //verifie si term est dans elt, indexof renvoie 1 si vrai, -1 sinon
      uneCit.style.display = 'block'; //visible
    else uneCit.style.display = 'none'; //invisible
    })
  })
}


/**
 * Appelle toutes fonctions en rapport avec les citations
 *
 * @param {Etat} etatCourant l'état courant
 */
 function maj_citations(etatCourant) {
  console.debug(`CALL maj_liste_nouvelles([...])`);
  const citationHTML = TransformeHTML(etatCourant);
  document.getElementById('tbody').innerHTML = citationHTML;
  let tab = Array.from(etatCourant); //recupeere le tableau de 'toutes les citations'
  classementEntier(tab); 
  duel(tab);
  detail(tab);
  filtrerPersonnage(tab);
  filtrerCitation(tab);
  modifier(tab);
}



/**
 * Met à jour l'état actuel avec un nouvel état
 *
 * @param {Etat} etatCourant l'état courant
 */
 function majPage(etatCourant) {
  console.log("CALL majPage");
  fetch(url + "/citations")
  .then((response) => response.json())
  .then(maj_citations); 
  
  majTab(etatCourant);
  majModalLogin(etatCourant);
  registerTabClick(etatCourant);
  registerLoginModalClick(etatCourant);
}

/**
 * Appelé après le chargement de la page.
 * Met en place la mécanique de gestion des événements
 * en lançant la mise à jour de la page à partir d'un état initial.
 */
function initClientCitations() {
  console.log("CALL initClientCitations");
  const etatInitial = {
    tab: "duel",
    loginModal: false,
  };
  majPage(etatInitial);
  console.log(etatInitial);
}

// Appel de la fonction init_client_duels au après chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  console.log("Exécution du code après chargement de la page");
  initClientCitations();
});