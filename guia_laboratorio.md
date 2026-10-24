# 📘 Guía Práctica de Experimentación en Laboratorios Interactivos
## Trabajo Práctico N° 6: Gestión de Memoria Principal

**Universidad Nacional de Jujuy (UNJu) — Facultad de Ingeniería**  
**Cátedra:** Teoría de Sistemas Operativos (TSO) — Ciclo Lectivo 2026  
**Responsable de Cátedra:** Ing. María Fernanda Vázquez | **JTP:** Ing. Fabio D. Argañaraz  

---

### 🎯 Propósito de esta Guía

Los simuladores interactivos de `index.html` no son herramientas aisladas ni decorativas: **constituyen el laboratorio experimental donde comprobarás empíricamente cada concepto teórico antes de responder los ejercicios evaluativos**.

Esta guía te explica detalladamente:
1. **Qué parámetros y valores específicos probar** en cada simulador.
2. **Qué fenómenos y métricas observar** en la pantalla y en los paneles de estado.
3. **Con qué ejercicio evaluativo del TP se relaciona cada prueba**, permitiéndote verificar tus deducciones matemáticas y conceptuales antes de generar tu archivo de respuestas.

---

## 🧠 Laboratorio 1: Colocación en Particiones Variables
**Ubicación en simulador:** Sección `#alloc-simulator`  
**Ejercicios asociados:** **Ejercicio 1**, **Ejercicio 2**, **Ejercicio 3** y **Ejercicio 11**.

### 📋 Estado Inicial del Sistema
- **Memoria física total:** 96 KB dividida en 8 huecos libres ordenados por dirección física:
  `[20 KB, 7 KB, 10 KB, 12 KB, 5 KB, 9 KB, 15 KB, 18 KB]`.
> ℹ️ **Nota sobre la representación simplificada:** Los huecos pertenecen a distintas zonas no contiguas de la memoria. Los procesos ocupados que los separan se omiten en esta representación simplificada para concentrar el análisis en la política de selección del hueco.
- **Cola de solicitudes sucesivas:**
  1. Solicitud $a$: Proceso **P1** = `12 KB`
  2. Solicitud $b$: Proceso **P2** = `9 KB`
  3. Solicitud $c$: Proceso **P3** = `10 KB`

---

### 🧪 Experimento 1.1: Primer Ajuste (First-Fit)
> **Objetivo:** Comprobar la rapidez de asignación y la fragmentación residual generada al tomar el primer bloque donde quepa el proceso.

1. **Configuración:**
   - Asegúrate de tener seleccionado el escenario **`📋 1. Caso Base: 8 Huecos`**.
   - En el menú desplegable **Estrategia**, selecciona **`Primer Ajuste (First-Fit)`**.
   - Si ya realizaste pruebas previas, haz clic en **`🔄 Reiniciar escenario actual`**.
2. **Procedimiento Paso a Paso:**
   - Haz clic en **`⏭️ Siguiente Solicitud (1/3)`** para asignar **P1 (12 KB)**:
     - *Búsqueda:* El algoritmo examina desde la dirección 0. El primer hueco es de **20 KB**. Como $12 \le 20$, lo asigna allí.
     - *Qué observar:* El hueco 0 de 20 KB se divide: se alojan los 12 KB de P1 y se genera un **hueco residual de 8 KB**. Observa en el panel inferior la tarjeta verde: `"Hueco residual de P1: 8 KB restantes"`.
   - Haz clic en **`⏭️ Siguiente Solicitud (2/3)`** para asignar **P2 (9 KB)**:
     - *Búsqueda:* Comienza nuevamente desde el inicio. El hueco residual es de 8 KB (no alcanza, $9 > 8$). El siguiente hueco es de 7 KB (no alcanza). El siguiente hueco es de **10 KB** ($9 \le 10$), por lo que P2 se ubica en el hueco 2 original de 10 KB.
     - *Qué observar:* Se genera un nuevo residuo minúsculo de **1 KB**.
   - Haz clic en **`⏭️ Siguiente Solicitud (3/3)`** para asignar **P3 (10 KB)**:
     - *Búsqueda:* Comienza desde el inicio. El residuo de 8 KB no alcanza; el hueco de 7 KB no alcanza; el residuo de 1 KB no alcanza; el siguiente hueco disponible es de **12 KB** ($10 \le 12$).
     - *Qué observar:* P3 se ubica en el hueco 3 de 12 KB, dejando un residuo de **2 KB**.
