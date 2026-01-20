
import React, { useState } from 'react';
import { 
  Terminal, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter,
  FileText,
  Trash2,
  // Added missing icon imports
  Play,
  Database
} from 'lucide-react';

interface LogEntry {
  type: 'SUCCESS' | 'ERROR' | 'INFO';
  message: string;
  details?: string;
  timestamp: string;
}

const DUMMY_EXCEL_DATA = [
  { bic: 'AAAARSBGXXX', city: 'BEOGRAD', institution: 'YETTEL BANK AD', country: 'RS' },
  { bic: 'AAACKWKWXXX', city: 'KUWAIT', institution: 'AL MUZAINI EXCHANGE CO. KSCC', country: 'KW' },
  { bic: 'AAADFRP1XXX', city: 'PARIS', institution: 'ABN AMRO INVESTMENT SOLUTIONS', country: 'FR' },
  { bic: 'AAACKWKWXXX', city: 'KUWAIT', institution: 'DUPLICATE BANK', country: 'KW' }, // Intended duplicate
  { bic: 'INVALID', city: 'NULL CITY', institution: 'BROKEN BANK', country: 'XX' }, // Intended error
];

const COUNTRY_MAP: Record<string, string> = {
  'RS': 'SERBIA',
  'KW': 'KUWAIT',
  'FR': 'FRANCE',
  'IT': 'ITALY',
  'ES': 'SPAIN',
  'US': 'UNITED STATES'
};

export const ProcessorSimulator: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedItems, setProcessedItems] = useState<any[]>([]);

  const runSimulation = () => {
    setIsProcessing(true);
    setLogs([]);
    setProcessedItems([]);

    const newLogs: LogEntry[] = [];
    const items: any[] = [];
    const seenSwifts = new Set<string>();

    const addLog = (type: LogEntry['type'], msg: string, details?: string) => {
      newLogs.push({
        type,
        message: msg,
        details,
        timestamp: new Date().toLocaleTimeString()
      });
    };

    setTimeout(() => {
      addLog('INFO', 'Iniciando proceso...', 'Limpiando tabla SwiftCodes en BD');
      addLog('INFO', 'Leyendo carpeta local...', 'Encontrado file_1.xlsx');

      DUMMY_EXCEL_DATA.forEach((row, index) => {
        if (row.bic === 'INVALID') {
          addLog('ERROR', `Error en línea ${index + 1}`, `Motivo: Formato BIC inválido (${row.bic})`);
          return;
        }

        if (seenSwifts.has(row.bic)) {
          addLog('ERROR', `Error en línea ${index + 1}`, `Motivo: SwiftCode duplicado (${row.bic}). Saltando registro.`);
          return;
        }

        const countryName = COUNTRY_MAP[row.country] || 'UNKNOWN';
        
        seenSwifts.add(row.bic);
        items.push({
          ...row,
          countryName
        });
        addLog('SUCCESS', `Procesado: ${row.bic}`, `Mapeado a ${countryName}`);
      });

      addLog('INFO', 'Proceso finalizado.', `Total exitosos: ${items.length} | Errores: ${newLogs.filter(l => l.type === 'ERROR').length}`);
      setLogs(newLogs);
      setProcessedItems(items);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Left Column: Control & Results */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Upload size={20} className="text-indigo-600" /> Control de Ejecución
            </h3>
            <button 
              onClick={runSimulation}
              disabled={isProcessing}
              className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md ${
                isProcessing 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
              }`}
            >
              <Play size={18} fill="currentColor" />
              {isProcessing ? 'Procesando...' : 'Ejecutar Importación'}
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs overflow-hidden h-[400px] flex flex-col">
            <div className="flex items-center gap-2 mb-3 text-slate-500 border-b border-slate-800 pb-2">
              <Terminal size={14} />
              <span>LOG DE CONSOLA (SIMULADO)</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-700 pr-2">
              {logs.length === 0 && (
                <div className="text-slate-600 italic">Esperando ejecución...</div>
              )}
              {logs.map((log, i) => (
                <div key={i} className={`flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300`}>
                  <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                  <div className="flex-1">
                    <span className={`font-bold mr-2 ${
                      log.type === 'ERROR' ? 'text-red-400' : 
                      log.type === 'SUCCESS' ? 'text-emerald-400' : 'text-sky-400'
                    }`}>
                      {log.type}:
                    </span>
                    <span className="text-slate-300">{log.message}</span>
                    {log.details && <div className="text-slate-500 mt-0.5 ml-2 text-[10px] italic">→ {log.details}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: DB View Preview */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Database size={20} className="text-indigo-600" /> Vista Previa Tabla: SwiftCodes
            </h3>
            <span className="text-xs text-slate-400 font-mono">COUNT: {processedItems.length}</span>
          </div>

          <div className="flex-1 border rounded-xl overflow-hidden bg-slate-50">
            <table className="w-full text-sm text-left">
              <thead className="bg-white border-b text-slate-500 font-medium uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">SwiftCode</th>
                  <th className="px-4 py-3">BankName</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">City</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {processedItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-slate-400 italic">
                      <div className="flex flex-col items-center gap-2">
                        <Filter size={24} className="opacity-20" />
                        Tabla vacía. Inicia el proceso.
                      </div>
                    </td>
                  </tr>
                ) : (
                  processedItems.map((item, i) => (
                    <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-indigo-600">{item.bic}</td>
                      <td className="px-4 py-3 text-slate-600 truncate max-w-[150px]">{item.institution}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold">{item.countryName}</span></td>
                      <td className="px-4 py-3 text-slate-500">{item.city}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <div className="text-xs text-red-800">
              <strong>Nota Importante:</strong> El simulador omite registros con SwiftCode repetido automáticamente, tal como se especifica en los requerimientos.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
