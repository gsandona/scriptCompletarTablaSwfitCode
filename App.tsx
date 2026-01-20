
import React, { useState, useMemo } from 'react';
import { 
  FileCode, 
  Play, 
  Settings, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  ClipboardCopy, 
  Database,
  FileSpreadsheet,
  Trash2,
  BookOpen
} from 'lucide-react';
import { CodePreview } from './components/CodePreview';
import { ProcessorSimulator } from './components/ProcessorSimulator';
import { getDotNetCode } from './services/dotNetTemplates';

type ViewMode = 'CODE' | 'SIMULATOR' | 'DOCUMENTATION';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('CODE');
  const [dbConnectionString, setDbConnectionString] = useState('Server=localhost;Database=BanksDB;Trusted_Connection=True;');
  const [localPath, setLocalPath] = useState('C:\\SwiftImports');

  const dotNetFiles = useMemo(() => getDotNetCode(dbConnectionString, localPath), [dbConnectionString, localPath]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white border-b border-slate-700 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">SwiftCode Processor Studio</h1>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">.NET Core Engine</p>
          </div>
        </div>
        <nav className="flex gap-1 bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => setView('CODE')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${view === 'CODE' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
          >
            <FileCode size={18} />
            <span>Generar Script</span>
          </button>
          <button 
            onClick={() => setView('SIMULATOR')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${view === 'SIMULATOR' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
          >
            <Play size={18} />
            <span>Simulador</span>
          </button>
          <button 
            onClick={() => setView('DOCUMENTATION')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${view === 'DOCUMENTATION' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
          >
            <BookOpen size={18} />
            <span>Guía de Uso</span>
          </button>
        </nav>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Settings */}
        <aside className="w-80 bg-white border-r border-slate-200 overflow-y-auto hidden lg:block">
          <div className="p-6 space-y-8">
            <section>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Settings size={16} /> Configuración .NET
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Directorio de Excels</label>
                  <input 
                    type="text" 
                    value={localPath}
                    onChange={(e) => setLocalPath(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="C:\Documentos\Excel"
                  />
                  <p className="mt-1 text-xs text-slate-500 italic">Ruta local donde residen los archivos .xlsx</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cadena de Conexión SQL</label>
                  <textarea 
                    rows={3}
                    value={dbConnectionString}
                    onChange={(e) => setDbConnectionString(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    placeholder="Server=..."
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Trash2 size={16} /> Reglas del Negocio
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                  <span>Limpieza de tabla antes de procesar.</span>
                </li>
                <li className="flex gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                  <span>Carga recursiva de archivos en carpeta.</span>
                </li>
                <li className="flex gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                  <span>Validación de SwiftCode único.</span>
                </li>
                <li className="flex gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                  <span>Autocompletar nombre de país (ISO Alpha2).</span>
                </li>
              </ul>
            </section>

            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <h4 className="text-indigo-900 font-semibold text-sm mb-2 flex items-center gap-2">
                <AlertCircle size={16} /> Requerimientos NuGet
              </h4>
              <ul className="text-xs text-indigo-700 space-y-1 font-mono">
                <li>• ClosedXML</li>
                <li>• Dapper</li>
                <li>• Microsoft.Data.SqlClient</li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="p-8">
            {view === 'CODE' && (
              <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-800">Código .NET Generado</h2>
                  <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase">v1.0 Standard</div>
                </div>
                <CodePreview files={dotNetFiles} />
              </div>
            )}

            {view === 'SIMULATOR' && (
              <div className="max-w-5xl mx-auto space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Simulador de Procesamiento</h2>
                <ProcessorSimulator />
              </div>
            )}

            {view === 'DOCUMENTATION' && (
              <div className="max-w-4xl mx-auto prose prose-slate bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
                <h1 className="text-slate-900">Guía de Implementación SwiftCode</h1>
                <p>Este sistema está diseñado para facilitar la importación masiva de datos bancarios desde archivos Excel hacia una base de datos SQL Server, asegurando la integridad de los datos y la consistencia geográfica.</p>
                
                <h3>Pasos para la ejecución</h3>
                <ol>
                  <li><strong>Crear el Proyecto:</strong> Crea una consola de C# (.NET Core 6.0+) con <code>dotnet new console</code>.</li>
                  <li><strong>Librerías:</strong> Instala las dependencias necesarias:
                    <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg mt-2 overflow-x-auto">
{`dotnet add package ClosedXML
dotnet add package Dapper
dotnet add package Microsoft.Data.SqlClient`}
                    </pre>
                  </li>
                  <li><strong>Archivos:</strong> Copia el contenido de <code>Program.cs</code>, <code>SwiftModel.cs</code> y <code>DatabaseManager.cs</code> generados en la pestaña "Generar Script".</li>
                  <li><strong>Carpeta Local:</strong> Asegúrate de que la carpeta definida en la configuración exista y tenga permisos de lectura.</li>
                </ol>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
                  <h4 className="text-amber-900 mt-0">Nota sobre el País</h4>
                  <p className="text-amber-800 text-sm mb-0">El script incluye un diccionario estático interno para mapear el <code>Alpha2Code</code> (ej: 'IT') al nombre completo ('ITALY') de forma automática, cumpliendo con el requerimiento de autocompletado.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
