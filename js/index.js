var result = /[^a-záéóúâêôû\\,\\ ]/i
var elenco = new Array();
var tipo = new Array();
var wholeId = new Array();
var video;

function createCORSRequest(method, url) {
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr){
		xhr.open(method, url, true);
	} else if (typeof XDomainRequest != "undefined"){//para IE (argh)
		xhr = new XDomainRequest();
		xhr.open(method, url);
	} else {
		xhr=null;
	}
	return xhr;
}

function CORSSupported(entrada){
	if (!entrada){
		alert('CORS not supported!');
		return;
	}
}

function searchVideo(entrada){
	entrada = entrada+" trailer";
	var url = "https://www.googleapis.com/youtube/v3/search?part=id&type=video&key=AIzaSyCld-ZwYo_x4KjF-L_8CJiyQSVBOTeY6yI&q="+entrada;

	var xhr = createCORSRequest('GET',url);
	CORSSupported(xhr);
	
	xhr.onload = function(){
		var data = JSON.parse(xhr.responseText);
		video = "http://www.youtube.com/embed/"+data.items[0].id.videoId;
	}
	
	xhr.onerror = function(){
		alert('Woops, there was an error making the request.');
	};
	
	xhr.send(null);
}

/*
	FUNÇÕES PARA PROCURAR NO ARQUIVO DATABASE
*/

/* FUNÇÃO PARA EXTRAIR <body></body> DA DATABASE*/
function getBody(content){
	var x = content.indexOf("<div id="); //retorna a posição que começa <body>
	var y = content.lastIndexOf("</body>");
	return content.slice(x, y);
}

function prepare(id,exibir){
	var temp;
	var imagem;
	var nomeFilme;
	var sinopse;
	var categoria;
	var ano;
	var atores;

	for (var i = 0; i < exibir.length; i++) {
		if (exibir[i].getAttribute("id")==id){
			temp = exibir[i].getElementsByTagName("img")[0];
			imagem = "database/"+temp.getAttribute("src");
			temp = exibir[i].getElementsByTagName("h2")[0];
			nomeFilme = temp.firstChild.nodeValue;
			searchVideo(nomeFilme);			
			temp = exibir[i].getElementsByTagName("p")[1];
			sinopse = temp.firstChild.nodeValue;
			temp = exibir[i].getElementsByTagName("ul")[0];
			categoria = temp.getElementsByTagName("li");
			for (var j = 0; j < categoria.length; j++) {
				tipo.push(categoria[j].firstChild.nodeValue);
			};
			temp = exibir[i].getElementsByTagName("p")[0];
			ano = temp.lastChild.nodeValue;
			temp = exibir[i].getElementsByTagName("ul")[1];
			atores = temp.getElementsByTagName("li");
			for (var j = 0; j < atores.length; j++) {
				elenco.push(atores[j].firstChild.nodeValue);
			};
		}
	};
	if (!nomeFilme){
		prepare(wholeId[Math.floor(Math.random() * wholeId.length)], exibir);
	}

	setTimeout(function(){
		atualizaSection(imagem,nomeFilme,sinopse,tipo,ano,elenco);
	}, 3000);

	document.getElementById("loading").style.display = "none";
	document.getElementById("loading-image").style.display = "none";
}

function matchWord(campo, entrada){
	if (!campo){
		return true;
	}
	else if (entrada.match(campo)){
		return true;
	}
	else{
		return false;
	}
}

function equalWord(campo, entrada){
	if (!campo){
		return true;
	}
	else if (campo==entrada){
		return true;
	}
	else{
		return false;
	}
}

