import { Download, ChevronLeft, FileText, DownloadCloud } from 'lucide-react';
import { GeneratedModul, ModulFormData } from '../types';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    
    // Tambahkan meta data dan CSS spesifik Word untuk border yang lebih solid
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>RPPM</title>
      <style>
        @page { size: A4; margin: 2cm; }
        body { font-family: 'Times New Roman', serif; }
        table { border-collapse: collapse; width: 100%; border: 0.5pt solid black; margin-bottom: 15px; }
        td, th { border: 0.5pt solid black; padding: 8px; font-size: 11pt; vertical-align: top; }
        .bg-mint-50 { background-color: #f0fdf9 !important; }
        .font-bold { font-weight: bold; }
        .uppercase { text-transform: uppercase; }
        /* Style khusus tanda tangan agar tidak berantakan di Word */
        .sig-container { border: none !important; margin-top: 50px; }
        .sig-container td { border: none !important; width: 50%; }
        .no-print { display: none; }
      </style></head><body>`;
    
    const footer = "</body></html>";
    const source = header + content + footer;
    
    const blob = new Blob(['\ufeff', source], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RPPM_${formInput.subject || 'Dokumen'}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    if (!containerRef.current) return;
    
    try {
      setShowExportOptions(false);
      await new Promise(resolve => setTimeout(resolve, 400));

      const element = containerRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 1200, // Memaksa lebar desktop agar layout tidak pecah
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Margin adjustment (opsional, di sini kita gunakan full width)
      const imgProps = pdf.getImageProperties(imgData);
      const canvasHeightInMm = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = canvasHeightInMm;
      let position = 0;

      // Halaman 1
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, canvasHeightInMm);
      heightLeft -= pdfHeight;

      // Loop untuk halaman tambahan
      while (heightLeft > 0) {
        position = heightLeft - canvasHeightInMm;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, canvasHeightInMm);
        heightLeft -= pdfHeight;
      }

      pdf.save(`RPPM_${formInput.subject || 'Dokumen'}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Gagal membuat PDF. Coba gunakan fitur Print Browser.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32 px-4">
      {/* Header Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <button onClick={onBack} className="flex items-center gap-2 text-mint-700 font-bold hover:text-mint-900 transition-colors">
          <ChevronLeft className="w-5 h-5" /> Kembali
        </button>

        <div className="relative">
          <button onClick={() => setShowExportOptions(!showExportOptions)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all">
            <Download className="w-5 h-5" /> Unduh Dokumen
          </button>
          
          <AnimatePresence>
            {showExportOptions && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                <button onClick={downloadWord} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-700 border-b border-slate-100">
                  <FileText className="w-5 h-5 text-blue-500" /> Format Word (.doc)
                </button>
                <button onClick={downloadPDF} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-700">
                  <DownloadCloud className="w-5 h-5 text-red-500" /> Format PDF (.pdf)
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Document Content */}
      <div ref={containerRef} className="bg-white p-8 md:p-12 shadow-sm border border-slate-200 text-slate-900">
        <div className="text-center mb-10">
          <h1 className="text-xl font-bold uppercase">RENCANA PELAKSANAAN PEMBELAJARAN MENDALAM</h1>
          <p className="text-lg font-bold uppercase mt-2">(RPPM)</p>
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
          <table className="w-full border-none border-collapse">
            <tbody>
              <tr>
                <td className="w-1/2 text-left align-top border-none p-0 pl-5 md:pl-32">
                  <p className="mb-1">Mengetahui,</p>
                  <p className="mb-12">Kepala Sekolah</p>
                  <p className="font-bold underline uppercase">{formInput.principalName}</p>
                  <p className="text-sm">NIP. {formInput.principalNip}</p>
                </td>
                <td className="w-1/2 text-left align-top border-none p-0 pl-12 md:pl-32">
                  <p className="mb-1">.............., ............... 20....</p>
                  <p className="mb-12">{formInput.position || 'Guru Kelas'}</p>
                  <p className="font-bold underline uppercase">{formInput.teacherName}</p>
                  <p className="text-sm">NIP. {formInput.teacherNip}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
