# movieOn
This code is a project for subject Web Systems (MATC82) in Federal University of Bahia. Follow description in Portuguese.

## **Descrição geral**

Quer assistir um filme, mas não sabe qual? As vezes, o que basta é uma simples sugestão!

O trabalho consiste no desenvolvimento de um site de sugestão de filmes para usuários. Basicamente o usuário deve fornecer pequenas informações sobre os filmes desejados e o site deve retornar uma sugestão de filme com um certo grau de aleatoriedade, mas sem fugir do requisito do usuário.

## **Requisitos básicos**

O site **deve ser** desenvolvido utilizando elementos de HTML 4 e 5, CSS e Javascript (podendo utilizar a biblioteca jQuery).

Você deve implementar uma página HTML que inicialmente possui um formulário simples com o inputs para informar categoria,  no, lista de atores, outras informações e um botão de submissão. **O usuário não obrigatoriamente terá que preencher todos os campos**.

Ao submeter esse formulário deve-se executar uma requisição Ajax a qual irá retorna uma sugestão de filme **aleatória dentro dos requisitos informados** no formulário. A submissão do formulário não deve recarregar a página.

Assim a partir das informações passadas você deve apresentar um filme contendo título, sinopse, ano, lista de atores e uma imagem do encarte do filme (caso exista).

Além disso você deve buscar algum trailer do filme através de uma consulta a API do Youtube. Caso retorne algo você deve exibir esse vídeo usando HTML 5.

Você pode encontrar informações de como fazer isso em: https://www.youtube.com/yt/dev/pt-BR/api-resources.html

Por fim o site deve exibir uma opção de usuário receber outra indicação de filme com os mesmos requisitos, ou de iniciar uma nova busca (a qual retornará para página inicial).

Para realizar esse projeto será disponibilizado para vocês um arquivo HTML, que irá conter toda base de filmes com os dados estruturados. Como vocês podem ver no trecho abaixo:
```
<div id=”112” class="movie">
	<img src=”movies_images/OvESxOZWqZUU.jpg”>
	<h2>A Arma Proibida<h2>
	<p><span>Ano: <span>1989</p>
	<p>Categorias:</p>
	<ul class="categories">
		<li>Ação</li>
		<li>Suspense</li>
	</ul>
	<p class="sinopsis">Uma arma experimental alimentada por um mini-reator nuclear cai do caminhão em um rio durante o transporte. O adolescente Zeke (Rodney Eastman) acaba encontrando a arma e a usa contra todos que constantemente o perseguem.</p>
	<ul class="actors">
		<li>Francisco</li>
		<li>João</li>
		<li>Maria</li>
	</ul>
</div>
```


## **Observações:**

* Realizar todas as funcionalidades sem recarregar a página totalmente
* Usar aleatoriedade (dentro dos requisitos passados pelo usuário) para exibir o filme
* Vocês terão liberdade para fazer a folha de estilo e efeitos da página.
* O sistema deve rodar corretamente nos navegadores Chrome e Firefox.
* Não é permitido o uso de outras bibliotecas, ou tecnologias sem autorização prévia do professor.
* Alguns filmes não possuem imagem

## Documentação
No "index.js", na função "searchVideo" é utlizado o protocolo CORS para obter o ID do video no youtube, fazendo uma requisição AJAX inserindo na url o API Key e, como entrada, o nome do filme; a saída pe um JSON com 5 resultados de videos relacionados com a busca.

Para extrair as informações do database, novamente faz uma requisição AJAX para abrir o arquivo. Depois de aberto, salva todas as div com as informações de cada filme e vasculha nas informações em busca dos filmes de acordo com o que o usuário deseja. Na submissão dos dados, primeiro verifica-se se existe caracteres inválidos nos campos "Atores" e "Outras Informações" e depois chama a função "searchData()". Nela, realiza-se a requisição AJAX e obtém todas as informações contidas no HTML.

Depois disso, chama a função "extractInfo()": nela, de acordo com o(s) input(s) do usuário, procuramos os filmes que tem as informações do submit. A busca é baseada na seguinte regra:

* Em "Atores", é possível pesquisar pelo nome ou sobrenome do ator. Caso exista dois ou mais nomes, procura-se filmes que tenham esses atores no elenco. Por exemplo, se o usuário digitar "Ludacris, Paul Walker", exibirá filmes onde os dois façam parte do elenco. Essa regra também vale para "Outras Informações", mas nesse campo procura no título e/ou na sinopse do filme.
* Ano e categoria: busca-se filmes com o ano e/ou a categoria que o usuário deseja.
* Caso o usuário preencha dois ou mais campos, o sistema procura com aquelas informações que o usuário colocou. Exemplo: se o usuário gostaria de ver filmes com Ludacris e Paul Walker no elenco, do ano de 2008, na categoria "Ação" e como outras informações "velozes", só aparece no resultado filmes que atendam todos esses requisitos.

Caso o usuário não insira dados em nenhum dos campos, é feita uma busca ramdomica em todos os filmes contidos na database.
Lembrando que todos os resultados são randomicos.

Caso não encontre um filme de acordo com os requisitos do usuário, aparece uma página informando que não foi encontrado e o usuário pode pesquisar naquela página.

Como o random do Javascript não é 100% eficaz, talvez tenha resultados de filmes que não existam na database. Por isso, se acontecer isso, chama-se a função "prepare()" novamente, para verificar outro filme que atende os dados que o usuário inseriu.

Após ter obtido todos os dados do filme de acordo com o número do id randomizado, em "atualizaSection" é inserido todos os dados em uma variável, esta que será exibida no site. Caso o usuário deseja obter outro filme com as mesmas características, basta clicar no "Indicar outro filme"; caso contrário, é só clicar no botão "Iniciar nova busca" para voltar a página principal.

Foi utilizado setTimeout por dois motivos: (1) o resultado do Youtube demora de ser recebido, então não seria possível exibir os videos; (2) aliado a esse problema, surgiu a ideia de colocar uma imagem indicando o carregamento dos dados, para o usuário não achar que o programa/site travou.

Aplicou-se na exibição dos dados a função "Accordion", dando uma interação maior na interface.