document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initAllocSimulator();
    initBuddySimulator();
    initPagingSimulator();
    initSegmentationSimulator();
    renderExercises();
    loadProgress();
    setupListeners();
});

// --- ESTADO GLOBAL ---
const state = {
    answers: {},
    studentInfo: {
        name: '',
        lu: ''
    }
};

// --- BANCO DE EJERCICIOS EVALUATIVOS (12 EJERCICIOS) ---
const exercisesData = [
    {
        id: 'ej1_primer_ajuste',
        type: 'radio',
        title: 'Ejercicio 1: Particiones Variables con Primer Ajuste (First-Fit)',
        question: 'Un sistema con particiones variables tiene en memoria 8 huecos libres ordenados por dirección física: [20 KB, 7 KB, 10 KB, 12 KB, 5 KB, 9 KB, 15 KB, 18 KB]. Se reciben en orden sucesivo las solicitudes a) 12 KB, b) 9 KB y c) 10 KB. Si se aplica Primer Ajuste, ¿de qué huecos originales se realizará cada asignación, considerando que el espacio remanente de un hueco continúa disponible?',
        biblio: 'Silberschatz Cap. 8.3 / Diapositivas U6 pág. 19',
        labRef: { id: 'alloc-simulator', name: 'Laboratorio 1: Asignación Continua', badge: '🧪 Lab 1: Particiones Variables' },
        labHint: 'En el Simulador 1, selecciona "Primer Ajuste (First-Fit)" con los 8 huecos iniciales y pulsa sucesivamente "Siguiente Solicitud" para observar qué hueco toma cada proceso (P1: 12 KB, P2: 9 KB, P3: 10 KB).',
        options: [
            { value: 'h12_h9_h10', label: 'a en hueco 12 KB, b en hueco 9 KB y c en hueco 10 KB' },
            { value: 'h20_h10_h12', label: 'a en hueco 20 KB, b en hueco 10 KB y c en hueco 12 KB' },
            { value: 'h20_h18_h15', label: 'a en hueco 20 KB, b en hueco 18 KB y c en hueco 15 KB' },
            { value: 'h12_h20_h18', label: 'a en hueco 12 KB, b en hueco 20 KB y c en hueco 18 KB' }
        ]
    },
    {
        id: 'ej2_mejor_ajuste',
        type: 'select',
        title: 'Ejercicio 2: Particiones Variables con Mejor Ajuste (Best-Fit)',
        question: 'Para el mismo estado con 8 huecos libres [20 KB, 7 KB, 10 KB, 12 KB, 5 KB, 9 KB, 15 KB, 18 KB] y la misma secuencia de solicitudes (a: 12 KB, b: 9 KB, c: 10 KB). Si se aplica Mejor Ajuste, ¿de qué huecos originales se realizará cada asignación, considerando que el espacio remanente de un hueco continúa disponible?',
        biblio: 'Silberschatz Cap. 8.3 / Diapositivas U6 pág. 19',
        labRef: { id: 'alloc-simulator', name: 'Laboratorio 1: Asignación Continua', badge: '🧪 Lab 1: Particiones Variables' },
        labHint: 'En el Simulador 1, cambia la estrategia a "Mejor Ajuste (Best-Fit)" y reinicia la simulación para comprobar qué huecos mínimos albergan exactamente a cada solicitud.',
        options: [
            { value: 'h20_h10_h12', label: 'a en hueco 20 KB, b en hueco 10 KB y c en hueco 12 KB' },
            { value: 'h20_h18_h15', label: 'a en hueco 20 KB, b en hueco 18 KB y c en hueco 15 KB' },
            { value: 'h12_h9_h10', label: 'a en hueco 12 KB, b en hueco 9 KB y c en hueco 10 KB' },
            { value: 'h7_h5_h9', label: 'a en hueco 7 KB, b en hueco 5 KB y c en hueco 9 KB' }
        ]
    },
    {
        id: 'ej3_peor_ajuste',
        type: 'radio',
        title: 'Ejercicio 3: Particiones Variables con Peor Ajuste (Worst-Fit)',
        question: 'Para la misma secuencia de huecos [20 KB, 7 KB, 10 KB, 12 KB, 5 KB, 9 KB, 15 KB, 18 KB] y solicitudes sucesivas (a: 12 KB, b: 9 KB, c: 10 KB). Si se aplica Peor Ajuste, ¿de qué huecos originales se realizará cada asignación, considerando que el espacio remanente de un hueco continúa disponible?',
        biblio: 'Silberschatz Cap. 8.3 / Diapositivas U6 pág. 19',
        labRef: { id: 'alloc-simulator', name: 'Laboratorio 1: Asignación Continua', badge: '🧪 Lab 1: Particiones Variables' },
        labHint: 'En el Simulador 1, selecciona "Peor Ajuste (Worst-Fit)" para verificar cómo el algoritmo selecciona siempre el hueco más grande disponible en cada turno.',
        options: [
            { value: 'h20_h18_h15', label: 'a en hueco 20 KB, b en hueco 18 KB y c en hueco 15 KB' },
            { value: 'h12_h9_h10', label: 'a en hueco 12 KB, b en hueco 9 KB y c en hueco 10 KB' },
            { value: 'h20_h10_h12', label: 'a en hueco 20 KB, b en hueco 10 KB y c en hueco 12 KB' },
            { value: 'h18_h15_h20', label: 'a en hueco 18 KB, b en hueco 15 KB y c en hueco 20 KB' }
        ]
    },
    {
        id: 'ej4_buddy_system',
        type: 'select',
        title: 'Ejercicio 4: Particionamiento Dinámico con Sistema del Compañero (Buddy System)',
        question: 'En un sistema de compañeros (Buddy System) con un bloque inicial de memoria de 512 KB, se reciben solicitudes sucesivas de 12 KB, 9 KB y 10 KB. En este ejercicio se supone que el tamaño mínimo de bloque permitido por el sistema es de 16 KB. Dado que los bloques se particionan en potencias de 2 (2^k), ¿cuál es el tamaño mínimo de bloque asignado a cada solicitud?',
        biblio: 'Tanenbaum Cap. 3.2 / Stallings Cap. 7.2',
        labRef: { id: 'buddy-simulator', name: 'Laboratorio 2: Buddy System', badge: '🧪 Lab 2: Buddy System' },
        labHint: 'En el Simulador 2, observa las divisiones del bloque de 512 KB al asignar P1 (12 KB), P2 (9 KB) y P3 (10 KB). Comprueba que, bajo la cota mínima del sistema, todas reciben bloques de 16 KB.',
        options: [
            { value: '32kb', label: '32 KB para cada una de las solicitudes' },
            { value: '8kb', label: '8 KB para cada una de las solicitudes' },
            { value: '64kb', label: '64 KB para cada una de las solicitudes' },
            { value: '16kb', label: '16 KB para cada una de las solicitudes' }
        ]
    },
    {
        id: 'ej5_dir_logica_fisica_bits',
        type: 'select',
        title: 'Ejercicio 5: Estructura de Direcciones Lógicas y Físicas en Paginación',
        question: 'Considere un espacio de direcciones lógico de 16 páginas de 512 KB cada una, mapeado sobre una memoria física compuesta por 8 marcos. ¿Cuántos bits componen una dirección lógica y una física respectivamente?',
        biblio: 'Silberschatz Cap. 8.4 / Diapositivas U6 pág. 33',
        labRef: { id: 'paging-simulator', name: 'Laboratorio 3: Paginación Simple MMU', badge: '🧪 Lab 3: Paginación MMU' },
        labHint: 'Descompón cada dirección en número de página o marco y desplazamiento: 16 páginas requieren 4 bits, 8 marcos requieren 3 bits y una página de 512 KB requiere 19 bits de desplazamiento.',
        options: [
            { value: '24_20', label: '24 bits de dirección lógica y 20 bits de dirección física' },
            { value: '23_22', label: '23 bits de dirección lógica y 22 bits de dirección física' },
            { value: '20_19', label: '20 bits de dirección lógica y 19 bits de dirección física' },
            { value: '32_24', label: '32 bits de dirección lógica y 24 bits de dirección física' }
        ]
    },
    {
        id: 'ej6_paginacion_calculo_20000',
        type: 'select',
        title: 'Ejercicio 6: Desglose de Dirección Virtual en Página y Desplazamiento (DL = 20000)',
        question: 'Para un sistema con páginas de 4 KB (4096 bytes), calcule el número de página virtual y el desplazamiento correspondientes a la dirección decimal 20000 generada por el procesador:',
        biblio: 'Silberschatz Cap. 8.4 / Diapositivas U6 pág. 32-33',
        labRef: { id: 'paging-simulator', name: 'Laboratorio 3: Paginación Simple MMU', badge: '🧪 Lab 3: Paginación MMU' },
        labHint: 'Ingresa manualmente Dirección Lógica = 20000 con tamaño de página 4096 (4 KB) y pulsa el botón de traducción para ver el cálculo directo de p y d.',
        options: [
            { value: 'p4_d3616', label: 'Página virtual 4 y desplazamiento 3616' },
            { value: 'p5_d1024', label: 'Página virtual 5 y desplazamiento 1024' },
            { value: 'p4_d4000', label: 'Página virtual 4 y desplazamiento 4000' },
            { value: 'p3_d3616', label: 'Página virtual 3 y desplazamiento 3616' }
        ]
    },
    {
        id: 'ej7_paginacion_calculo_32768',
        type: 'select',
        title: 'Ejercicio 7: Desglose de Dirección Virtual en Página y Desplazamiento (DL = 32768)',
        question: 'Para un sistema con páginas de 4 KB (4096 bytes), calcule el número de página virtual y el desplazamiento correspondientes a la dirección decimal 32768:',
        biblio: 'Silberschatz Cap. 8.4 / Diapositivas U6 pág. 32-33',
        labRef: { id: 'paging-simulator', name: 'Laboratorio 3: Paginación Simple MMU', badge: '🧪 Lab 3: Paginación MMU' },
        labHint: 'Ingresa Dirección Lógica = 32768 para comprobar que se descompone en página 8 y desplazamiento 0. La página 8 no está incluida en el fragmento mostrado de la tabla, por lo que el laboratorio no permite verificar su marco físico.',
        options: [
            { value: 'p7_d4095', label: 'Página virtual 7 y desplazamiento 4095' },
            { value: 'p8_d1024', label: 'Página virtual 8 y desplazamiento 1024' },
            { value: 'p8_d0', label: 'Página virtual 8 y desplazamiento 0' },
            { value: 'p9_d0', label: 'Página virtual 9 y desplazamiento 0' }
        ]
    },
    {
        id: 'ej8_tabla_paginas_traduccion',
        type: 'radio',
        title: 'Ejercicio 8: Traducción con Tabla de Páginas y Detección de Fallo de Página',
        question: 'Un proceso de 56 KB con páginas de 4 KB tiene en su tabla: Pág. 0 en Marco 1, con presencia 1; Pág. 1 con presencia 0; Pág. 3 en Marco 3; Pág. 4 en Marco 2; y Pág. 6 en Marco 0. La página 1 no se encuentra actualmente en memoria principal. Al intentar traducir la dirección virtual decimal 4100 (Pág 1, Disp 4), ¿qué ocurre?',
        biblio: 'Silberschatz Cap. 8.4 / Diapositivas U6 pág. 35',
        labRef: { id: 'paging-simulator', name: 'Laboratorio 3: Paginación Simple MMU', badge: '🧪 Lab 3: Paginación MMU' },
        labHint: 'Ingresa manualmente Dirección Lógica = 4100 y pulsa el botón de traducción. Observa en la Tabla de Páginas que la Pág 1 tiene Bit de Presencia = 0 (no se encuentra en memoria principal) y la MMU reporta una Excepción por fallo de página.',
        options: [
            { value: 'direccion_fisica_directa', label: 'La MMU accede directamente al marco 1 sumando el desplazamiento 4' },
            { value: 'violacion_segmento', label: 'Se produce una trampa por violación de límite de segmento en el hardware' },
            { value: 'compactacion_automatica', label: 'El sistema operativo compacta la memoria física antes de traducir' },
            { value: 'fallo_pagina_no_cargada', label: 'Se produce una excepción por fallo de página porque la página 1 no está presente en memoria principal' }
        ]
    },
    {
        id: 'ej9_segmentacion_traduccion',
        type: 'select',
        title: 'Ejercicio 9: Traducción de Direcciones en Segmentación Pura (Segmento 2, Offset 10)',
        question: 'Dada la tabla de segmentos con valores expresados en unidades direccionables (bytes): Seg 0 (Base: 150, Límite: 250), Seg 1 (Base: 650, Límite: 180), Seg 2 (Base: 1024, Límite: 310), Seg 3 (Base: 410, Límite: 200), Seg 4 (Base: 850, Límite: 110). Calcule la dirección física equivalente a la dirección lógica dupla (2, 10), donde el desplazamiento también se expresa en bytes:',
        biblio: 'Silberschatz Cap. 8.6 / Diapositivas U6 pág. 38',
        labRef: { id: 'seg-simulator', name: 'Laboratorio 4: Segmentación MMU', badge: '🧪 Lab 4: Segmentación MMU' },
        labHint: 'Ingresa manualmente Segmento = 2, Desplazamiento = 10 y pulsa el botón de validación. La MMU comprueba 10 < 310 (válido) y calcula Dirección Física = Base(1024) + 10 = 1034 bytes.',
        options: [
            { value: '1334', label: 'Dirección física 1334 bytes' },
            { value: '1034', label: 'Dirección física 1034 bytes' },
            { value: '1014', label: 'Dirección física 1014 bytes' },
            { value: '320', label: 'Dirección física 320 bytes' }
        ]
    },
    {
        id: 'ej10_segmentacion_violacion',
        type: 'switch',
        title: 'Ejercicio 10: Validación de Límites y Excepción de Hardware en Segmentación',
        question: 'Dada la tabla de segmentos donde los valores se expresan en unidades direccionables (bytes) y el Segmento 1 tiene Base: 650 bytes y Límite: 180 bytes. ¿Qué acción emprende la MMU al solicitar la dirección lógica (1, 371), con desplazamiento de 371 bytes?',
        biblio: 'Silberschatz Cap. 8.6 / Diapositivas U6 pág. 38',
        labRef: { id: 'seg-simulator', name: 'Laboratorio 4: Segmentación MMU', badge: '🧪 Lab 4: Segmentación MMU' },
        labHint: 'Ingresa manualmente Segmento = 1, Desplazamiento = 371 y pulsa el botón de validación. Dado que el desplazamiento 371 supera el límite de 180 del Segmento 1, la MMU genera una excepción por violación de límite (trap).',
        options: [
            { value: 'violacion_limite_trap', label: 'La MMU genera una excepción por violación de límite (trap)' },
            { value: 'traduccion_correcta_1021', label: 'Se accede a la dirección física 1021 bytes sumando la base al desplazamiento' },
            { value: 'reasignacion_segmento', label: 'El proceso es reubicado dinámicamente al segmento de datos contiguo' },
            { value: 'paginacion_demanda', label: 'La CPU carga una nueva página desde el área de intercambio de swap' }
        ]
    },
    {
        id: 'ej11_regla_cincuenta',
        type: 'radio',
        title: 'Ejercicio 11: Análisis Estadístico de Fragmentación (Regla del 50%)',
        question: 'Según la regla del 50 % para particiones variables con Primer Ajuste, si existen N procesos cargados, ¿aproximadamente cuántos huecos libres se generan y qué proporción representan respecto del total de bloques, considerando procesos y huecos?',
        biblio: 'Silberschatz Cap. 8.3 / Diapositivas U6 pág. 25-26',
        labRef: { id: 'alloc-simulator', name: 'Laboratorio 1: Asignación Continua', badge: '🧪 Lab 1: Particiones Variables' },
        labHint: 'Revisa el Laboratorio 1 tras realizar múltiples asignaciones y liberaciones con Primer Ajuste: la fragmentación externa genera aproximadamente N/2 huecos para N procesos en memoria, representando cerca de un tercio del total de bloques.',
        options: [
            { value: 'la_mitad', label: 'Se generan aproximadamente N huecos, equivalentes a cerca de la mitad del total de bloques' },
            { value: 'una_cuarta_parte', label: 'Se generan aproximadamente N/4 huecos, equivalentes a cerca de una quinta parte del total de bloques' },
            { value: 'un_tercio', label: 'Se generan aproximadamente N/2 huecos, equivalentes a cerca de un tercio del total de bloques' },
            { value: 'el_diez_por_ciento', label: 'Se generan menos de N/10 huecos, equivalentes a menos de una décima parte del total de bloques' }
        ]
    },
    {
        id: 'ej12_segmentacion_paginada',
        type: 'switch',
        title: 'Ejercicio 12: Arquitectura de Segmentación Paginada',
        question: 'Una memoria virtual segmentada implementa 4 segmentos paginados. Cada segmento tiene un tamaño máximo de 8 KB y las páginas son de 1 KB. ¿Cuántas páginas tiene como máximo cada segmento?',
        biblio: 'Silberschatz Cap. 8.7 / Diapositivas U6 pág. 45-47',
        labRef: { id: 'seg-simulator', name: 'Laboratorio 4: Segmentación MMU', badge: '🧪 Lab 4: Segmentación MMU' },
        labHint: 'Observa la integración conceptual entre el Laboratorio 3 y 4: al paginar cada segmento, cada uno de ellos se divide en páginas de tamaño fijo (8 KB / 1 KB = 8 páginas por segmento).',
        options: [
            { value: '16_paginas', label: '16 páginas por cada segmento' },
            { value: '8_paginas', label: '8 páginas por cada segmento' },
            { value: '4_paginas', label: '4 páginas por cada segmento' },
            { value: '32_paginas', label: '32 páginas por cada segmento' }
        ]
    }
];