3. **Conclusión y Validación:**
   - ¿De qué huecos originales se realizará cada asignación, considerando que el espacio remanente de un hueco continúa disponible?
   - Huecos utilizados respectivamente: **Hueco 20 KB, Hueco 10 KB y Hueco 12 KB**.
   - ✅ *Esta secuencia es la respuesta correcta del **Ejercicio 1***.

---

### 🧪 Experimento 1.2: Mejor Ajuste (Best-Fit)
> **Objetivo:** Comprobar cómo la búsqueda completa del hueco con menor residuo optimiza el espacio o crea pequeños huecos inutilizables.

1. **Configuración:**
   - Haz clic en **`🔄 Reiniciar escenario actual`**.
   - En **Estrategia**, selecciona **`Mejor Ajuste (Best-Fit)`**.
2. **Procedimiento:**
   - Ejecuta las 3 solicitudes paso a paso:
     - **P1 (12 KB):** Recorre toda la lista y encuentra que el hueco 3 mide **12 KB exactos** ($12 - 12 = 0$ de residuo). Lo asigna allí.
     - **P2 (9 KB):** Recorre la lista y encuentra el hueco 5 de **9 KB exactos** ($9 - 9 = 0$). Lo asigna allí.
     - **P3 (10 KB):** Recorre la lista y encuentra el hueco 2 de **10 KB exactos** ($10 - 10 = 0$). Lo asigna allí.
3. **Qué notar:**
   - Observa el panel de residuos: en este caso excepcional del TP, Best-Fit logra un **hueco residual libre de 0 KB** en los tres casos porque existían huecos del tamaño exacto.
   - Huecos utilizados: **Hueco 12 KB, Hueco 9 KB y Hueco 10 KB**.
   - ✅ *Esta secuencia es la respuesta correcta del **Ejercicio 2***.

---

### 🧪 Experimento 1.3: Peor Ajuste (Worst-Fit)
> **Objetivo:** Comprobar la estrategia que busca dejar los huecos residuales más grandes posibles.

1. **Configuración:**
   - Haz clic en **`🔄 Reiniciar escenario actual`**.
   - En **Estrategia**, selecciona **`Peor Ajuste (Worst-Fit)`**.
2. **Procedimiento:**
   - Ejecuta las 3 solicitudes:
     - **P1 (12 KB):** Busca el hueco más grande de toda la memoria: el hueco 0 de **20 KB** (deja 8 KB).
     - **P2 (9 KB):** El hueco más grande disponible ahora es el último, de **18 KB** (deja 9 KB).
     - **P3 (10 KB):** El siguiente más grande es el de **15 KB** (deja 5 KB).
3. **Qué notar:**
   - Los huecos residuales libres que quedan (8 KB, 9 KB y 5 KB) son significativamente más grandes que en Best-Fit.
   - Huecos utilizados: **Hueco 20 KB, Hueco 18 KB y Hueco 15 KB**.
   - ✅ *Esta secuencia es la respuesta correcta del **Ejercicio 3***.

---

### 🧪 Experimento 1.4: Fragmentación Externa y la Regla del 50% de Knuth
1. **Procedimiento:**
   - Selecciona el botón **`💥 2. Fragmentación Externa Severa`**.
   - Observa la barra de memoria: hay múltiples huecos de 4 KB y 6 KB intercalados con procesos.
   - Nota el indicador **Libre total | Mayor hueco**: marca memoria libre suficiente para un proceso grande, pero ningún hueco individual puede albergarlo (fragmentación externa).
   - Haz clic en **`🗜️ Compactar estado actual`**: observa cómo el sistema operativo reubica todos los procesos contiguamente hacia el inicio de la memoria, unificando todo el espacio libre en un único gran bloque sin alterar el escenario activo.
2. **Qué notar teóricamente:**
   - Donald Knuth demostró formalmente que en particiones variables con First-Fit, si hay $N$ procesos asignados en estado estable, el número de huecos libres tiende a $N/2$ (la mitad de huecos que de procesos).
   - Por ende, los huecos libres representan aproximadamente **un tercio** del total de bloques (procesos + huecos: $\frac{0.5N}{N + 0.5N} = \frac{1}{3}$).
   - ✅ *Este principio analítico resuelve el **Ejercicio 11**: ante $N$ procesos cargados, se generan aproximadamente $N/2$ huecos libres, equivalentes a cerca de un tercio del total de bloques.*

