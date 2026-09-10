// Fallback small dataset used if CDN fetch fails
const FALLBACK_DB = {
  "Toyota": ["Corolla","Camry","Yaris","RAV4"],
  "Volkswagen": ["Golf","Passat","Polo","T-Cross"],
  "Geely": ["Atlas","Coolray","Emgrand"],
  "Chery": ["Tiggo 4","Tiggo 7","Arrizo 5"],
  "BYD": ["Atto 3","Tang"],
  "MG": ["ZS","HS"]
};

const VEHICLE_MAKES_URL = 'https://cdn.jsdelivr.net/gh/vehiclesdb/vehiclesdb@latest/catalog/car/makes.json';
const VEHICLE_MODELS_URL = 'https://cdn.jsdelivr.net/gh/vehiclesdb/vehiclesdb@latest/catalog/car/models.json';
let VEHICLE_MAP = {}; // { makeName: [modelName,...] }
let VEHICLE_MAKES = []; // original makes array
let VEHICLE_MODELS = []; // original models array

function buildMapFromArray(arr) {
  const map = {};
  arr.forEach(item => {
    // filter to passenger cars when possible
    const kind = (item.kind || item.type || item.vehicleType || item.vehicle_type || "").toString().toLowerCase();
    if (kind && kind !== 'car') return; // skip non-car entries
    const make = item.make || item.manufacturer || item.brand || item.Make || item.manufacturerName;
    const model = item.model || item.modelName || item.model_name || item.Model;
    if (!make || !model) return;
    if (!map[make]) map[make] = new Set();
    map[make].add(model);
  });
  const out = {};
  Object.keys(map).forEach(k => out[k] = Array.from(map[k]).sort());
  return out;
}

function buildMapFromObject(obj) {
  const out = {};
  Object.keys(obj).forEach(make => {
    const val = obj[make];
    if (Array.isArray(val)) {
      // array of models or objects
      // when models are objects they might include a "kind" field
      const models = val.map(m => {
        if (!m) return null;
        const kind = (m.kind || m.type || m.vehicleType || "").toString().toLowerCase();
        if (kind && kind !== 'car') return null;
        return (typeof m === 'string' ? m : (m.model || m.modelName || m.name));
      }).filter(Boolean);
      out[make] = Array.from(new Set(models)).sort();
    }
  });
  return out;
}

async function loadVehicleDB() {
  try {
    // Always refresh the catalog; cached data is only used when the CDN is unavailable.
    const makesRes = await fetch(VEHICLE_MAKES_URL, { cache: 'no-store' });
    if (!makesRes.ok) throw new Error(`Makes fetch failed: ${makesRes.status}`);
    const makes = await makesRes.json();
    VEHICLE_MAKES = Array.isArray(makes) ? makes : [];

    try {
      const modelsRes = await fetch(VEHICLE_MODELS_URL, { cache: 'no-store' });
      if (modelsRes.ok) {
        const models = await modelsRes.json();
        VEHICLE_MODELS = Array.isArray(models) ? models : [];
      }
    } catch (modelsError) {
      console.warn('vehicleDB models load failed; makes remain available', modelsError);
      VEHICLE_MODELS = [];
    }

    if (!VEHICLE_MAKES.length) throw new Error('No car makes found');

    buildVehicleMap();
  } catch (e) {
    // Clear catalogs saved by older versions and use only the bundled fallback.
    localStorage.removeItem('carosseria-vehiclesdb-v2');
    VEHICLE_MAP = FALLBACK_DB;
    // build simple fallback makes/models arrays
    VEHICLE_MAKES = Object.keys(FALLBACK_DB).map((name, idx) => ({ id: idx + 1, name, slug: name.toLowerCase().replace(/\s+/g, '-') }));
    VEHICLE_MODELS = [];
    VEHICLE_MAKES.forEach(mk => {
      const models = FALLBACK_DB[mk.name] || [];
      models.forEach(mod => VEHICLE_MODELS.push({ make_id: mk.id, name: mod }));
    });
    console.warn('vehicleDB load failed, using fallback', e);
    const note = document.getElementById('vehicleDataNote');
    if (note) note.textContent = 'Nie udało się załadować bazy marek — użyto lokalnej listy (możesz wpisać model ręcznie).';
  }
}

function buildVehicleMap() {
    // Build map: for each make, include only models with the same make_id.
    const map = {};
    VEHICLE_MAKES.forEach(make => {
      const makeName = make.name || make.manufacturer || make.slug;
      if (!makeName) return;
      const makeId = make.id || make.slug || make.uid;
      const modelsForMake = VEHICLE_MODELS.filter(m => m && String(m.make_id) === String(makeId))
        .map(m => m.name || m.model || m.modelName).filter(Boolean);
      map[makeName] = Array.from(new Set(modelsForMake)).sort();
    });
    VEHICLE_MAP = map;
    console.debug('vehicleDB: loaded makes/models, makes=', VEHICLE_MAKES.length, 'models=', VEHICLE_MODELS.length);
    if (!Object.keys(VEHICLE_MAP).length) throw new Error('No car makes found');
}

