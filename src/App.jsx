import { useState, useEffect } from 'react'

function App() {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('modern_users_list');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Arama durumu
  const [notification, setNotification] = useState(''); // Bildirim mesajı

  useEffect(() => {
    localStorage.setItem('modern_users_list', JSON.stringify(users));
  }, [users]);

  // Bildirimleri otomatik temizle
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingId) {
      setUsers(users.map(u => u.id === editingId ? { ...formData, id: editingId, isLocal: u.isLocal } : u));
      setEditingId(null);
      setNotification('✅ Kullanıcı başarıyla güncellendi!');
    } else {
      setUsers([...users, { ...formData, id: Date.now(), isLocal: true }]);
      setNotification('🎉 Kullanıcı başarıyla eklendi!');
    }
    setFormData({ name: '', email: '', phone: '', company: '' });
  };

  const deleteUser = (id) => {
    // SİLME ONAYI
    if (window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
      setUsers(users.filter(u => u.id !== id));
      setNotification('🗑️ Kullanıcı sistemden silindi.');
    }
  };
  
  const startEdit = (user) => {
    setEditingId(user.id);
    setFormData({ name: user.name, email: user.email, phone: user.phone, company: user.company });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ARAMA FİLTRESİ
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans relative">
      
      {/* BİLDİRİM MESAJI (Toast) */}
      {notification && (
        <div className="fixed top-5 right-5 bg-gray-800 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 animate-bounce">
          {notification}
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 px-6 shadow-lg mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Kullanıcı Yönetim Paneli</h1>
        <p className="text-sm opacity-80 font-light mt-2 max-w-lg mx-auto">
          Müşteri ve personel kayıtlarını dijital ortamda güvenle organize edin.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        
        {/* İSTATİSTİKLER VE ARAMA ÇUBUĞU */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-blue-600">{users.length}</div>
            <div className="text-gray-500 text-xs font-bold uppercase">Toplam</div>
          </div>
          
          {/* ARAMA INPUTU */}
          <div className="md:col-span-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center px-6">
            <span className="text-2xl mr-4">🔍</span>
            <input 
              type="text"
              placeholder="İsim, email veya şirket ile hızlıca ara..."
              className="w-full outline-none text-lg text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* FORM KARTI */}
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            {editingId ? '📝 Kullanıcıyı Düzenle' : '👤 Yeni Kayıt Oluştur'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-600 ml-1">Ad Soyad</label>
              <input 
                className="w-full border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-600 ml-1">Email</label>
              <input 
                type="email"
                className="w-full border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-600 ml-1">Telefon</label>
              <input 
                className="w-full border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-600 ml-1">Şirket</label>
              <input 
                className="w-full border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
              />
            </div>
            <button className="md:col-span-2 bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 shadow-lg transition text-lg">
              {editingId ? 'Güncellemeyi Tamamla' : 'Sisteme Kaydet'}
            </button>
          </form>
        </div>

        {/* LİSTE */}
        <div className="space-y-4">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                <p className="text-gray-500 text-sm">{user.email} • {user.company || 'Bireysel'}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => startEdit(user)} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-100 transition">Düzenle</button>
                <button onClick={() => deleteUser(user.id)} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition">Sil</button>
              </div>
            </div>
          ))}
          
          {filteredUsers.length === 0 && (
            <div className="text-center bg-white py-16 rounded-2xl shadow-inner border border-gray-100">
                <span className="text-6xl mb-4 block">📭</span>
                <p className="text-gray-400 text-xl font-medium">Henüz kayıtlı kullanıcı bulunmuyor.</p>
                <p className="text-gray-400">Yeni bir kullanıcı ekleyerek başlayın.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App