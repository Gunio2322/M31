/**
 * M31-AAAX4440G — REST API (Express) nad Modbus TCP (modbus-serial)
 *
 * Adresy rejestrów wg instrukcji Ebyte M31 series:
 *  - DI1-DI4  : FC 0x02, adres 0x0000, 4 kanały (bity)
 *  - DO1-DO4  : FC 0x01 (odczyt) / 0x05,0x0F (zapis), adres 0x0000, 4 kanały (bity)
 *  - AI1-AI4  : FC 0x04, adres 0x0000 (int 0-20000=0-20mA), 4 kanały (16-bit)
 *  - AI1-AI4  : FC 0x04, adres 0x03E8 (float, 2 rej./kanał, wartość w mA)
 */

const express = require('express');
const ModbusRTU = require('modbus-serial');

const app = express();
app.use(express.json());

// ---- Konfiguracja połączenia z urządzeniem ----
const DEVICE_IP = process.env.M31_IP || '192.168.3.7';
const DEVICE_PORT = parseInt(process.env.M31_PORT || '502', 10);
const SLAVE_ID = parseInt(process.env.M31_SLAVE_ID || '1', 10);

const client = new ModbusRTU();
let connected = false;

// ---- Adresy rejestrów (hex) — 1:1 z tabelami z instrukcji Ebyte M31 ----
const ADDR = {
  DI: 0x0000,        // DI1-DI4, FC 0x02, Zone 1
  DO: 0x0000,        // DO1-DO4, FC 0x01 (odczyt) / 0x05,0x0F (zapis), Zone 0
  AI_INT: 0x0000,    // AI1-AI4 (wartość całkowita 0-20000), FC 0x04, Zone 3
  AI_FLOAT: 0x03E8,  // AI1-AI4 (float, 2 rej./kanał), FC 0x04, Zone 3
  DO_CHANNELS: { 1: 0x0000, 2: 0x0001, 3: 0x0002, 4: 0x0003 }, // pojedyncze DO
};

async function connectDevice() {
  try {
    await client.connectTCP(DEVICE_IP, { port: DEVICE_PORT });
    client.setID(SLAVE_ID);
    client.setTimeout(2000);
    connected = true;
    console.log(`[Modbus] Połączono z ${DEVICE_IP}:${DEVICE_PORT}, slave ID=${SLAVE_ID}`);
  } catch (err) {
    connected = false;
    console.error('[Modbus] Błąd połączenia:', err.message);
    // ponów próbę po 5s
    setTimeout(connectDevice, 5000);
  }
}
connectDevice();

// Middleware: upewnij się, że jest połączenie przed każdym żądaniem do urząbuf.writeUInt16BE(lo, 2); zapisuje wartość lo od pozycji 2, ponieważ pierwszy rejestr zajmuje bajty 0 i 1. W ten sposób dwa rejestry 16-bitowe wypełniają cały bufor o rozmiarze 4 bajtów, który może następnie zostać odczytany jako jedna 32-bitowa liczba typu float.dzenia
async function ensureConnected(req, res, next) {
  if (!connected || !client.isOpen) {
    return res.status(503).json({ error: 'Brak połączenia z urządzeniem Modbus' });
  }
  next();
}

