//imports

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var basex  = require("basex");
var log = require("basex/debug");
var fs = require('fs');
var http = require('http');
var et = require('elementtree');

var app = express();

//configure app

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views')); // le repertoire ou se trouve tous les fichier sont dans le views

//use middleware

app.use(bodyParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './')));
app.engine('html', require('ejs').renderFile);



//define routes


app.get('/',function(req, res){ //affiche la page d'accueil
	res.render('login.html');
});


app.post('/delete',function (req,res){
	
	var selectCapitaines = req.body.selectCapitaines;		
	
	var XML = et.XML;
	var ElementTree = et.ElementTree;
	var element = et.Element;
	var subElement = et.SubElement;
	root = element('armateur');
	var dataNew, etreeNew;
	dataNew = fs.readFileSync('xml/donnees.xml').toString();
	etreeNew = et.parse(dataNew);
	
	for (i = 0; i < etreeNew.getroot().getchildren()[0].len(); i++){
		
		if (etreeNew.getroot().getchildren()[0].getchildren()[i].find('identifiant').text == selectCapitaines){
			
			etreeNew.getroot().getchildren()[0].remove(etreeNew.getroot().getchildren()[0].getchildren()[i]);
			
		}
		
	}
	etree = new ElementTree(etreeNew._root);
	xml = etree.write({'xml_declaration': true});
	fs.writeFile('xml/donnees.xml',xml);
	res.redirect("armateur.html");
	
});
app.post('/decision', function (req,res){ //mise a jour du fichier xml  - interface armateur
	//variable depuis capitaine.html
	
	var idBailSelection = req.body.selectMission;
	
	var XML = et.XML;
	var ElementTree = et.ElementTree;
	var element = et.Element;
	var subElement = et.SubElement;
	var dataNew, etreeNew;
	dataNew = fs.readFileSync('xml/donnees.xml').toString();
	etreeNew = et.parse(dataNew);
	root = element('armateur');

	for (i = 0; i < etreeNew.getroot().getchildren()[1].len(); i++){
		
		if (etreeNew.getroot().getchildren()[1].getchildren()[i].find('bail').getchildren()[0].text == idBailSelection){
			etreeNew.getroot().getchildren()[1].getchildren()[i].find('mission').getchildren()[5].text = 'approuver';
		}
	}
	
	etree = new ElementTree(etreeNew._root);
	xml = etree.write({'xml_declaration': true});
	fs.writeFile('xml/donnees.xml',xml);
	
	res.redirect("armateur.html");
});

app.post('/terminermission', function (req,res){ //mise a jour du fichier xml  - interface capitaine
	//variable depuis capitaine.html
	
	var idBail = req.body.idbailnavire;
	
	var XML = et.XML;
	var ElementTree = et.ElementTree;
	var element = et.Element;
	var subElement = et.SubElement;
	var dataNew, etreeNew;
	dataNew = fs.readFileSync('xml/donnees.xml').toString();
	etreeNew = et.parse(dataNew);
	root = element('armateur');

	for (i = 0; i < etreeNew.getroot().getchildren()[1].len(); i++){
		
		if (etreeNew.getroot().getchildren()[1].getchildren()[i].find('bail').getchildren()[0].text == idBail){
			etreeNew.getroot().getchildren()[1].getchildren()[i].find('mission').getchildren()[5].text = 'disponible';
			etreeNew.getroot().getchildren()[1].getchildren()[i].set("disponible","oui");
		}
	}
	
	etree = new ElementTree(etreeNew._root);
	xml = etree.write({'xml_declaration': true});
	fs.writeFile('xml/donnees.xml',xml);
	
	res.redirect("capitaine.html");
});

