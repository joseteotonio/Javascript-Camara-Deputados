const URL_BASE = "https://dadosabertos.camara.leg.br/api/v2/";
const URL_FOTO = "https://www.camara.leg.br/internet/deputado/bandep/";

var listaDeDeputados;
var itensPorPagina = 8;
var listaDeNomes = [];

$(document).ready(function(){
  $.get(URL_BASE + "deputados?ordem=ASC&ordenarPor=nome", function(data, status){

    listaDeDeputados = data.dados;

    listaDeDeputados.forEach(salvarNomes);

    $('input.autocomplete').autocomplete({
      data: listaDeNomes
    });

    var totalDept = listaDeDeputados.length;
    var qtdPaginas = Math.ceil(totalDept / itensPorPagina);

    var paginacao = '';  
    
    for (var i = 1; i <= qtdPaginas; i++) {
      paginacao += `
      <li class="waves-effect" id=${i} onclick="irParaPagina(${i})">
      <a href="#!">${i}</a>
      </li>`;
    }

    $("#paginacao").append(`
      <ul class="pagination">
      <li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
      `
      + paginacao +
      `
      <li class="waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
      </ul>`);

      irParaPagina(1);

    });

  });

  function salvarNomes(item, index){
    listaDeNomes[item.nome] = item.urlFoto;
  }
  
  $("#busca ul").click(function(){
    console.log(this);
  })

  function irParaPagina(paginaSelecionada){
    
    var pagAtual = paginaSelecionada;
    var primeiroItemPagAtual = (pagAtual - 1) * itensPorPagina;
    var itensPagAtual = listaDeDeputados.slice(primeiroItemPagAtual, primeiroItemPagAtual+itensPorPagina);
    
    listarDeputados(itensPagAtual);

    $("#paginacao li").removeClass('active');
    $(`#${paginaSelecionada}`).addClass('active');

  }

  function listarDeputados(lista){

    $("#resultados").html('');

    lista.forEach(function (item) {

      var idDept = item.id;
      var nmDept = item.nome;
      var partido = item.siglaPartido;
      var uf = item.siglaUf;
      var uriPartido = item.uriPartido;
      var idpartido = uriPartido.replace(URL_BASE + "partidos/", '')

      var cardDept = `
      <div class="col s12 m3" id="id${idDept}" align="center" style="border: #ffffff solid; border-radius: 8px;border-style: inset;">
            <div class="row">
                <h5 class="p-title" style="text-align: center;">${nmDept}</h5>
                <img class="col s12 m6 responsive-img" src="${URL_FOTO+idDept}.jpg" alt="${nmDept}">
                <p class="p-title">Estado:</p>
                <p style="font-size: 18px;">${uf} </p>
                <p class="p-title">Partido:</p>
                <p><a href="javascript:showPartido('${idpartido}')">${partido} [+]</a></p>
            </div>
      </div>`;

      $("#resultados").append(cardDept);

    } );
  };

  function showPartido(ref){
    
        varWindow = window.open (
        'popup.html' + '?reference=' + ref,
        'pagina',
        "width=760, height=500, top=100, left=110, scrollbars=yes" );

        recuperaPartido(ref);
    }

    function recuperaPartido(ref) {

        var xhr = new XMLHttpRequest();
        
        xhr.open('GET' , `${URL_BASE}"/partidos/"${ref}` , true);

        xhr.onload = function(){
            if(this.status == 200){

                var resultData = JSON.parse(this.responseText);

                var output = `
                <p>${resultData.dados.totalMembros}</p>
                <p>${resultData.dados.uriMembros}</p>
                `;

                document.getElementById('#partidos').innerHTML = output;

            }
        }
       
    }
