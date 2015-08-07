
/*Fonction pour charger un document XML*/

function loadXMLDoc(filename)
{
if (window.XMLHttpRequest)
  {
  xhttp=new XMLHttpRequest();
  }
else // code for IE5 and IE6
  {
  xhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xhttp.open("GET",filename,false);
xhttp.send();
return xhttp.responseXML;
}
xmlDoc=loadXMLDoc("xml/donnees.xml");
/*Fonctions qui vont etre utiliser par l'interface capitaine et l'interface armateur*/

//lister tous les navires qui sont disponibles
function naviresDispo(){
	
	
	listeNavires = xmlDoc.getElementsByTagName("navire");
	listeNomNavires = xmlDoc.getElementsByTagName("nomnav");
	
	for(i = 0; i < listeNavires.length; i++){
		
		if (listeNavires[i].attributes.getNamedItem("disponible").nodeValue == "oui"){
			
			document.write("<option>" + listeNomNavires[i].childNodes[0].nodeValue + "</option>" );
			
		} else {
			
			document.write();
		}
	}
};
//lister tous les navires non disponibles = navires en mission
function naviresNonDispo(){
	
	
	listeNavires = xmlDoc.getElementsByTagName("navire");
	listeNomNavires = xmlDoc.getElementsByTagName("nomnav");
	listeDecision = xmlDoc.getElementsByTagName("decision");
	for(i = 0; i < listeNavires.length; i++){
		
		if (listeNavires[i].attributes.getNamedItem("disponible").nodeValue == "non"){
			if(listeDecision[i].childNodes[0].nodeValue == "approuver"){
				document.write("<option>" + listeNomNavires[i].childNodes[0].nodeValue + "</option>" );
			}
		} else {			
			document.write();
		}
	}
};

//lister tous les capitaines
function listeCapitaines(){
	
	
	listePersonnes = xmlDoc.getElementsByTagName("personne");
	listeIdentifiant = xmlDoc.getElementsByTagName("identifiant");
	nomPersonnes = xmlDoc.getElementsByTagName("nom");
	prenomPersonnes = xmlDoc.getElementsByTagName("prenom");
	
	for(i = 0; i < listePersonnes.length; i++){
		
		if (listeIdentifiant[i].childNodes[0].nodeValue != 'admin'){
				document.write('<option value='+ listeIdentifiant[i].childNodes[0].nodeValue +'>'+nomPersonnes[i].childNodes[0].nodeValue +' '+ prenomPersonnes[i].childNodes[0].nodeValue+'</option>');
		}
	
	};
};

//lister tous les missions a approuver ou refuser

function listeMissions(){
	
	listeMissions = xmlDoc.getElementsByTagName("mission");
	listeDureeMissions = xmlDoc.getElementsByTagName("dureeM");
	listeNomMissions = xmlDoc.getElementsByTagName("nomM");
	listePrenomMissions = xmlDoc.getElementsByTagName("prenomM");
	listeIdMissions = xmlDoc.getElementsByTagName("idMission");
	listeDecision = xmlDoc.getElementsByTagName("decision");
    listeidBail = xmlDoc.getElementsByTagName("idBailC");
	listeidBailM = xmlDoc.getElementsByTagName("idBail");
	

	
	for(i = 0; i < listeMissions.length; i++){
		if (listeDecision[i].childNodes[0].nodeValue == "attente"){	
		
			for (j = 0; j < listeidBail.length; j++){
				if (listeidBail[j].childNodes[0].nodeValue == listeidBailM[i].childNodes[0].nodeValue ){
					document.write('<option value='+ listeidBail[j].childNodes[0].nodeValue + '>' +listeDureeMissions[i].childNodes[0].nodeValue +'-'+listeNomMissions[i].childNodes[0].nodeValue+' '+listePrenomMissions[i].childNodes[0].nodeValue+'-'+listeIdMissions[i].childNodes[0].nodeValue+'</option>');

				}
			}
		
		}	
	};	
};

/*Fonctions pour gerer les utilisateurs */

//dessine un cercle rouge pour dire que les informations sont invalides
function verificationInvalide() {

	var ni = document.getElementById('container2');

	var newdiv = document.createElement('div');
	var newbutton = document.createElement('input');
  
	var divIdName = 'circleRouge';
	var buttonName = 'button1';
	
	newdiv.setAttribute('id',divIdName);

	ni.appendChild(newdiv);
}

//chargement de l'interface armateur
function verificationValideA(){
	
	location.assign('armateur.html');
	
}

//chargement de l'interface capitaine
function verificationValideC(){
	
	location.assign('capitaine.html');
	
}

function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

//fonction qui va verifier si les informations entrer sont valides par rapport a la base de donnees XML
function verification(){
	//document html
	var user = document.getElementById('utilisateur').value;
	var pass = document.getElementById('motdepasse').value;
	//document xml
	
	listeIdentifiant = xmlDoc.getElementsByTagName("identifiant");
	listePasse = xmlDoc.getElementsByTagName("passe");
	var allow = 0;
	for(i = 0; i < listeIdentifiant.length; i++){

		if (listeIdentifiant[i].childNodes[0].nodeValue == user && listePasse[i].childNodes[0].nodeValue == pass){
			
			if (pass == 'admin' && user == 'admin'){				
				verificationValideA();
				createCookie("admin","admin",7);
				return true;
			} else {
				verificationValideC();
				createCookie("nonadmin",user,7);
				allow = 1;
				return true;
			}
		}
	};
	if (allow == 0){
		verificationInvalide();
	}
};


function afficheDetailsMission(){
	
	selection = document.getElementById("selectMissionCss").value;
	listeRetro = xmlDoc.getElementsByTagName("retrocession");
	listePrise = xmlDoc.getElementsByTagName("prise");
	listeDuree = xmlDoc.getElementsByTagName("dureeB");
	listeIdBail = xmlDoc.getElementsByTagName("idBail");
	
	for (i = 0; i < listeIdBail.length; i++){
		if (selection == listeIdBail[i].childNodes[0].nodeValue ){
			index = i;
		}
	}
	document.getElementById("li1").innerHTML = "Prise: " + listePrise[index].childNodes[0].nodeValue+'<br>'+"Retrocession: " + listeRetro[index].childNodes[0].nodeValue+'<br>'+"Duree: " + listeDuree[index].childNodes[0].nodeValue;
	
}

function afficheDetailsCapitaine(){
	
	selection = document.getElementById("selectCapitainesCss").value;
	listePersonnes = xmlDoc.getElementsByTagName("personne");
	listeIdentifiant = xmlDoc.getElementsByTagName("identifiant");
	nomPersonnes = xmlDoc.getElementsByTagName("nom");
	prenomPersonnes = xmlDoc.getElementsByTagName("prenom");
	listeAge = xmlDoc.getElementsByTagName("age");
	listeTelephone = xmlDoc.getElementsByTagName("telephone");

	listeCode = xmlDoc.getElementsByTagName("codepostale");
	listeLieu = xmlDoc.getElementsByTagName("lieu");
	listeVille = xmlDoc.getElementsByTagName("ville");
	listeNoRue = xmlDoc.getElementsByTagName("norue");
	listePays = xmlDoc.getElementsByTagName("pays");
	for (i = 0; i < listeIdentifiant.length; i++){
		if (selection == listeIdentifiant[i].childNodes[0].nodeValue ){
			index = i;
		}
	}
	document.getElementById("li2").innerHTML = "Nom: " + nomPersonnes[index].childNodes[0].nodeValue+'<br>'+"Prenom: " + prenomPersonnes[index].childNodes[0].nodeValue+'<br>'+"Age: " + listeAge[index].childNodes[0].nodeValue + "<br>" + "Telephone: " +listeTelephone[index].childNodes[0].nodeValue + "<br>" + "Adresse: <br>" + "Rue:" + listeNoRue[index].childNodes[0].nodeValue + "<br>Lieu:" + listeLieu[index].childNodes[0].nodeValue +"<br> Ville:" + listeVille[index].childNodes[0].nodeValue + "<br> CP:" + listeCode[index].childNodes[0].nodeValue +"<br> Pays:"+listePays[index].childNodes[0].nodeValue;
	
}

function afficheDetailsNaviresOccupe(){
	
	selection = document.getElementById("selectEnMissionCss").value;
	listeRetro = xmlDoc.getElementsByTagName("retrocession");
	listePrise = xmlDoc.getElementsByTagName("prise");
	listeDuree = xmlDoc.getElementsByTagName("dureeB");
	listePersonnes = xmlDoc.getElementsByTagName("personne");
	listeNomNavires = xmlDoc.getElementsByTagName("nomnav");
	nomPersonnes = xmlDoc.getElementsByTagName("nom");
	prenomPersonnes = xmlDoc.getElementsByTagName("prenom");
	listeAge = xmlDoc.getElementsByTagName("age");
	listeTelephone = xmlDoc.getElementsByTagName("telephone");

	listeCode = xmlDoc.getElementsByTagName("codepostale");
	listeLieu = xmlDoc.getElementsByTagName("lieu");
	listeVille = xmlDoc.getElementsByTagName("ville");
	listeNoRue = xmlDoc.getElementsByTagName("norue");
	listePays = xmlDoc.getElementsByTagName("pays");
	
	for (i = 0; i < listeNomNavires.length; i++){
		if (selection == listeNomNavires[i].childNodes[0].nodeValue ){
			index = i;
		}
	}
	document.getElementById("li3").innerHTML = "Capitaine: " + nomPersonnes[index].childNodes[0].nodeValue + ' ' + prenomPersonnes[index].childNodes[0].nodeValue+'<br>'+"Prise: " + listePrise[index].childNodes[0].nodeValue+'<br>'+"Retrocession: " + listeRetro[index].childNodes[0].nodeValue+'<br>'+"Duree: " + listeDuree[index].childNodes[0].nodeValue+ "<br>" + "Telephone: " +listeTelephone[index].childNodes[0].nodeValue + "<br>" + "Adresse: <br>" + "Rue:" + listeNoRue[index].childNodes[0].nodeValue + "<br>Lieu:" + listeLieu[index].childNodes[0].nodeValue +"<br> Ville:" + listeVille[index].childNodes[0].nodeValue + "<br> CP:" + listeCode[index].childNodes[0].nodeValue +"<br> Pays:"+listePays[index].childNodes[0].nodeValue;
	
}



/*fin*/



//utiliser que par l'interface capitaine

function afficheMonProfile(){
	
	var identifiantF = readCookie('nonadmin');
	var pereNode = "";
	listeIdentifiant = xmlDoc.getElementsByTagName("identifiant");
	listePersonne = xmlDoc.getElementsByTagName("personne");
	for (i = 0; i < listeIdentifiant.length; i++){
		
		if (listeIdentifiant[i].childNodes[0].nodeValue == readCookie('nonadmin')){
				indice = i;
		}
	}
	nomF = listePersonne[indice].getElementsByTagName('nom')[0].childNodes[0].nodeValue;
	prenomF = listePersonne[indice].getElementsByTagName('prenom')[0].childNodes[0].nodeValue;
	identifiantF = listePersonne[indice].getElementsByTagName('identifiant')[0].childNodes[0].nodeValue;
	telF = listePersonne[indice].getElementsByTagName('telephone')[0].childNodes[0].nodeValue;
	codeF = listePersonne[indice].getElementsByTagName('codepostale')[0].childNodes[0].nodeValue;
	villeF = listePersonne[indice].getElementsByTagName('ville')[0].childNodes[0].nodeValue;
	norueF = listePersonne[indice].getElementsByTagName('norue')[0].childNodes[0].nodeValue;
	lieuF = listePersonne[indice].getElementsByTagName('lieu')[0].childNodes[0].nodeValue;
	paysF = listePersonne[indice].getElementsByTagName('pays')[0].childNodes[0].nodeValue;
	
	document.write("Identifiant:<br><input type='text' name='identifiantC' id='identifiant' value="+ identifiantF +"><br>");
	document.write("Nom:<br><input type='text' id='nom' name='nomC' value="+ nomF +"><br>");
	document.write("Prenom:<br><input type='text' name='prenomC' id='prenom' value=" + prenomF + "><br>");
	document.write("Tel:<br><input type='text' id='tel' value="+ telF +"><br>");
	document.write("Adresse:<br>");
	document.write("Rue: <input type='text' id='rue' value="+ norueF +"><br>");
	document.write("Lieu: <input type='text' id='lieu' value="+ lieuF +"><br>");
	document.write("Ville: <input type='text' id='ville' value="+ villeF +"><br>");
	document.write("CP:<input type='text' id='codepostale' value="+ codeF +"><br>");
	document.write("Pays: <input type='text' id='pays' value="+ paysF +"><br>");
};


function capitaineDisponible(){
	listeidentifiant = xmlDoc.getElementsByTagName('identifiant');
	listeidBailC = xmlDoc.getElementsByTagName('idBailC');
	listeidBail = xmlDoc.getElementsByTagName('idBail');
	identifiant = document.getElementById("identifiant").value;
	
	
	for (i = 0; i < listeidentifiant.length; i++){
		if (identifiant == listeidentifiant[i].childNodes[0].nodeValue){
			for (j = 0; j < listeidBail.length; j++){
				if (listeidBailC[i].childNodes[0].nodeValue == listeidBail[j].childNodes[0].nodeValue){
					
					document.write("<h3>vous êtes déjà en mission! </h3>");
				    var allow = 1;
				}
			}
		}
	}
	
	if (allow != 1){
		document.write('<br><input type="submit" value="Envoyer la demande" /> ');
	}
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkDuplicate(){
	listeBailId = xmlDoc.getElementsByTagName('idBail');
	num = getRandomArbitrary(100000,999999);
	allow = 1;
	for (i = 0; i < listeBailId.length; i++){
		
		if (num == parseInt(listeBailId[i].childNodes[0].nodeValue)){
			allow = 0;
			return false;
		}		
	}
	if (allow == 1){
		return num;
	}
}

function autocompletion(){
	
	selection = document.getElementById("selectC").value;
	document.getElementById('navireM').value = selection;
}

function addBail(){
	
	number = checkDuplicate();
	document.getElementById("idBailM").value = number;
	
}

function nombreCapitaines(){
		
		nombrePersonne =  xmlDoc.getElementsByTagName("personne").length;
		nombreNavire =  xmlDoc.getElementsByTagName("navire").length;
		document.write('Nombre capitaines: <input type="text" id="nombreC" size=3 name="nombreC" value='+nombrePersonne+ '><br>');
		document.write('Nombre navires: <input type="text" id="nombreN" size=3 name="nombreN" value='+nombreNavire+ '>');
}
