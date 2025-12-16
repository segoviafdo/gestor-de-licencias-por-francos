import { GoogleGenAI, Chat } from "@google/genai";
import { AIResponse } from "../types";

// Safe initialization: Check if key exists to prevent app crash on load
const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey.length > 0 && apiKey !== 'undefined') {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Failed to initialize Gemini Client", e);
  }
} else {
  console.warn("API_KEY is missing or invalid in environment variables");
}

// Dynamic date context
const currentDate = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// --- BASE DE DATOS DE EMPLEADOS ---
const EMPLOYEE_DB = [
  { name: "IBAÑEZ MARCELO JAVIER", dni: "23158355" },
  { name: "GUTIERREZ SEBASTIAN ALEJANDRO", dni: "31366249" },
  { name: "ACOSTA ALBERTO MARTIN", dni: "29858232" },
  { name: "MARTINEZ JOSE LUIS", dni: "22942132" },
  { name: "HERNANDEZ JOSE ALBERTO", dni: "24067751" },
  { name: "CURIN RAUL ANDRES", dni: "27632068" },
  { name: "REALES ARIEL MANUEL", dni: "22483384" },
  { name: "FLORES PAULO CESAR", dni: "30643726" },
  { name: "FRELLE SERGIO ANDRES", dni: "28004768" },
  { name: "SOLORZA PABLO ERNESTO", dni: "27774207" },
  { name: "YAÑEZ HECTOR GABRIEL", dni: "27632034" },
  { name: "VILLEGAS DIEGO ANDRES", dni: "31082736" },
  { name: "CLARK JAIME ORLANDO", dni: "20237391" },
  { name: "HELGUERO MARCELO JAVIER", dni: "22437877" },
  { name: "HUENUMAN ERVIAN", dni: "18888568" },
  { name: "ROJOS ANGEL SEBASTIAN", dni: "28809908" },
  { name: "CABERO CRISTIAN SEBASTIAN", dni: "34869628" },
  { name: "CARCAMO GOMEZ WALTER EDUARDO", dni: "33226145" },
  { name: "GONZALEZ PABLO DARIO", dni: "27632001" },
  { name: "HUEITRA VICTOR ALEJANDRO", dni: "28703003" },
  { name: "NAHUELHUAL RAUL ROBERTO", dni: "22683644" },
  { name: "PINO JOSE LUIS", dni: "25655446" },
  { name: "SCHWENKE CARLOS SEBASTIAN", dni: "32086477" },
  { name: "ZAMBRANO VICTOR RAUL", dni: "20111050" },
  { name: "VASQUEZ TOLEDO FREDDY", dni: "92477916" },
  { name: "BARRIENTOS GERARDO", dni: "24794145" },
  { name: "CASTRO DARIO HORACIO", dni: "24245943" },
  { name: "FUNES GERARDO", dni: "25272279" },
  { name: "HERNANDEZ JORGE LUIS", dni: "20645050" },
  { name: "VERA ANDRES", dni: "28702853" },
  { name: "VILLARROEL CESAR AUGUSTO", dni: "29920043" },
  { name: "CURIN DOMINGO", dni: "25102466" },
  { name: "VERA SANDRA BEATRIZ", dni: "23484019" },
  { name: "MARZENIUK RODRIGO NEYEN", dni: "39883184" },
  { name: "FLORES CARLOS DANIEL", dni: "34869893" },
  { name: "CRUZ DIEGO GASTON", dni: "28004869" },
  { name: "BEROIZA PEDRO ANIBAL", dni: "31755613" },
  { name: "CONTRERAS ALBERTO SEBASTIAN", dni: "34800861" },
  { name: "MARTINEZ ENZO GABRIEL", dni: "39882967" },
  { name: "SCHNIEPP ENZO RAMON", dni: "40986048" },
  { name: "ORTIZ RAUL ALFREDO", dni: "25030764" },
  { name: "ANDRADE JORGE ARIEL", dni: "24880880" },
  { name: "MASO GUILLERMO JAVIER", dni: "22632488" },
  { name: "MORALES LUIS ALBERTO", dni: "25697316" },
  { name: "CARTER JORGE MARTIN", dni: "29090333" },
  { name: "PACHECO ROBERTO DOMINGO", dni: "29774854" },
  { name: "PUJATO FABIO JAVIER CEFERIN", dni: "21554973" },
  { name: "PEREZ CARLOS FABIAN", dni: "22333951" },
  { name: "AVENDAÑO MARIO FABIAN", dni: "28686864" },
  { name: "MENDOZA EDUARDO DAVID", dni: "27177235" },
  { name: "TRIPAY ENRIQUE", dni: "21908504" },
  { name: "NAVARRO JUAN ALEJANDRO", dni: "23322685" },
  { name: "VILLAGRAN ADRIAN FERNANDO", dni: "24414123" },
  { name: "SOSA CARLOS ALBERTO", dni: "26377658" },
  { name: "CORTEZ GASTON", dni: "25011651" },
  { name: "RIVERO CLAUDIO DANIEL", dni: "35658976" },
  { name: "ANGULO PABLO DAVID", dni: "30008319" },
  { name: "AVENDAÑO SERGIO SEBASTIAN", dni: "35383929" },
  { name: "MENDOZA GERARDO DANIEL", dni: "29774857" },
  { name: "MORENO YANINA", dni: "32697562" },
  { name: "SALAZAR DIEGO MARTIN", dni: "28075654" },
  { name: "SID LUCAS ALEJANDRO", dni: "36393293" },
  { name: "SALAZAR EDUARDO INOCENCIO", dni: "33574776" },
  { name: "SOSA IVO MARIANO HERNAN", dni: "43004173" },
  { name: "MENDEZ ANDRES DANIEL", dni: "26344581" },
  { name: "ROSALES FABIO GUSTAVO", dni: "29239211" },
  { name: "QUINTEROS VICTOR HUGO", dni: "29239231" },
  { name: "RIVERO ALEJANDRO GABRIEL", dni: "36719003" },
  { name: "VEGA FLAVIA NATALIA", dni: "35241177" },
  { name: "AVALO GONZALO JAVIER", dni: "36988270" },
  { name: "MASO GONZALO ARIEL", dni: "44411144" },
  { name: "FUENTEALBA LEANDRO RICARDO", dni: "31350731" },
  { name: "GONZALEZ CLAUDIO ROBERTO", dni: "29774992" },
  { name: "DE URIBARRI RAFAEL", dni: "29585789" },
  { name: "VILLAFAÑE MIGUEL FERNANDO", dni: "25011796" },
  { name: "CALBUCOY ADOLFO SEBASTIAN", dni: "29945014" },
  { name: "CASTRO GABRIEL ALEJANDRO", dni: "28075691" },
  { name: "DORADO MATIAS EMANUEL", dni: "44753526" },
  { name: "GALLARDO TIZIANA MELISA", dni: "44084192" },
  { name: "ARGEL MAURICIO ARIEL", dni: "36307380" },
  { name: "GONZALEZ JESUS FERNANDO", dni: "38470431" },
  { name: "CARTER MAGALI SABRINA", dni: "44083785" },
  { name: "CASTRO MARCO AURELIO", dni: "30325108" },
  { name: "MANSILLA JUAN FERNANDO", dni: "27699133" },
  { name: "VARGAS LUIS ALEJANDRO", dni: "36181263" },
  { name: "CARTER MARCOS EDUARDO", dni: "31985847" },
  { name: "BARRERA BRUNO EZEQUIEL", dni: "36106196" },
  { name: "TAPIA VICTOR HUGO", dni: "22632934" },
  { name: "QUINTEROS RAUL ADRIAN", dni: "30661306" },
  { name: "CALO FERNANDA BEATRIZ", dni: "30853715" },
  { name: "BARROS DAVID EDUARDO", dni: "32233657" },
  { name: "HOMOLA ROQUE DAVID", dni: "33930089" },
  { name: "ALMONACID ROBERTO JOSE LUIS", dni: "32245102" },
  { name: "ANDRADE ADRIAN GUILLERMO", dni: "25901081" },
  { name: "ANTELO AUGUSTO EZEQUIEL", dni: "25801665" },
  { name: "CARO LUIS ADRIAN", dni: "35659371" },
  { name: "CHANAMPA JUAN CARLOS", dni: "33619533" },
  { name: "GONZALEZ LUIS ALBERTO", dni: "27277671" },
  { name: "LIRIO MAXIMILIANO ANDRES", dni: "41722099" },
  { name: "MAMANI VICTOR ALEJANDRO", dni: "26996137" },
  { name: "RUARTE EMMANUEL ARNALDO", dni: "30773284" },
  { name: "SANTANA JUSTINO ERNESTO", dni: "19039669" },
  { name: "VILLEGAS NESTOR MARIANO", dni: "27198090" },
  { name: "BARRIA MANUEL EDUARDO", dni: "34664916" },
  { name: "FISCELLA SILVANA", dni: "17129225" },
  { name: "FISCELLA DANIEL ALEJANDRO", dni: "22470050" },
  { name: "HERNANDEZ GUSTAVO JAVIER", dni: "17129147" },
  { name: "LAFFEUILLADE ROBERTO OSCAR", dni: "28075819" },
  { name: "ESPINOSA AUGUSTO JUAN RAMON", dni: "37532716" },
  { name: "SEGOVIA FERNANDO MANUEL", dni: "25901036" },
  { name: "FILLASTRE BRENDA DAIANA", dni: "36911717" },
  { name: "TACON MARCOS NICOLAS", dni: "35047405" },
  { name: "BIN MIGUEL ANGEL", dni: "28611879" },
  { name: "SORIA CLAUDIA ELIZABETH", dni: "26633127" },
  { name: "VILLEGAS PAULA AGOSTINA", dni: "38807763" },
  { name: "GOMEZ NANCY NOEMI", dni: "26857242" },
  { name: "SALAS CARLOS GABRIEL", dni: "22345731" }
];

