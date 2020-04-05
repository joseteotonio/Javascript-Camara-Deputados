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
        "width=760, height=600, top=100, left=110, scrollbars=yes" );

        recuperaPartido(ref);
    }

    function recuperaPartido(partidoId){

        let urlpartido = `${URL_BASE}partidos/${partidoId}`;
        $("#gridpartido").html('');
    
        fetch(urlpartido).then(function(retPartido) {
            retPartido.json().then(function(retData) {
                
                let sigla = retData.dados.sigla;
                let nome = retData.dados.nome;
                let logo = retData.dados.urlLogo;
                let status = retData.dados.status.situacao;
                let membros = retData.dados.status.totalMembros;

                let lider = retData.dados.status.lider.nome;
                let estado = retData.dados.status.lider.uf;
                let foto = retData.dados.status.lider.urlFoto;

                let geraOutput = `
                <div class="container" style="margin-top: 110px;">
                    <table>
                        <tr>
                            <td rowspan="2" style="width: 20%;">
                                <img class="col s12 m3 responsive-img" src="${logo}" alt="${nome}">
                            </td>
                            <td colspan = "2" style="font-weight: bolder;font-size: 18px;text-align: center; background-color: #333; color: #ffffff;">
                            ${sigla} - ${nome}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bolder;font-size: 18px;text-align: center;">
                            Status: ${status}</td>
                            <td style="font-weight: bolder;font-size: 18px;text-align: center;">
                            Total de Mebros : ${membros}</td>
                        </tr>
                        <tr</tr>
                    </table>
                </div>
                <div class="container">
                    <table>
                        <tr>
                            <td rowspan="2" style="width: 20%;">
                                <img class="responsive-img" src="${foto}" alt="${lider}">
                            </td>
                            <td style="font-weight: bolder;font-size: 18px;text-align: center; background-color: #333; color: #ffffff;">
                                Lider do Partido</td>
                            <td style="font-weight: bolder;font-size: 18px;text-align: center; background-color: #333; color: #ffffff;">
                                Estado</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bolder;font-size: 18px;text-align: center;">
                            ${lider}
                            </td>
                            <td style="font-weight: bolder;font-size: 18px;text-align: center;">
                            ${estado}</td>
                        </tr>
                        <tr</tr>
                    </table>
                </div>

                `;
            
                $("#gridpartido").append(geraOutput);

            });
        });

    }