function extractInfo(){
	var cont;
	var printed = document.getElementById("storage");
	var data = printed.getElementsByTagName("div");

	var actors = document.getElementById("nameActor").value;
	var year = document.getElementById("year").value;
	var category = document.getElementById("category").value;
	var other = document.getElementById("otherInfo").value;

	var geralTemp = new Array();

	var actorsName = actors.toLowerCase().split(",");
	var otherList = other.toLowerCase().split(",");
	/*for (var i = 0; i < otherList.length; i++) {
		alert(otherList[i]);
	};*/

	if (!actors && !year && !category && !other){
		for (var i = 0; i < data.length; i++) {
			wholeId.push(data[i].getAttribute("id"));
		};
	}

	else if (actors || year || category || other){
		for (var i = 0; i < data.length; i++) {
			cont = 0;
			var list = data[i].getElementsByTagName("ul")[1];
			var cast = list.getElementsByTagName("li");
			var ano = data[i].getElementsByTagName("p")[0];
			list = data[i].getElementsByTagName("ul")[0];
			var categories = list.getElementsByTagName("li");
			var title = data[i].getElementsByTagName("h2")[0];
			var essay = data[i].getElementsByTagName("p")[1];
			for (var j = 0; j < actorsName.length; j++) {
				for (var k = 0; k < cast.length; k++) {
					if ( matchWord( actorsName[j].trim(), cast[k].firstChild.nodeValue.toLowerCase() ) ){
						cont++;
					}
				};
			};

			if (cont==actorsName.length || cont>actorsName.length){
				cont=0;
				for (var j = 0; j < otherList.length; j++) {
					if ( matchWord( otherList[j].trim(), title.firstChild.nodeValue.toLowerCase() ) || 
						matchWord( otherList[j].trim(), essay.firstChild.nodeValue.toLowerCase() ) ){
						cont++;
					}
				};
				if (cont==otherList.length || cont>otherList.length){
					for (var j = 0; j < categories.length; j++) {
						if ( equalWord( year, ano.lastChild.nodeValue ) &&
								equalWord( category, categories[j].firstChild.nodeValue.toLowerCase() )
							) {
							geralTemp.push(data[i].getAttribute("id"));
						}
					};
				}
			}
		};

		$.each (geralTemp, function(i, el){
			if ($.inArray(el, wholeId) === -1) wholeId.push(el);
		});
	}

	/*for (var i = 0; i < wholeId.length; i++) {
		alert(wholeId[i]);
	};*/
	//alert(wholeId.length);	

	if (!wholeId.length){
		var section = document.getElementById("section");
		var html="";
		html+="<br/>";
		html+="<h1>Ooops...</h1></br>";
		html+="<img src=\"image/tv-set-funky-cuteo.gif\" style=\"margin-left:30%; width: 199px; height:146px\"/>";
		html+="<div id='box-toggle'>";
		html+="<h2>Em nosso banco de dados não encontramos o filme que você deseja.</h2>";
		html+="<h2>Tente novamente clicando no botão abaixo.</h2></br>";
		html+="</div>";
		html+="<a href='index.html'> <input id='new' type='button' style=\"margin-left:40%;\" value='Iniciar Nova Busca'/></a>";
		html+="</div></div>";
		html+="</br></br></br>";
		section.innerHTML= html;
		document.getElementById("loading").style.display = "none";
		document.getElementById("loading-image").style.display = "none";

	}
	else{
		prepare(wholeId[Math.floor(Math.random() * wholeId.length)],data);
	}
}

function searchData(){
	var responseHTML = document.getElementById("storage");
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET","database/movies.html",true);
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4){
			responseHTML.innerHTML = getBody(xmlhttp.responseText);
			extractInfo();	
		}
	}
	xmlhttp.send(null);
}

function onSubmit (){
	var inputActor = document.getElementById("nameActor").value;
	var inputOther = document.getElementById("otherInfo").value;
	/*	Verificar se existe caracteres invalidos e espaço antes ou depois da virgula
		nos campos Atores e Outras Informações
	*/
	if (result.test(inputActor)){
		alert("No campo Atores: existe caracter inválido! Corrija e tente novamente.");
	}
	else if (result.test(inputOther)){
		alert("No campo Outras Informações: existe caracter inválido! Corrija e tente novamente.");
	}
	else {
		document.getElementById("loading").style.display = "block";
		document.getElementById("loading-image").style.display = "inline";
		searchData();
	}

	return false;
}

function buscarOutroFilme(){
	document.getElementById("loading").style.display = "block";
	document.getElementById("anotherPage").style.display = "inline";
	setTimeout(function(){
		var id = wholeId[Math.floor(Math.random() * wholeId.length)];
		var printed = document.getElementById("storage");
		var data = printed.getElementsByTagName("div");
		prepare(id,data);
	}, 500);
	//document.getElementById("anotherPage").style.display = "none";
}

function atualizaSection(caminhoCartaz,nomeFilme,sinopse,categoria,ano,atores){
	var section = document.getElementById("section");
	var html = "";
		
	html+="<br/>";
	html+="<a href='index.html'> <input id='new' type='button'value='Iniciar Nova Busca'/></a>";
	html+="<input id='back' type='button' onClick='return buscarOutroFilme();' value='Indicar outro Filme'/>";
	html+="<h1>"+nomeFilme+"</h1></br>";
	html+="<img src="+caminhoCartaz+" class='cartaz'/>";	
	html+="<iframe src=\""+video+"\"></iframe></br></br></br></br></br></br>";
	html+="<div id='box-toggle'>";
	html+="<h2>Sinopse</h2><div class=\"tgl\"><p>"+sinopse+"</p></div>";
	html+="<h2>Categoria</h2><div class=\"tgl\">";
	for (var i=0; i<categoria.length; i++) {
		html+="<p>"+categoria[i]+"</p>";	
	}
	html+="</div>";
	html+="<h2>Ano</h2><div class=\"tgl\"><p>"+ano+"</p></div>";
	html+="<h2>Atores</h2><div class=\"tgl\">";
	for (var i=0; i<atores.length; i++) {
		html+="<p>"+atores[i]+"</p>";	
	}
	html+="</div></div>";
	
	//Aqui Escreve em section o filme que foi escolhido	
	section.innerHTML= html;
	$(document).ready(function(){
		$("#box-toggle").accordion({
			heightStyle: "content"
		});
	});
}

function onSubmitContact(){
	var nome = document.getElementById("nameUser").value;
	var texto = document.getElementById("text").value;
	if (nome == "") {
		alert("Campo Nome obrigatório!");	
		return false;
	}
	if ((texto == " ") || (texto == "")) {
		alert("Campo Mensagem Obrigatório!");	
		return false;
	}
	else {	
		alert("Sua mensagem foi enviada com sucesso!");
		return true;
	}
}
