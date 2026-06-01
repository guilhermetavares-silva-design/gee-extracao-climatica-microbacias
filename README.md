# gee-extracao-climatica-microbacias
Google Earth Engine code developed to extract thirty-year monthly climatological data for microbasin polygons.

# Extração de Dados Climáticos Mensais por Microbacia – BR-DWGD (Xavier Collection)

Script desenvolvido no **Google Earth Engine (GEE)** para extração automatizada de dados climáticos mensais a partir da coleção BR-DWGD para microbacias hidrográficas. Produzido no âmbito do programa **PROMAB/LHF – USP ESALQ / IPEF**.

---

## Descrição

O script itera sobre um intervalo de anos e meses definido pelo usuário, extraindo para cada microbacia os seguintes valores mensais:

- **Precipitação acumulada** (mm)
- **Temperatura média** (°C)
- **Evapotranspiração potencial – ETP** (mm)

O resultado é exportado para o Google Drive em formato **CSV no layout longo** (uma linha por microbacia por mês), facilitando análises posteriores em R, Python ou Excel.

---

## Fonte dos Dados

Os dados climáticos são provenientes da coleção **BR-DWGD (Xavier Collection)**, hospedada no GEE sob o asset:

```
projects/ee-alexandrexavier/assets/BR-DWGD
```

A Xavier Collection é um dos datasets de reanálise climática com melhor cobertura para o território brasileiro (~5 km de resolução espacial), integrando dados de estações meteorológicas do INMET e ANA com interpolação espacial. É amplamente utilizada em estudos hidrológicos no Brasil.

> Xavier, A.C., King, C.W., Scanlon, B.R. (2016). Daily gridded meteorological variables in Brazil (1980–2013). *International Journal of Climatology*, 36(6), 2644–2659. https://doi.org/10.1002/joc.4518

---

## Como Usar

### Pré-requisitos

- Conta ativa no [Google Earth Engine](https://code.earthengine.google.com)
- Um `FeatureCollection` de microbacias carregado no ambiente GEE, com campo identificador `Id`

### Passo a passo

1. No **GEE Code Editor**, carregue o script
2. Certifique-se de que a variável `area` aponta para o seu `FeatureCollection` de microbacias
3. Ajuste os parâmetros conforme necessário (ver seção abaixo)
4. Clique em **Run**
5. Na aba **Tasks**, confirme a tarefa de exportação
6. O arquivo CSV será salvo na pasta `GEE_Exports` do seu Google Drive

---

## Parâmetros Configuráveis

| Parâmetro | Valor padrão | Descrição |
|---|---|---|
| `microbacias` | `area` | FeatureCollection com as microbacias de interesse |
| `ano_inicio` | `1994` | Primeiro ano do período de análise |
| `ano_fim` | `2023` | Último ano do período de análise |

---

## Estrutura do Arquivo de Saída

O CSV exportado contém as seguintes colunas:

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | Texto/Número | Identificador da microbacia (campo `Id`) |
| `ano` | Inteiro | Ano de referência |
| `mes` | Inteiro | Mês de referência (1–12) |
| `precip_mm` | Inteiro | Precipitação acumulada mensal (mm) |
| `temp_c` | Decimal | Temperatura média mensal (°C) |
| `etp_mm` | Inteiro | Evapotranspiração potencial acumulada mensal (mm) |

---

## Contexto de Uso

Este script foi desenvolvido para subsidiar o cálculo do **Índice de Resiliência Hidrológica (IRH)**, especificamente o componente **ISN**, que utiliza a relação ETP/P e o coeficiente de variação da precipitação como indicadores de sensibilidade climática das microbacias monitoradas no PROMAB/LHF.

---

## Autor

**Guilherme Tavares da Silva**  
IPEF – Instituto de Pesquisas e Estudos Florestais  
Programa PROMAB/LHF – USP ESALQ  
2025

---

## Como Citar

```
TAVARES, G. Extração de dados climáticos mensais por microbacia via Google Earth Engine
(BR-DWGD / Xavier Collection). GitHub, 2025.
Disponível em: <https://github.com/guilhermetavares-silva-design/gee-extracao-climatica-microbacias>
```
