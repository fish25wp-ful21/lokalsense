'use client';
import { useState, useEffect } from 'react';
import javaneseData from '../data/regions/javanese.json';
import sundaneseData from '../data/regions/sundanese.json';
import balineseData from '../data/regions/balinese.json';

export default function Home() {
  const [region, setRegion] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [popup, setPopup] = useState(null);
  const [piUser, setPiUser] = useState(null);

  const database = {
    Jawa: javaneseData,
    Sunda: sundaneseData,
    Bali: balineseData,
  };

  // Otentikasi Pi SDK v2
  const handlePiLogin = async () => {
    if (window.Pi) {
      try {
        const scopes = ['username', 'payments'];
        const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
        setPiUser(auth.user);
      } catch (error) {
        console.error("Gagal login ke Pi Network:", error);
      }
    } else {
      alert("Harap buka aplikasi ini dari dalam Pi Browser untuk menggunakan fitur login!");
    }
  };

  const onIncompletePaymentFound = (payment) => {
    // Siap digunakan untuk update premium otomatis di masa mendatang
  };

  // Simulasi deteksi suara offline via Mikrofon (Web Speech API Placeholder)
  const toggleListening = () => {
    if (!region) {
      alert("Silakan pilih wilayah terlebih dahulu!");
      return;
    }
    const nextState = !isListening;
    setIsListening(nextState);

    if (nextState) {
      // Simulasi trigger pop-up otomatis mendeteksi kata dalam database lokal setelah 2 detik
      setTimeout(() => {
        const activeDb = database[region];
        if (activeDb && activeDb.length > 0) {
          setPopup(activeDb[0]);
        }
      }, 2500);
    } else {
      setPopup(null);
    }
  };

  // Filter pencarian pintar offline
  const allEntries = [...javaneseData, ...sundaneseData, ...balineseData];
  const filteredSearch = searchQuery ? allEntries.filter(item => 
    item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.translation.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <main className="max-w-md mx-auto min-h-screen p-4 flex flex-col justify-between relative">
      {/* Header & Status Pi */}
      <header className="flex justify-between items-center py-2 border-b border-[#EADCC9]">
        <h1 className="text-2xl font-bold text-[#8C3A32]">LokalSense</h1>
        {piUser ? (
          <span className="text-xs bg-[#4A7A57] text-white px-3 py-1 rounded-full font-medium">
            ⚡ {piUser.username}
          </span>
        ) : (
          <button onClick={handlePiLogin} className="text-xs bg-[#E6A15C] text-[#2C2A29] px-3 py-1 rounded-full font-semibold shadow-sm hover:opacity-90">
            Konek Pi
          </button>
        )}
      </header>

      {/* Konten Utama */}
      <div className="flex-grow my-4 space-y-6">
        {/* Mode Pilih Wilayah jika belum memilih */}
        {!region ? (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-center text-[#554F4A]">Mau pergi ke daerah mana hari ini?</h2>
            <div className="grid grid-cols-1 gap-3">
              {['Jawa', 'Sunda', 'Bali'].map((name, idx) => (
                <button key={idx} onClick={() => setRegion(name)} className="p-5 bg-white border border-[#EADCC9] rounded-xl shadow-sm text-left flex justify-between items-center transition-all hover:border-[#8C3A32]">
                  <div>
                    <h3 className="font-bold text-lg text-[#2C2A29]">{name}</h3>
                    <p className="text-xs text-[#7A726C]">Aktifkan kamus offline & norma lokal</p>
                  </div>
                  <span className="text-2xl">➔</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Mode Monitor Listening */
          <div className="bg-white p-6 border border-[#EADCC9] rounded-2xl text-center space-y-6 shadow-sm">
            <div className="flex justify-between items-center bg-[#F4EDE2] px-4 py-2 rounded-full">
              <span className="text-sm font-semibold text-[#554F4A]">📍 Wilayah: {region}</span>
              <button onClick={() => { setRegion(null); setIsListening(false); setPopup(null); }} className="text-xs text-[#8C3A32] font-bold underline">Ubah</button>
            </div>

            <div className="py-8 flex flex-col items-center justify-center space-y-4">
              <button onClick={toggleListening} className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl shadow-lg transition-all ${isListening ? 'bg-[#8C3A32] animate-pulse' : 'bg-[#4A7A57]'}`}>
                {isListening ? '🛑' : '🎤'}
              </button>
              <p className="text-sm font-medium text-[#7A726C]">
                {isListening ? 'Sedang mendengarkan percakapan di sekitar...' : 'Ketuk mikrofon untuk mulai memantau'}
              </p>
            </div>
          </div>
        )}

        {/* Offline Smart-Search Bar */}
        <div className="bg-white p-4 border border-[#EADCC9] rounded-xl shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-[#554F4A]">🔍 Kamus Offline Instan</h3>
          <input type="text" placeholder="Cari kata daerah atau arti Indonesia..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-2 text-sm border border-[#C8B8A6] rounded-lg bg-[#FAF8F5] focus:outline-none focus:border-[#8C3A32]" />
          
          {searchQuery && (
            <div className="max-h-40 overflow-y-auto space-y-2 mt-2 divide-y divide-[#EADCC9]">
              {filteredSearch.length > 0 ? filteredSearch.map((item, idx) => (
                <div key={idx} className="pt-2 text-sm cursor-pointer" onClick={() => setPopup(item)}>
                  <p className="font-bold text-[#8C3A32]">{item.word}</p>
                  <p className="text-xs text-[#7A726C]">{item.translation}</p>
                </div>
              )) : <p className="text-xs text-[#908780] italic">Kata tidak ditemukan di database offline.</p>}
            </div>
          )}
        </div>
      </div>

      {/* Pop-up Kebudayaan Real-Time (Bottom Sheet Style) */}
      {popup && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-white border-l-4 border-[#8C3A32] rounded-r-xl shadow-2xl p-4 space-y-2 transition-all duration-300 transform translate-y-0 z-50 animate-fade-in">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-[#F4EDE2] text-[#8C3A32] px-2 py-0.5 rounded">Terdeteksi Suara</span>
              <h4 className="text-lg font-bold text-[#2C2A29] mt-1">"{popup.word}"</h4>
            </div>
            <button onClick={() => setPopup(null)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
          </div>
          <div className="text-sm text-[#554F4A]">
            <p><span className="font-semibold text-gray-700">Arti:</span> {popup.translation}</p>
            <p className="text-xs text-gray-500 italic mt-0.5">{popup.context}</p>
          </div>
          <div className="bg-[#FFF9F2] p-2 rounded border border-[#F5E6D3] text-xs text-[#614227]">
            <span className="font-bold block text-[#8C3A32] mb-0.5">💡 Tips Etika & Gestur:</span>
            {popup.tip}
          </div>
        </div>
      )}

      <footer className="text-center text-[10px] text-[#908780] pt-4">
        LokalSense Ecosystem v1.0 — 100% Secure & On-Device Data
      </footer>
    </main>
  );
}

