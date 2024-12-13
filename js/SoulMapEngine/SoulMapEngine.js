const generateSoulPlanButton = document.getElementById("generateSoulPlanButton");
const soulForm = document.getElementById("soulForm");

const letterValues = {
    A: 1, B: 2, C: 11, Ç: 11, D: 4, E: 5, F: 17, G: 3, H: 5, I: 10, J: 10, K: 19, L: 12,
    M: 13, N: 14, O: 6, P: 17, Q: 19, R: 20, S: 15, T: 9, U: 6, V: 6, W: 6, X: 15, Y: 16, Z: 7,
    AH: 5, CH: 8, SH: 21, TA: 22, TH: 22, TZ: 18, WH: 16
};

const finalLetterValues = {
    M: 12,
    P: 12
};

const sumDigits = (value) => {
    return value.toString().split("").reduce((sum, digit) => sum + parseInt(digit), 0);
};

const reduceToSingleDigit = (value) => {
    while (value > 9) {
        value = sumDigits(value);
    }
    return value;
};

const reduceNumerology = (value) => {
    while (value > 22) {
        value = sumDigits(value);
    }
    return value;
};

generateSoulPlanButton.addEventListener("click", function () {
    let fullName = document.getElementById("fullName").value;

    if (fullName.trim() === "") {
        alert("Por favor, preencha o nome completo para gerar o plano de alma.");
        return;
    }

    fullName = fullName.replace(/\s+/g, "").toUpperCase();

    const nameArray = [];
    let i = 0;

    while (i < fullName.length) {

        const pair = fullName.slice(i, i + 2);
        if (letterValues[pair]) {
            nameArray.push({ char: pair, value: letterValues[pair] });
            i += 2;
        } else {
            const char = fullName[i];
            const isLastChar = i === fullName.length - 1;

            if (isLastChar && finalLetterValues[char]) {
                nameArray.push({ char, value: finalLetterValues[char] });
            } else {
                nameArray.push({ char, value: letterValues[char] || 0 }); // Padrão 0 se não encontrado
            }

            i += 1;
        }
    }

    const lastChar = nameArray[nameArray.length - 1];
    if (finalLetterValues[lastChar.char]) {
        nameArray[nameArray.length - 1] = { char: lastChar.char, value: finalLetterValues[lastChar.char] };
    }

    const totalLetters = nameArray.length;
    const useSixGroups = totalLetters > 9;

    let groups = [];
    if (useSixGroups) {
        groups = [
            { name: "Desafios Mundanos", letters: [], originalTotal: 0, reducedTotal: 0 },
            { name: "Desafios Espirituais", letters: [], originalTotal: 0, reducedTotal: 0 },
            { name: "Talentos Mundanos", letters: [], originalTotal: 0, reducedTotal: 0 },
            { name: "Talentos Espirituais", letters: [], originalTotal: 0, reducedTotal: 0 },
            { name: "Objetivos Mundanos", letters: [], originalTotal: 0, reducedTotal: 0 },
            { name: "Objetivos Espirituais", letters: [], originalTotal: 0, reducedTotal: 0 }
        ];
    } else {
        groups = [
            { name: "Desafios", letters: [], originalTotal: 0, reducedTotal: 0 },
            { name: "Talentos", letters: [], originalTotal: 0, reducedTotal: 0 },
            { name: "Objetivos", letters: [], originalTotal: 0, reducedTotal: 0 },
        ];
    }


    nameArray.forEach((item, index) => {
        const groupIndex = index % groups.length;
        groups[groupIndex].letters.push(item);
        groups[groupIndex].originalTotal += item.value;
    });

    groups.forEach(group => {
        group.reducedTotal = reduceNumerology(group.originalTotal);
    });

    let totalFirstParts = 0;
    let totalSecondParts = 0;

    groups.forEach(group => {
        totalFirstParts += group.reducedTotal;
        if (group.reducedTotal <= 9) {
            totalSecondParts += group.reducedTotal;
        } else {
            let summed = sumDigits(group.reducedTotal);
            summed = reduceToSingleDigit(summed);
            totalSecondParts += summed;
        }
    });

    if (totalFirstParts > 22) {
        totalFirstParts = reduceNumerology(totalFirstParts);
    }

    let destinoSecondPart = 0;
    if (totalFirstParts <= 9) {
        destinoSecondPart = totalFirstParts;
    } else {
        destinoSecondPart = sumDigits(totalFirstParts);
        destinoSecondPart = reduceToSingleDigit(destinoSecondPart);
    }

    const destinoDaAlma = `${totalFirstParts}-${destinoSecondPart}`;

    const frequencyMap = {};

    groups.forEach(group => {

        if (frequencyMap[group.reducedTotal]) {
            frequencyMap[group.reducedTotal]++;
        } else {
            frequencyMap[group.reducedTotal] = 1;
        }

        let secondPart = 0;
        if (group.reducedTotal <= 9) {
            secondPart = group.reducedTotal;
        } else {
            secondPart = sumDigits(group.reducedTotal);
            secondPart = reduceToSingleDigit(secondPart);
        }

        if (frequencyMap[secondPart]) {
            frequencyMap[secondPart]++;
        } else {
            frequencyMap[secondPart] = 1;
        }
    });

    const [destinoFirst, destinoSecond] = destinoDaAlma.split('-').map(Number);
    if (frequencyMap[destinoFirst]) {
        frequencyMap[destinoFirst]++;
    } else {
        frequencyMap[destinoFirst] = 1;
    }

    if (frequencyMap[destinoSecond]) {
        frequencyMap[destinoSecond]++;
    } else {
        frequencyMap[destinoSecond] = 1;
    }

    let vibDominante = [];

    for (const [number, freq] of Object.entries(frequencyMap)) {
        if (freq >= 4) {
            vibDominante.push(number);
        }
    }

    if (vibDominante.length === 0) {
        let maxFrequency = 0;
        for (const freq of Object.values(frequencyMap)) {
            if (freq > maxFrequency) {
                maxFrequency = freq;
            }
        }
        for (const [number, freq] of Object.entries(frequencyMap)) {
            if (freq === maxFrequency) {
                vibDominante.push(number);
            }
        }
    }

    vibDominante = [...new Set(vibDominante)].sort((a, b) => a - b);

    const vibracaoDominante = vibDominante.join(', ');

    const resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML = "";

    const letterTableContainer = document.createElement("div");
    letterTableContainer.className = "overflow-y-auto rounded-lg shadow-md bg-gray-800 mb-6";

    const letterTable = document.createElement("table");
    letterTable.className = "w-full text-sm text-left text-gray-300";

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

        let displayTotal = '';
        if (group.reducedTotal <= 9) {
            displayTotal = `${group.reducedTotal}-${group.reducedTotal}`;
        } else {
            let secondPart = sumDigits(group.reducedTotal);

            secondPart = reduceToSingleDigit(secondPart);
            displayTotal = `${group.reducedTotal}-${secondPart}`;
        }

        groupTable.innerHTML += `
            <tr class="bg-gray-700">
                <td class="px-6 py-4 font-semibold">Total</td>
                <td class="px-6 py-4 font-semibold">${displayTotal}</td>
            </tr>
            </tbody>
        `;

        groupTableContainer.appendChild(groupTable);
        groupsGridContainer.appendChild(groupTableContainer);
    });

    resultContainer.appendChild(groupsGridContainer);

    const summaryContainer = document.createElement("div");
    summaryContainer.className = "mt-6 p-4 bg-gray-800 rounded-lg shadow-md";

    const destinoDaAlmaElement = document.createElement("div");
    destinoDaAlmaElement.className = "mb-4 text-center";
    destinoDaAlmaElement.innerHTML = `
        <h3 class="text-xl font-semibold text-indigo-200">Destino da Alma</h3>
        <p class="text-lg">${destinoDaAlma}</p>
    `;

    const vibracaoDominanteElement = document.createElement("div");
    vibracaoDominanteElement.className = "text-center";
    vibracaoDominanteElement.innerHTML = `
        <h3 class="text-xl font-semibold text-indigo-200">Vibração Dominante</h3>
        <p class="text-lg">${vibracaoDominante || 'Nenhuma vibração dominante identificada'}</p>
    `;

    summaryContainer.appendChild(destinoDaAlmaElement);
    summaryContainer.appendChild(vibracaoDominanteElement);

    resultContainer.appendChild(summaryContainer);
});