// --- 1. TEMA CLARO / OSCURO ---
function initTheme() {
    const savedTheme = localStorage.getItem('tso_theme_tp6') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        toggleBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('tso_theme_tp6', next);
            toggleBtn.textContent = next === 'dark' ? '☀️' : '🌙';
        });
    }
}

// --- 2. SIMULADOR 1: PARTICIONES VARIABLES ---
let allocMemory = [];
let allocRequests = [12, 9, 10];
let allocCurrentStep = 0;
let allocNextFitLastIdx = 0;
let currentAllocScene = 'btn-scene-tp';

function initAllocSimulator() {
    loadSceneTP();

    document.getElementById('btn-scene-tp').addEventListener('click', () => {
        currentAllocScene = 'btn-scene-tp';
        setActiveSceneBtn('btn-scene-tp');
        loadSceneTP();
    });
    document.getElementById('btn-scene-frag').addEventListener('click', () => {
        currentAllocScene = 'btn-scene-frag';
        setActiveSceneBtn('btn-scene-frag');
        loadSceneFrag();
    });
    document.getElementById('btn-scene-compact').addEventListener('click', () => {
        compactMemory();
        setActiveSceneBtn(currentAllocScene);
    });

    document.getElementById('select-alloc-algo').addEventListener('change', () => {
        resetAllocMemory();
    });

    document.getElementById('btn-alloc-step').addEventListener('click', () => {
        stepAlloc();
    });

    document.getElementById('btn-alloc-reset').addEventListener('click', () => {
        resetAllocMemory();
    });
}

