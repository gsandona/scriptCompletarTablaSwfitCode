
import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Terminal, 
  Copy, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Database,
  FileText,
  AlertTriangle,
  Layers,
  Banknote,
  FileDown
} from 'lucide-react';

// Diccionario de Países para SwiftCodes
const COUNTRY_MAP: Record<string, string> = {
  'AD': 'ANDORRA', 'AE': 'UNITED ARAB EMIRATES', 'AF': 'AFGHANISTAN', 'AL': 'ALBANIA', 'AM': 'ARMENIA', 
  'AO': 'ANGOLA', 'AR': 'ARGENTINA', 'AT': 'AUSTRIA', 'AU': 'AUSTRALIA', 'AZ': 'AZERBAIJAN', 
  'BA': 'BOSNIA AND HERZEGOVINA', 'BB': 'BARBADOS', 'BD': 'BANGLADESH', 'BE': 'BELGIUM', 'BF': 'BURKINA FASO', 
  'BG': 'BULGARIA', 'BH': 'BAHRAIN', 'BJ': 'BENIN', 'BM': 'BERMUDA', 'BN': 'BRUNEI', 'BR': 'BRAZIL', 
  'BS': 'BAHAMAS', 'BW': 'BOTSWANA', 'BY': 'BELARUS', 'CA': 'CANADA', 'CD': 'CONGO (DRC)', 'CG': 'CONGO', 
  'CH': 'SWITZERLAND', 'CI': 'IVORY COAST', 'CL': 'CHILE', 'CN': 'CHINA', 'CO': 'COLOMBIA', 'CW': 'CURACAO', 
  'CY': 'CYPRUS', 'CZ': 'CZECH REPUBLIC', 'DE': 'GERMANY', 'DJ': 'DJIBOUTI', 'DK': 'DENMARK', 'DO': 'DOMINICAN REPUBLIC', 
  'DZ': 'ALGERIA', 'EC': 'ECUADOR', 'EE': 'ESTONIA', 'EG': 'EGYPT', 'ES': 'SPAIN', 'ET': 'ETHIOPIA', 
  'FI': 'FINLAND', 'FK': 'FALKLAND ISLANDS', 'FO': 'FAROE ISLANDS', 'FR': 'FRANCE', 'GB': 'UNITED KINGDOM', 
  'GE': 'GEORGIA', 'GG': 'GUERNSEY', 'GH': 'GHANA', 'GI': 'GIBRALTAR', 'GM': 'GAMBIA', 'GN': 'GUINEA', 
  'GP': 'GUADELOUPE', 'GQ': 'EQUATORIAL GUINEA', 'GR': 'GREECE', 'HK': 'HONG KONG', 'HR': 'CROATIA', 
  'HU': 'HUNGARY', 'ID': 'INDONESIA', 'IE': 'IRELAND', 'IL': 'ISRAEL', 'IM': 'ISLE OF MAN', 'IN': 'INDIA', 
  'IQ': 'IRAQ', 'IR': 'IRAN', 'IS': 'ICELAND', 'IT': 'ITALY', 'JE': 'JERSEY', 'JM': 'JAMAICA', 
  'JO': 'JORDAN', 'JP': 'JAPAN', 'KE': 'KENYA', 'KG': 'KYRGYZSTAN', 'KH': 'CAMBODIA', 'KN': 'SAINT KITTS AND NEVIS', 
  'KR': 'SOUTH KOREA', 'KW': 'KUWAIT', 'KY': 'CAYMAN ISLANDS', 'KZ': 'KAZAKHSTAN', 'LA': 'LAOS', 'LB': 'LEBANON', 
  'LC': 'SAINT LUCIA', 'LI': 'LIECHTENSTEIN', 'LK': 'SRI LANKA', 'LS': 'LESOTHO', 'LT': 'LITHUANIA', 
  'LU': 'LUXEMBOURG', 'LV': 'LATVIA', 'LY': 'LIBYA', 'MA': 'MOROCCO', 'MC': 'MONACO', 'MM': 'MYANMAR', 
  'MN': 'MONGOLIA', 'MO': 'MACAU', 'MQ': 'MARTINIQUE', 'MU': 'MAURITIUS', 'MV': 'MALDIVES', 'MW': 'MALAWI', 
  'MX': 'MEXICO', 'MY': 'MALAYSIA', 'MZ': 'MOZAMBIQUE', 'NA': 'NAMIBIA', 'NC': 'NEW CALEDONIA', 'NG': 'NIGERIA', 
  'NL': 'NETHERLANDS', 'NO': 'NORWAY', 'NP': 'NEPAL', 'NZ': 'NEW ZEALAND', 'OM': 'OMAN', 'PA': 'PANAMA', 
  'PE': 'PERU', 'PF': 'FRENCH POLYNESIA', 'PH': 'PHILIPPINES', 'PK': 'PAKISTAN', 'PL': 'POLAND', 'PR': 'PUERTO RICO', 
  'PS': 'PALESTINE', 'PT': 'PORTUGAL', 'PY': 'PARAGUAY', 'QA': 'QATAR', 'RE': 'REUNION', 'RO': 'ROMANIA', 
  'RS': 'SERBIA', 'RU': 'RUSSIA', 'SA': 'SAUDI ARABIA', 'SC': 'SEYCHELLES', 'SD': 'SUDAN', 'SE': 'SWEDEN', 
  'SG': 'SINGAPORE', 'SK': 'SLOVAKIA', 'SL': 'SIERRA LEONE', 'SM': 'SAN MARINO', 'SN': 'SENEGAL', 'SO': 'SOMALIA', 
  'SR': 'SURINAME', 'SS': 'SOUTH SUDAN', 'SV': 'EL SALVADOR', 'SY': 'SYRIA', 'SZ': 'ESWATINI', 'TG': 'TOGO', 
  'TH': 'THAILAND', 'TJ': 'TAJIKISTAN', 'TM': 'TURKMENISTAN', 'TN': 'TUNISIA', 'TR': 'TURKEY', 'TT': 'TRINIDAD AND TOBAGO', 
  'TW': 'TAIWAN', 'TZ': 'TANZANIA', 'UA': 'UKRAINE', 'UG': 'UGANDA', 'US': 'UNITED STATES', 'UY': 'URUGUAY', 
  'UZ': 'UZBEKISTAN', 'VC': 'SAINT VINCENT AND THE GRENADINES', 'VE': 'VENEZUELA', 'VN': 'VIETNAM', 
  'WS': 'SAMOA', 'YE': 'YEMEN', 'ZA': 'SOUTH AFRICA', 'ZM': 'ZAMBIA', 'ZW': 'ZIMBABWE'
};

