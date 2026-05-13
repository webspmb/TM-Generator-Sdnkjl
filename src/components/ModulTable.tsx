import { Download, ChevronLeft, FileText, Printer } from 'lucide-react';
import { GeneratedModul, ModulFormData } from '../types';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ModulTableProps {
  data: GeneratedModul;
  formInput: ModulFormData;
  onBack: () => void;
}

export default function ModulTable({ data, formInput, onBack }: ModulTableProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const downloadWord = () => {
    if (!containerRef.current) return;
    const content = containerRef.current.innerHTML;
    const schoolName = data.identitas.schoolName || "DOKUMEN ASLI"; // Fallback jika kosong
    
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>RPPM</title>
      <style>
        @page { size: A4; margin: 2cm; }
        body { font-family: 'Times New Roman', serif; position: relative; }
        table { border-collapse: collapse; width: 100%; border: 1px solid black; }
        td, th { border: 0.5pt solid black; padding: 8px; font-size: 11pt; vertical-align: top; }
        .text-justify { text-align: justify; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .uppercase { text-transform: uppercase; }
        .bg-mint-50 { background-color: #f0fdf9 !important; }
        .bg-slate-100 { background-color: #f1f5f9 !important; }
        .italic { font-style: italic; }
        .spreadsheet-table { border: 0.5pt solid black; width: 100%; }
        .spreadsheet-table td { border: 0.5pt solid black; padding: 8px; }
        
        /* Watermark khusus Word */
        .watermark-word {
          position: fixed;
          top: 50%;
          left: 0;
          width: 100%;
          text-align: center;
          font-size: 60pt;
          color: #eeeeee;
          transform: rotate(-45deg);
          z-index: -1;
          opacity: 0.5;
        }
      </style></head><body>
      <div class="watermark-word">${schoolName}</div>
      ${content}
      </body></html>`;
    const cleanedSource = header.replace(/className=/g, 'class=');
    
    const blob = new Blob(['\ufeff', cleanedSource], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RPPM_${formInput.subject || 'Dokumen'}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    setShowExportOptions(false);
    setTimeout(() => {
      window.print();
    }, 250);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32 px-4 relative">
      {/* CSS Watermark untuk Print Browser */}
      <style dangerouslySetInnerHTML={{ __html: `
  @media print {
    .print-watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 5.5rem;
      font-weight: 900;
      color: rgba(220, 220, 220, 0.15) !important;
      z-index: -1;
      pointer-events: none;
      white-space: nowrap;
      display: block !important;
      text-transform: uppercase;
      -webkit-print-color-adjust: exact;
    }
    .no-print { display: none !important; }
    @page { margin: 1.5cm; }
    body { background: white !important; -webkit-print-color-adjust: exact; }
  }

  .print-watermark { display: none; }
  .spreadsheet-table { width: 100%; border-collapse: collapse; margin-top: 4px; }
  .spreadsheet-table td { border: 1px solid #cbd5e1; padding: 8px; }
  
  @media screen {
    .bg-white {
      min-height: 29.7cm; /* Tinggi minimal A4 */
      width: 21cm;        /* Lebar A4 */
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 2rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); 
      overflow: visible; /* Biarkan memanjang jika konten banyak */
    }
  }
` }} />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <button onClick={onBack} className="flex items-center gap-2 text-mint-700 font-bold hover:text-mint-900 transition-colors">
          <ChevronLeft className="w-5 h-5" /> Kembali
        </button>

        <div className="relative">
          <button onClick={() => setShowExportOptions(!showExportOptions)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all">
            <Download className="w-5 h-5" /> Unduh / Cetak
          </button>
          
          <AnimatePresence>
            {showExportOptions && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                <button onClick={downloadWord} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-700 border-b border-slate-100 transition-colors">
                  <FileText className="w-5 h-5 text-blue-500" /> Format Word (.doc)
                </button>
                <button onClick={handlePrint} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-700 transition-colors">
                  <Printer className="w-5 h-5 text-orange-500" /> Cetak / Print Browser
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div ref={containerRef} className="bg-white p-8 md:p-12 shadow-sm border border-slate-200 text-slate-900 relative overflow-hidden">
        {/* Konten Watermark */}
        <div className="print-watermark">
          {data.identitas.schoolName || "DOKUMEN ASLI"}
        </div>
        
        {/* Judul Dokumen */}
        <div className="text-center mb-10">
          <h1 className="text-xl font-bold uppercase">RENCANA PELAKSANAAN PEMBELAJARAN MENDALAM</h1>
          <p className="text-lg font-bold uppercase mt-1">(RPPM)</p>
        </div>

        <div className="space-y-6">
          {/* Identitas Section */}
          <section>
            <h2 className="text-xs font-bold bg-slate-100 p-2 border border-slate-300 uppercase tracking-wider">1. IDENTITAS</h2>
            <table className="w-full border-collapse border border-slate-300 mt-1">
              <tbody>
                <tr>
                  <td className="w-1/3 font-semibold border border-slate-300 p-2">Nama Satuan Pendidikan</td>
                  <td className="border border-slate-300 p-2">{data.identitas.schoolName}</td>
                </tr>
                <tr>
                  <td className="font-semibold border border-slate-300 p-2">Mata Pelajaran</td>
                  <td className="border border-slate-300 p-2">{data.identitas.subject}</td>
                </tr>
                <tr>
                  <td className="font-semibold border border-slate-300 p-2">Kelas/Semester</td>
                  <td className="border border-slate-300 p-2">{data.identitas.classSemester}</td>
                </tr>
                <tr>
                  <td className="font-semibold border border-slate-300 p-2">Durasi Pertemuan</td>
                  <td className="border border-slate-300 p-2">{data.identitas.duration}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Section 2: Identifikasi */}
          <section>
            <h2 className="text-sm font-bold bg-mint-50 p-2 border border-slate-300">2. IDENTIFIKASI</h2>
            <table className="spreadsheet-table">
              <tbody>
                <tr>
                  <td className="w-1/3 font-semibold">Murid</td>
                  <td className="text-justify leading-relaxed">{data.identifikasi.students}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Materi Pelajaran</td>
                  <td className="text-justify leading-relaxed">{data.identifikasi.material}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Capaian Dimensi Lulusan</td>
                  <td className="text-justify leading-relaxed">{data.identifikasi.dimensi}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Section 3: Desain Pembelajaran */}
          <section>
            <h2 className="text-sm font-bold bg-mint-50 p-2 border border-slate-300">3. DESAIN PEMBELAJARAN</h2>
            <table className="spreadsheet-table">
              <tbody>
                <tr>
                  <td className="w-1/3 font-semibold">Capaian Pembelajaran</td>
                  <td className="text-justify leading-relaxed">{data.desain.cp}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Lintas Disiplin Ilmu</td>
                  <td className="text-justify leading-relaxed">{data.desain.crossDisciplinary}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Tujuan Pembelajaran</td>
                  <td className="text-justify leading-relaxed">{data.desain.tp}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Topik Pembelajaran</td>
                  <td className="text-justify leading-relaxed">{data.desain.topic}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Praktik Pedagogis</td>
                  <td className="text-justify leading-relaxed">{data.desain.pedagogy}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Kemitraan Pembelajaran</td>
                  <td className="text-justify leading-relaxed">{data.desain.partnership}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Lingkungan Pembelajaran</td>
                  <td className="text-justify leading-relaxed">{data.desain.environment}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Pemanfaatan Digital</td>
                  <td className="text-justify leading-relaxed">{data.desain.digitalUtilization}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Adaptasi Lokal (Kontekstual)</td>
                  <td className="text-justify leading-relaxed bg-mint-50/50">{data.desain.adaptasiLokal}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Section 4: Pengalaman Belajar */}
          <section>
            <h2 className="text-sm font-bold bg-mint-50 p-2 border border-slate-300">4. PENGALAMAN BELAJAR</h2>
            <table className="spreadsheet-table">
              <tbody>
                <tr>
                  <td className="w-1/3 font-semibold">Memahami (Kegiatan Awal)</td>
                  <td className="text-justify leading-relaxed italic">{data.pengalaman.memahami}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Mengaplikasi (Kegiatan Inti)</td>
                  <td className="text-justify leading-relaxed">{data.pengalaman.mengaplikasi}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Merefleksi (Kegiatan Penutup)</td>
                  <td className="text-justify leading-relaxed italic">{data.pengalaman.merefleksi}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Section 5: Asesmen */}
          <section>
            <h2 className="text-xs font-bold bg-slate-100 p-2 border border-slate-300 uppercase tracking-wider">5. ASESMEN PEMBELAJARAN</h2>
            <table className="w-full border-collapse border border-slate-300 mt-1">
              <tbody>
                <tr><td className="w-1/3 font-semibold border border-slate-300 p-2">Asesmen Awal</td><td className="border border-slate-300 p-2 text-justify">{data.asesmen.awal}</td></tr>
                <tr><td className="font-semibold border border-slate-300 p-2">Asesmen Proses</td><td className="border border-slate-300 p-2 text-justify">{data.asesmen.proses}</td></tr>
                <tr><td className="font-semibold border border-slate-300 p-2">Asesmen Akhir</td><td className="border border-slate-300 p-2 text-justify">{data.asesmen.akhir}</td></tr>
              </tbody>
            </table>
          </section>
        </div>

        {/* Signature Section */}
        <div className="mt-16 w-full">
          <table className="w-full border-none border-collapse" style={{ border: 'none' }}>
            <tbody>
              <tr>
                {/* Kolom Kiri */}
                <td className="w-1/2 text-left align-top border-none p-0" style={{ border: 'none' }}>
                  <p className="mb-1">Mengetahui,</p>
                  <p className="mb-0">Kepala Sekolah</p>
          
                  {/* Spacer Statis untuk Tanda Tangan */}
                  <div className="mt-20"> 
                    <p className="font-bold underline uppercase mb-0">{formInput.principalName}</p>
                    <p className="text-sm mt-0">NIP. {formInput.principalNip}</p>
                  </div>
                </td>

                {/* Kolom Kanan */}
                <td className="w-1/2 text-left align-top border-none p-0" style={{ border: 'none' }}>
                  <p className="mb-1">................., ................... 20....</p>
                  <p className="mb-0">{formInput.position || 'Guru Kelas'}</p>
          
                  {/* Spacer Statis yang SAMA (mt-20) */}
                  <div className="mt-20">
                    <p className="font-bold underline uppercase mb-0">{formInput.teacherName}</p>
                    <p className="text-sm mt-0">NIP. {formInput.teacherNip}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
