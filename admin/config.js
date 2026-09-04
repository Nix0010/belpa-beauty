/* ==========================================================================
   BELPA CMS - CONFIGURACIÓN DE CONEXIÓN CLOUD (SUPABASE)
   ========================================================================== */

(function() {
    const storedUrl = typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('belpa_supabase_url') : null;
    const storedKey = typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('belpa_supabase_anon_key') : null;

    window.BELPA_CONFIG = {
        SUPABASE_URL: storedUrl || "https://tu-proyecto.supabase.co",
        SUPABASE_ANON_KEY: storedKey || "tu-anon-key-de-supabase",
        STORAGE_BUCKET: "belpa-products",

        isConfigured: function() {
            return Boolean(
                this.SUPABASE_URL && 
                this.SUPABASE_ANON_KEY && 
                !this.SUPABASE_URL.includes('tu-proyecto') && 
                !this.SUPABASE_ANON_KEY.includes('tu-anon-key') &&
                !this.SUPABASE_URL.includes('placeholder') &&
                !this.SUPABASE_ANON_KEY.includes('dummy')
            );
        },

        saveCredentials: function(url, key) {
            if (url) localStorage.setItem('belpa_supabase_url', url.trim());
            if (key) localStorage.setItem('belpa_supabase_anon_key', key.trim());
            this.SUPABASE_URL = url ? url.trim() : this.SUPABASE_URL;
            this.SUPABASE_ANON_KEY = key ? key.trim() : this.SUPABASE_ANON_KEY;
        }
    };
})();