type ImportMode = 'SWIFT' | 'ABA';

interface LogEntry {
  code: string;
  name: string;
  city: string;
  stateOrCountry: string;
  reason: string;
}

const App: React.FC = () => {
  // Fix: Corrected the useState syntax by adding the missing closing angle bracket for the generic type parameter 'ImportMode'.
  const [mode, setMode] = useState<ImportMode>('SWIFT');
  const [sqlScript, setSqlScript] = useState<string>('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState({ total: 0, processed: 0, skipped: 0 });
  const [dragging, setDragging] = useState(false);

  const cleanString = (val: any, maxLen: number) => {
    if (!val) return 'NULL';
    let s = String(val).trim().replace(/'/g, "''");
    if (s.length > maxLen) s = s.substring(0, maxLen);
    return `N'${s}'`; 
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setLogs([]);
    setSqlScript('');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = (window as any).XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = (window as any).XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const processedCodes = new Set<string>();
        const generatedSql: string[] = [];
        const errorLogs: LogEntry[] = [];
        
        const tableName = mode === 'SWIFT' ? 'SwiftCodes' : 'ABACodes';
        generatedSql.push(`-- Script de importación para la tabla ${tableName}`);
        generatedSql.push(`TRUNCATE TABLE ${tableName};`);
        generatedSql.push('GO\n');

        let successCount = 0;
        let skipCount = 0;
        let totalRowsFound = 0;

        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;
          
          const firstVal = String(row[0] || '').toLowerCase();
          if (firstVal === 'bic' || firstVal === 'abacode' || firstVal.includes('routing')) continue;

          totalRowsFound++;
          let code = '', name = '', city = '', stateOrCountry = '', alpha2 = '';

          if (mode === 'SWIFT') {
            code = String(row[0] || '').trim();
            city = String(row[6] || '').trim();
            name = String(row[7] || '').trim();
            alpha2 = String(row[8] || '').trim().toUpperCase();
            stateOrCountry = alpha2;

            if (!code || !name || !city || !alpha2) {
              errorLogs.push({ code, name, city, stateOrCountry, reason: 'Faltan columnas requeridas (BIC, City, Name o Country)' });
              skipCount++; continue;
            }
          } else {
            code = String(row[0] || '').trim();
            name = String(row[2] || '').trim();
            stateOrCountry = String(row[3] || '').trim();
            city = String(row[4] || '').trim();

            if (!code || !name || !city || !stateOrCountry) {
              errorLogs.push({ code, name, city, stateOrCountry, reason: 'Datos incompletos en Excel (A, C, D o E vacíos)' });
              skipCount++; continue;
            }
          }

          if (processedCodes.has(code)) {
            errorLogs.push({ code, name, city, stateOrCountry, reason: 'Código duplicado en archivo' });
            skipCount++; continue;
          }

          let values = '';
          if (mode === 'SWIFT') {
            const fullCountry = COUNTRY_MAP[stateOrCountry] || 'UNKNOWN';
            values = [
              cleanString(code, 11),  cleanString(name, 120), cleanString(fullCountry, 50), 
              cleanString(city, 50), 'NULL', 'NULL', cleanString(stateOrCountry, 2)
            ].join(', ');
            generatedSql.push(`INSERT INTO SwiftCodes (SwiftCode, BankName, Country, City, PhysicalAddress1, PhysicalAddress2, Alpha2Code) VALUES (${values});`);
          } else {
            values = [
              cleanString(code, 9), cleanString(name, 120), cleanString(stateOrCountry, 50), 
              cleanString(city, 50), 'NULL', 'NULL'
            ].join(', ');
            generatedSql.push(`INSERT INTO ABACodes (ABACode, BankName, State, City, PhysicalAddress1, PhysicalAddress2) VALUES (${values});`);
          }
          
          processedCodes.add(code);
          successCount++;
        }

        setSqlScript(generatedSql.join('\n'));
        setLogs(errorLogs);
        setStats({ total: totalRowsFound, processed: successCount, skipped: skipCount });
      } catch (err) {
        console.error(err);
        alert("Error de procesamiento.");
      }
      setIsProcessing(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadErrorCsv = () => {
    if (logs.length === 0) return;
    
    const headers = mode === 'SWIFT' 
      ? "SwiftCode,BankName,City,CountryCode,MotivoOmitido"
      : "ABACode,BankName,State,City,MotivoOmitido";
      
    const rows = logs.map(log => 
      `"${log.code}","${log.name.replace(/"/g, '""')}","${log.city}","${log.stateOrCountry}","${log.reason}"`
    );
    
    const csvContent = "\uFEFF" + [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Omitidos_${mode}_${new Date().getTime()}.csv`;
    link.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="bg-slate-900 text-white p-4 shadow-2xl flex flex-col md:flex-row items-center justify-between px-8 border-b border-indigo-500/30 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight uppercase">FinData Studio</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">SQL Generator v3.0</p>
          </div>
        </div>

        <div className="flex bg-slate-800 p-1 rounded-2xl border border-slate-700 shadow-inner">
          <button 
            onClick={() => { setMode('SWIFT'); setSqlScript(''); setStats({total:0,processed:0,skipped:0}); setLogs([]); }}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black transition-all ${mode === 'SWIFT' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <Layers size={14} /> SWIFT
          </button>
          <button 
            onClick={() => { setMode('ABA'); setSqlScript(''); setStats({total:0,processed:0,skipped:0}); setLogs([]); }}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black transition-all ${mode === 'ABA' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <Banknote size={14} /> ABA
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
        <div className="lg:col-span-4 space-y-6 flex flex-col h-full overflow-y-auto pr-2">
          <div 
            className={`drop-zone rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center cursor-pointer bg-white shadow-xl transition-all duration-500 border-2 ${dragging ? 'active scale-[1.03] border-indigo-400 ring-4 ring-indigo-50' : 'hover:shadow-indigo-100 shadow-slate-200 border-slate-100'}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input id="file-input" type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-6 shadow-inner group-hover:scale-110 transition-transform">
              <FileSpreadsheet size={40} />
            </div>
            <h3 className="font-black text-slate-800 text-lg tracking-tight">Procesar Archivo {mode}</h3>
            <p className="text-slate-400 text-sm mt-3 px-4 leading-relaxed font-medium">Suelta aquí tu archivo Excel o CSV</p>
          </div>

          {stats.total > 0 && (
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-500">Resumen Ejecución</h4>
                <span className="text-[10px] font-bold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">{mode}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 transition-all hover:border-slate-300">
                  <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Filas</p>
                  <p className="text-2xl font-black text-slate-800 leading-none">{stats.total}</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 transition-all hover:border-emerald-300">
                  <p className="text-[9px] text-emerald-500 font-black uppercase mb-1">OK</p>
                  <p className="text-2xl font-black text-emerald-600 leading-none">{stats.processed}</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 transition-all hover:border-rose-300">
                  <p className="text-[9px] text-rose-500 font-black uppercase mb-1">Omitidos</p>
                  <p className="text-2xl font-black text-rose-600 leading-none">{stats.skipped}</p>
                </div>
              </div>
            </div>
          )}

          {logs.length > 0 && (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden flex-1 flex flex-col min-h-[300px]">
              <div className="bg-rose-500 px-6 py-4 flex items-center justify-between shadow-lg relative z-10">
                <h4 className="text-xs font-black text-white uppercase flex items-center gap-2 tracking-widest">
                  <AlertCircle size={16} /> Errores Detectados
                </h4>
                <button 
                  onClick={downloadErrorCsv}
                  title="Descargar CSV de errores"
                  className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase"
                >
                  <FileDown size={14} /> Descargar CSV
                </button>
              </div>
              <div className="overflow-y-auto divide-y divide-slate-50 flex-1 custom-scrollbar">
                {logs.map((log, i) => (
                  <div key={i} className="px-6 py-4 hover:bg-rose-50/20 transition-colors group">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[11px] font-mono font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded shadow-sm">{log.code || 'SIN CÓDIGO'}</span>
                      <span className="text-[9px] text-rose-500 font-black flex items-center gap-1 uppercase tracking-tighter bg-rose-50 px-2 py-0.5 rounded-full">
                        <AlertTriangle size={10} /> {log.reason}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate font-bold group-hover:text-slate-600">{log.name || 'N/A'}</p>
                    <p className="text-[9px] text-slate-300 mt-1 italic">{log.city}, {log.stateOrCountry}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 flex flex-col h-full overflow-hidden">
          <div className="bg-slate-900 rounded-[2.5rem] flex-1 flex flex-col shadow-2xl border border-slate-800 ring-8 ring-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800 bg-slate-900/90 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                </div>
                <div className="ml-4 flex items-center gap-2 text-slate-400 font-mono text-xs">
                  <Terminal size={14} className="text-indigo-400" />
                  <span className="opacity-70">output_import_{mode.toLowerCase()}.sql</span>
                </div>
              </div>
              <div className="flex gap-3">
                {sqlScript && (
                  <>
                    <button 
                      onClick={() => { navigator.clipboard.writeText(sqlScript); alert("Script copiado al portapapeles"); }}
                      className="p-3 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-2xl transition-all active:scale-95 border border-slate-700"
                    >
                      <Copy size={20} />
                    </button>
                    <button 
                      onClick={() => {
                        const element = document.createElement("a");
                        const file = new Blob([sqlScript], {type: 'text/plain'});
                        element.href = URL.createObjectURL(file);
                        element.download = `Import_${mode}Data_${new Date().getTime()}.sql`;
                        document.body.appendChild(element);
                        element.click();
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/30 uppercase tracking-widest active:translate-y-1"
                    >
                      <Download size={16} /> Descargar .sql
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex-1 relative overflow-hidden flex flex-col bg-[#0d1117]">
              {!sqlScript ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-700 gap-6 opacity-30">
                  <Terminal size={120} strokeWidth={0.5} className="animate-pulse" />
                  <div className="text-center">
                    <p className="text-xl font-black uppercase tracking-tighter">Esperando entrada de {mode}</p>
                    <p className="text-xs font-bold">Arrastra tu Excel para ver la magia</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-auto custom-scrollbar p-10 bg-[#0d1117]">
                  <pre className="text-[13px] leading-relaxed text-indigo-100/90 font-mono whitespace-pre selection:bg-indigo-500/50 selection:text-white">
                    <code>{sqlScript}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 p-5 bg-white border border-slate-100 rounded-3xl flex items-center gap-5 shadow-xl transition-all hover:shadow-indigo-50">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner ring-1 ring-indigo-100">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Validación de Datos Inteligente</p>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                El sistema detecta automáticamente columnas faltantes y duplicados en el código {mode}. 
                Las direcciones se fijan en <span className="font-mono text-indigo-600 bg-indigo-50 px-1 rounded">NULL</span> por diseño.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-4 text-center border-t border-slate-100 bg-white shadow-inner">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">FinData Studio • Database Migration Utility • 2024</p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 10px; height: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0d1117; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 10px; border: 3px solid #0d1117; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4a5568; }
        .drop-zone.active { border-style: solid; animation: pulse-border 2s infinite; }
        @keyframes pulse-border {
          0% { border-color: #6366f1; }
          50% { border-color: #818cf8; }
          100% { border-color: #6366f1; }
        }
      `}} />
    </div>
  );
};

export default App;