function setActiveSceneBtn(id) {
    ['btn-scene-tp', 'btn-scene-frag'].forEach(btnId => {
        const el = document.getElementById(btnId);
        if (el) {
            el.className = (btnId === id) ? 'btn-primary text-xs active' : 'btn-secondary text-xs';
        }
    });
}

function enableAllocStepBtn() {
    const stepBtn = document.getElementById('btn-alloc-step');
    if (stepBtn) {
        stepBtn.disabled = false;
        stepBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

function loadSceneTP() {
    enableAllocStepBtn();
    // 8 huecos libres ordenados por dirección: 20KB, 7KB, 10KB, 12KB, 5KB, 9KB, 15KB, 18KB (Total = 96 KB)
    const rawSizes = [20, 7, 10, 12, 5, 9, 15, 18];
    allocMemory = rawSizes.map((tam, idx) => ({
        id: `H${idx + 1}`,
        tipo: 'H',
        tam: tam,
        originalTam: tam,
        isResidual: false,
        procId: null
    }));
    allocRequests = [12, 9, 10];
    allocCurrentStep = 0;
    allocNextFitLastIdx = 0;
    const stepEl = document.getElementById('alloc-step-num');
    if (stepEl) stepEl.textContent = `1/${allocRequests.length}`;
    renderMemoryBar();
    logAlloc("📋 Caso Base cargado: 8 huecos libres [20, 7, 10, 12, 5, 9, 15, 18 KB] (Total: 96 KB). Nota: Los huecos pertenecen a distintas zonas no contiguas de la memoria; los procesos ocupados que los separan se omiten en esta representación simplificada.");
    updateAllocBadges("Listo");
}

function loadSceneFrag() {
    enableAllocStepBtn();
    // Escenario de Fragmentación Externa: muchos huecos pequeños de 6KB, 8KB, 5KB
    allocMemory = [
        { id: 'P_A', tipo: 'P', tam: 30, originalTam: 30, procId: 'P_A', color: '#64748b' },
        { id: 'H1', tipo: 'H', tam: 8, originalTam: 8, isResidual: false, procId: null },
        { id: 'P_B', tipo: 'P', tam: 25, originalTam: 25, procId: 'P_B', color: '#64748b' },
        { id: 'H2', tipo: 'H', tam: 6, originalTam: 6, isResidual: false, procId: null },
        { id: 'P_C', tipo: 'P', tam: 20, originalTam: 20, procId: 'P_C', color: '#64748b' },
        { id: 'H3', tipo: 'H', tam: 7, originalTam: 7, isResidual: false, procId: null }
    ];
    allocRequests = [15]; // Proceso de 15 KB no cabe en ninguno aunque hay 8+6+7 = 21 KB libres!
    allocCurrentStep = 0;
    allocNextFitLastIdx = 0;
    const stepEl = document.getElementById('alloc-step-num');
    if (stepEl) stepEl.textContent = `1/${allocRequests.length}`;
    renderMemoryBar();
    logAlloc("💥 Escenario de Fragmentación Externa: Hay 21 KB libres en total, pero dispersos en huecos de 8KB, 6KB y 7KB. Llega solicitud P_Grande de 15 KB.");
    updateAllocBadges("Fragmentación Externa");
}

function compactMemory() {
    enableAllocStepBtn();
    const totalHueco = allocMemory.filter(b => b.tipo === 'H').reduce((acc, b) => acc + b.tam, 0);
    const procs = allocMemory.filter(b => b.tipo === 'P');
    allocMemory = [...procs];
    if (totalHueco > 0) {
        allocMemory.push({
            id: 'H_Compactado',
            tipo: 'H',
            tam: totalHueco,
            originalTam: totalHueco,
            isResidual: false,
            procId: null
        });
    }
    renderMemoryBar();
    logAlloc(`🗜️ Memoria Compactada: Todos los procesos reubicados contiguamente al inicio. Se consolidó un único hueco de ${totalHueco} KB al final.`);
    updateAllocBadges("Compactación Realizada");
}

function resetAllocMemory() {
    if (currentAllocScene === 'btn-scene-frag') {
        loadSceneFrag();
    } else {
        loadSceneTP();
    }
}

function stepAlloc() {
    if (allocCurrentStep >= allocRequests.length) {
        logAlloc("ℹ️ Todas las solicitudes de este escenario ya fueron procesadas. Pulsa 'Reiniciar'.");
        return;
    }

    const sol = allocRequests[allocCurrentStep];
    const procId = `P${allocCurrentStep + 1}`;
    const procName = `${procId} (${sol}KB)`;
    const algo = document.getElementById('select-alloc-algo').value;

    let targetIdx = -1;

    if (algo === 'first') {
        for (let i = 0; i < allocMemory.length; i++) {
            if (allocMemory[i].tipo === 'H' && allocMemory[i].tam >= sol) {
                targetIdx = i;
                break;
            }
        }
    } else if (algo === 'best') {
        let menorDesp = Infinity;
        for (let i = 0; i < allocMemory.length; i++) {
            if (allocMemory[i].tipo === 'H' && allocMemory[i].tam >= sol) {
                const desp = allocMemory[i].tam - sol;
                if (desp < menorDesp) {
                    menorDesp = desp;
                    targetIdx = i;
                }
            }
        }
    } else if (algo === 'worst') {
        let mayorTam = -1;
        for (let i = 0; i < allocMemory.length; i++) {
            if (allocMemory[i].tipo === 'H' && allocMemory[i].tam >= sol) {
                if (allocMemory[i].tam > mayorTam) {
                    mayorTam = allocMemory[i].tam;
                    targetIdx = i;
                }
            }
        }
    } else if (algo === 'next') {
        const n = allocMemory.length;
        for (let offset = 0; offset < n; offset++) {
            const idx = (allocNextFitLastIdx + offset) % n;
            if (allocMemory[idx].tipo === 'H' && allocMemory[idx].tam >= sol) {
                targetIdx = idx;
                break;
            }
        }
    }

    if (targetIdx !== -1) {
        const huecoElegido = allocMemory[targetIdx];
        const remanente = huecoElegido.tam - sol;
        const color = getProcColor(allocCurrentStep);

        logAlloc(`✅ [${algo.toUpperCase()}] ${procName} asignado al hueco ${huecoElegido.id} (${huecoElegido.tam} KB). Hueco residual libre: ${remanente} KB.`);

        const nuevoProc = {
            id: procId,
            tipo: 'P',
            tam: sol,
            procId: procId,
            color: color,
            allocatedHole: huecoElegido.id,
            originalHoleTam: huecoElegido.tam,
            residualTam: remanente,
            residualHoleId: remanente > 0 ? `${huecoElegido.id}'` : null
        };

        if (remanente === 0) {
            allocMemory[targetIdx] = nuevoProc;
            allocNextFitLastIdx = (targetIdx + 1) % allocMemory.length;
        } else {
            const nuevoHueco = {
                id: `${huecoElegido.id}'`,
                tipo: 'H',
                tam: remanente,
                originalTam: remanente,
                isResidual: true,
                fromProc: procId,
                procColor: color,
                originalHole: huecoElegido.id,
                originalHoleTam: huecoElegido.tam
            };
            allocMemory.splice(targetIdx, 1, nuevoProc, nuevoHueco);
            // La búsqueda posterior continúa desde la posición inmediatamente posterior a la asignación (el hueco residual generado)
            allocNextFitLastIdx = (targetIdx + 1) % allocMemory.length;
        }

        allocCurrentStep++;
    } else {
        logAlloc(`❌ Solicitud rechazada: ${procName} NO cabe en ningún hueco disponible. ¡Fragmentación externa!`);
        allocCurrentStep++;
        const stepBtn = document.getElementById('btn-alloc-step');
        if (stepBtn && allocCurrentStep >= allocRequests.length) {
            stepBtn.disabled = true;
            stepBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }

    const stepEl = document.getElementById('alloc-step-num');
    if (stepEl) {
        stepEl.textContent = `${Math.min(allocCurrentStep + 1, allocRequests.length)}/${allocRequests.length}`;
    }
    renderMemoryBar();
    updateAllocBadges(targetIdx !== -1 ? "Asignado" : "Rechazado");
}

function getProcColor(idx) {
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];
    return colors[idx % colors.length];
}

function renderMemoryBar() {
    const bar = document.getElementById('memory-map-bar');
    if (!bar) return;
    bar.innerHTML = '';

    const total = allocMemory.reduce((acc, b) => acc + b.tam, 0);
    const totalEl = document.getElementById('alloc-total-mem');
    if (totalEl) totalEl.textContent = `${total} KB`;

    allocMemory.forEach(block => {
        const div = document.createElement('div');
        const pct = (block.tam / total) * 100;
        div.style.width = `${pct}%`;

        if (block.tipo === 'P') {
            div.className = 'mem-block occupied';
            div.style.backgroundColor = block.color || '#3b82f6';
            div.setAttribute('data-proc', block.id);
            div.setAttribute('title', `Proceso ${block.id} (${block.tam} KB) asignado en hueco original ${block.allocatedHole || 'H'} (${block.originalHoleTam || block.tam} KB)`);
            div.innerHTML = `
                <span class="mem-block-name">${block.id}</span>
                <span class="mem-block-size">${block.tam} KB</span>
            `;
        } else if (block.isResidual) {
            div.className = 'mem-block hole residual';
            div.setAttribute('data-proc', block.fromProc);
            const procCol = block.procColor || '#3b82f6';
            div.style.background = `repeating-linear-gradient(45deg, ${procCol}1a, ${procCol}1a 8px, ${procCol}33 8px, ${procCol}33 16px)`;
            div.style.borderTop = `2px dashed ${procCol}`;
            div.style.borderBottom = `2px dashed ${procCol}`;
            div.style.borderRight = `2px dashed ${procCol}`;
            div.setAttribute('title', `Hueco Residual ${block.id} (${block.tam} KB): Hueco residual libre dejado por ${block.fromProc} al ocupar ${block.originalHole} (${block.originalHoleTam} KB).`);

            if (block.tam >= 5) {
                div.innerHTML = `
                    <span class="mem-block-name font-bold" style="color: ${procCol};">${block.id}</span>
                    <span class="residual-badge" style="background: ${procCol}30; color: ${procCol}; border: 1px solid ${procCol}70;">Residuo ${block.fromProc}</span>
                    <span class="mem-block-size font-bold">${block.tam} KB</span>
                `;
            } else {
                div.innerHTML = `
                    <span class="mem-block-name font-bold text-xs" style="color: ${procCol};">${block.id}</span>
                    <span class="mem-block-size font-bold">${block.tam} KB</span>
                    <span class="text-[9px] font-semibold leading-none" style="color: ${procCol};">Res. ${block.fromProc}</span>
                `;
            }
        } else {
            // Hueco libre original intacto
            div.className = 'mem-block hole original-hole';
            div.setAttribute('title', `Hueco libre ${block.id} (${block.tam} KB): Sin asignación`);
            div.innerHTML = `
                <span class="mem-block-name text-gray-500 dark:text-gray-400 font-bold">${block.id}</span>
                <span class="mem-block-size text-gray-500 dark:text-gray-400">${block.tam} KB</span>
                <span class="text-[9px] text-gray-400 dark:text-gray-500 font-medium leading-none">Libre</span>
            `;
        }

        // Eventos de hover sincronizado entre proceso y su residuo
        div.addEventListener('mouseenter', () => {
            const pId = div.getAttribute('data-proc');
            if (pId) {
                highlightProcBlocks(pId, true);
            }
        });
        div.addEventListener('mouseleave', () => {
            const pId = div.getAttribute('data-proc');
            if (pId) {
                highlightProcBlocks(pId, false);
            }
        });

        bar.appendChild(div);
    });

    updateResidualsPanel();
}

function highlightProcBlocks(procId, active) {
    if (!procId) return;
    document.querySelectorAll(`.mem-block[data-proc="${procId}"]`).forEach(el => {
        if (active) {
            el.classList.add('highlight-linked');
        } else {
            el.classList.remove('highlight-linked');
        }
    });
    document.querySelectorAll(`.residual-card[data-proc="${procId}"]`).forEach(card => {
        if (active) {
            card.classList.add('ring-2', 'ring-offset-1');
            card.style.transform = 'translateY(-2px)';
        } else {
            card.classList.remove('ring-2', 'ring-offset-1');
            card.style.transform = '';
        }
    });
}

function updateResidualsPanel() {
    const panel = document.getElementById('alloc-residuals-panel');
    if (!panel) return;

    const assignedProcs = allocMemory.filter(b => b.tipo === 'P');
    if (assignedProcs.length === 0) {
        panel.classList.add('hidden');
        panel.innerHTML = '';
        return;
    }

    panel.classList.remove('hidden');
    let cardsHtml = '';

    assignedProcs.forEach(p => {
        const residualHole = allocMemory.find(b => b.tipo === 'H' && b.isResidual && b.fromProc === p.id);
        const resTam = residualHole ? residualHole.tam : (p.residualTam || 0);
        const origTam = p.originalHoleTam || (p.tam + resTam);
        const pctDesp = origTam > 0 ? ((resTam / origTam) * 100).toFixed(1) : 0;
        const resId = residualHole ? residualHole.id : (p.residualHoleId || 'Ninguno (Exacto)');

        cardsHtml += `
            <div class="residual-card p-3 rounded-xl border transition-all cursor-pointer shadow-sm"
                 data-proc="${p.id}"
                 style="background: ${p.color}0d; border-color: ${p.color}60;"
                 onmouseenter="highlightProcBlocks('${p.id}', true)" 
                 onmouseleave="highlightProcBlocks('${p.id}', false)">
                <div class="flex items-center justify-between mb-1.5">
                    <span class="font-bold text-sm flex items-center gap-1.5" style="color: ${p.color};">
                        <span class="inline-block w-2.5 h-2.5 rounded-full" style="background: ${p.color};"></span>
                        ${p.id} (${p.tam} KB)
                    </span>
                    <span class="text-xs px-2 py-0.5 rounded font-semibold" style="background: ${p.color}25; color: ${p.color};">
                        Hueco Original: ${p.allocatedHole || 'H'} (${origTam} KB)
                    </span>
                </div>
                <div class="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                    <div class="flex justify-between">
                        <span>Ocupado por ${p.id}:</span>
                        <strong>${p.tam} KB</strong>
                    </div>
                    <div class="flex justify-between items-center pt-1 border-t border-gray-200 dark:border-gray-700">
                        <span class="font-medium flex items-center gap-1">
                            <span class="inline-block w-1.5 h-1.5 rounded-full ${resTam > 0 ? 'bg-amber-500' : 'bg-emerald-500'}"></span>
                            Espacio Residual (${resId}):
                        </span>
                        <strong class="${resTam > 0 ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-bold'}">
                            ${resTam} KB ${resTam > 0 ? `(${pctDesp}% remanente)` : '(Exacto)'}
                        </strong>
                    </div>
                </div>
            </div>
        `;
    });

    const totalRes = allocMemory.filter(b => b.tipo === 'H' && b.isResidual).reduce((acc, b) => acc + b.tam, 0);
    const totalIntact = allocMemory.filter(b => b.tipo === 'H' && !b.isResidual).reduce((acc, b) => acc + b.tam, 0);
    const totalAlloc = assignedProcs.reduce((acc, b) => acc + b.tam, 0);

    panel.innerHTML = `
        <div class="p-3.5 bg-gray-50/80 dark:bg-slate-800/60 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <span class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <span>📊</span> Auditoría de Huecos Residuales Libres por Proceso
                </span>
                <span class="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                    Asignado: <strong class="text-blue-600 dark:text-blue-400">${totalAlloc} KB</strong> | 
                    Residual Libre: <strong class="text-amber-600 dark:text-amber-400">${totalRes} KB</strong> | 
                    Huecos Intactos: <strong class="text-emerald-600 dark:text-emerald-400">${totalIntact} KB</strong>
                </span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                ${cardsHtml}
            </div>
        </div>
    `;
}

function updateAllocBadges(estado) {
    const free = allocMemory.filter(b => b.tipo === 'H').reduce((acc, b) => acc + b.tam, 0);
    const holes = allocMemory.filter(b => b.tipo === 'H').length;
    const largestHole = Math.max(0, ...allocMemory.filter(b => b.tipo === 'H').map(b => b.tam));

    document.getElementById('badge-alloc-status').textContent = `Estado: ${estado}`;
    document.getElementById('badge-alloc-free').textContent = `Libre: ${free} KB`;
    document.getElementById('badge-alloc-holes').textContent = `Huecos: ${holes}`;
    document.getElementById('badge-alloc-frag').textContent = `Libre total: ${free} KB | Mayor hueco: ${largestHole} KB`;
}

function logAlloc(msg) {
    const box = document.getElementById('alloc-log');
    if (box) {
        const time = new Date().toLocaleTimeString();
        box.innerHTML = `<div>[${time}] ${msg}</div>` + box.innerHTML;
    }
}

// --- 3. SIMULADOR 2: BUDDY SYSTEM (ÁRBOL DE COMPAÑEROS) ---
let buddyBlocks = [{ base: 0, tam: 512, ocupado: false, procId: null, solTam: 0, color: null }];
let buddyCustomCount = 1;

function initBuddySimulator() {
    renderBuddyTree();

    // Selectores de Escenario
    const btnSceneMulti = document.getElementById('btn-buddy-scene-multi');
    const btnSceneTP = document.getElementById('btn-buddy-scene-tp');
    const btnSceneCustom = document.getElementById('btn-buddy-scene-custom');

    const controlsMulti = document.getElementById('buddy-controls-multi');
    const controlsTP = document.getElementById('buddy-controls-tp');
    const controlsCustom = document.getElementById('buddy-controls-custom');

    function setBuddyScene(scene) {
        if (btnSceneMulti) btnSceneMulti.className = (scene === 'multi') ? 'btn-primary text-xs active' : 'btn-secondary text-xs';
        if (btnSceneTP) btnSceneTP.className = (scene === 'tp') ? 'btn-primary text-xs active' : 'btn-secondary text-xs';
        if (btnSceneCustom) btnSceneCustom.className = (scene === 'custom') ? 'btn-primary text-xs active' : 'btn-secondary text-xs';

        if (controlsMulti) controlsMulti.classList.toggle('hidden', scene !== 'multi');
        if (controlsTP) controlsTP.classList.toggle('hidden', scene !== 'tp');
        if (controlsCustom) controlsCustom.classList.toggle('hidden', scene !== 'custom');

        buddyReset();

        if (scene === 'multi') {
            logBuddy("🌟 Escenario 1 cargado: Multiescala Didáctica con jerarquía de potencias de 2 (P1: 12KB➔16KB, P2: 25KB➔32KB, P3: 60KB➔64KB, P4: 110KB➔128KB, P5: 240KB➔256KB).");
        } else if (scene === 'tp') {
            logBuddy("📋 Escenario 2 cargado: Caso Ejercicio 4 del TP oficial (P1: 12KB, P2: 9KB, P3: 10KB). Demuestra por qué todas las solicitudes pequeñas caen en el bloque mínimo de 16 KB.");
        } else if (scene === 'custom') {
            logBuddy("🎛️ Escenario 3 cargado: Modo Libre. Ingresa cualquier tamaño de proceso (1 a 512 KB) para explorar divisiones y coalescencias personalizadas.");
        }
    }

    if (btnSceneMulti) btnSceneMulti.addEventListener('click', () => setBuddyScene('multi'));
    if (btnSceneTP) btnSceneTP.addEventListener('click', () => setBuddyScene('tp'));
    if (btnSceneCustom) btnSceneCustom.addEventListener('click', () => setBuddyScene('custom'));

    // Botones Escenario Multiescala (Jerarquía Completa)
    document.getElementById('btn-buddy-p1')?.addEventListener('click', () => buddyAlloc(12, 'P1', '#3b82f6'));
    document.getElementById('btn-buddy-p2')?.addEventListener('click', () => buddyAlloc(25, 'P2', '#10b981'));
    document.getElementById('btn-buddy-p3')?.addEventListener('click', () => buddyAlloc(60, 'P3', '#8b5cf6'));
    document.getElementById('btn-buddy-p4')?.addEventListener('click', () => buddyAlloc(110, 'P4', '#f59e0b'));
    document.getElementById('btn-buddy-p5')?.addEventListener('click', () => buddyAlloc(240, 'P5', '#ec4899'));
    document.getElementById('btn-buddy-free-all')?.addEventListener('click', () => buddyReset());

    // Botones Escenario Caso TP (12, 9, 10 KB)
    document.getElementById('btn-buddy-tp-p1')?.addEventListener('click', () => buddyAlloc(12, 'P1', '#3b82f6'));
    document.getElementById('btn-buddy-tp-p2')?.addEventListener('click', () => buddyAlloc(9, 'P2', '#10b981'));
    document.getElementById('btn-buddy-tp-p3')?.addEventListener('click', () => buddyAlloc(10, 'P3', '#8b5cf6'));
    document.getElementById('btn-buddy-tp-free-all')?.addEventListener('click', () => buddyReset());

    // Botones Escenario Libre / Personalizado
    document.getElementById('btn-buddy-custom-add')?.addEventListener('click', () => {
        const input = document.getElementById('buddy-custom-size');
        const size = parseInt(input?.value) || 30;
        const pId = `P_Cust${buddyCustomCount++}`;
        const colors = ['#06b6d4', '#f97316', '#14b8a6', '#6366f1', '#e11d48'];
        const col = colors[(buddyCustomCount) % colors.length];
        buddyAlloc(size, pId, col);
    });
    document.getElementById('btn-buddy-custom-free-all')?.addEventListener('click', () => buddyReset());
}

function nextPow2(n) {
    return Math.pow(2, Math.ceil(Math.log2(n)));
}

function buddyAlloc(tamSol, procId, customColor = null) {
    if (tamSol <= 0 || tamSol > 512) {
        logBuddy(`❌ Error: El tamaño solicitado (${tamSol} KB) debe estar entre 1 KB y 512 KB.`);
        return false;
    }

    const tamReq = Math.max(16, nextPow2(tamSol)); // Mínimo 16 KB (potencia de 2 mínima pedagógica)
    let targetIdx = -1;
    let minTam = Infinity;

    // Buscar el bloque libre más pequeño que sea >= tamReq (Mejor Ajuste en árbol de potencias de 2)
    for (let i = 0; i < buddyBlocks.length; i++) {
        const b = buddyBlocks[i];
        if (!b.ocupado && b.tam >= tamReq && b.tam < minTam) {
            minTam = b.tam;
            targetIdx = i;
        }
    }

    if (targetIdx === -1) {
        logBuddy(`❌ Error: No hay bloque libre suficiente para ${procId} (${tamSol} KB ➔ requiere bloque 2^k de ${tamReq} KB). ¡Memoria saturada!`);
        return false;
    }

    // Dividir sucesivamente en dos compañeros (buddies)
    while (buddyBlocks[targetIdx].tam > tamReq) {
        const b = buddyBlocks.splice(targetIdx, 1)[0];
        const medio = b.tam / 2;
        logBuddy(`✂️ División: Bloque libre de ${b.tam} KB [${b.base}..${b.base + b.tam - 1}] se divide en dos compañeros de ${medio} KB.`);
        buddyBlocks.splice(targetIdx, 0, 
            { base: b.base, tam: medio, ocupado: false, procId: null, solTam: 0, color: null },
            { base: b.base + medio, tam: medio, ocupado: false, procId: null, solTam: 0, color: null }
        );
    }

    const color = customColor || getBuddyProcColor(procId);
    const fragInterna = tamReq - tamSol;
    const pctFrag = ((fragInterna / tamReq) * 100).toFixed(1);

    buddyBlocks[targetIdx].ocupado = true;
    buddyBlocks[targetIdx].procId = procId;
    buddyBlocks[targetIdx].solTam = tamSol;
    buddyBlocks[targetIdx].color = color;

    logBuddy(`✅ ${procId} (${tamSol} KB) asignado en bloque de ${tamReq} KB [${buddyBlocks[targetIdx].base}..${buddyBlocks[targetIdx].base + tamReq - 1}]. Fragmentación interna: ${fragInterna} KB (${pctFrag}%).`);
    renderBuddyTree();
    return true;
}

function buddyFree(procId) {
    let target = null;
    for (let b of buddyBlocks) {
        if (b.ocupado && b.procId === procId) {
            target = b;
            break;
        }
    }

    if (!target) {
        logBuddy(`ℹ️ ${procId} no se encuentra actualmente cargado en memoria.`);
        return;
    }

    const solTam = target.solTam;
    const blkTam = target.tam;
    target.ocupado = false;
    target.procId = null;
    target.solTam = 0;
    target.color = null;

    logBuddy(`➖ Liberado ${procId} (${solTam} KB, bloque de ${blkTam} KB en base ${target.base} KB). Comprobando coalescencia recursiva...`);
    buddyCoalesce();
    renderBuddyTree();
}

function buddyCoalesce() {
    let cambio = true;
    while (cambio) {
        cambio = false;
        buddyBlocks.sort((a, b) => a.base - b.base);
        for (let i = 0; i < buddyBlocks.length - 1; i++) {
            const b1 = buddyBlocks[i];
            const b2 = buddyBlocks[i + 1];
            // Regla matemática de Knuth para compañeros:
            // 1. Ambos bloques están desocupados
            // 2. Tienen idéntico tamaño (b1.tam === b2.tam)
            // 3. b1.base debe ser múltiplo de 2 * b1.tam (compañero izquierdo)
            // 4. b2.base contiguo inmediatamente a b1 (b1.base + b1.tam === b2.base)
            if (!b1.ocupado && !b2.ocupado && b1.tam === b2.tam && 
                (b1.base % (2 * b1.tam) === 0) && (b1.base + b1.tam === b2.base)) {
                const nuevoTam = b1.tam * 2;
                logBuddy(`🔗 Coalescencia: Compañeros en [${b1.base}..${b1.base + b1.tam - 1}] y [${b2.base}..${b2.base + b2.tam - 1}] (${b1.tam} KB c/u) se fusionan en bloque único de ${nuevoTam} KB.`);
                b1.tam = nuevoTam;
                buddyBlocks.splice(i + 1, 1);
                cambio = true;
                break;
            }
        }
    }
}

function buddyReset() {
    buddyBlocks = [{ base: 0, tam: 512, ocupado: false, procId: null, solTam: 0, color: null }];
    buddyCustomCount = 1;
    logBuddy("🔄 Buddy System restablecido: Bloque inicial único libre de 512 KB [0..511].");
    renderBuddyTree();
}

function getBuddyProcColor(procId) {
    const map = {
        'P1': '#3b82f6',
        'P2': '#10b981',
        'P3': '#8b5cf6',
        'P4': '#f59e0b',
        'P5': '#ec4899'
    };
    return map[procId] || '#6366f1';
}

function renderBuddyTree() {
    const container = document.getElementById('buddy-tree-display');
    if (!container) return;
    container.innerHTML = '';

    const row = document.createElement('div');
    row.className = 'buddy-level';

    let totalUsedBlk = 0;
    let totalUsedProc = 0;

    buddyBlocks.forEach(b => {
        const node = document.createElement('div');
        node.className = `buddy-node ${b.ocupado ? 'allocated' : 'free'}`;
        node.style.flex = b.tam;

        if (b.ocupado) {
            totalUsedBlk += b.tam;
            const sol = b.solTam || b.tam;
            totalUsedProc += sol;
            const frag = b.tam - sol;
            const pctProc = ((sol / b.tam) * 100).toFixed(0);
            const color = b.color || '#3b82f6';

            node.style.background = `${color}18`;
            node.style.borderColor = `${color}80`;
            node.setAttribute('title', `Proceso ${b.procId}: Solicitó ${sol} KB, asignado en bloque de ${b.tam} KB. Frag. interna: ${frag} KB. Haz clic para liberar.`);

            node.innerHTML = `
                <div class="flex items-center justify-center gap-1 font-bold text-sm" style="color: ${color};">
                    <span>${b.procId}</span>
                    <span class="text-[11px] opacity-75">(${sol} KB)</span>
                </div>
                <div class="text-[11px] font-bold mt-0.5 text-gray-700 dark:text-gray-200">Bloque ${b.tam} KB</div>
                <div class="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5 my-1 overflow-hidden" title="${pctProc}% ocupado / ${100 - pctProc}% frag. interna">
                    <div class="h-full rounded-full" style="width: ${pctProc}%; background: ${color};"></div>
                </div>
                <div class="text-[10px] ${frag > 0 ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-emerald-500 font-bold'}">
                    ${frag > 0 ? `Frag: ${frag} KB` : 'Exacto (0 frag)'}
                </div>
                <div class="text-[9px] opacity-65 font-mono">[${b.base}..${b.base + b.tam - 1}]</div>
            `;

            node.addEventListener('click', () => {
                buddyFree(b.procId);
            });
        } else {
            node.setAttribute('title', `Bloque libre de ${b.tam} KB [${b.base}..${b.base + b.tam - 1}].`);
            node.innerHTML = `
                <div class="font-bold text-xs text-emerald-600 dark:text-emerald-400">LIBRE</div>
                <div class="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">${b.tam} KB</div>
                <div class="text-[9px] opacity-70 font-mono text-emerald-600 dark:text-emerald-400">[${b.base}..${b.base + b.tam - 1}]</div>
            `;
        }

        row.appendChild(node);
    });

    container.appendChild(row);

    // Actualizar Badges
    const totalFree = 512 - totalUsedBlk;
    const totalFrag = totalUsedBlk - totalUsedProc;
    const badgeFree = document.getElementById('badge-buddy-free');
    const badgeUsed = document.getElementById('badge-buddy-used');
    const badgeFrag = document.getElementById('badge-buddy-frag');
    const badgeBlocks = document.getElementById('badge-buddy-blocks');

    if (badgeFree) badgeFree.textContent = `Libre: ${totalFree} KB`;
    if (badgeUsed) badgeUsed.textContent = `En Bloques: ${totalUsedBlk} KB (Real: ${totalUsedProc} KB)`;
    if (badgeFrag) badgeFrag.textContent = `Frag. Interna: ${totalFrag} KB`;
    if (badgeBlocks) badgeBlocks.textContent = `Particiones: ${buddyBlocks.length}`;
}

function logBuddy(msg) {
    const box = document.getElementById('buddy-log');
    if (box) {
        const time = new Date().toLocaleTimeString();
        box.innerHTML = `<div>[${time}] ${msg}</div>` + box.innerHTML;
    }
}

// --- 4. SIMULADOR 3: TRADUCCIÓN MMU EN PAGINACIÓN SIMPLE ---
const officialPageTable = {
    0: { marco: 1, presente: true },
    1: { marco: null, presente: false },
    2: { marco: null, presente: false },
    3: { marco: 3, presente: true },
    4: { marco: 2, presente: true },
    5: { marco: null, presente: false },
    6: { marco: 0, presente: true },
    7: { marco: null, presente: false }
};

function initPagingSimulator() {
    renderPagingTable();
    document.getElementById('btn-translate-paging').addEventListener('click', translatePaging);
    translatePaging();
}

function renderPagingTable() {
    const tbody = document.getElementById('paging-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    for (let p = 0; p < 8; p++) {
        const entry = officialPageTable[p] || { marco: null, presente: false };
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>Pág ${p}</strong></td>
            <td>${entry.presente ? 'Marco ' + entry.marco : '<span class="text-gray-400">-</span>'}</td>
            <td>${entry.presente ? '<span class="text-emerald-500 font-bold">1 (RAM)</span>' : '<span class="text-rose-500 font-bold">0 (Ausente de RAM)</span>'}</td>
        `;
        tbody.appendChild(tr);
    }
}

function translatePaging() {
    const rawVal = document.getElementById('paging-dl-input').value.trim();
    const dl = Number(rawVal);
    const tamPag = parseInt(document.getElementById('paging-size-select').value) || 4096;
    const resultBox = document.getElementById('paging-result-box');

    if (!Number.isInteger(dl) || dl < 0) {
        document.getElementById('mmu-dl-disp').textContent = rawVal || 'Inválido';
        document.getElementById('mmu-page-disp').textContent = '-';
        document.getElementById('mmu-offset-disp').textContent = '-';
        document.getElementById('mmu-binary-disp').innerHTML = '<span class="text-rose-500 font-bold">Dirección Lógica inválida (debe ser un entero ≥ 0)</span>';
        resultBox.className = 'p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-sm';
        document.getElementById('paging-result-status').innerHTML = '❌ Dirección Inválida';
        document.getElementById('paging-res-frame').textContent = '-';
        document.getElementById('paging-res-calc').textContent = 'La dirección lógica debe ser un entero no negativo (≥ 0)';
        document.getElementById('paging-res-df').textContent = 'Error de MMU';
        return;
    }

    const p = Math.floor(dl / tamPag);
    const d = dl % tamPag;

    document.getElementById('mmu-dl-disp').textContent = dl;
    document.getElementById('mmu-page-disp').textContent = p;
    document.getElementById('mmu-offset-disp').textContent = d;

    // Desglose binario (bits altos p, bits bajos d)
    const bitsDisp = Math.log2(tamPag);
    const binTotal = dl.toString(2).padStart(20, '0');
    const binP = binTotal.slice(0, binTotal.length - bitsDisp);
    const binD = binTotal.slice(binTotal.length - bitsDisp);
    document.getElementById('mmu-binary-disp').innerHTML = `<span class="text-blue-500 font-bold">${binP}</span> <span class="text-emerald-500 font-bold">${binD}</span>`;

    const entry = officialPageTable[p];

    if (!entry || !entry.presente) {
        resultBox.className = 'p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-sm';
        document.getElementById('paging-result-status').innerHTML = '❌ Excepción por fallo de página (Page Fault)';
        document.getElementById('paging-res-frame').textContent = entry ? 'No presente en memoria principal' : 'No incluida en tabla';
        document.getElementById('paging-res-calc').textContent = entry
            ? `La página ${p} tiene bit de presencia 0`
            : `La página ${p} no está incluida en el fragmento de tabla mostrado`;
        document.getElementById('paging-res-df').textContent = 'Excepción por fallo de página';
    } else {
        resultBox.className = 'p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-sm';
        const df = (entry.marco * tamPag) + d;
        document.getElementById('paging-result-status').innerHTML = '✅ Traducción Exitosa';
        document.getElementById('paging-res-frame').textContent = `${entry.marco}`;
        document.getElementById('paging-res-calc').textContent = `${entry.marco} × ${tamPag} + ${d}`;
        document.getElementById('paging-res-df').textContent = `${df}`;
    }
}

// --- 5. SIMULADOR 4: SEGMENTACIÓN PURA Y VALIDACIÓN POR HARDWARE ---
const officialSegmentTable = {
    0: { base: 150, limite: 250 },
    1: { base: 650, limite: 180 },
    2: { base: 1024, limite: 310 },
    3: { base: 410, limite: 200 },
    4: { base: 850, limite: 110 }
};

function initSegmentationSimulator() {
    document.getElementById('btn-translate-seg').addEventListener('click', translateSegmentation);
    translateSegmentation();
}

window.loadSegSample = function(s, d) {
    document.getElementById('seg-num-input').value = s;
    document.getElementById('seg-offset-input').value = d;
    translateSegmentation();
};

function translateSegmentation() {
    const rawS = document.getElementById('seg-num-input').value.trim();
    const rawD = document.getElementById('seg-offset-input').value.trim();
    const s = Number(rawS);
    const d = Number(rawD);

    const badge = document.getElementById('seg-status-badge');
    const compEl = document.getElementById('seg-comp');
    const calcEl = document.getElementById('seg-calc');
    const dfEl = document.getElementById('seg-final-df');

    if (!Number.isInteger(s) || s < 0 || !Number.isInteger(d) || d < 0) {
        badge.className = 'badge danger text-sm text-center py-2';
        badge.textContent = '❌ Parámetros Inválidos (Deben ser enteros ≥ 0)';
        compEl.innerHTML = '<span class="text-rose-500 font-bold">El segmento y desplazamiento deben ser enteros no negativos (≥ 0)</span>';
        calcEl.textContent = 'Acceso bloqueado por hardware';
        dfEl.textContent = 'Excepción de Dirección Inválida';
        return;
    }

    const seg = officialSegmentTable[s];

    if (!seg) {
        badge.className = 'badge danger text-sm text-center py-2';
        badge.textContent = '❌ Segmento Inválido (Fuera de Rango)';
        compEl.textContent = `Segmento ${s} no existe en tabla`;
        calcEl.textContent = 'Acceso bloqueado';
        dfEl.textContent = 'Segmentation Fault';
        return;
    }

    if (d >= seg.limite) {
        badge.className = 'badge danger text-sm text-center py-2';
        badge.textContent = '💥 Excepción por violación de límite (trap): Segmentation Fault';
        compEl.innerHTML = `<span class="text-rose-500 font-bold">${d} &ge; ${seg.limite} (DESPLAZAMIENTO EXCEDE EL LÍMITE)</span>`;
        calcEl.textContent = 'Hardware bloquea acceso a la memoria';
        dfEl.textContent = 'No se genera dirección física';
    } else {
        badge.className = 'badge success text-sm text-center py-2';
        badge.textContent = '✅ Acceso Válido por Hardware';
        compEl.innerHTML = `<span class="text-emerald-500 font-bold">${d} &lt; ${seg.limite} (Dentro de límites)</span>`;
        const df = seg.base + d;
        calcEl.textContent = `Base ${seg.base} + Desplazamiento ${d}`;
        dfEl.textContent = `${df}`;
    }
}

// --- 6. RENDERIZADO DE LOS 12 EJERCICIOS EVALUATIVOS ---
function renderExercises() {
    const container = document.getElementById('exercises-container');
    if (!container) return;
    container.innerHTML = '';

    exercisesData.forEach((ex, idx) => {
        const card = document.createElement('div');
        card.className = 'exercise-card';
        card.id = `card-${ex.id}`;

        let interactiveHtml = '';

        if (ex.type === 'switch') {
            const buttonsHtml = ex.options.map(opt => {
                const isSelected = state.answers[ex.id] === opt.value;
                return `<button type="button" class="segment-btn ${isSelected ? 'active' : ''}" data-ex="${ex.id}" data-val="${opt.value}" onclick="selectAnswer('${ex.id}', '${opt.value}')">${opt.label}</button>`;
            }).join('');
            interactiveHtml = `
                <div class="segment-control">
                    ${buttonsHtml}
                </div>
            `;
        } else if (ex.type === 'select') {
            const optionsHtml = ex.options.map(opt => {
                const isSelected = state.answers[ex.id] === opt.value;
                return `<option value="${opt.value}" ${isSelected ? 'selected' : ''}>${opt.label}</option>`;
            }).join('');
            interactiveHtml = `
                <div class="form-group mt-2">
                    <select class="select-academic" onchange="selectAnswer('${ex.id}', this.value)">
                        <option value="">-- Seleccione una opción correspondiente --</option>
                        ${optionsHtml}
                    </select>
                </div>
            `;
        } else {
            // Default: 'radio' con Radio Cards estructuradas (Anti-Bias format)
            const letters = ['A', 'B', 'C', 'D', 'E'];
            const optionsHtml = ex.options.map((opt, oIdx) => {
                const isSelected = state.answers[ex.id] === opt.value;
                const letter = letters[oIdx] || '';
                return `
                    <label class="radio-card ${isSelected ? 'selected' : ''}" onclick="selectAnswer('${ex.id}', '${opt.value}')">
                        <input type="radio" name="${ex.id}" value="${opt.value}" ${isSelected ? 'checked' : ''}>
                        <span class="radio-letter">${letter})</span>
                        <span class="radio-text">${opt.label}</span>
                    </label>
                `;
            }).join('');
            interactiveHtml = `
                <div class="radio-cards-grid mt-2">
                    ${optionsHtml}
                </div>
            `;
        }

        const labLinkHtml = ex.labRef ? `
            <a href="#${ex.labRef.id}" class="lab-link-pill" title="Ir al ${ex.labRef.name}">
                <span>${ex.labRef.badge}</span>
                <span>↗ Ir al Lab</span>
            </a>
        ` : '';

        const labHintHtml = ex.labHint ? `
            <div class="lab-experiment-hint">
                💡 <strong>Comprobación en el simulador:</strong> ${ex.labHint}
            </div>
        ` : '';

        card.innerHTML = `
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div class="exercise-title mb-0">${ex.title}</div>
                ${labLinkHtml}
            </div>
            <details class="biblio-panel">
                <summary class="biblio-summary">📖 Dónde estudiar este tema en la bibliografía</summary>
                <div class="biblio-content">${ex.biblio}</div>
            </details>
            <p class="text-sm font-medium mb-2">${ex.question}</p>
            ${labHintHtml}
            ${interactiveHtml}
        `;

        container.appendChild(card);
    });
}

window.selectAnswer = function(exId, value) {
    if (!value) {
        delete state.answers[exId];
    } else {
        state.answers[exId] = value;
    }

    // Sincronizar estilos visuales en la tarjeta
    const card = document.getElementById(`card-${exId}`);
    if (card) {
        // Radio Cards
        const radioCards = card.querySelectorAll('.radio-card');
        radioCards.forEach(rc => {
            const input = rc.querySelector('input[type="radio"]');
            if (input && input.value === value) {
                rc.classList.add('selected');
                input.checked = true;
            } else {
                rc.classList.remove('selected');
                if (input) input.checked = false;
            }
        });

        // Switches
        const segmentBtns = card.querySelectorAll('.segment-btn');
        segmentBtns.forEach(btn => {
            if (btn.getAttribute('data-val') === value) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Selects
        const select = card.querySelector('select.select-academic');
        if (select && select.value !== value) {
            select.value = value;
        }
    }

    saveProgress();
    updateProgress();
};

// --- 7. PERSISTENCIA Y PROGRESO ---
function saveProgress() {
    state.studentInfo.name = document.getElementById('student-name').value;
    state.studentInfo.lu = document.getElementById('student-lu').value;
    localStorage.setItem('tso_tp6_state', JSON.stringify(state));
}

function loadProgress() {
    const saved = localStorage.getItem('tso_tp6_state');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            state.answers = parsed.answers || {};
            state.studentInfo = parsed.studentInfo || { name: '', lu: '' };

            document.getElementById('student-name').value = state.studentInfo.name || '';
            document.getElementById('student-lu').value = state.studentInfo.lu || '';

            // Restaurar controles interactivos
            for (let [exId, val] of Object.entries(state.answers)) {
                // Radio
                const radio = document.querySelector(`input[name="${exId}"][value="${val}"]`);
                if (radio) {
                    radio.checked = true;
                    const rc = radio.closest('.radio-card');
                    if (rc) rc.classList.add('selected');
                }
                // Segment Switch
                const segBtn = document.querySelector(`.segment-btn[data-ex="${exId}"][data-val="${val}"]`);
                if (segBtn) segBtn.classList.add('active');

                // Select
                const card = document.getElementById(`card-${exId}`);
                if (card) {
                    const sel = card.querySelector('select.select-academic');
                    if (sel) sel.value = val;
                }
            }
        } catch (e) {
            console.error("Error al cargar estado previo:", e);
        }
    }
    updateProgress();
}

function updateProgress() {
    const total = exercisesData.length;
    const answered = Object.keys(state.answers).length;
    const pct = Math.round((answered / total) * 100);

    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');
    if (fill) fill.style.width = `${pct}%`;
    if (text) text.textContent = `${pct}% Completado (${answered}/${total})`;

    const nameVal = document.getElementById('student-name').value.trim();
    const luVal = document.getElementById('student-lu').value.trim();
    const exportBtn = document.getElementById('btn-export');

    if (exportBtn) {
        exportBtn.disabled = !(answered === total && nameVal.length > 2 && luVal.length > 2);
    }
}

function setupListeners() {
    document.getElementById('student-name').addEventListener('input', () => {
        saveProgress();
        updateProgress();
    });
    document.getElementById('student-lu').addEventListener('input', () => {
        saveProgress();
        updateProgress();
    });

    // Importación de JSON
    const btnImport = document.getElementById('btn-import-json');
    const fileImport = document.getElementById('file-import-input');
    if (btnImport && fileImport) {
        btnImport.addEventListener('click', () => fileImport.click());
        fileImport.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const data = JSON.parse(evt.target.result);
                    if (data.student) {
                        state.studentInfo.name = data.student.name || '';
                        state.studentInfo.lu = data.student.lu || '';
                        document.getElementById('student-name').value = state.studentInfo.name;
                        document.getElementById('student-lu').value = state.studentInfo.lu;
                    }
                    for (let key of Object.keys(data)) {
                        if (key.startsWith('ej')) {
                            state.answers[key] = data[key];
                        }
                    }
                    saveProgress();
                    renderExercises();
                    loadProgress();
                    alert("✅ Respuestas importadas correctamente desde " + file.name);
                } catch (err) {
                    alert("❌ Error al leer el archivo JSON: " + err.message);
                }
            };
            reader.readAsText(file);
        });
    }

    document.getElementById('btn-export').addEventListener('click', exportAnswers);
}

// --- 8. EXPORTACIÓN DE RESPUESTAS A JSON ---
function exportAnswers() {
    const payload = {
        tp_id: "TSO-2026-TP6",
        student: {
            name: document.getElementById('student-name').value.trim(),
            lu: document.getElementById('student-lu').value.trim()
        },
        timestamp: new Date().toISOString(),
        ...state.answers
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "respuestas_tp6.json");
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();

    // Disparar confetti de celebración
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}
