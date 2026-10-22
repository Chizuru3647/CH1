// ==========================================
// 千鶴の約束簿 (Chizuru's Promise Ledger) v2.0
// Clean Initial State • Persistent Storage • Polished UI
// ==========================================

const STORAGE_KEY = 'chizuru_ledger_v2';
const LEGACY_KEY = 'chizuru_ledger_data';

const OUTFITS = [
  {
    id: 'mizuhara_pink',
    name: '水原千鶴・粉紅約會裝',
    persona: 'mizuhara',
    desc: '經典粉色蝴蝶結上衣與白裙（透明立繪）',
    img: './images/stand_mizuhara_pink.png',
    avatar: './images/avatar_mizuhara.png',
    isTransparent: true
  },
  {
    id: 'ichinose_glasses',
    name: '一之瀨千鶴・大學眼鏡裝',
    persona: 'ichinose',
    desc: '黑框眼鏡與雙麻花辮的認真鄰居模式',
    img: './images/stand_ichinose.png',
    avatar: './images/avatar_ichinose.png',
    isTransparent: false
  },
  {
    id: 'mizuhara_red',
    name: '水原千鶴・紅罩衫私服',
    persona: 'mizuhara',
    desc: '紅色針織外套搭配圓點短裙（透明立繪）',
    img: './images/stand_mizuhara_red.png',
    avatar: './images/avatar_mizuhara.png',
    isTransparent: true
  },
  {
    id: 'date_street',
    name: '街頭約會・溫柔凝視',
    persona: 'mizuhara',
    desc: '約會途中回眸微笑的心動瞬間',
    img: './images/cg_date_card.png',
    avatar: './images/avatar_mizuhara.png',
    isTransparent: false
  },
  {
    id: 'date_aquarium',
    name: '水族館之戀・燦爛笑容',
    persona: 'mizuhara',
    desc: '在湛藍水族館裡露出的治癒笑顏',
    img: './images/cg_aquarium_card.png',
    avatar: './images/avatar_mizuhara.png',
    isTransparent: false
  }
];

const EXPENSE_CATEGORIES = [
  { id: 'food', name: '伙食餐飲', icon: '🍽️', color: '#FF6B8B' },
  { id: 'drink', name: '飲料甜點', icon: '🧋', color: '#FF9F43' },
  { id: 'traffic', name: '交通通勤', icon: '🚆', color: '#54A0FF' },
  { id: 'shopping', name: '日常購物', icon: '🛍️', color: '#A29BFE' },
  { id: 'date', name: '娛樂約會', icon: '🎬', color: '#FD79A8' },
  { id: 'living', name: '房租水電', icon: '🏠', color: '#48DBFB' },
  { id: 'study', name: '學習進修', icon: '📚', color: '#1DD1A1' },
  { id: 'impulse', name: '衝動消費', icon: '💥', color: '#EE5253' },
];

const INCOME_CATEGORIES = [
  { id: 'salary', name: '薪資收入', icon: '💰', color: '#10AC84' },
  { id: 'bonus', name: '獎金補助', icon: '🎁', color: '#F368E0' },
  { id: 'invest', name: '投資理財', icon: '📈', color: '#2E86DE' },
  { id: 'other_in', name: '其他收入', icon: '✨', color: '#FF9F43' },
];

const ACCOUNTS = [
  { id: 'cash', name: '現金', icon: '💵' },
  { id: 'card', name: '信用卡', icon: '💳' },
  { id: 'mobile', name: '行動支付', icon: '📱' },
  { id: 'bank', name: '銀行帳戶', icon: '🏦' },
];

function getTodayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Web Audio Synthesizer
class SoundPlayer {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
  }
  playCoin() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, this.ctx.currentTime);
      osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {}
  }
  playSuccess() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.08, now + i * 0.055);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.055 + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.055);
        osc.stop(now + i * 0.055 + 0.22);
      });
    } catch (e) {}
  }
  playAlert() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.setValueAtTime(220, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {}
  }
  playTap() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(640, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }
}

const DIALOGUES = {
  ichinose: {
    welcome: [
      { text: "帳本已經準備好了！每一筆收支都要老實記下來喔。", jp: "家計簿の準備はできてるわよ。一円単位で記録しなさいよね。" },
      { text: "買東西前先想想：這是『必需品』還是單純『想要』？", jp: "買う前に考えて。『必要な物』？それともただ『欲しい物』？" },
      { text: "我是隔壁的一之瀨。我會嚴格監督你的每月預算的！", jp: "隣の一ノ瀬よ。今月の予算、しっかり監督するからね！" }
    ],
    recordExpense: [
      { text: "記下來了！資料已經幫你妥善保存囉。", jp: "記録したわ。データはちゃんと保存しておいたから。" },
      { text: "嗯，這筆開銷還算合理，繼續保持記帳的好習慣。", jp: "まあ、妥当な出費ね。このまま記録を続けなさいよ。" }
    ],
    recordIncome: [
      { text: "有收入進帳了呢！記得先規劃儲蓄，別馬上花掉喔！", jp: "収入が入ったわね！すぐ使わずに、まず貯金に回しなさいよ！" }
    ],
    impulseWarn: [
      { text: "等等！這筆開銷很大耶！你確定不是衝動消費嗎？！", jp: "ちょっと！かなりの出費よ？！衝動買いじゃないでしょうね！" },
      { text: "真是的…再這樣亂花錢，月底就要吃泡麵度日了喔！", jp: "もう…そんなにお金使って、月末どうするつもりなのよ！" }
    ],
    tap: [
      { text: "幹、幹嘛突然點我啦！我正在幫你核對帳本呢！", jp: "な、何よ急に！今あなたの家計簿をチェックしてるの！" },
      { text: "眼鏡歪掉了啦…別鬧了，今天還有沒有忘記記的帳？", jp: "メガネがズレるじゃない…今日つけ忘れた出費はないの？" }
    ]
  },
  mizuhara: {
    welcome: [
      { text: "今天也辛苦了！點擊右下角「＋」一起開始記帳吧～", jp: "今日もお疲れ様！右下の「＋」から一緒に家計簿をつけようね♪" },
      { text: "能陪著你一起管理生活收支，我真的很開心呢！", jp: "あなたと一緒にやりくりできて、私すごく嬉しいな。" },
      { text: "每一筆記帳都會自動保存下來，放心交給我吧！", jp: "記録は全部自動で保存されるから、私に任せてね！" }
    ],
    recordExpense: [
      { text: "記帳完成並儲存囉！今天也認真記錄了，好孩子～♪", jp: "記録して保存したよ！今日もちゃんとしてて偉いね、いい子♪" },
      { text: "辛苦啦！一步一腳印，我們一定能達成儲蓄目標的！", jp: "お疲れ様！一歩ずつ、目標に向かって進もうね！" }
    ],
    recordIncome: [
      { text: "太棒了，有新收入入帳呢！這是你努力的成果喔！", jp: "やったね、収入アップ！あなたが毎日頑張った結晶だよ！" }
    ],
    impulseWarn: [
      { text: "哎呀…這筆金額比較大呢，下半個月我們一起努力省回來吧！", jp: "あら…ちょっと大きめの出費だね。後半、一緒に節約頑張ろう！" }
    ],
    tap: [
      { text: "呵呵，怎麼了嗎？隨時都可以找我記帳或聊天喔～", jp: "ふふっ、どうしたの？いつでも家計簿つけに来てね♪" },
      { text: "只要你每天堅持記帳，千鶴就會一直在這裡陪著你喔！", jp: "あなたが毎日記録を続けてくれたら、私ずっとそばにいるよ！" }
    ]
  }
};