---

## 🌲 Laboratorio 2: Sistema de Compañeros (Buddy System)
**Ubicación en simulador:** Sección `#buddy-simulator`  
**Ejercicio asociado:** **Ejercicio 4**.

### 📋 Concepto Fundamental
El Buddy System particiona la memoria exclusivamente en potencias de 2 ($2^k$). Un bloque de tamaño $S$ sólo puede dividirse en dos compañeros (*buddies*) de tamaño $S/2$. Toda solicitud de tamaño $x$ requiere un bloque mínimo tal que:
$$2^{k-1} < x \le 2^k$$

---

### 🧪 Experimento 2.1: El Escenario del Ejercicio Oficial (12 KB, 9 KB, 10 KB)
1. **Configuración:**
   - Selecciona el escenario **`📋 2. Caso Ejercicio TP (12, 9, 10 KB)`**.
   - El simulador inicia con un único bloque maestro de **512 KB**.
2. **Procedimiento:**
   - Haz clic en **`➕ P1 (12 KB ➔ 16 KB)`**:
     - *Qué ocurre:* Para albergar 12 KB, se necesita un bloque de $16\text{ KB}$ ($2^4$, ya que $8 < 12 \le 16$).
     - El bloque de 512 KB se divide sucesivamente en mitades:
       $$512 \to 256 + 256 \to 128 + 128 \to 64 + 64 \to 32 + 32 \to 16 + 16\text{ KB}$$
     - Se asigna un bloque de 16 KB a P1.
     - *Qué observar en pantalla:* El badge **Frag. Interna** sube a $4\text{ KB}$ ($16 - 12 = 4\text{ KB}$).
   - Haz clic en **`➕ P2 (9 KB ➔ 16 KB)`**:
     - *Qué ocurre:* $8 < 9 \le 16$. El sistema aprovecha el compañero contiguo libre de 16 KB generado en la división anterior.
     - *Qué observar:* No se requieren nuevas divisiones de bloques grandes. La fragmentación interna aumenta en $16 - 9 = 7\text{ KB}$.
   - Haz clic en **`➕ P3 (10 KB ➔ 16 KB)`**:
     - *Qué ocurre:* $8 < 10 \le 16$. Toma el compañero contiguo libre de 32 KB, lo divide en dos de 16 KB y aloja a P3.
     - *Qué observar:* La fragmentación interna aumenta en $16 - 10 = 6\text{ KB}$.
3. **Conclusión y Validación:**
   - En este ejercicio se supone que el tamaño mínimo de bloque permitido por el sistema es de 16 KB (el simulador adopta esta cota inferior para ilustrar la fragmentación interna representativa).
   - Para las tres solicitudes (12 KB, 9 KB y 10 KB), el tamaño de bloque asignado es invariablemente **16 KB**.
   - ✅ *Esta observación resuelve el **Ejercicio 4***.

---

### 🧪 Experimento 2.2: Escenario Multiescala y Fusión (Coalescing)
1. **Configuración:**
   - Selecciona **`🌟 1. Multiescala Didáctica (12, 25, 60, 110, 240 KB)`**.
2. **Procedimiento:**
   - Asigna todos los procesos presionando P1, P2, P3, P4 y P5:
     - P1 (12 KB) $\to$ bloque de **16 KB**
     - P2 (25 KB) $\to$ bloque de **32 KB**
     - P3 (60 KB) $\to$ bloque de **64 KB**
     - P4 (110 KB) $\to$ bloque de **128 KB**
     - P5 (240 KB) $\to$ bloque de **256 KB**
   - *Qué notar:* La memoria de 512 KB se descompone armónicamente en toda la escala de potencias de 2: $16 + 16(\text{libre}) + 32 + 64 + 128 + 256 = 512\text{ KB}$.
3. **Prueba de Liberación y Coalescencia:**
   - Haz clic directamente sobre el bloque de **P1 (12 KB)** en el mapa gráfico.
   - *Qué observar:* Al quedar libres ambos bloques de 16 KB compañeros, el sistema los **fusiona instantáneamente (*coalesce*)** en un solo bloque de 32 KB.
   - Haz clic sobre **P2 (25 KB)**: ahora ambos bloques de 32 KB se fusionan en uno de 64 KB, y así sucesivamente en cascada.

---

