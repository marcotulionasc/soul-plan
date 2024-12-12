// Variáveis dos elementos do DOM
const generateSoulPlanButton = document.getElementById("generateSoulPlanButton");
const soulForm = document.getElementById("soulForm");

// Tabela de conversão
const letterValues = {
    A: 1, B: 2, C: 11, D: 4, E: 5, F: 17, G: 3, H: 5, I: 10, J: 10, K: 19, L: 12,
    M: 13, N: 14, O: 6, P: 17, Q: 19, R: 20, S: 15, T: 9, U: 6, V: 6, W: 6, X: 15, Y: 16, Z: 7,
    AH: 5, CH: 8, SH: 21, TA: 22, TH: 22, TZ: 18, WH: 16
};

// Valores especiais para letras finais
const finalLetterValues = {
    M: 12,
    P: 12
};

// Função auxiliar para redução numerológica
const reduceNumerology = (value) => {
    while (value > 22) {
        value = value.toString().split("").reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return value;
};

// Event Listener para o botão
generateSoulPlanButton.addEventListener("click", function () {
    let fullName = document.getElementById("fullName").value;

    // Validação da entrada do usuário
    if (fullName.trim() === "") {
        alert("Por favor, preencha o nome completo para gerar o plano de alma.");
        return;
    }

    // Removendo espaços e transformando o nome em maiúsculas
    fullName = fullName.replace(/\s+/g, "").toUpperCase();

    // Processando o nome para valores
    const nameArray = [];
    let i = 0;

    while (i < fullName.length) {
        // Verifica combinações especiais primeiro
        const pair = fullName.slice(i, i + 2);
        if (letterValues[pair]) {
            nameArray.push({ char: pair, value: letterValues[pair] });
            i += 2; // Pula o próximo caractere, pois faz parte do par
        } else {
            const char = fullName[i];
            const isLastChar = i === fullName.length - 1;

            // Lida com letras finais com valores especiais
            if (isLastChar && finalLetterValues[char]) {
                nameArray.push({ char, value: finalLetterValues[char] });
            } else {
                nameArray.push({ char, value: letterValues[char] || 0 }); // Padrão 0 se não encontrado
            }

            i += 1;
        }
    }

    // Corrigindo valores das letras finais na exibição
    const lastChar = nameArray[nameArray.length - 1];
    if (finalLetterValues[lastChar.char]) {
        nameArray[nameArray.length - 1] = { char: lastChar.char, value: finalLetterValues[lastChar.char] };
    }

    // Distribuindo em grupos
    const groups = [
        { name: "Desafios Mundanos", letters: [], total: 0 },
        { name: "Desafios Espirituais", letters: [], total: 0 },
        { name: "Talentos Mundanos", letters: [], total: 0 },
        { name: "Talentos Espirituais", letters: [], total: 0 },
        { name: "Objetivos Mundanos", letters: [], total: 0 },
        { name: "Objetivos Espirituais", letters: [], total: 0 }
    ];

    nameArray.forEach((item, index) => {
        const groupIndex = index % 6;
        groups[groupIndex].letters.push(item);
        groups[groupIndex].total += item.value;
    });

    // Reduzindo totais numerologicamente
    groups.forEach(group => {
        group.total = reduceNumerology(group.total);
    });

    // Criando o contêiner de resultados
    const resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML = ""; // Limpa os resultados anteriores

    /*** Tabela de Letras e Valores ***/
    const letterTableContainer = document.createElement("div");
    letterTableContainer.className = "overflow-hidden rounded-lg shadow-md bg-gray-800 mb-6";

    const letterTable = document.createElement("table");
    letterTable.className = "w-full text-sm text-left text-gray-300";

    // Cabeçalho da tabela
    letterTable.innerHTML = `
        <thead class="text-xs uppercase bg-gray-700 text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">Posição</th>
                ${nameArray.map((item, index) => `<th scope="col" class="px-6 py-3">${index + 1}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
            <tr class="bg-gray-800 border-b border-gray-700">
                <td class="px-6 py-4 font-semibold">Letra</td>
                ${nameArray.map(item => `<td class="px-6 py-4">${item.char}</td>`).join('')}
            </tr>
            <tr class="bg-gray-800 border-b border-gray-700">
                <td class="px-6 py-4 font-semibold">Valor</td>
                ${nameArray.map(item => `<td class="px-6 py-4">${item.value}</td>`).join('')}
            </tr>
        </tbody>
    `;

    letterTableContainer.appendChild(letterTable);
    resultContainer.appendChild(letterTableContainer);

    /*** Tabelas para Cada Grupo ***/
    // Criar um contêiner de grid responsivo para as tabelas dos grupos
    const groupsGridContainer = document.createElement("div");
    groupsGridContainer.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4";

    groups.forEach(group => {
        const groupTableContainer = document.createElement("div");
        groupTableContainer.className = "overflow-hidden rounded-lg shadow-md bg-gray-800";

        const groupTable = document.createElement("table");
        groupTable.className = "w-full text-sm text-left text-gray-300";
        groupTable.innerHTML = `
            <thead class="text-xs uppercase bg-gray-700 text-gray-400">
                <tr>
                    <th scope="col" colspan="2" class="px-6 py-3 text-center">${group.name}</th>
                </tr>
            </thead>
            <tbody>
        `;

        group.letters.forEach(item => {
            groupTable.innerHTML += `
                <tr class="bg-gray-800 border-b border-gray-700">
                    <td class="px-6 py-4">${item.char}</td>
                    <td class="px-6 py-4">${item.value}</td>
                </tr>
            `;
        });

        groupTable.innerHTML += `
            <tr class="bg-gray-700">
                <td class="px-6 py-4 font-semibold">Total</td>
                <td class="px-6 py-4 font-semibold">${group.total}</td>
            </tr>
            </tbody>
        `;

        groupTableContainer.appendChild(groupTable);
        groupsGridContainer.appendChild(groupTableContainer);
    });

    resultContainer.appendChild(groupsGridContainer);
});