function createCleanDefaultState() {
  return {
    persona: 'mizuhara', // 'mizuhara' | 'ichinose'
    activeTab: 'home',   // 'home' | 'ledger' | 'analytics' | 'room'
    transactions: [],    // 100% CLEAN EMPTY INITIAL STATE
    monthlyBudget: 20000,
    affinity: {
      level: 1,
      exp: 0,
      nextExp: 100,
      rentalPoints: 0,
      currentOutfit: 'mizuhara_pink'
    },
    dreamFund: {
      title: '千鶴の自主製作映画基金',
      target: 50000,
      current: 0
    },
    customOutfits: [],
    currentQuote: DIALOGUES.mizuhara.welcome[0],
    // Modal state
    isModalOpen: false,
    editingId: null,
    calcType: 'expense',
    calcAmount: '0',
    calcCategory: 'food',
    calcAccount: 'cash',
    calcDate: getTodayStr(),
    calcNote: '',
    // Filter state
    filterType: 'all',
    searchQuery: ''
  };
}

window.App = {
  sound: new SoundPlayer(),
  state: createCleanDefaultState(),
  toastTimer: null,

  init() {
    this.loadState();
    this.refreshDialogue('welcome', false);
    this.render();
    this.setupKeyboardShortcuts();
  },

  loadState() {
    try {
      const savedV2 = localStorage.getItem(STORAGE_KEY);
      if (savedV2) {
        const parsed = JSON.parse(savedV2);
        this.state = {
          ...createCleanDefaultState(),
          ...parsed,
          affinity: { ...createCleanDefaultState().affinity, ...(parsed.affinity || {}) },
          dreamFund: { ...createCleanDefaultState().dreamFund, ...(parsed.dreamFund || {}) },
          transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
          customOutfits: Array.isArray(parsed.customOutfits) ? parsed.customOutfits : []
        };
        return;
      }

      // Check if user had v1 data and strip out the 7 hardcoded fake preset items ('t1'..'t7')
      const savedV1 = localStorage.getItem(LEGACY_KEY);
      if (savedV1) {
        const parsedV1 = JSON.parse(savedV1);
        const presetIds = new Set(['t1', 't2', 't3', 't4', 't5', 't6', 't7']);
        const userTransactions = Array.isArray(parsedV1.transactions)
          ? parsedV1.transactions.filter(t => t && !presetIds.has(t.id))
          : [];

        this.state = createCleanDefaultState();
        this.state.transactions = userTransactions.map(t => ({
          ...t,
          account: t.account || 'cash'
        }));
        if (parsedV1.monthlyBudget) {
          this.state.monthlyBudget = Number(parsedV1.monthlyBudget) || 20000;
        }
        // Recalculate affinity & dreamFund strictly from real user transactions
        this.state.affinity.exp = userTransactions.length * 20;
        this.state.affinity.rentalPoints = userTransactions.length * 10;
        localStorage.removeItem(LEGACY_KEY);
        this.saveState(false);
      }
    } catch (e) {
      console.warn('Error loading state:', e);
    }
  },

  saveState(showToast = true) {
    try {
      const payload = {
        persona: this.state.persona,
        monthlyBudget: this.state.monthlyBudget,
        transactions: this.state.transactions,
        affinity: this.state.affinity,
        dreamFund: this.state.dreamFund,
        customOutfits: this.state.customOutfits
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      if (showToast) {
        this.showSaveToast('✓ 記帳資料已自動保存');
      }
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
      alert('儲存空間不足或瀏覽器限制，請檢查設定。');
    }
  },

  showSaveToast(msg) {
    const toast = document.getElementById('save-toast');
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.remove('opacity-0', 'translate-y-2', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2', 'pointer-events-none');
      toast.classList.remove('opacity-100', 'translate-y-0');
    }, 2000);
  },

  getAllOutfits() {
    return [...OUTFITS, ...(this.state.customOutfits || [])];
  },

  getCurrentOutfitObj() {
    const all = this.getAllOutfits();
    return all.find(o => o.id === this.state.affinity.currentOutfit) || OUTFITS[0];
  },

  togglePersona() {
    this.sound.playSuccess();
    if (this.state.persona === 'mizuhara') {
      this.state.persona = 'ichinose';
      this.state.affinity.currentOutfit = 'ichinose_glasses';
    } else {
      this.state.persona = 'mizuhara';
      this.state.affinity.currentOutfit = 'mizuhara_pink';
    }
    this.refreshDialogue('welcome', false);
    this.saveState(true);
    this.render();
  },

  setTab(tab) {
    this.sound.playTap();
    this.state.activeTab = tab;
    this.render();
    if (tab === 'analytics') {
      requestAnimationFrame(() => this.renderCharts());
    }
  },

  refreshDialogue(type = 'welcome', updateDOMOnly = false) {
    const p = this.state.persona;
    const pool = (DIALOGUES[p] && DIALOGUES[p][type]) ? DIALOGUES[p][type] : DIALOGUES[p].welcome;
    this.state.currentQuote = pool[Math.floor(Math.random() * pool.length)];
    if (updateDOMOnly) {
      const jpEl = document.getElementById('dialogue-jp');
      const txtEl = document.getElementById('dialogue-text');
      if (jpEl) jpEl.innerText = this.state.currentQuote.jp;
      if (txtEl) txtEl.innerText = this.state.currentQuote.text;
    }
  },

  onChizuruClick() {
    this.sound.playTap();
    this.refreshDialogue('tap', true);
    const imgEl = document.getElementById('chizuru-main-img');
    if (imgEl) {
      imgEl.classList.remove('animate-pop');
      void imgEl.offsetWidth;
      imgEl.classList.add('animate-pop');
    }
  },

  // Financial Calculations
  getCurrentMonthPrefix() {
    return getTodayStr().slice(0, 7); // YYYY-MM
  },

  getMonthSpending() {
    const prefix = this.getCurrentMonthPrefix();
    return this.state.transactions
      .filter(t => t.type === 'expense' && (t.date || '').startsWith(prefix))
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  },

  getMonthIncome() {
    const prefix = this.getCurrentMonthPrefix();
    return this.state.transactions
      .filter(t => t.type === 'income' && (t.date || '').startsWith(prefix))
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  },

  getTodaySpending() {
    const today = getTodayStr();
    return this.state.transactions
      .filter(t => t.type === 'expense' && t.date === today)
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  },

  getCategoryMeta(type, catId) {
    const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    return list.find(c => c.id === catId) || { id: catId, name: '其他', icon: '📝', color: '#94A3B8' };
  },

  getAccountMeta(accId) {
    return ACCOUNTS.find(a => a.id === accId) || ACCOUNTS[0];
  },

  // Modal & Calculator Operations
  openAddModal(type = 'expense') {
    this.sound.playTap();
    this.state.editingId = null;
    this.state.calcType = type;
    this.state.calcAmount = '0';
    this.state.calcCategory = type === 'expense' ? 'food' : 'salary';
    this.state.calcAccount = 'cash';
    this.state.calcDate = getTodayStr();
    this.state.calcNote = '';
    this.state.isModalOpen = true;
    this.render();
  },

  openEditModal(txId) {
    const tx = this.state.transactions.find(t => t.id === txId);
    if (!tx) return;
    this.sound.playTap();
    this.state.editingId = tx.id;
    this.state.calcType = tx.type;
    this.state.calcAmount = String(tx.amount);
    this.state.calcCategory = tx.category;
    this.state.calcAccount = tx.account || 'cash';
    this.state.calcDate = tx.date || getTodayStr();
    this.state.calcNote = tx.note || '';
    this.state.isModalOpen = true;
    this.render();
  },

  closeModal() {
    this.sound.playTap();
    this.state.isModalOpen = false;
    this.state.editingId = null;
    this.render();
  },

  setCalcType(type) {
    this.sound.playTap();
    this.state.calcType = type;
    const validCats = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    if (!validCats.some(c => c.id === this.state.calcCategory)) {
      this.state.calcCategory = validCats[0].id;
    }
    this.render();
  },

  setCalcCategory(catId) {
    this.sound.playTap();
    this.state.calcCategory = catId;
    this.renderModalCategoryAndReaction();
  },

  setCalcAccount(accId) {
    this.sound.playTap();
    this.state.calcAccount = accId;
    this.render();
  },

  calcInput(char) {
    this.sound.playTap();
    let cur = String(this.state.calcAmount);

    if (char === 'C') {
      cur = '0';
    } else if (char === 'backspace') {
      cur = cur.length > 1 ? cur.slice(0, -1) : '0';
    } else if (char === '=') {
      cur = this.evaluateExpression(cur);
    } else if (['+', '-', '*', '/'].includes(char)) {
      const last = cur.slice(-1);
      if (['+', '-', '*', '/'].includes(last)) {
        cur = cur.slice(0, -1) + char;
      } else {
        cur += char;
      }
    } else {
      // Digit or dot
      if (cur === '0' && char !== '.') {
        cur = char;
      } else {
        cur += char;
      }
    }

    this.state.calcAmount = cur;
    const disp = document.getElementById('calc-display-amount');
    if (disp) disp.innerText = cur;
    this.renderModalCategoryAndReaction();
  },

  evaluateExpression(expr) {
    try {
      const sanitized = String(expr).replace(/[^0-9+\-*/.]/g, '');
      if (!sanitized) return '0';
      const val = Function(`'use strict'; return (${sanitized})`)();
      if (!isFinite(val) || isNaN(val)) return '0';
      return String(Math.max(0, Math.round(val * 100) / 100));
    } catch (e) {
      return '0';
    }
  },

  renderModalCategoryAndReaction() {
    // Update reaction text in modal without full re-render so input focus isn't lost
    const numVal = parseFloat(this.evaluateExpression(this.state.calcAmount)) || 0;
    const reactionTextEl = document.getElementById('modal-chizuru-comment');
    const reactionAvatarEl = document.getElementById('modal-chizuru-avatar');
    if (reactionTextEl && reactionAvatarEl) {
      if (this.state.calcType === 'expense' && (this.state.calcCategory === 'impulse' || numVal >= 3000)) {
        reactionAvatarEl.src = './images/avatar_ichinose.png';
        reactionTextEl.innerText = '一之瀨：「這筆金額不小喔！確定是必要支出嗎？」';
      } else if (this.state.calcType === 'income') {
        reactionAvatarEl.src = './images/avatar_mizuhara.png';
        reactionTextEl.innerText = '千鶴：「太棒了！有收入進帳，別忘了規劃儲蓄喔～」';
      } else {
        reactionAvatarEl.src = this.state.persona === 'ichinose' ? './images/avatar_ichinose.png' : './images/avatar_mizuhara.png';
        reactionTextEl.innerText = this.state.persona === 'ichinose'
          ? '一之瀨：「請輸入正確金額並選擇分類。」'
          : '千鶴：「今天也認真記帳了呢，交給我保管吧！」';
      }
    }

    // Highlight selected category button
    document.querySelectorAll('[data-cat-btn]').forEach(btn => {
      const cid = btn.getAttribute('data-cat-btn');
      if (cid === this.state.calcCategory) {
        btn.className = 'flex flex-col items-center gap-1 p-2 rounded-xl border-2 border-pink-500 bg-pink-50/80 shadow-sm scale-[1.03] transition-all';
      } else {
        btn.className = 'flex flex-col items-center gap-1 p-2 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-all';
      }
    });
  },

  saveTransaction() {
    const evaluated = this.evaluateExpression(this.state.calcAmount);
    const finalAmount = parseFloat(evaluated);
    if (!finalAmount || finalAmount <= 0) {
      alert('請輸入大於 0 的有效金額！');
      return;
    }

    const catMeta = this.getCategoryMeta(this.state.calcType, this.state.calcCategory);
    const noteText = (this.state.calcNote || '').trim() || catMeta.name;
    const dateStr = this.state.calcDate || getTodayStr();

    if (this.state.editingId) {
      // Update existing transaction
      const idx = this.state.transactions.findIndex(t => t.id === this.state.editingId);
      if (idx !== -1) {
        this.state.transactions[idx] = {
          ...this.state.transactions[idx],
          type: this.state.calcType,
          amount: finalAmount,
          category: this.state.calcCategory,
          account: this.state.calcAccount,
          date: dateStr,
          note: noteText
        };
      }
      this.sound.playSuccess();
    } else {
      // Create new transaction
      const newTx = {
        id: 'tx_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        type: this.state.calcType,
        amount: finalAmount,
        category: this.state.calcCategory,
        account: this.state.calcAccount,
        date: dateStr,
        note: noteText,
        timestamp: Date.now()
      };
      this.state.transactions.unshift(newTx);
      this.addAffinity(20, 10);

      if (newTx.type === 'income') {
        this.sound.playSuccess();
        this.refreshDialogue('recordIncome', false);
      } else if (newTx.category === 'impulse' || finalAmount >= 3000) {
        this.sound.playAlert();
        this.refreshDialogue('impulseWarn', false);
      } else {
        this.sound.playCoin();
        this.refreshDialogue('recordExpense', false);
      }
    }

    this.state.isModalOpen = false;
    this.state.editingId = null;
    this.saveState(true);
    this.render();
  },

  deleteTransaction(id, event) {
    if (event) event.stopPropagation();
    if (!confirm('確定要刪除這筆收支紀錄嗎？')) return;
    this.sound.playTap();
    this.state.transactions = this.state.transactions.filter(t => t.id !== id);
    if (this.state.editingId === id) {
      this.state.isModalOpen = false;
      this.state.editingId = null;
    }
    this.saveState(true);
    this.render();
  },

  addAffinity(expGain, rpGain) {
    this.state.affinity.exp += expGain;
    this.state.affinity.rentalPoints += rpGain;
    while (this.state.affinity.exp >= this.state.affinity.nextExp) {
      this.state.affinity.exp -= this.state.affinity.nextExp;
      this.state.affinity.level += 1;
      this.state.affinity.nextExp = Math.round(this.state.affinity.nextExp * 1.25);
    }
  },

  editBudget() {
    const input = prompt('請設定每月總預算上限 (NT$):', this.state.monthlyBudget);
    if (input === null) return;
    const val = parseFloat(input);
    if (!isNaN(val) && val > 0) {
      this.state.monthlyBudget = Math.round(val);
      this.sound.playSuccess();
      this.saveState(true);
      this.render();
    }
  },

  depositDreamFund() {
    const input = prompt(`請輸入要存入「${this.state.dreamFund.title}」的金額 (NT$):`, '500');
    if (input === null) return;
    const amount = parseFloat(input);
    if (isNaN(amount) || amount <= 0) {
      alert('請輸入有效金額！');
      return;
    }

    this.state.dreamFund.current += amount;
    this.state.transactions.unshift({
      id: 'tx_dream_' + Date.now(),
      type: 'expense',
      amount: amount,
      category: 'date',
      account: 'bank',
      date: getTodayStr(),
      note: `存入夢想基金：${this.state.dreamFund.title}`,
      timestamp: Date.now()
    });

    this.addAffinity(30, 20);
    this.sound.playSuccess();
    this.saveState(true);
    this.render();
  },

  editDreamGoal() {
    const newTitle = prompt('請輸入儲蓄目標名稱：', this.state.dreamFund.title);
    if (!newTitle) return;
    const newTarget = prompt('請輸入目標總金額 (NT$)：', this.state.dreamFund.target);
    if (!newTarget) return;
    const targetVal = parseFloat(newTarget);
    if (!isNaN(targetVal) && targetVal > 0) {
      this.state.dreamFund.title = newTitle.trim();
      this.state.dreamFund.target = Math.round(targetVal);
      this.saveState(true);
      this.render();
    }
  },

  selectOutfit(outfitId) {
    const all = this.getAllOutfits();
    const found = all.find(o => o.id === outfitId);
    if (!found) return;
    this.sound.playSuccess();
    this.state.affinity.currentOutfit = found.id;
    this.state.persona = found.persona || 'mizuhara';
    this.refreshDialogue('welcome', false);
    this.saveState(true);
    this.render();
  },

  triggerCustomImageUpload() {
    const fileInput = document.getElementById('custom-outfit-upload');
    if (fileInput) fileInput.click();
  },

  handleCustomImageFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const name = prompt('請為這張千鶴圖片命名：', '自訂千鶴立繪 #' + ((this.state.customOutfits || []).length + 1));
    if (!name) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const customId = 'custom_' + Date.now();
      this.state.customOutfits.push({
        id: customId,
        name: name.trim(),
        persona: this.state.persona,
        desc: '使用者自訂上傳圖片',
        img: dataUrl,
        avatar: dataUrl,
        isTransparent: false
      });
      this.state.affinity.currentOutfit = customId;
      this.sound.playSuccess();
      this.saveState(true);
      this.render();
    };
    reader.readAsDataURL(file);
  },

  exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `chizuru_ledger_backup_${getTodayStr()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  triggerImportData() {
    const input = document.getElementById('import-json-input');
    if (input) input.click();
  },

  handleImportData(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed && Array.isArray(parsed.transactions)) {
          this.state = {
            ...createCleanDefaultState(),
            ...parsed
          };
          this.saveState(true);
          this.render();
          alert('✓ 備份資料匯入成功！');
        } else {
          alert('檔案格式不正確！');
        }
      } catch (err) {
        alert('讀取 JSON 備份檔失敗！');
      }
    };
    reader.readAsText(file);
  },

  clearAllData() {
    if (confirm('確定要清空所有記帳資料、將帳本恢復為全新的空白初始狀態嗎？')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_KEY);
      this.state = createCleanDefaultState();
      this.saveState(true);
      this.render();
    }
  },

  speakQuote(text) {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'ja-JP';
        u.rate = 1.0;
        u.pitch = 1.15;
        window.speechSynthesis.speak(u);
      }
    } catch (e) {}
  },

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (!this.state.isModalOpen) return;
      if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        if (e.key === 'Escape') this.closeModal();
        return;
      }
      if (e.key >= '0' && e.key <= '9') {
        this.calcInput(e.key);
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        this.calcInput(e.key);
      } else if (e.key === 'Backspace') {
        this.calcInput('backspace');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.saveTransaction();
      } else if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  },

  // ==========================================
  // Main Render Pipeline
  // ==========================================
  render() {
    const appEl = document.getElementById('app');
    if (!appEl) return;

    const isIchinose = this.state.persona === 'ichinose';
    const outfit = this.getCurrentOutfitObj();
    const headerAvatar = isIchinose ? './images/avatar_ichinose.png' : './images/avatar_mizuhara.png';

    const spent = this.getMonthSpending();
    const income = this.getMonthIncome();
    const budget = this.state.monthlyBudget;
    const remaining = budget - spent;
    const spentPct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
    const isOverBudget = spent > budget;
    const todaySpent = this.getTodaySpending();

    appEl.innerHTML = `
      <div class="min-h-screen flex justify-center items-start py-0 sm:py-5 px-0 sm:px-4 bg-[#F5F2EE]">
        
        <!-- Auto-Save Floating Toast -->
        <div id="save-toast" class="save-toast fixed top-4 right-4 z-50 bg-slate-900/90 text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-lg opacity-0 translate-y-2 pointer-events-none">
          ✓ 記帳資料已自動保存
        </div>

        <!-- App Container -->
        <div class="w-full max-w-[440px] bg-[#FAF8F6] sm:rounded-[32px] shadow-2xl border border-pink-100/80 overflow-hidden flex flex-col min-h-screen sm:min-h-[840px] sm:max-h-[92vh] relative">
          
          <!-- Top Header Bar -->
          <header class="px-5 py-3.5 flex items-center justify-between shrink-0 ${isIchinose ? 'bg-slate-800 text-white' : 'bg-gradient-to-r from-[#FF6B8B] to-[#FF8E9E] text-white'} shadow-sm transition-colors duration-300">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full border-2 border-white/90 overflow-hidden shadow-sm shrink-0 bg-pink-50 cursor-pointer" onclick="App.onChizuruClick()">
                <img src="${headerAvatar}" alt="Chizuru Avatar" class="w-full h-full object-cover object-center" />
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <h1 class="text-base font-extrabold tracking-tight">千鶴の約束簿</h1>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${isIchinose ? 'bg-amber-400/20 text-amber-200 border border-amber-300/30' : 'bg-white/25 text-white'}">
                    ${isIchinose ? '👓 一之瀨模式' : '💎 水原模式'}
                  </span>
                </div>
                <p class="text-[11px] opacity-90 mt-0.5">
                  ${isIchinose ? '認真務實的鄰居理財管家' : '溫柔鼓勵的理想女友陪伴'}
                </p>
              </div>
            </div>

            <button onclick="App.togglePersona()" class="px-3 py-1.5 rounded-full text-xs font-extrabold shadow-sm transition-all active:scale-95 ${isIchinose ? 'bg-pink-500 hover:bg-pink-400 text-white' : 'bg-white text-pink-600 hover:bg-pink-50'}">
              ${isIchinose ? '切換水原 💎' : '切換一之瀨 👓'}
            </button>
          </header>

          <!-- Scrollable View Body -->
          <main class="flex-1 overflow-y-auto pb-28">
            ${this.renderActiveTab(spent, income, budget, remaining, spentPct, isOverBudget, todaySpent, outfit)}
          </main>

          <!-- Floating Quick-Add Button (+) -->
          <div class="absolute bottom-20 right-5 z-20">
            <button onclick="App.openAddModal('expense')" title="新增收支" class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF5E7E] to-[#FF8598] text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all">
              ＋
            </button>
          </div>

          <!-- Bottom Navigation Bar -->
          <nav class="glass-nav shrink-0 px-3 py-2.5 flex justify-around items-center z-10">
            ${this.renderNavBtn('home', '總覽', '🏠')}
            ${this.renderNavBtn('ledger', '帳目明細', '📒')}
            ${this.renderNavBtn('analytics', '統計週報', '📊')}
            ${this.renderNavBtn('room', '千鶴房間', '🎀')}
          </nav>

          <!-- Add / Edit Transaction Modal -->
          ${this.state.isModalOpen ? this.renderCalculatorModal() : ''}
        </div>
      </div>
    `;
  },

  renderNavBtn(tabKey, label, icon) {
    const active = this.state.activeTab === tabKey;
    return `
      <button onclick="App.setTab('${tabKey}')" class="flex-1 flex flex-col items-center gap-0.5 py-0.5 transition-all ${active ? 'tab-active' : 'text-slate-400 hover:text-slate-600'}">
        <span class="text-xl tab-icon transition-transform">${icon}</span>
        <span class="text-[11px]">${label}</span>
      </button>
    `;
  },

  renderActiveTab(spent, income, budget, remaining, spentPct, isOverBudget, todaySpent, outfit) {
    switch (this.state.activeTab) {
      case 'home':
        return this.renderHomeTab(spent, income, budget, remaining, spentPct, isOverBudget, todaySpent, outfit);
      case 'ledger':
        return this.renderLedgerTab();
      case 'analytics':
        return this.renderAnalyticsTab(spent, income, budget);
      case 'room':
        return this.renderRoomTab();
      default:
        return '';
    }
  },

  // ==========================================
  // Tab 1: Home Dashboard
  // ==========================================
  renderHomeTab(spent, income, budget, remaining, spentPct, isOverBudget, todaySpent, outfit) {
    const isIchinose = this.state.persona === 'ichinose';
    const dreamPct = this.state.dreamFund.target > 0
      ? Math.min(100, Math.round((this.state.dreamFund.current / this.state.dreamFund.target) * 100))
      : 0;

    return `
      <div class="p-4 space-y-4">
        
        <!-- Character Companion Card (Well-proportioned horizontal split) -->
        <div class="relative rounded-3xl border ${isIchinose ? 'bg-gradient-to-br from-slate-100 via-white to-slate-50 border-slate-200' : 'bg-gradient-to-br from-pink-50/90 via-white to-rose-50/70 border-pink-100'} shadow-sm overflow-hidden">
          <div class="grid grid-cols-12 items-stretch min-h-[200px]">
            
            <!-- Left Column: Dialogue & Status (7 cols) -->
            <div class="col-span-7 p-4 flex flex-col justify-between z-10">
              <div>
                <div class="flex items-center gap-1.5 mb-2">
                  <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-md ${isIchinose ? 'bg-slate-800 text-white' : 'bg-pink-500 text-white'}">
                    ${outfit.name}
                  </span>
                  <span class="text-[10px] font-bold text-pink-600 bg-pink-100/80 px-2 py-0.5 rounded-md">
                    Lv.${this.state.affinity.level}
                  </span>
                </div>

                <!-- Speech Bubble -->
                <div onclick="App.onChizuruClick()" class="companion-bubble p-3 border border-pink-100/80 cursor-pointer hover:border-pink-300 transition-all">
                  <p id="dialogue-jp" class="text-[10px] text-slate-400 leading-tight mb-1">${this.state.currentQuote.jp}</p>
                  <p id="dialogue-text" class="text-xs font-bold text-slate-800 leading-relaxed">${this.state.currentQuote.text}</p>
                </div>
              </div>

              <div class="flex items-center gap-2 mt-3">
                <button onclick="App.onChizuruClick()" class="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-2xs">
                  💬 對話互動
                </button>
                <button onclick="App.setTab('room')" class="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-pink-50 border border-pink-200 text-pink-600 hover:bg-pink-100">
                  👗 更換立繪
                </button>
              </div>
            </div>

            <!-- Right Column: Properly Framed Character Portrait (5 cols) -->
            <div onclick="App.onChizuruClick()" class="col-span-5 relative flex ${outfit.isTransparent ? 'items-end justify-center pt-3 px-1' : 'items-center justify-center p-2.5'} cursor-pointer select-none">
              ${outfit.isTransparent ? `
                <!-- Transparent Stand Render: Anchored neatly to bottom -->
                <img id="chizuru-main-img" src="${outfit.img}" alt="${outfit.name}" class="max-h-[195px] w-auto object-contain object-bottom drop-shadow-md transition-transform duration-200 hover:scale-[1.03]" />
              ` : `
                <!-- Scene / Portrait Card: Framed cleanly with rounded corners & top alignment -->
                <div class="w-full h-[180px] rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white">
                  <img id="chizuru-main-img" src="${outfit.img}" alt="${outfit.name}" class="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105" />
                </div>
              `}
            </div>

          </div>
        </div>

        <!-- Monthly Budget & Cashflow Overview Card -->
        <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3.5">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-extrabold text-slate-700">本月預算與收支</span>
              <span class="text-[10px] text-slate-400 font-medium">(${this.getCurrentMonthPrefix()})</span>
            </div>
            <button onclick="App.editBudget()" class="text-xs font-bold text-pink-500 hover:text-pink-600 bg-pink-50 px-2.5 py-1 rounded-lg">
              ⚙️ 設定預算
            </button>
          </div>

          <!-- 3 Key Metrics Grid -->
          <div class="grid grid-cols-3 gap-2.5">
            <div class="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
              <span class="text-[10px] font-bold text-slate-400 block">本月已支出</span>
              <span class="text-sm font-black text-slate-800 tabular-numbers mt-0.5 block">
                $${spent.toLocaleString()}
              </span>
            </div>
            <div class="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
              <span class="text-[10px] font-bold text-slate-400 block">預算剩餘</span>
              <span class="text-sm font-black ${isOverBudget ? 'text-red-500' : 'text-emerald-600'} tabular-numbers mt-0.5 block">
                ${isOverBudget ? '-' : ''}$${Math.abs(remaining).toLocaleString()}
              </span>
            </div>
            <div class="bg-pink-50/60 rounded-xl p-2.5 border border-pink-100/80">
              <span class="text-[10px] font-bold text-pink-500 block">今日支出</span>
              <span class="text-sm font-black text-pink-600 tabular-numbers mt-0.5 block">
                $${todaySpent.toLocaleString()}
              </span>
            </div>
          </div>

          <!-- Budget Bar -->
          <div class="space-y-1.5">
            <div class="flex justify-between text-[11px] font-bold">
              <span class="${isOverBudget ? 'text-red-500' : 'text-slate-500'}">
                ${isOverBudget ? '⚠️ 已超出月度預算！' : `預算使用率 ${spentPct}%`}
              </span>
              <span class="text-slate-400">月預算上限 $${budget.toLocaleString()}</span>
            </div>
            <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : spentPct > 80 ? 'bg-amber-400' : 'bg-gradient-to-r from-pink-400 to-rose-500'}" style="width: ${spentPct}%"></div>
            </div>
          </div>
        </div>

        <!-- Recent Transactions Section -->
        <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xs font-extrabold text-slate-700">
              最近收支紀錄
              <span class="text-[11px] font-normal text-slate-400 ml-1">(共 ${this.state.transactions.length} 筆)</span>
            </h3>
            ${this.state.transactions.length > 0 ? `
              <button onclick="App.setTab('ledger')" class="text-xs font-bold text-pink-500 hover:underline">查看全部 →</button>
            ` : ''}
          </div>

          ${this.state.transactions.length === 0 ? `
            <!-- Clean Empty State -->
            <div class="py-8 px-4 text-center rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 space-y-2.5">
              <div class="text-3xl">🌸</div>
              <div class="text-xs font-bold text-slate-700">帳本目前已是全新空白狀態</div>
              <p class="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                所有的收支紀錄都會自動保存在你的裝置中，現在就記下第一筆收支吧！
              </p>
              <button onclick="App.openAddModal('expense')" class="mt-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-extrabold shadow-sm transition-all">
                <span>＋ 新增第一筆記帳</span>
              </button>
            </div>
          ` : `
            <div class="divide-y divide-slate-100">
              ${this.state.transactions.slice(0, 5).map(t => this.renderTransactionRow(t)).join('')}
            </div>
          `}
        </div>

        <!-- Dream Fund Card -->
        <div class="bg-gradient-to-r from-amber-50 to-orange-50/80 border border-amber-200/70 rounded-2xl p-3.5 shadow-2xs">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2.5">
              <span class="text-xl p-2 bg-white rounded-xl shadow-2xs">🎬</span>
              <div>
                <div class="flex items-center gap-1.5">
                  <h4 class="text-xs font-extrabold text-amber-950">${this.state.dreamFund.title}</h4>
                  <button onclick="App.editDreamGoal()" class="text-[10px] text-amber-600 hover:underline">編輯</button>
                </div>
                <p class="text-[11px] text-amber-800 tabular-numbers">
                  已累積 <strong>$${this.state.dreamFund.current.toLocaleString()}</strong> / 目標 $${this.state.dreamFund.target.toLocaleString()} (${dreamPct}%)
                </p>
              </div>
            </div>
            <button onclick="App.depositDreamFund()" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold rounded-xl shadow-xs shrink-0">
              存入 ＋
            </button>
          </div>
          <div class="w-full bg-white/80 h-2 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500" style="width: ${dreamPct}%"></div>
          </div>
        </div>

      </div>
    `;
  },

  // ==========================================
  // Tab 2: Ledger (明細列表)
  // ==========================================
  renderLedgerTab() {
    let list = [...this.state.transactions];
    if (this.state.filterType !== 'all') {
      list = list.filter(t => t.type === this.state.filterType);
    }
    if (this.state.searchQuery.trim() !== '') {
      const q = this.state.searchQuery.trim().toLowerCase();
      list = list.filter(t => {
        const cat = this.getCategoryMeta(t.type, t.category);
        return (t.note || '').toLowerCase().includes(q) || cat.name.toLowerCase().includes(q);
      });
    }

    // Group by date descending
    const grouped = {};
    list.forEach(t => {
      const d = t.date || getTodayStr();
      if (!grouped[d]) grouped[d] = [];
      grouped[d].push(t);
    });
    const sortedDates = Object.keys(grouped).sort().reverse();

    return `
      <div class="p-4 space-y-3.5">
        
        <!-- Filter & Search Controls -->
        <div class="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs space-y-2.5">
          <div class="flex bg-slate-100 p-1 rounded-xl">
            <button onclick="App.setFilter('all')" class="flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all ${this.state.filterType === 'all' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500'}">
              全部 (${this.state.transactions.length})
            </button>
            <button onclick="App.setFilter('expense')" class="flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all ${this.state.filterType === 'expense' ? 'bg-white text-pink-600 shadow-2xs' : 'text-slate-500'}">
              支出
            </button>
            <button onclick="App.setFilter('income')" class="flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all ${this.state.filterType === 'income' ? 'bg-white text-emerald-600 shadow-2xs' : 'text-slate-500'}">
              收入
            </button>
          </div>

          <div class="relative">
            <input
              type="text"
              value="${this.state.searchQuery}"
              oninput="App.onSearchInput(this.value)"
              placeholder="🔍 搜尋備註或分類名稱..."
              class="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-pink-400"
            />
          </div>
        </div>

        <!-- Grouped Transactions -->
        ${sortedDates.length === 0 ? `
          <div class="bg-white rounded-2xl py-14 px-4 text-center border border-slate-100 space-y-2">
            <span class="text-4xl block">📒</span>
            <p class="text-xs font-bold text-slate-600">尚無符合條件的收支紀錄</p>
            <p class="text-[11px] text-slate-400">點擊右下角「＋」按鈕隨時新增記帳</p>
          </div>
        ` : sortedDates.map(date => {
          const items = grouped[date];
          const dayExpense = items.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
          const dayIncome = items.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
          return `
            <div class="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs">
              <div class="flex justify-between items-center text-[11px] pb-2 mb-1 border-b border-slate-100">
                <span class="font-extrabold text-slate-700">
                  ${date === getTodayStr() ? `今天 (${date})` : date}
                </span>
                <div class="flex items-center gap-2 font-bold tabular-numbers">
                  ${dayIncome > 0 ? `<span class="text-emerald-600">+$${dayIncome.toLocaleString()}</span>` : ''}
                  ${dayExpense > 0 ? `<span class="text-slate-600">-$${dayExpense.toLocaleString()}</span>` : ''}
                </div>
              </div>
              <div class="divide-y divide-slate-50">
                ${items.map(t => this.renderTransactionRow(t)).join('')}
              </div>
            </div>
          `;
        }).join('')}

      </div>
    `;
  },

  renderTransactionRow(t) {
    const cat = this.getCategoryMeta(t.type, t.category);
    const acc = this.getAccountMeta(t.account);
    const isExpense = t.type === 'expense';
    return `
      <div onclick="App.openEditModal('${t.id}')" class="flex items-center justify-between py-2.5 px-1.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style="background-color: ${cat.color}18">
            <span>${cat.icon}</span>
          </div>
          <div class="min-w-0">
            <div class="text-xs font-extrabold text-slate-800 truncate">${t.note}</div>
            <div class="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
              <span>${cat.name}</span>
              <span>•</span>
              <span>${acc.icon} ${acc.name}</span>
              <span>•</span>
              <span>${t.date}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0 ml-2">
          <span class="text-sm font-black tabular-numbers ${isExpense ? 'text-slate-800' : 'text-emerald-600'}">
            ${isExpense ? '-' : '+'}$${Number(t.amount).toLocaleString()}
          </span>
          <button onclick="App.deleteTransaction('${t.id}', event)" title="刪除" class="w-6 h-6 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center text-xs transition-colors">
            ✕
          </button>
        </div>
      </div>
    `;
  },

  setFilter(f) {
    this.sound.playTap();
    this.state.filterType = f;
    this.render();
  },

  onSearchInput(val) {
    this.state.searchQuery = val;
    this.render();
    const input = document.querySelector('input[placeholder*="搜尋"]');
    if (input) {
      input.focus();
      input.setSelectionRange(val.length, val.length);
    }
  },

  // ==========================================
  // Tab 3: Analytics (統計與千鶴週報)
  // ==========================================
  renderAnalyticsTab(spent, income, budget) {
    const hasTx = this.state.transactions.length > 0;
    let grade = '—';
    let reviewComment = '剛開始使用帳本呢！記下第一筆收支後，千鶴會根據你的消費習慣給出專屬評語喔～';

    if (hasTx) {
      if (spent === 0 && income > 0) {
        grade = 'S';
        reviewComment = '太強了！目前只有收入沒有支出，儲蓄進度滿分！';
      } else if (spent <= budget * 0.6) {
        grade = 'S';
        reviewComment = '非常自律的消費節奏！繼續保持下去，離我們的夢想越來越近了！';
      } else if (spent <= budget * 0.85) {
        grade = 'A';
        reviewComment = '收支控制得很穩健喔！每一分錢都有花在刀口上呢。';
      } else if (spent <= budget) {
        grade = 'B';
        reviewComment = '已經接近本月預算上限囉，接下來的日子稍微節制一點吧！';
      } else {
        grade = 'F';
        reviewComment = '已經超出本月預算了！從今天起禁止衝動購物，好好反省！';
      }
    }

    const avatar = this.state.persona === 'ichinose' ? './images/avatar_ichinose.png' : './images/avatar_mizuhara.png';

    return `
      <div class="p-4 space-y-4">
        
        <!-- Chizuru Report Card -->
        <div class="bg-gradient-to-br from-[#FF6B8B] to-[#FF8E9E] rounded-3xl p-5 text-white shadow-md">
          <div class="flex justify-between items-center mb-3">
            <div class="flex items-center gap-3">
              <img src="${avatar}" alt="Chizuru" class="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm bg-white" />
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-pink-100 block">千鶴の財務診断書</span>
                <h3 class="text-base font-black">本月理財綜合評級</h3>
              </div>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-white/25 backdrop-blur-xs flex items-center justify-center font-black text-2xl text-yellow-200 border border-white/40">
              ${grade}
            </div>
          </div>

          <p class="text-xs leading-relaxed bg-black/15 p-3 rounded-2xl border border-white/15">
            「${reviewComment}」
          </p>

          <div class="grid grid-cols-3 gap-2 text-center mt-3 pt-3 border-t border-white/20 text-xs">
            <div>
              <span class="text-[10px] text-pink-100 block">總收入</span>
              <strong class="font-extrabold tabular-numbers">$${income.toLocaleString()}</strong>
            </div>
            <div>
              <span class="text-[10px] text-pink-100 block">總支出</span>
              <strong class="font-extrabold tabular-numbers">$${spent.toLocaleString()}</strong>
            </div>
            <div>
              <span class="text-[10px] text-pink-100 block">收支結餘</span>
              <strong class="font-extrabold tabular-numbers">$${(income - spent).toLocaleString()}</strong>
            </div>
          </div>
        </div>

        <!-- Category Donut Chart -->
        <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
          <h4 class="text-xs font-extrabold text-slate-700 mb-3">支出分類佔比分析</h4>
          <div class="flex flex-col items-center">
            <canvas id="categoryDonutChart" width="210" height="210" class="mb-4"></canvas>
            <div id="chart-legend" class="w-full space-y-2"></div>
          </div>
        </div>

        <!-- Backup & Restore -->
        <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-2.5">
          <h4 class="text-xs font-extrabold text-slate-700">資料保存與備份管理</h4>
          <p class="text-[11px] text-slate-400">所有記帳資料皆即時儲存在瀏覽器本地，亦可匯出 JSON 檔案永久備份。</p>
          <div class="grid grid-cols-3 gap-2 pt-1">
            <button onclick="App.exportData()" class="py-2 px-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors">
              📥 匯出備份
            </button>
            <button onclick="App.triggerImportData()" class="py-2 px-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors">
              📤 匯入備份
            </button>
            <button onclick="App.clearAllData()" class="py-2 px-2 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
              🗑️ 清空帳本
            </button>
          </div>
          <input type="file" id="import-json-input" accept=".json" class="hidden" onchange="App.handleImportData(event)" />
        </div>

      </div>
    `;
  },

  renderCharts() {
    const canvas = document.getElementById('categoryDonutChart');
    const legendEl = document.getElementById('chart-legend');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const expenses = this.state.transactions.filter(t => t.type === 'expense');
    const totals = {};
    let totalSpent = 0;

    expenses.forEach(t => {
      const amt = Number(t.amount) || 0;
      totals[t.category] = (totals[t.category] || 0) + amt;
      totalSpent += amt;
    });

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = 82;
    const ir = 52;

    if (totalSpent === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.arc(cx, cy, ir, 0, 2 * Math.PI, true);
      ctx.fillStyle = '#F1F5F9';
      ctx.fill();

      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('尚無支出資料', cx, cy);
      if (legendEl) {
        legendEl.innerHTML = `<p class="text-center text-xs text-slate-400 py-2">新增支出後將自動繪製圓餅圖</p>`;
      }
      return;
    }

    let startAngle = -0.5 * Math.PI;
    const sortedCats = Object.keys(totals).sort((a, b) => totals[b] - totals[a]);
    if (legendEl) legendEl.innerHTML = '';

    sortedCats.forEach(catId => {
      const amt = totals[catId];
      const slice = (amt / totalSpent) * 2 * Math.PI;
      const meta = this.getCategoryMeta('expense', catId);

      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, startAngle + slice);
      ctx.arc(cx, cy, ir, startAngle + slice, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = meta.color;
      ctx.fill();

      startAngle += slice;

      if (legendEl) {
        const pct = Math.round((amt / totalSpent) * 100);
        legendEl.innerHTML += `
          <div class="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full shrink-0" style="background-color: ${meta.color}"></span>
              <span class="font-bold text-slate-700">${meta.icon} ${meta.name}</span>
            </div>
            <div class="flex items-center gap-3 tabular-numbers">
              <span class="text-slate-500">$${amt.toLocaleString()}</span>
              <span class="font-extrabold text-slate-800 w-9 text-right">${pct}%</span>
            </div>
          </div>
        `;
      }
    });

    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('總支出', cx, cy - 8);
    ctx.fillStyle = '#1E293B';
    ctx.font = '900 14px sans-serif';
    ctx.fillText('$' + totalSpent.toLocaleString(), cx, cy + 11);
  },

  // ==========================================
  // Tab 4: Chizuru Room & Wardrobe
  // ==========================================
  renderRoomTab() {
    const allOutfits = this.getAllOutfits();
    const expPct = Math.min(100, Math.round((this.state.affinity.exp / this.state.affinity.nextExp) * 100));
    const avatar = this.state.persona === 'ichinose' ? './images/avatar_ichinose.png' : './images/avatar_mizuhara.png';

    return `
      <div class="p-4 space-y-4">
        
        <!-- Affinity Status Card -->
        <div class="bg-white rounded-3xl p-4 border border-pink-100 shadow-xs flex items-center gap-4">
          <img src="${avatar}" alt="Chizuru" class="w-16 h-16 rounded-2xl object-cover border-2 border-pink-300 shadow-sm shrink-0" />
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-extrabold text-slate-800">水原千鶴 / 一之瀨千鶴</h3>
              <span class="text-xs font-black text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full">
                好感度 Lv.${this.state.affinity.level}
              </span>
            </div>
            <p class="text-[11px] text-slate-500 mt-0.5">
              每次記帳可獲得 +20 EXP 與 +10 約會點數 (目前 ${this.state.affinity.rentalPoints} RP)
            </p>
            <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
              <div class="bg-gradient-to-r from-pink-500 to-rose-400 h-full rounded-full transition-all" style="width: ${expPct}%"></div>
            </div>
            <p class="text-[10px] text-slate-400 mt-1 text-right">
              EXP ${this.state.affinity.exp} / ${this.state.affinity.nextExp}
            </p>
          </div>
        </div>

        <!-- Outfit & CG Selector -->
        <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3">
          <div class="flex justify-between items-center">
            <div>
              <h4 class="text-xs font-extrabold text-slate-800">千鶴立繪與約會圖鑑</h4>
              <p class="text-[10px] text-slate-400">點擊任意造型即可設為首頁看板娘，也可上傳自己的千鶴圖片</p>
            </div>
            <button onclick="App.triggerCustomImageUpload()" class="px-2.5 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-[11px] font-bold shadow-2xs shrink-0">
              ＋ 上傳圖片
            </button>
            <input type="file" id="custom-outfit-upload" accept="image/*" class="hidden" onchange="App.handleCustomImageFile(event)" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            ${allOutfits.map(item => {
              const isSelected = this.state.affinity.currentOutfit === item.id;
              return `
                <div onclick="App.selectOutfit('${item.id}')" class="rounded-2xl border-2 ${isSelected ? 'border-pink-500 bg-pink-50/40 shadow-sm' : 'border-slate-100 bg-white hover:border-pink-200'} p-2.5 flex flex-col cursor-pointer transition-all">
                  <div class="w-full h-40 rounded-xl overflow-hidden ${item.isTransparent ? 'bg-gradient-to-b from-pink-50/60 to-slate-50 flex items-end justify-center pt-2' : 'bg-slate-100'} relative mb-2">
                    <img
                      src="${item.img}"
                      alt="${item.name}"
                      class="${item.isTransparent ? 'max-h-full w-auto object-contain object-bottom' : 'w-full h-full object-cover object-top'}"
                    />
                    ${isSelected ? `
                      <span class="absolute top-2 right-2 bg-pink-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                        使用中 ✓
                      </span>
                    ` : ''}
                  </div>
                  <div class="text-xs font-extrabold text-slate-800 truncate">${item.name}</div>
                  <div class="text-[10px] text-slate-400 truncate mt-0.5">${item.desc}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Japanese Voice Clips -->
        <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-2">
          <h4 class="text-xs font-extrabold text-slate-800">千鶴的語音應援盒</h4>
          <button onclick="App.speakQuote('今日もちゃんと家計簿つけてる？一円単位で記録しなさいよね。')" class="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-pink-50 text-xs font-bold text-slate-700 flex items-center justify-between transition-colors">
            <span>🔊 「今天也有好好記帳嗎？每一筆都要算清楚喔。」</span>
            <span class="text-[10px] text-pink-500 shrink-0 ml-2">播放語音</span>
          </button>
          <button onclick="App.speakQuote('今日もお疲れ様！あなたと一緒にやりくりできて、私すごく嬉しいな。')" class="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-pink-50 text-xs font-bold text-slate-700 flex items-center justify-between transition-colors">
            <span>🔊 「今天也辛苦了！能和你一起理財真的很開心～」</span>
            <span class="text-[10px] text-pink-500 shrink-0 ml-2">播放語音</span>
          </button>
        </div>

      </div>
    `;
  },

  // ==========================================
  // Modal: Add / Edit Transaction + Calculator
  // ==========================================
  renderCalculatorModal() {
    const isExpense = this.state.calcType === 'expense';
    const categories = isExpense ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    const isEditing = Boolean(this.state.editingId);
    const modalAvatar = this.state.persona === 'ichinose' ? './images/avatar_ichinose.png' : './images/avatar_mizuhara.png';

    return `
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onclick="if(event.target === this) App.closeModal()">
        <div class="bg-white w-full max-w-[420px] rounded-t-3xl sm:rounded-3xl p-4 shadow-2xl space-y-3 animate-slide-up max-h-[92vh] overflow-y-auto">
          
          <!-- Modal Top Bar -->
          <div class="flex items-center justify-between">
            <div class="flex bg-slate-100 p-1 rounded-xl">
              <button onclick="App.setCalcType('expense')" class="px-4 py-1.5 text-xs font-extrabold rounded-lg transition-all ${isExpense ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-500'}">
                支出
              </button>
              <button onclick="App.setCalcType('income')" class="px-4 py-1.5 text-xs font-extrabold rounded-lg transition-all ${!isExpense ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-500'}">
                收入
              </button>
            </div>

            <span class="text-xs font-extrabold text-slate-500">
              ${isEditing ? '✏️ 編輯紀錄' : '✨ 新增收支'}
            </span>

            <button onclick="App.closeModal()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm">
              ✕
            </button>
          </div>

          <!-- Chizuru Mini Prompt Bar -->
          <div class="flex items-center gap-2.5 bg-pink-50/70 border border-pink-100 px-3 py-2 rounded-2xl">
            <img id="modal-chizuru-avatar" src="${modalAvatar}" alt="Chizuru" class="w-8 h-8 rounded-full object-cover border border-white shadow-2xs shrink-0" />
            <p id="modal-chizuru-comment" class="text-[11px] font-bold text-slate-700 leading-snug">
              ${this.state.persona === 'ichinose' ? '一之瀨：「請輸入正確金額並選擇分類。」' : '千鶴：「今天也認真記帳了呢，交給我保管吧！」'}
            </p>
          </div>

          <!-- Amount Display Box -->
          <div class="bg-slate-900 text-white rounded-2xl px-4 py-3 flex items-center justify-between shadow-inner">
            <span class="text-xs font-bold text-slate-400">${isExpense ? '支出金額 NT$' : '收入金額 NT$'}</span>
            <div id="calc-display-amount" class="text-2xl font-black tabular-numbers tracking-tight text-right truncate max-w-[240px]">
              ${this.state.calcAmount}
            </div>
          </div>

          <!-- Category Grid -->
          <div>
            <div class="grid grid-cols-4 gap-2">
              ${categories.map(cat => {
                const selected = this.state.calcCategory === cat.id;
                return `
                  <button
                    type="button"
                    data-cat-btn="${cat.id}"
                    onclick="App.setCalcCategory('${cat.id}')"
                    class="flex flex-col items-center gap-1 p-2 rounded-xl ${selected ? 'border-2 border-pink-500 bg-pink-50/80 shadow-sm scale-[1.03]' : 'border border-gray-100 bg-white hover:bg-gray-50'} transition-all"
                  >
                    <span class="text-lg">${cat.icon}</span>
                    <span class="text-[10px] font-bold text-slate-700">${cat.name}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Date, Account & Note Row -->
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[10px] font-bold text-slate-400 block mb-1">日期</label>
              <input
                type="date"
                value="${this.state.calcDate}"
                onchange="App.state.calcDate = this.value"
                class="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-none focus:border-pink-400"
              />
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 block mb-1">支付帳戶</label>
              <select
                onchange="App.state.calcAccount = this.value"
                class="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-none focus:border-pink-400"
              >
                ${ACCOUNTS.map(a => `
                  <option value="${a.id}" ${this.state.calcAccount === a.id ? 'selected' : ''}>${a.icon} ${a.name}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <div>
            <input
              type="text"
              value="${this.state.calcNote}"
              oninput="App.state.calcNote = this.value"
              placeholder="✏️ 輸入備註說明（例如：午餐便當、捷運、看電影...）"
              class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:border-pink-400"
            />
          </div>

          <!-- Calculator Keypad -->
          <div class="grid grid-cols-4 gap-1.5 pt-1">
            <button type="button" onclick="App.calcInput('7')" class="keypad-btn py-2.5 bg-slate-100 rounded-xl font-extrabold text-base text-slate-800">7</button>
            <button type="button" onclick="App.calcInput('8')" class="keypad-btn py-2.5 bg-slate-100 rounded-xl font-extrabold text-base text-slate-800">8</button>
            <button type="button" onclick="App.calcInput('9')" class="keypad-btn py-2.5 bg-slate-100 rounded-xl font-extrabold text-base text-slate-800">9</button>
            <button type="button" onclick="App.calcInput('+')" class="keypad-btn py-2.5 bg-pink-50 text-pink-600 rounded-xl font-extrabold text-base">＋</button>

            <button type="button" onclick="App.calcInput('4')" class="keypad-btn py-2.5 bg-slate-100 rounded-xl font-extrabold text-base text-slate-800">4</button>
            <button type="button" onclick="App.calcInput('5')" class="keypad-btn py-2.5 bg-slate-100 rounded-xl font-extrabold text-base text-slate-800">5</button>
            <button type="button" onclick="App.calcInput('6')" class="keypad-btn py-2.5 bg-slate-100 rounded-xl font-extrabold text-base text-slate-800">6</button>
            <button type="button" onclick="App.calcInput('-')" class="keypad-btn py-2.5 bg-pink-50 text-pink-600 rounded-xl font-extrabold text-base">－</button>

            <button type="button" onclick="App.calcInput('1')" class="keypad-btn py-2.5 bg-slate-100 rounded-xl font-extrabold text-base text-slate-800">1</button>
            <button type="button" onclick="App.calcInput('2')" class="keypad-btn py-2.5 bg-slate-100 rounded-xl font-extrabold text-base text-slate-800">2</button>
            <button type="button" onclick="App.calcInput('3')" class="keypad-btn py-2.5 bg-slate-100 rounded-xl font-extrabold text-base text-slate-800">3</button>
            <button type="button" onclick="App.calcInput('*')" class="keypad-btn py-2.5 bg-pink-50 text-pink-600 rounded-xl font-extrabold text-base">×</button>

            <button type="button" onclick="App.calcInput('C')" class="keypad-btn py-2.5 bg-slate-200 rounded-xl font-bold text-xs text-slate-600">清除</button>
            <button type="button" onclick="App.calcInput('0')" class="keypad-btn py-2.5 bg-slate-100 rounded-xl font-extrabold text-base text-slate-800">0</button>
            <button type="button" onclick="App.calcInput('backspace')" class="keypad-btn py-2.5 bg-slate-200 rounded-xl font-bold text-base text-slate-700">⌫</button>
            <button type="button" onclick="App.calcInput('=')" class="keypad-btn py-2.5 bg-pink-100 text-pink-700 rounded-xl font-extrabold text-base">＝</button>
          </div>

          <button type="button" onclick="App.saveTransaction()" class="w-full py-3 bg-gradient-to-r from-[#FF5E7E] to-[#FF8598] hover:opacity-95 text-white font-extrabold rounded-2xl shadow-md shadow-pink-500/20 text-sm transition-all">
            ${isEditing ? '💾 儲存修改' : '✓ 確認記帳並保存'}
          </button>

        </div>
      </div>
    `;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
