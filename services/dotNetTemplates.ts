
export const getDotNetCode = (connectionString: string, excelPath: string) => {
  return [
    {
      name: "Program.cs",
      language: "csharp",
      content: `using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;

namespace SwiftCodeProcessor
{
    class Program
    {
        static void Main(string[] args)
        {
            string folderPath = @"${excelPath.replace(/\\/g, '\\\\')}";
            string connectionString = @"${connectionString.replace(/\\/g, '\\\\')}";
            
            Console.WriteLine("--- Iniciando SwiftCode Processor ---");

            var dbManager = new DatabaseManager(connectionString);
            var processor = new ExcelProcessor(dbManager);

            try 
            {
                // Requerimiento: Limpiar tabla antes de comenzar
                Console.WriteLine("Limpiando tabla de destino...");
                dbManager.ClearSwiftCodes();

                // Requerimiento: Procesar archivos uno a uno en carpeta local
                var files = Directory.GetFiles(folderPath, "*.xlsx");
                
                if (files.Length == 0)
                {
                    Console.WriteLine("No se encontraron archivos .xlsx en la carpeta.");
                    return;
                }

                foreach (var file in files)
                {
                    Console.WriteLine($"Procesando archivo: {Path.GetFileName(file)}");
                    processor.ProcessFile(file);
                }

                Console.WriteLine("--- Proceso Completado con Éxito ---");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error crítico: {ex.Message}");
            }
        }
    }
}`
    },
    {
      name: "SwiftModel.cs",
      language: "csharp",
      content: `namespace SwiftCodeProcessor
{
    public class SwiftCodeModel
    {
        public string SwiftCode { get; set; } // BIC en Excel
        public string BankName { get; set; }  // Institution Name en Excel
        public string Country { get; set; }   // Autocompletado desde Alpha2Code
        public string City { get; set; }      // City Name en Excel
        public string PhysicalAddress1 { get; set; }
        public string PhysicalAddress2 { get; set; }
        public string Alpha2Code { get; set; } // Country en Excel
    }
}`
    },
    {
      name: "ExcelProcessor.cs",
      language: "csharp",
      content: `using System;
using System.IO;
using System.Collections.Generic;
using ClosedXML.Excel;

namespace SwiftCodeProcessor
{
    public class ExcelProcessor
    {
        private readonly DatabaseManager _db;
        private readonly HashSet<string> _processedSwifts;
        private readonly string _logPath;

        public ExcelProcessor(DatabaseManager db)
        {
            _db = db;
            _processedSwifts = new HashSet<string>();
            _logPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "processing_log.txt");
        }

        public void ProcessFile(string filePath)
        {
            using (var workbook = new XLWorkbook(filePath))
            {
                var worksheet = workbook.Worksheet(1);
                var rows = worksheet.RangeUsed().RowsUsed();

                foreach (var row in rows)
                {
                    if (row.RowNumber() == 1) continue; // Saltar cabecera

                    // Mapeo Excel -> Clase
                    string bic = row.Cell(1).GetValue<string>();           // Columna BIC
                    string cityName = row.Cell(7).GetValue<string>();      // Columna City Name
                    string institutionName = row.Cell(8).GetValue<string>(); // Columna Institution Name
                    string countryCode = row.Cell(9).GetValue<string>();   // Columna Country (Alpha2)

                    try 
                    {
                        // 1. Validación de Unicidad
                        if (_processedSwifts.Contains(bic))
                        {
                            LogFailure(bic, institutionName, "SwiftCode duplicado en la carga actual");
                            continue;
                        }

                        // 2. Autocompletado de País
                        string countryName = CountryMapper.GetName(countryCode);

                        // 3. Crear modelo
                        var model = new SwiftCodeModel
                        {
                            SwiftCode = bic,
                            BankName = institutionName,
                            City = cityName,
                            Alpha2Code = countryCode,
                            Country = countryName,
                            PhysicalAddress1 = " ",
                            PhysicalAddress2 = "NULL"
                        };

                        // 4. Guardar en Base de Datos
                        _db.InsertSwiftCode(model);
                        _processedSwifts.Add(bic);
                    }
                    catch (Exception ex)
                    {
                        LogFailure(bic, institutionName, $"Error de sistema: {ex.Message}");
                    }
                }
            }
        }

        private void LogFailure(string bic, string bank, string reason)
        {
            string logEntry = $"[{DateTime.Now}] BIC: {bic} | Banco: {bank} | Razón: {reason}{Environment.NewLine}";
            File.AppendAllText(_logPath, logEntry);
            Console.WriteLine($"[LOG ERROR] {bic}: {reason}");
        }
    }
}`
    },
    {
      name: "DatabaseManager.cs",
      language: "csharp",
      content: `using System.Data;
using Microsoft.Data.SqlClient;
using Dapper;

namespace SwiftCodeProcessor
{
    public class DatabaseManager
    {
        private readonly string _connectionString;

        public DatabaseManager(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void ClearSwiftCodes()
        {
            using (IDbConnection db = new SqlConnection(_connectionString))
            {
                db.Execute("DELETE FROM SwiftCodes");
            }
        }

        public void InsertSwiftCode(SwiftCodeModel model)
        {
            string sql = @"INSERT INTO SwiftCodes (SwiftCode, BankName, Country, City, PhysicalAddress1, PhysicalAddress2, Alpha2Code) 
                           VALUES (@SwiftCode, @BankName, @Country, @City, @PhysicalAddress1, @PhysicalAddress2, @Alpha2Code)";
            
            using (IDbConnection db = new SqlConnection(_connectionString))
            {
                db.Execute(sql, model);
            }
        }
    }
}`
    },
    {
      name: "CountryMapper.cs",
      language: "csharp",
      content: `using System.Collections.Generic;

namespace SwiftCodeProcessor
{
    public static class CountryMapper
    {
        private static readonly Dictionary<string, string> Countries = new Dictionary<string, string>
        {
            { "RS", "SERBIA" },
            { "KW", "KUWAIT" },
            { "FR", "FRANCE" },
            { "IT", "ITALY" },
            { "ES", "SPAIN" },
            { "US", "UNITED STATES" },
            { "BG", "BULGARIA" },
            { "TH", "THAILAND" },
            { "FI", "FINLAND" }
            // Agregar más mapeos según sea necesario
        };

        public static string GetName(string alpha2Code)
        {
            if (string.IsNullOrEmpty(alpha2Code)) return "UNKNOWN";
            return Countries.TryGetValue(alpha2Code.ToUpper(), out string name) ? name : "UNKNOWN";
        }
    }
}`
    }
  ];
};