// System instruction to guide the bot's behavior
const SYSTEM_INSTRUCTION = `
HOY ES: ${currentDate}.
AÑO: 2025.

EMPLEADOS:
${JSON.stringify(EMPLOYEE_DB)}

ERES: Asistente RR.HH.

OBJETIVO: Recolectar datos para licencia por francos.

FLUJO (Estricto):
1. **Identificación**: Pide nombre. Valida contra EMPLEADOS.
   - Si existe: Confirma "¿Eres [Nombre] DNI [DNI]?". Si SÍ -> Paso 2. Si NO -> Reintenta.
   - Si NO existe: "No figuras en el listado habilitado. Contacta a RR.HH." -> FIN.
2. **Supervisor**: "¿Acordaste con supervisor?".
   - SÍ -> Paso 3.
   - NO -> "Debes acordar antes. Vuelve cuando definas." -> FIN.
3. **Cantidad días**.
4. **Fechas origen**: "¿Qué fechas trabajaste para generar estos francos?". (1 fecha por cada día pedido).
5. **Fecha inicio licencia**.
6. **DNI** (Solo si no se confirmó en paso 1).
7. **Comentarios**.
   - **IMPORTANTE**: ANTES de este paso, NO hagas un resumen detallado con viñetas de todos los datos (nombre, dni, fechas, etc.). SE VE CONFUSO.
   - Simplemente confirma el último dato recibido y pregunta: "Perfecto. ¿Deseas agregar algún comentario adicional a la solicitud?".

SALIDA FINAL JSON (Solo al completar):
{
  "subject": "Solicitud Francos - [Nombre]",
  "formalEmail": "Solicito [X] días... (Detalles completos)",
  "summaryStatus": "Lista para [Nombre]",
  "extractedData": { ... }
}
`;

