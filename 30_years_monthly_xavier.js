// =============================================================================
// EXTRAÇÃO DE DADOS CLIMÁTICOS MENSAIS POR MICROBACIA – BR-DWGD (Xavier Collection)
// =============================================================================
// Autor:       Guilherme Tavares da Silva (TAVARES, G.)
// Instituição: IPEF – Instituto de Pesquisas e Estudos Florestais
// Programa:    PROMAB/LHF – USP ESALQ
// Ano:         2026
// -----------------------------------------------------------------------------
// Descrição:
//   Script desenvolvido no Google Earth Engine para extração de precipitação
//   acumulada (mm), temperatura média (°C) e evapotranspiração potencial – ETP
//   (mm) a partir da coleção BR-DWGD, em escala mensal, para microbacias
//   hidrográficas monitoradas no âmbito do programa PROMAB/LHF.
// -----------------------------------------------------------------------------
// Contato: Guilherme.tavares-silva@unesp.br
// =============================================================================

// 1. CONFIGURAÇÃO
var microbacias = area;
var ano_inicio = 1994;
var ano_fim = 2023;

// 2. FUNÇÃO DE ESCALONAMENTO
var aplicarEscala = function(img) {
  var pr   = img.select('pr').multiply(0.00686666).add(225.0);
  var tmax = img.select('Tmax').multiply(0.00106815).add(15.0);
  var tmin = img.select('Tmin').multiply(0.00106815).add(15.0);
  var temp = tmax.add(tmin).divide(2);
  var etp  = img.select('ET').multiply(0.0511811);

  return ee.Image([
    pr.rename('precip_mm'),
    temp.rename('temp_c'),
    etp.rename('etp_mm')
  ]).copyProperties(img, ['system:time_start']);
};

// 3. COLEÇÃO FILTRADA PARA O INTERVALO
var col = ee.ImageCollection('projects/ee-alexandrexavier/assets/BR-DWGD')
    .filterDate(ano_inicio + '-01-01', ano_fim + '-12-31')
    .filterBounds(microbacias)
    .map(aplicarEscala);

// 4. AGREGAÇÃO MENSAL POR ANO
var anos = ee.List.sequence(ano_inicio, ano_fim);
var meses = ee.List.sequence(1, 12);

var resultados = ee.FeatureCollection(
  anos.map(function(ano) {
    ano = ee.Number(ano);
    
    var colAno = col.filter(ee.Filter.calendarRange(ano, ano, 'year'));

    return ee.FeatureCollection(
      meses.map(function(mes) {
        mes = ee.Number(mes);
        
        var colMes = colAno.filter(ee.Filter.calendarRange(mes, mes, 'month'));

        var imagem = colMes.select(['precip_mm', 'etp_mm']).sum()
                           .addBands(colMes.select('temp_c').mean());

        var extracao = imagem.reduceRegions({
          collection: microbacias,
          reducer: ee.Reducer.mean(),
          scale: 5000,
          tileScale: 4
        });

        return extracao.map(function(f) {
          var precip = ee.Number(f.get('precip_mm')).round();
          var temp   = ee.Number(f.get('temp_c')).multiply(100).round().divide(100);
          var etp    = ee.Number(f.get('etp_mm')).round();

          return ee.Feature(null, {
            'id':        f.get('Id'),
            'ano':       ano,
            'mes':       mes,
            'precip_mm': precip,
            'temp_c':    temp,
            'etp_mm':    etp
          });
        });
      })
    ).flatten();
  })
).flatten();

// 5. EXPORTAÇÃO
Export.table.toDrive({
  collection: resultados,
  description: 'Dados_Mensais_Long_' + ano_inicio + '_' + ano_fim,
  folder: 'GEE_Exports',
  fileFormat: 'CSV',
  selectors: ['id', 'ano', 'mes', 'precip_mm', 'temp_c', 'etp_mm']
});

print('Tentando exportar 30 anos..');
