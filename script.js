class ToolPart {
    constructor(type, color, stats, description) {
        this.type = type;
        this.color = color;
        this.stats = stats;
        this.description = description;
    }
}

class Handle extends ToolPart {
    constructor(stats, description) {
        super('handle', 'yellow', stats, description);
    }
}

class Motor extends ToolPart {
    constructor(stats, description) {
        super('motor', 'blue', stats, description);
    }
}

class WorkEnd extends ToolPart {
    constructor(stats, description) {
        super('workEnd', 'red', stats, description);
    }
}

let conveyorBelt = document.getElementById('conveyor-belt');
let workStation = [null, null, null];
let paused = false;
let parts = [];

fetch('tools.json')
    .then(response => response.json())
    .then(data => {
        parts = data;
        setInterval(generatePart, 1000);
    });

function generateRandomStats(type) {
    let stats = {};
    if (type === 'handle') {
        stats.Ergonomics = Math.floor(Math.random() * 100) + 1;
        stats.TriggerFeel = Math.floor(Math.random() * 100) + 1;
    } else if (type === 'motor') {
        stats.Stability = Math.floor(Math.random() * 100) + 1;
        stats.Loyalty = Math.floor(Math.random() * 100) + 1;
    } else if (type === 'workEnd') {
        stats.Efficiency = Math.floor(Math.random() * 100) + 1;
        stats.Recoil = Math.floor(Math.random() * 100) + 1;
    }
    return stats;
}

function getDescription(type, stats) {
    let descriptions = parts[type + 's'];
    for (let desc of descriptions) {
        let match = true;
        for (let stat in desc) {
            if (stat !== 'description' && (stats[stat] < desc[stat][0] || stats[stat] > desc[stat][1])) {
                match = false;
                break;
            }
        }
        if (match) return desc.description;
    }
    return 'Unknown';
}

function generatePart() {
    if (paused) return;
    let partType = ['handle', 'motor', 'workEnd'][Math.floor(Math.random() * 3)];
    let stats = generateRandomStats(partType);
    let description = getDescription(partType, stats);
    let part;
    if (partType === 'handle') {
        part = new Handle(stats, description);
    } else if (partType === 'motor') {
        part = new Motor(stats, description);
    } else if (partType === 'workEnd') {
        part = new WorkEnd(stats, description);
    }
    let partElement = document.createElement('div');
    partElement.style.backgroundColor = part.color;
    partElement.className = 'part';
    partElement.innerHTML = `<div class="description">${description}</div>`;
    partElement.onclick = () => addToWorkStation(part);
    conveyorBelt.appendChild(partElement);
    animatePart(partElement);
}

function animatePart(partElement) {
    let position = 500;
    partElement.style.position = 'absolute';
    partElement.style.right = '0px';
    let interval = setInterval(() => {
        if (paused) return;
        position -= 2;
        partElement.style.right = position + 'px';
        if (position <= 0) {
            clearInterval(interval);
            partElement.style.transform = 'scale(0.1)';
            setTimeout(() => partElement.remove(), 500);
        }
    }, 20);
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
    document.getElementById('pause').innerText = paused ? 'START' : 'PAUSE';
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