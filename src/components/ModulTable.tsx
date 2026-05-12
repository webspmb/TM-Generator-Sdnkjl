import { Download, ChevronLeft, FileText, DownloadCloud } from 'lucide-react';
import { GeneratedModul, ModulFormData } from '../types';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

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
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>RPPM</title><style>
      body { font-family: 'Times New Roman', Times, serif; }
      table { border-collapse: collapse; width: 100%; border: 1px solid black; margin-bottom: 20px; }
      th, td { border: 1px solid black; padding: 10px; text-align: left; vertical-align: top; font-size: 11pt; }
      th { background-color: #f0fdf9; font-weight: bold; }
      .text-center { text-align: center; }
      .text-justify { text-align: justify; }
      .font-bold { font-weight: bold; }
      .signature-table { border: none !important; margin-top: 50px; width: 100%; }
      .signature-table td { border: none !important; width: 50%; vertical-align: top; }
      .no-print { display: none; }
    </style></head><body>`;
    const footer = "</body></html>";
    const source = header + content + footer;
    
    const blob = new Blob(['\ufeff', source], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RPPM_${formInput.subject}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-mint-700 font-bold hover:text-mint-900 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Edit Data
        </button>

        <div className="relative">
          <button
            onClick={() => setShowExportOptions(!showExportOptions)}
            className="gradient-mint text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Unduh Dokumen
          </button>
          
          <AnimatePresence>
            {showExportOptions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-mint-100 overflow-hidden z-50"
              >
                <button
                  onClick={downloadWord}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-mint-50 text-mint-900 transition-colors border-b border-mint-50"
                >
                  <FileText className="w-5 h-5 text-blue-500" />
                  Format Word (.doc)
                </button>
                <button
                  onClick={downloadWord}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-mint-50 text-mint-900 transition-colors"
                >
                  <DownloadCloud className="w-5 h-5 text-mint-600" />
                  Google Docs
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div ref={containerRef} className="bg-white p-8 md:p-12 shadow-2xl border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold uppercase">RENCANA PELAKSANAAN PEMBELAJARAN MENDALAM (RPPM)</h1>
          <p className="text-xl font-bold uppercase mt-2">{formInput.subject}</p>
        </div>

        <div className="space-y-8">
          {/* Section 1: Identitas */}
          <section>
            <h2 className="text-sm font-bold bg-mint-50 p-2 border border-slate-300">1. IDENTITAS</h2>
            <table className="spreadsheet-table">
              <tbody>
                <tr>
                  <td className="w-1/3 font-semibold">Nama Satuan Pendidikan</td>
                  <td>{data.identitas.schoolName}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Mata Pelajaran</td>
                  <td>{data.identitas.subject}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Kelas/Semester</td>
                  <td>{data.identitas.classSemester}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Durasi Pertemuan</td>
                  <td>{data.identitas.duration}</td>
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
            <h2 className="text-sm font-bold bg-mint-50 p-2 border border-slate-300">5. ASESMEN PEMBELAJARAN</h2>
            <table className="spreadsheet-table">
              <tbody>
                <tr>
                  <td className="w-1/3 font-semibold">Asesmen Awal</td>
                  <td className="text-justify leading-relaxed">{data.asesmen.awal}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Asesmen Proses</td>
                  <td className="text-justify leading-relaxed">{data.asesmen.proses}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Asesmen Akhir</td>
                  <td className="text-justify leading-relaxed">{data.asesmen.akhir}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>


        {/* Signatures */}
        <table className="signature-table mt-20 no-border w-full">
          <tbody>
            <tr>
              <td className="text-left align-top">
                <p>Mengetahui,</p>
                <p>Kepala Sekolah</p>
                <div className="h-24"></div>
                <p className="font-bold underline uppercase">{formInput.principalName}</p>
                <p>NIP. {formInput.principalNip}</p>
              </td>
              <td className="text-left align-top">
                <p>Indonesia, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p>{formInput.position}</p>
                <div className="h-24"></div>
                <p className="font-bold underline uppercase">{formInput.teacherName}</p>
                <p>NIP. {formInput.teacherNip}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
