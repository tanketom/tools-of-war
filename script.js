const parts = [
    { type: 'handle', color: 'yellow', stats: { Ergonomics: 50, TriggerFeel: 60, Security: 70 }, description: 'Comfortable handle' },
    { type: 'motor', color: 'blue', stats: { Stability: 80 }, description: 'Powerful motor' },
    { type: 'workEnd', color: 'red', stats: { Efficiency: 90 }, description: 'Sharp work end' }
];

let conveyorBelt = document.getElementById('conveyor-belt');
let workStation = [null, null, null];
let paused = false;

function generatePart() {
    if (paused) return;
    let part = parts[Math.floor(Math.random() * parts.length)];
    let partElement = document.createElement('div');
    partElement.style.backgroundColor = part.color;
    partElement.className = 'part';
    partElement.onclick = () => addToWorkStation(part);
    conveyorBelt.appendChild(partElement);
}

function addToWorkStation(part) {
    for (let i = 0; i < workStation.length; i++) {
        if (!workStation[i]) {
            workStation[i] = part;
            document.getElementById(`slot${i + 1}`).style.backgroundColor = part.color;
            break;
        }
    }
}

document.getElementById('deploy').onclick = () => {
    if (workStation.every(slot => slot)) {
        let toolName = generateToolName(workStation);
        let toolStats = calculateToolStats(workStation);
        let toolList = document.getElementById('tool-list');
        let toolElement = document.createElement('div');
        toolElement.innerText = `${toolName}: ${JSON.stringify(toolStats)}`;
        toolList.appendChild(toolElement);
        workStation = [null, null, null];
        document.querySelectorAll('.slot').forEach(slot => slot.style.backgroundColor = 'white');
    }
};

document.getElementById('pause').onclick = () => {
    paused = !paused;
};

function generateToolName(parts) {
    return `Tool-${Math.floor(Math.random() * 1000)}`;
}

function calculateToolStats(parts) {
    let stats = {};
    parts.forEach(part => {
        for (let stat in part.stats) {
            stats[stat] = (stats[stat] || 0) + part.stats[stat];
        }
    });
    return stats;
}

setInterval(generatePart, 1000);