## 📑 Laboratorio 3: Traducción MMU en Paginación Simple
**Ubicación en simulador:** Sección `#paging-simulator`  
**Ejercicios asociados:** **Ejercicio 5**, **Ejercicio 6**, **Ejercicio 7** y **Ejercicio 8**.

### 📋 Arquitectura del Simulador
- **Tamaño de página:** $4\text{ KB} = 4096\text{ bytes} \implies 12\text{ bits}$ para el desplazamiento ($d$) (fijo según el fragmento de tabla del proceso).
- **Fragmento de la tabla de páginas del proceso, páginas 0 a 7 (proceso de 56 KB = 14 páginas):**
  - Página 0 $\to$ Marco 1 (Presencia = 1)
  - Página 1 $\to$ **Presencia = 0 (bit de presencia 0, por lo que no se encuentra actualmente en memoria principal)**
  - Página 2 $\to$ Presencia = 0
  - Página 3 $\to$ Marco 3 (Presencia = 1)
  - Página 4 $\to$ Marco 2 (Presencia = 1)
  - Página 6 $\to$ Marco 0 (Presencia = 1)

---

### 🧪 Experimento 3.1: Desglose Matemático y Binario para $\text{DL} = 20000$
1. **Configuración y Valores:**
   - En **Dirección Lógica (Decimal)**, ingresa manualmente: `20000`.
   - En **Tamaño de Página**, nota que está fijado en: `4 KB (4096 bytes - Fijo según tabla de proceso)`.
   - Haz clic en **`🔍 Traducir Dirección`**.
2. **Qué observar en pantalla:**
   - **Cálculo de la MMU:**
     $$p = \lfloor 20000 / 4096 \rfloor = \mathbf{4}$$
     $$d = 20000 \pmod{4096} = 20000 - (4 \times 4096) = \mathbf{3616}$$
   - **Desglose en MMU:**
     - En el visor binario verás: `<span class="text-blue-500">00000100</span> <span class="text-emerald-500">111000100000</span>`.
     - Los 12 bits bajos en verde son el desplazamiento: $111000100000_2 = 3616_{10}$.
     - Los bits altos en azul son la página: $00000100_2 = 4_{10}$.
   - **Traducción Física:**
     - La MMU busca en la tabla la fila `Pág 4`: encuentra que está presente en el **Marco 2**.
     - Fórmula física: $\text{DF} = \text{Marco} \times 4096 + d = 2 \times 4096 + 3616 = \mathbf{11808}$.
3. **Validación:**
   - Página virtual = 4, Desplazamiento = 3616.
   - ✅ *Resuelve el **Ejercicio 6***.

---

### 🧪 Experimento 3.2: Límite Exacto de Página para $\text{DL} = 32768$
1. **Valores a Probar:**
   - Ingresa manualmente la Dirección Lógica: `32768`. Presiona **`🔍 Traducir Dirección`**.
2. **Qué observar:**
   - $p = 32768 / 4096 = \mathbf{8}$.
   - $d = 32768 \pmod{4096} = \mathbf{0}$.
   - Nota que cuando una dirección lógica es múltiplo exacto del tamaño de página, el desplazamiento es siempre $0$, apuntando al primer byte de la página siguiente.
3. **Validación:**
   - Página virtual = 8, Desplazamiento = 0.
   - ⚠️ *Aclaración sobre el simulador:* El fragmento de tabla implementado cubre las páginas 0 a 7, por lo que el laboratorio comprueba el desglose aritmético pero no dispone del marco para la página 8.
   - ✅ *Resuelve el **Ejercicio 7***.

---

### 🧪 Experimento 3.3: Detección por Hardware de Fallo de Página ($\text{DL} = 4100$)
1. **Valores a Probar:**
   - Ingresa manualmente la Dirección Lógica: `4100`. Presiona **`🔍 Traducir Dirección`**.
2. **Qué observar:**
   - $p = \lfloor 4100 / 4096 \rfloor = \mathbf{1}$, $d = 4100 - 4096 = \mathbf{4}$.
   - La MMU consulta la tabla en la entrada `Pág 1`.
   - La columna de presencia indica: `0 (Ausente de RAM)`.
   - El panel de resultado cambia a color **rojo**:
     `❌ Excepción por fallo de página (Page Fault): La página 1 tiene bit de presencia 0 (ausente de RAM).`
   - La MMU **no calcula dirección física**, sino que suspende la instrucción y genera una **excepción por fallo de página** (Page Fault Exception) transfiriendo el control a la rutina del núcleo del sistema operativo para cargar la página desde el almacenamiento secundario a RAM.