function populateBrands() {
  const brand = document.getElementById('brandSelect');
  brand.innerHTML = '<option value="">Wybierz markę…</option>';
  // VEHICLE_MAKES is the array from makes.json; include all records
  if (Array.isArray(VEHICLE_MAKES) && VEHICLE_MAKES.length) {
    VEHICLE_MAKES.forEach(make => {
      const opt = document.createElement('option');
      const id = make.id || make.slug || make.name;
      opt.value = id;
      opt.textContent = make.name || make.slug || id;
      opt.dataset.slug = make.slug || '';
      brand.appendChild(opt);
    });
  } else {
    // fallback to VEHICLE_MAP keys
    Object.keys(VEHICLE_MAP).sort().forEach(b => {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = b;
      brand.appendChild(opt);
    });
  }
  const otherOpt = document.createElement('option');
  otherOpt.value = 'Inna';
  otherOpt.textContent = 'Inna marka / wpisz ręcznie';
  brand.appendChild(otherOpt);
}

function populateModels(brandName) {
  const model = document.getElementById('modelSelect');
  model.innerHTML = '';
  if (!brandName) {
    model.disabled = true;
    model.innerHTML = '<option value="">Wybierz najpierw markę</option>';
    hideModelOther();
    return;
  }
  if (brandName === 'Inna') {
    model.disabled = true;
    model.innerHTML = '<option value="">Wpisz model ręcznie</option>';
    showModelOther();
    return;
  }
  // brandName here is the make id (or name when fallback)
  let modelsList = [];
  if (Array.isArray(VEHICLE_MODELS) && VEHICLE_MODELS.length) {
    modelsList = VEHICLE_MODELS.filter(m => {
      if (!m) return false;
      if (m.make_id && String(m.make_id) === String(brandName)) return true;
      // some datasets use make slug/name
      if (m.make && String(m.make) === String(brandName)) return true;
      return false;
    }).map(m => m.name || m.model || m.modelName).filter(Boolean);
  }
  modelsList.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    model.appendChild(opt);
  });
  const other = document.createElement('option');
  other.value = 'Inny';
  other.textContent = 'Inny / wpisz ręcznie';
  model.appendChild(other);
  model.disabled = false;
  hideModelOther();
}

function populateYears() {
  const year = document.getElementById('yearSelect');
  const current = new Date().getFullYear();
  for (let y = current + 1; y >= 1980; y--) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    year.appendChild(opt);
  }
}

function showModelOther() {
  const other = document.getElementById('modelOther');
  other.classList.add('show');
  other.querySelector('input').required = true;
}
function hideModelOther() {
  const other = document.getElementById('modelOther');
  other.classList.remove('show');
  other.querySelector('input').required = false;
}

document.addEventListener('DOMContentLoaded', async () => {
  const header = document.querySelector('header');
  const heroLogo = document.querySelector('.racing-banner-image');

  if (header && heroLogo) {
    const updateCompactHeader = () => {
      header.classList.toggle('is-condensed', window.scrollY > heroLogo.offsetTop + heroLogo.offsetHeight);
    };

    window.addEventListener('scroll', updateCompactHeader, { passive: true });
    updateCompactHeader();
  }

  // indicate loading state
  const brand = document.getElementById('brandSelect');
  brand.innerHTML = '<option>Ładowanie marek…</option>';
  const model = document.getElementById('modelSelect');
  model.innerHTML = '<option>Ładowanie…</option>';
  model.disabled = true;

  await loadVehicleDB();
  populateBrands();
  populateYears();

  // update UI note with diagnostics
  const note = document.getElementById('vehicleDataNote');
  const count = brand ? Math.max(0, brand.options.length - 2) : 0; // minus placeholder + 'Inna'
  if (note) {
    if (count > 0) note.textContent = `Baza marek załadowana: ${count} marek.`;
    else note.textContent = 'Baza marek załadowana, ale brak wpisów — możesz wpisać markę ręcznie.';
  }
  // log sample to console for debugging
  try {
    const keys = Object.keys(VEHICLE_MAP || {}).slice(0,20);
    console.debug('vehicleDB brands count=', Object.keys(VEHICLE_MAP || {}).length, 'sample=', keys);
  } catch (e) {}

  const brandEl = document.getElementById('brandSelect');
  const modelEl = document.getElementById('modelSelect');
  brandEl.addEventListener('change', (e) => populateModels(e.target.value));
  modelEl.addEventListener('change', (e) => {
    if (e.target.value === 'Inny') showModelOther(); else hideModelOther();
  });
});