// ================== DI — odczyt wejść cyfrowych ==================
// GET /api/di  -> { DI1: bool, DI2: bool, DI3: bool, DI4: bool }
app.get('/api/di', ensureConnected, async (req, res) => {
  try {
    const result = await client.readDiscreteInputs(ADDR.DI, 4);
    const bits = result.data; // tablica bool [DI1, DI2, DI3, DI4]
    res.json({
      DI1: bits[0],
      DI2: bits[1],
      DI3: bits[2],
      DI4: bits[3],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ================== DO — odczyt stanu wyjść ==================
// GET /api/do -> { DO1: bool, DO2: bool, DO3: bool, DO4: bool }
app.get('/api/do', ensureConnected, async (req, res) => {
  try {
    const result = await client.readCoils(ADDR.DO, 4);
    const bits = result.data;
    res.json({
      DO1: bits[0],
      DO2: bits[1],
      DO3: bits[2],
      DO4: bits[3],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ================== DO — sterowanie pojedynczym wyjściem ==================
// POST /api/do/:channel   body: { "state": true|false }
// channel: 1-4
app.post('/api/do/:channel', ensureConnected, async (req, res) => {
  const channel = parseInt(req.params.channel, 10);
  const { state } = req.body;

  if (![1, 2, 3, 4].includes(channel)) {
    return res.status(400).json({ error: 'Kanał DO musi być w zakresie 1-4' });
  }
  if (typeof state !== 'boolean') {
    return res.status(400).json({ error: 'Pole "state" musi być typu boolean (true/false)' });
  }

  try {
    // Mapa adresów zgodna 1:1 z tabelą rejestrów DO z instrukcji (hex)
    const address = ADDR.DO_CHANNELS[channel];
    await client.writeCoil(address, state);
    res.json({ channel: `DO${channel}`, state });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ================== DO — sterowanie wszystkimi wyjściami naraz ==================
// POST /api/do   body: { "states": [true, false, true, false] }  // DO1..DO4
app.post('/api/do', ensureConnected, async (req, res) => {
  const { states } = req.body;
  if (!Array.isArray(states) || states.length !== 4) {
    return res.status(400).json({ error: 'Pole "states" musi być tablicą 4 wartości boolean [DO1,DO2,DO3,DO4]' });
  }
  try {
    await client.writeCoils(ADDR.DO, states);
    res.json({ DO1: states[0], DO2: states[1], DO3: states[2], DO4: states[3] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ================== AI — odczyt wartości całkowitej (0-20000 = 0-20mA) ==================
// GET /api/ai -> { AI1: {raw, mA}, AI2: {...}, ... }
app.get('/api/ai', ensureConnected, async (req, res) => {
  try {
    const result = await client.readInputRegisters(ADDR.AI_INT, 4);
    const regs = result.data; // [AI1, AI2, AI3, AI4] jako uint16
    const out = {};
    regs.forEach((raw, i) => {
      out[`AI${i + 1}`] = { raw, mA: +(raw / 1000).toFixed(3) };
    });
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// ================== AI — odczyt wartości zmiennoprzecinkowej (mA, IEEE754) ==================
// GET /api/ai/float -> { AI1: mA, AI2: mA, AI3: mA, AI4: mA }
app.get('/api/ai/float', ensureConnected, async (req, res) => {
  try {
    // AI1 float od 0x03E8, 2 rejestry na kanał, 4 kanały = 8 rejestrów
    const result = await client.readInputRegisters(ADDR.AI_FLOAT, 8);
    const regs = result.data;
    const out = {};
    for (let ch = 0; ch < 4; ch++) {
      const hi = regs[ch * 2];
      const lo = regs[ch * 2 + 1];
      const buf = Buffer.alloc(4);
      buf.writeUInt16BE(hi, 0);
      buf.writeUInt16BE(lo, 2);
      out[`AI${ch + 1}`] = +buf.readFloatBE(0).toFixed(3);
    }
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ================== Zbiorczy odczyt wszystkiego naraz ==================
// GET /api/status -> DI + DO + AI w jednej odpowiedzi
app.get('/api/status', ensureConnected, async (req, res) => {
  try {
    const [diRes, doRes, aiRes] = await Promise.all([
      client.readDiscreteInputs(ADDR.DI, 4),
      client.readCoils(ADDR.DO, 4),
      client.readInputRegisters(ADDR.AI_INT, 4),
    ]);

    const di = diRes.data;
    const doState = doRes.data;
    const ai = aiRes.data;

    res.json({
      DI: { DI1: di[0], DI2: di[1], DI3: di[2], DI4: di[3] },
      DO: { DO1: doState[0], DO2: doState[1], DO3: doState[2], DO4: doState[3] },
      AI: {
        AI1: +(ai[0] / 1000).toFixed(3),
        AI2: +(ai[1] / 1000).toFixed(3),
        AI3: +(ai[2] / 1000).toFixed(3),
        AI4: +(ai[3] / 1000).toFixed(3),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ================== Healthcheck ==================
app.get('/api/health', (req, res) => {
  res.json({ connected, device: `${DEVICE_IP}:${DEVICE_PORT}`, slaveId: SLAVE_ID });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer nasłuchuje na porcie ${PORT}`);
});