3. **Validación:**
   - No hay correspondencia física porque la página no está cargada (Pág. 1 con bit de presencia 0, por lo que no se encuentra actualmente en memoria principal).
   - ✅ *Resuelve el **Ejercicio 8***.

---

### 🧪 Experimento 3.4: Análisis de Bits de Dirección Lógica vs. Física
1. **Concepto teórico a verificar:**
   - Descompón cada dirección en número de página o marco y desplazamiento:
     - 16 páginas $= 2^4 \implies \mathbf{4\text{ bits}}$ de página virtual.
     - 8 marcos $= 2^3 \implies \mathbf{3\text{ bits}}$ de marco físico.
     - Página de $512\text{ KB} = 2^{19}\text{ bytes} \implies \mathbf{19\text{ bits}}$ de desplazamiento.
     - Dirección lógica total = $4 + 19 = \mathbf{23\text{ bits}}$.
     - Dirección física total = $3 + 19 = \mathbf{22\text{ bits}}$.
   - ⚠️ *Nota pedagógica:* Este ejercicio analiza una arquitectura teórica con páginas de 512 KB, mientras que el Laboratorio 3 en pantalla adopta páginas de 4 KB con fines visuales interactivos.
   - ✅ *Resuelve el **Ejercicio 5***.

---

## 🛡️ Laboratorio 4: Segmentación y Validación por Hardware
**Ubicación en simulador:** Sección `#seg-simulator`  
**Ejercicios asociados:** **Ejercicio 9**, **Ejercicio 10** y **Ejercicio 12**.

### 📋 Tabla de Segmentos Oficial en RAM (Unidades en Bytes)
> ℹ️ **Nota sobre unidades:** Las bases físicas, límites, desplazamientos ($d$) y direcciones físicas ($\text{DF}$) se expresan en **unidades direccionables (bytes)**.

| Segmento ($s$) | Base Física (bytes) | Límite / Tamaño máx. (bytes) |
| :---: | :---: | :---: |
| **0** | 150 | 250 |
| **1** | 650 | 180 |
| **2** | 1024 | 310 |
| **3** | 410 | 200 |
| **4** | 850 | 110 |

---

### 🧪 Experimento 4.1: Acceso Válido para la Dupla $(2, 10)$
1. **Procedimiento:**
   - Ingresa manualmente en los campos del simulador:
     - **Número de Segmento (S):** `2`
     - **Desplazamiento (d):** `10`
   - Presiona **`⚡ Validar Acceso MMU`**.
2. **Qué observar en pantalla:**
   - La MMU valida que el desplazamiento sea un entero no negativo ($d \ge 0$) y realiza la comparación de hardware:
     $$d < \text{Límite} \iff 10 < 310 \implies \mathbf{VERDADERO\ (Válido)}$$
   - El badge se muestra en verde: `✅ Acceso Válido por Hardware`.
   - Cálculo de la dirección física contigua:
     $$\text{DF} = \text{Base} + d = 1024 + 10 = \mathbf{1034}\text{ bytes}$$
3. **Validación:**
   - Dirección física calculada = 1034 bytes.
   - ✅ *Resuelve el **Ejercicio 9***.

---

### 🧪 Experimento 4.2: Excepción por Violación de Límite (Trap) para la Dupla $(1, 371)$
1. **Procedimiento:**
   - Ingresa manualmente en los campos del simulador:
     - **Número de Segmento (S):** `1`
     - **Desplazamiento (d):** `371`
   - Presiona **`⚡ Validar Acceso MMU`**.
2. **Qué observar en pantalla:**
   - Para el Segmento 1, el Límite es 180 bytes.
   - La MMU evalúa:
     $$d \ge \text{Límite} \iff 371 \ge 180 \implies \mathbf{VIOLACIÓN\ DE\ LÍMITE}$$
   - El panel se tiñe de color **rojo intenso**:
     `💥 Excepción por violación de límite (trap): Segmentation Fault`  
     `371 >= 180 (DESPLAZAMIENTO EXCEDE EL LÍMITE)`  
     `Hardware bloquea acceso a la memoria física: Excepción de Núcleo.`
   - La MMU **bloquea físicamente las líneas del bus de direcciones**, impidiendo que un proceso corrompa segmentos ajenos (así como también rechaza desplazamientos negativos o no enteros que no cumplan $0 \le d < \text{Límite}$).