let chatSession: Chat | null = null;

export const startChatSession = (): Chat => {
  if (!ai) {
    throw new Error("API Key faltante o inválida.");
  }
  
  // Usamos gemini-2.0-flash-exp por ser el más performante y actualizado para esta tarea
  chatSession = ai.chats.create({
    model: 'gemini-2.0-flash-exp',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
  return chatSession;
};

// Exponential backoff helper
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendMessageToBot = async (message: string): Promise<{ text: string; completedJson?: AIResponse }> => {
  if (!ai) {
     return { text: "Error: Falta API Key." };
  }
  
  if (!chatSession) {
    try {
        startChatSession();
    } catch(e) {
        return { text: "Error de conexión: API Key no válida." };
    }
  }

  // Aumentamos los reintentos para evitar errores de red/cuota visibles al usuario
  const MAX_RETRIES = 5; 
  let attempt = 0;
  let lastError: any = null;

  while (attempt <= MAX_RETRIES) {
    try {
      const response = await chatSession!.sendMessage({ message });
      const text = response.text || "";

      try {
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        if (cleanText.startsWith('{') && cleanText.endsWith('}')) {
          const jsonResponse = JSON.parse(cleanText) as AIResponse;
          return { text: "", completedJson: jsonResponse };
        }
      } catch (e) {
        // Not JSON
      }

      return { text: text };

    } catch (error: any) {
      lastError = error;
      console.warn(`Attempt ${attempt + 1} failed:`, error.message);

      const isOverloaded = error.message?.includes('503') || error.message?.includes('overloaded') || error.message?.includes('UNAVAILABLE');
      const isQuota = error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED');

      if ((isOverloaded || isQuota) && attempt < MAX_RETRIES) {
        // Backoff exponencial para dar tiempo al servidor de liberar recursos
        const delayTime = 1000 * Math.pow(2, attempt); 
        await wait(delayTime);
        attempt++;
        continue;
      } else {
        break;
      }
    }
  }

  // Mensaje más amigable en caso de falla persistente
  if (lastError?.message?.includes('429') || lastError?.message?.includes('quota')) {
    return { text: "⏳ **Alta demanda.** El servidor está procesando muchas solicitudes. Por favor, intenta enviar tu mensaje nuevamente." };
  }
  
  if (lastError?.message?.includes('503') || lastError?.message?.includes('overloaded')) {
    return { text: "⚠️ El servidor está momentáneamente ocupado. Por favor, intenta de nuevo en unos instantes." };
  }

  return { text: "Error de conexión. Verifica tu internet." };
};