app.post('/add', function (req,res){ //mise a jour du fichier xml  - interface armateur
	//variable depuis capitaine.html
	var paysM = req.body.paysM;
	var dureeM = req.body.dureeM;
	var priseM = req.body.priseM;
	var retrocessionM = req.body.retrocessionM;
	var navireM = req.body.navireM;
	var missionM = req.body.missionM;
	var idBailM = req.body.idBailM;
	var identifiantC = req.body.identifiantM;
	var nomM = req.body.nomM;
	var prenomM = req.body.prenomM;
	var debutM = req.body.debutM;
	var finM = req.body.finM;
	var idmissionM = req.body.idmissionM
	var dureeB = req.body.dureeB;
	
	
	var XML = et.XML;
	var ElementTree = et.ElementTree;
	var element = et.Element;
	var subElement = et.SubElement;
	var dataNew, etreeNew;
	dataNew = fs.readFileSync('xml/donnees.xml').toString();
	etreeNew = et.parse(dataNew);
	root = element('armateur');



	for(i = 0; i < etreeNew.getroot().getchildren()[0].len(); i++){
		if(etreeNew.getroot().getchildren()[0].getchildren()[i].find('identifiant').text == identifiantC){
			
			etreeNew.getroot().getchildren()[0].getchildren()[i].find('idBailC').text = idBailM;
		}
	}
	
	
	for (i = 0; i < etreeNew.getroot().getchildren()[1].len(); i++){
		
		if (etreeNew.getroot().getchildren()[1].getchildren()[i].find('nomnav').text == navireM){
			etreeNew.getroot().getchildren()[1].getchildren()[i].find('bail').getchildren()[0].text = idBailM;
			etreeNew.getroot().getchildren()[1].getchildren()[i].find('bail').getchildren()[1].text = priseM;
			etreeNew.getroot().getchildren()[1].getchildren()[i].find('bail').getchildren()[2].text = retrocessionM;
			etreeNew.getroot().getchildren()[1].getchildren()[i].find('bail').getchildren()[3].text = dureeM;
			etreeNew.getroot().getchildren()[1].getchildren()[i].find('mission').set('type' ,missionM);
			etreeNew.getroot().getchildren()[1].getchildren()[i].find('mission').getchildren()[3].getchildren()[0].text = nomM;
			etreeNew.getroot().getchildren()[1].getchildren()[i].find('mission').getchildren()[3].getchildren()[1].text = prenomM;
			etreeNew.getroot().getchildren()[1].getchildren()[i].find('mission').getchildren()[0].text = debutM;
			etreeNew.getroot().getchildren()[1].getchildren()[i].find('mission').getchildren()[1].text = finM;
			etreeNew.getroot().getchildren()[1].getchildren()[i].find('mission').getchildren()[2].text = dureeM;
			etreeNew.getroot().getchildren()[1].getchildren()[i].find('mission').getchildren()[4].text = idmissionM;
			etreeNew.getroot().getchildren()[1].getchildren()[i].find('mission').getchildren()[5].text = 'attente';
			etreeNew.getroot().getchildren()[1].findall('navire')[i].set('disponible','non');
		}
	}
	
	etree = new ElementTree(etreeNew._root);
	xml = etree.write({'xml_declaration': true});
	fs.writeFile('xml/donnees.xml',xml);
	
	res.redirect("capitaine.html");
});

app.post('/add2', function (req,res){ //mise a jour du fichier xml  - interface armateur
	
	//variable depuis armateur.html
	var nomC = req.body.nomC;
	var prenomC = req.body.prenomC;
	var ageC = req.body.ageC;
	var telC = req.body.telC;
	var sexeC = req.body.sexeC;
	var identifiantC = req.body.identifiantC;
	var motdepasseC = req.body.motdepasseC;
	var codepostaleC = req.body.codepostaleC;
	var villeC = req.body.villeC;
	var norueC = req.body.norueC;
	var lieuC = req.body.lieuC;
	var paysC = req.body.paysC;
	
	var XML = et.XML;
	var ElementTree = et.ElementTree;
	var element = et.Element;
	var subElement = et.SubElement;
	root = element('armateur');
	var dataNew, etreeNew;
	dataNew = fs.readFileSync('xml/donnees.xml').toString();
	etreeNew = et.parse(dataNew);

	personneTag = subElement(etreeNew.find('capitaines'), 'personne');
	personneTag.set('sexe',sexeC);

	//------
	nomTag = subElement(personneTag, 'nom');
	nomTag.text = nomC;

	prenomTag = subElement(personneTag, 'prenom');
	prenomTag.text = prenomC;

	ageTag = subElement(personneTag, 'age');
	ageTag.text = ageC;

	telephoneTag = subElement(personneTag, 'telephone');
	telephoneTag.text = telC;

	adresseTag = subElement(personneTag, 'adresse');
	//---sub
	codepostaleTag = subElement(adresseTag, 'codepostale');
	codepostaleTag.text = codepostaleC;
	villeTag = subElement(adresseTag, 'ville');
	villeTag .text = villeC;
	norueTag = subElement(adresseTag, 'norue');
	norueTag.text = norueC;
	lieuTag = subElement(adresseTag, 'lieu');
	lieuTag.text = lieuC;
	paysTag = subElement(adresseTag, 'pays');
	paysTag.text = paysC;
	//--
	passeTag = subElement(personneTag,'passe');
	passeTag.text = motdepasseC;
	identifiantTag = subElement(personneTag, 'identifiant');
	identifiantTag.text = identifiantC;

	idBailCTag = subElement(personneTag, 'idBailC');
	idBailCTag.text = "pasdebail";
	
	etree = new ElementTree(etreeNew._root);
	xml = etree.write({'xml_declaration': true});
	fs.writeFile('xml/donnees.xml',xml);
	
	res.redirect("armateur.html");
});


//affiche sur la console qu'on est bien connecte

var port = process.env.PORT || 1337;
app.listen(port, function(){
	console.log('sur le port 1337...');
			
});