3. **Validación:**
   - Acción: Excepción por violación de límite (trap) (desplazamiento 371 bytes supera límite de 180 bytes).
   - ✅ *Resuelve el **Ejercicio 10***.

---

### 🧪 Experimento 4.3: Arquitectura de Segmentación Paginada
1. **Concepto:**
   - La segmentación pura produce fragmentación externa al requerir bloques contiguos de tamaño variable para cada segmento.
   - Para solucionar esto, la **Segmentación Paginada** divide cada segmento en páginas de tamaño uniforme.
   - Si un segmento tiene un tamaño máximo de 8 KB y el sistema utiliza páginas de 1 KB:
     $$\text{Páginas por segmento} = \frac{8\text{ KB}}{1\text{ KB}} = \mathbf{8\text{ páginas}}$$
   - Cada segmento posee su propia tabla de páginas individual, eliminando por completo la fragmentación externa.
2. **Validación:**
   - ✅ *Resuelve el **Ejercicio 12***.

---

## 📊 Matriz de Autochequeo: De la Simulación a la Evaluación

Utiliza esta tabla para verificar que completaste cada comprobación antes de enviar tu evaluación:

| N° | Ejercicio Evaluativo | Simulador a Utilizar | Valores a Ingresar / Probar | Resultado Esperado en el Simulador |
| :-: | :--- | :--- | :--- | :--- |
| **1** | Primer Ajuste (Huecos originales) | Lab 1 (Particiones) | Estrategia: First-Fit, 3 pasos | Asignación en huecos originales: `20 KB`, `10 KB`, `12 KB` |
| **2** | Mejor Ajuste (Huecos originales) | Lab 1 (Particiones) | Estrategia: Best-Fit, 3 pasos | Asignación en huecos originales: `12 KB`, `9 KB`, `10 KB` |
| **3** | Peor Ajuste (Huecos originales) | Lab 1 (Particiones) | Estrategia: Worst-Fit, 3 pasos | Asignación en huecos originales: `20 KB`, `18 KB`, `15 KB` |
| **4** | Buddy System (Mínimo 16 KB) | Lab 2 (Buddy) | Escenario 2, P1(12), P2(9), P3(10) | Todos se asignan en bloques de `16 KB` (mínimo permitido) |
| **5** | Bits Lógicos/Físicos | Lab 3 (Paginación) | Apartado "Desglose en MMU" | `23 bits` lógicos y `22 bits` físicos |
| **6** | Desglose DL 20000 | Lab 3 (Paginación) | Ingreso manual: DL = `20000` | Página virtual `4`, Desplazamiento `3616` |
| **7** | Desglose DL 32768 | Lab 3 (Paginación) | Ingreso manual: DL = `32768` | Página virtual `8`, Desplazamiento `0` |
| **8** | Fallo de Página (Bit pres. 0) | Lab 3 (Paginación) | Ingreso manual: DL = `4100` | `Excepción por fallo de página` (Bit presencia = 0, ausente de RAM) |
| **9** | Segmentación Válida (bytes) | Lab 4 (Segmentación) | Segmento = `2`, Desplazamiento = `10` | `Acceso Válido`: DF = $1024 + 10 = \mathbf{1034}\text{ bytes}$ |
| **10** | Violación de Límite (bytes) | Lab 4 (Segmentación) | Segmento = `1`, Desplazamiento = `371` | `Excepción por violación de límite (trap)` ($371 \ge 180\text{ bytes}$) |
| **11** | Regla del 50% Knuth | Lab 1 (Particiones) | Análisis de estado estable | Se generan aprox. $N/2$ huecos ($\sim$ un tercio del total) |
| **12** | Segmentación Paginada | Lab 4 / Concepto | 8 KB máx. / páginas de 1 KB | `8 páginas` por cada segmento |

---

### 🏁 Flujo de Entrega Recomendado
1. Abre `index.html` en tu navegador.
2. Ingresa tu **Nombre, Apellido y Libreta Universitaria**.
3. Sigue cada experimento de esta guía interactuando con los 4 laboratorios.
4. Completa las 12 ejercitaciones en la sección evaluativa.
5. Haz clic en **`💾 Descargar respuestas_tp6.json`**.
6. En tu terminal o consola, ejecuta:
   ```bash
   python autograder_tp6.py
   ```
7. Confirma que tu calificación sea **100/100 (Nota: 10.0/10.0)** antes de subir tus cambios a GitHub Classroom.
