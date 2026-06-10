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
  const [authLoading, setAuthLoading] = useState(true);

  const database = {
    Jawa: javaneseData,
    Sunda: sundaneseData,
    Bali: balineseData,
  };

  // Inisialisasi & Otentikasi Pi SDK v2 Otomatis saat App dibuka
  useEffect(() => {
    const initPiSDK = async () => {
      if (typeof window !== 'undefined' && window.Pi) {
        try {
          // 1. Inisialisasi Pi SDK dengan konfigurasi sandbox/testnet
          await window.Pi.init({ version: "2.0", sandbox: true });
          
          // 2. Lakukan autentikasi otomatis tanpa perlu klik tombol
          const scopes = ['username', 'payments'];
          const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
          
          setPiUser(auth.user);
          setAuthLoading(false);
        } catch (error) {
          console.error("Gagal Otentikasi Pi SDK:", error);
          setAuthLoading(false);
        }
      } else {
        // Jika dibuka di browser biasa luar Pi Browser
        setAuthLoading(false);
      }
    };

    // Beri jeda kecil memastikan script script sdk ter-load sempurna
    const timer = setTimeout(() => {
      initPiSDK();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const onIncompletePaymentFound = (payment) => {
    // Dipakai untuk penanganan transaksi tertunda di masa depan
    console.log("Incomplete payment found:", payment);
  };

  // Simulasi deteksi suara offline via Mikrofon
  const toggleListening = () => {
    if (!region) {
      alert("Silakan pilih wilayah terlebih dahulu!");
      return;
    }
    const nextState = !isListening;
    setIsListening(nextState);

    if (nextState) {
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

  // Tampilan Loading Authenticating Menyesuaikan Gambar Anda agar rapi
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFBF7] p-4 text-center">
        <div className="w-16 h-16 border-4 border-[#8C3A32] border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-[#2C2A29] mb-2">Pi Network Authentication</h2>
        <p className="text-sm text-gray-500 animate-pulse">Menghubungkan ke Pi Testnet Sandbox...</p>
      </div>
    );
  }

  return (
    <main className="max-w-md mx-auto min-h-screen p-4 flex flex-col justify-between relative bg-[#FDFBF7]">
      {/* Header & Status Akun Pi */}
      <header className="flex justify-between items-center py-2 border-b border-[#EADCC9]">
        <h1 className="text-2xl font-bold text-[#8C3A32]">LokalSense</h1>
        {piUser ? (
          <span className="text-xs bg-[#4A7A57] text-white px-3 py-1 rounded-full font-medium">
            ⚡ {piUser.username}
          </span>
        ) : (
          <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
            Visitor Mode
          </span>
        )}
      </header>

      {/* Konten Utama */}
      <div className="flex-grow my-4 space-y-6">
        {!region ? (
          <div className="space-y-4">
            <h2 className="text-md font-medium text-center text-[#554F4A]">Mau pergi ke daerah mana hari ini?</h2>
            <div className="grid grid-cols-1 gap-3">
              {['Jawa', 'Sunda', 'Bali'].map((name, idx) => (
                <button key={idx} onClick={() => setRegion(name)} className="p-5 bg-white border border-[#EADCC9] rounded-xl shadow-sm text-left flex justify-between items-center transition-all hover:border-[#8C3A32]">
                  <div>
                    <h3 className="font-bold text-lg text-[#2C2A29]">{name}</h3>
                    <p className="text-xs text-[#7A726C]">Aktifkan kamus offline & norma lokal</p>
                  </div>
                  <span className="text-xl">➔</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 border border-[#EADCC9] rounded-2xl text-center space-y-6 shadow-sm">
            <div className="flex justify-between items-center bg-[#F4EDE2] px-4 py-2 rounded-full">
              <span className="text-sm font-semibold text-[#554F4A]">📍 Wilayah: {region}</span>
              <button onClick={() => { setRegion(null); setIsListening(false); setPopup(null); }} className="text-xs text-[#8C3A32] font-bold underline">Ubah</button>
            </div>

            <div className="py-8 flex flex-col items-center justify-center space-y-4">
              <button onClick={toggleListening} className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl shadow-lg transition-all ${isListening ? 'bg-[#8C3A32] animate-pulse' : 'bg-[#4A7A57]'}`}>
                {isListening ? '🛑' : '🎤'}
              </button>
              <p className="text-xs font-medium text-[#7A726C]">
                {isListening ? 'Sedang memantau dialek lokal...' : 'Ketuk mikrofon untuk mulai mendengar'}
              </p>
            </div>
          </div>
        )}

        {/* Offline Smart-Search Bar */}
        <div className="bg-white p-4 border border-[#EADCC9] rounded-xl shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-[#554F4A]">🔍 Kamus Offline Instan</h3>
          <input type="text" placeholder="Cari kata daerah atau arti..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-2 text-sm border border-[#C8B8A6] rounded-lg bg-[#FAF8F5] focus:outline-none focus:border-[#8C3A32]" />
          
          {searchQuery && (
            <div className="max-h-40 overflow-y-auto space-y-2 mt-2 divide-y divide-[#EADCC9]">
              {filteredSearch.length > 0 ? filteredSearch.map((item, idx) => (
                <div key={idx} className="pt-2 text-sm cursor-pointer" onClick={() => setPopup(item)}>
                  <p className="font-bold text-[#8C3A32]">{item.word}</p>
                  <p className="text-xs text-[#7A726C]">{item.translation}</p>
                </div>
              )) : <p className="text-xs text-[#908780] italic">Kata tidak ditemukan.</p>}
            </div>
          )}
        </div>
      </div>

      {/* Pop-up Kebudayaan */}
      {popup && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-white border-l-4 border-[#8C3A32] rounded-r-xl shadow-2xl p-4 space-y-2 z-50">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold bg-[#F4EDE2] text-[#8C3A32] px-2 py-0.5 rounded">Terdeteksi</span>
              <h4 className="text-lg font-bold text-[#2C2A29] mt-1">"{popup.word}"</h4>
            </div>
            <button onClick={() => setPopup(null)} className="text-gray-400 text-sm">✕</button>
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
        LokalSense v1.0 — Pi Sandbox Connected
      </footer>
    </main>
  );
}

