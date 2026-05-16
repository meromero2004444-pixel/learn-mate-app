import { FACULTY_KB } from '../data/kb';

const RAG_CONFIG = {
    websiteUrl: 'https://spcd.psu.edu.eg',
    pages: {
        departments: '/scientific-departments/',
        about: '/about-faculty/',
        admin: '/faculty-administration/',
        news: '/news-center/',
        staff: '/staff-2/',
        itUnit: '/it-unit/',
        academicAdvising: '/academic-advising/'
    },
    corsProxies: [
        u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
        u => `https://corsproxy.io/?${encodeURIComponent(u)}`,
        u => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`
    ],
    cacheTTL: 30 * 60 * 1000,
    cacheKey: 'rag_faculty_cache_v2',
    maxContextChunks: 6,
    chunkMinLength: 30
};

class SimpleSearchIndex {
    constructor() {
        this.docs = [];
        this.termDocFreq = {};
        this.totalDocs = 0;
        this.built = false;
        this.arStopWords = new Set([
            'في', 'من', 'إلى', 'على', 'عن', 'مع', 'هذا', 'هذه', 'ذلك', 'تلك',
            'كان', 'كانت', 'يكون', 'يكونون', 'ليست', 'ليس', 'قد', 'سوف', 'إن',
            'أن', 'لا', 'ما', 'لم', 'لن', 'إذا', 'حين', 'ثم', 'أو', 'و',
            'فـ', 'بـ', 'لـ', 'هل', 'أ', 'هو', 'هي', 'هم', 'هن', 'انت', 'انتم',
            'نحن', 'انا', 'الذي', 'التي', 'الذين', 'اللذان', 'اللتان', 'هؤلاء',
            'كانوا', 'كن', 'له', 'لها', 'لهم', 'منها', 'منه', 'فيه', 'فيها',
            'عليه', 'عليها', 'بين', 'تحت', 'فوق', 'عند', 'دون', 'كل', 'بعض',
            'أي', 'اي', 'غير', 'سيتم', 'يمكن', 'تم', 'تمثل', 'حيث',
            'كما', 'لقد', 'حتى', 'اذا', 'او', 'ولكن', 'لكن', 'بعد', 'قبل',
            'اثناء', 'خلال', 'به', 'بها', 'لدى', 'لدي'
        ]);
    }

    tokenize(text) {
        const cleaned = text
            .replace(/<[^>]+>/g, ' ')
            .replace(/[^\w\s\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFa-zA-Z0-9_]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
        const tokens = cleaned.split(/\s+/).filter(t => t.length > 1);
        return tokens.filter(t => !this.arStopWords.has(t));
    }

    addDocument(id, text, metadata) {
        const tokens = this.tokenize(text);
        const termFreq = {};
        for (const t of tokens) {
            termFreq[t] = (termFreq[t] || 0) + 1;
        }
        this.docs.push({ id, text, metadata, termFreq, maxFreq: Math.max(1, ...Object.values(termFreq)) });
        this.totalDocs++;
        for (const t of Object.keys(termFreq)) {
            this.termDocFreq[t] = (this.termDocFreq[t] || 0) + 1;
        }
    }

    search(query, topK) {
        if (!this.docs.length) return [];
        topK = topK || RAG_CONFIG.maxContextChunks;
        const qTokens = this.tokenize(query);
        if (!qTokens.length) return [];

        const scored = this.docs.map(doc => {
            let score = 0;
            for (const t of qTokens) {
                const tf = (doc.termFreq[t] || 0) / doc.maxFreq;
                const idf = Math.log((this.totalDocs + 1) / ((this.termDocFreq[t] || 0) + 1)) + 1;
                score += tf * idf;
            }
            for (const t of qTokens) {
                if (doc.text.toLowerCase().includes(t)) {
                    score += 0.1;
                }
            }
            return { ...doc, score };
        });

        scored.sort((a, b) => b.score - a.score);
        return scored.filter(d => d.score > 0.01).slice(0, topK);
    }
}

class WebsiteScraper {
    async fetchPage(path) {
        const url = RAG_CONFIG.websiteUrl + path;
        try {
            const resp = await fetch(url, { signal: AbortSignal.timeout(5000) });
            if (resp.ok) return await resp.text();
        } catch { }

        for (const proxyFn of RAG_CONFIG.corsProxies) {
            try {
                const proxyUrl = proxyFn(url);
                const resp = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
                if (resp.ok) return await resp.text();
            } catch { continue; }
        }
        return null;
    }

    extractMainContent(html) {
        if (!html) return '';
        let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ');
        text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ');
        text = text.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, ' ');
        text = text.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, ' ');
        text = text.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, ' ');
        
        const blocks = [];
        const headingMatch = text.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi);
        const paraMatch = text.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
        const liMatch = text.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
        const divWithText = text.match(/<div[^>]*>([^<]{20,})<\/div>/gi);

        for (const m of [headingMatch, paraMatch, liMatch, divWithText]) {
            if (m) blocks.push(...m);
        }
        return blocks.map(b => b.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
            .filter(b => b.length > RAG_CONFIG.chunkMinLength)
            .join('\n');
    }

    async scrapeAndIndex(index) {
        const pages = [
            { path: RAG_CONFIG.pages.departments, label: 'الأقسام العلمية' },
            { path: RAG_CONFIG.pages.about, label: 'عن الكلية' },
            { path: RAG_CONFIG.pages.admin, label: 'إدارة الكلية' },
            { path: RAG_CONFIG.pages.staff, label: 'هيئة التدريس' },
            { path: RAG_CONFIG.pages.itUnit, label: 'وحدة تكنولوجيا المعلومات' },
            { path: RAG_CONFIG.pages.academicAdvising, label: 'الإرشاد الأكاديمي' }
        ];

        let count = 0;
        for (const page of pages) {
            try {
                const html = await this.fetchPage(page.path);
                if (html) {
                    const content = this.extractMainContent(html);
                    if (content.length > 50) {
                        const chunks = this.chunkText(content, page.label);
                        for (const chunk of chunks) {
                            index.addDocument(`web_${page.label}_${count}`, chunk, { source: page.label, url: RAG_CONFIG.websiteUrl + page.path });
                            count++;
                        }
                    }
                }
            } catch { }
        }
        return count;
    }

    chunkText(text, source) {
        const sentences = text.split(/[.\n!؟?]+/).filter(s => s.trim().length > 20);
        const chunks = [];
        let current = '';
        for (const s of sentences) {
            if ((current + s).length > 300 && current.length > 50) {
                chunks.push(current.trim());
                current = s;
            } else {
                current += (current ? '. ' : '') + s;
            }
        }
        if (current.trim().length > 30) chunks.push(current.trim());
        return chunks.length ? chunks : [text.substring(0, 500)];
    }
}

function buildStaticKBDocuments(index) {
    const kb = FACULTY_KB;
    index.addDocument('kb_college', `${kb.college.name} ${kb.college.nameEn} ${kb.college.university} ${kb.college.description} ${kb.college.goal} ${kb.college.vision} ${kb.college.mission} ${kb.college.establishment}`, { source: 'عن الكلية', official: true });
    index.addDocument('kb_address', `العنوان: ${kb.college.address} - الرقم البريدي: ${kb.college.postalCode} - البريد: ${kb.college.email}`, { source: 'عن الكلية', official: true });

    const adminText = `عميد الكلية: ${kb.administration.dean.name} (${kb.administration.dean.specialization}). وكلاء الكلية: ${kb.administration.vices.map(v => `${v.name} - ${v.title}`).join('، ')}`;
    index.addDocument('kb_admin', adminText, { source: 'إدارة الكلية', official: true });

    index.addDocument('kb_system', `${kb.academicSystem.name}: ${kb.academicSystem.description} المميزات: ${kb.academicSystem.features.join('، ')}. التقييم: ${kb.academicSystem.evaluation}. ${kb.academicSystem.graduateStudies}`, { source: 'النظام الأكاديمي', official: true });

    for (const d of kb.departments) {
        const deptText = `قسم ${d.name}: ${d.goal} رئيس القسم: ${d.head.name} (${d.head.title}). المواد: ${d.subjects.join('، ')}. المهارات: ${d.skills.join('، ')}. مجالات العمل: ${d.careers.join('، ')}.`;
        index.addDocument(`kb_dept_${d.id}`, deptText, { source: `قسم ${d.name}`, official: true, url: d.url });
    }

    for (const u of kb.collegeUnits) {
        const unitText = `${u.name}: ${u.services ? u.services.join('، ') : ''}`;
        index.addDocument(`kb_unit_${u.name}`, unitText, { source: u.name, official: true });
    }

    for (const s of kb.firstYearSubjects) {
        const subjText = `مادة ${s.name} (${s.code}): ${s.topics.join('، ')}`;
        index.addDocument(`kb_subj_${s.code}`, subjText, { source: 'مواد الفرقة الأولى', official: true });
    }
}

export const RAGEngine = {
    index: new SimpleSearchIndex(),
    scraper: new WebsiteScraper(),
    initialized: false,
    initPromise: null,

    async ensureInitialized() {
        if (this.initialized) return;
        if (this.initPromise) return this.initPromise;

        this.initPromise = this._initialize();
        return this.initPromise;
    },

    async _initialize() {
        try {
            if (typeof window !== 'undefined') {
                const raw = localStorage.getItem(RAG_CONFIG.cacheKey);
                if (raw) {
                    const entry = JSON.parse(raw);
                    if (Date.now() < entry.expiry) {
                        const cached = entry.data;
                        this.index.docs = cached.documents;
                        this.index.termDocFreq = cached.termDocFreq;
                        this.index.totalDocs = cached.totalDocs;
                        this.initialized = true;
                        return;
                    }
                }
            }

            buildStaticKBDocuments(this.index);
            this._scrapeInBackground();
            this.initialized = true;
        } catch (e) {
            buildStaticKBDocuments(this.index);
            this.initialized = true;
        }
    },

    async _scrapeInBackground() {
        try {
            const webCount = await this.scraper.scrapeAndIndex(this.index);
            if (webCount > 0 && typeof window !== 'undefined') {
                localStorage.setItem(RAG_CONFIG.cacheKey, JSON.stringify({
                    data: {
                        documents: this.index.docs,
                        termDocFreq: this.index.termDocFreq,
                        totalDocs: this.index.totalDocs
                    },
                    expiry: Date.now() + RAG_CONFIG.cacheTTL
                }));
            }
        } catch { }
    },

    retrieve(query) {
        return this.index.search(query, RAG_CONFIG.maxContextChunks);
    },

    buildSystemPrompt() {
        const kb = FACULTY_KB;
        const deptList = kb.departments.map(d => `- ${d.name}: ${d.goal} (رئيس القسم: ${d.head.name})`).join('\n');
        const subjList = kb.firstYearSubjects.map(s => `- ${s.name}`).join('\n');

        return `أنت "المساعد الأكاديمي لكلية التربية النوعية" بجامعة بورسعيد. أنت خبير متخصص حصريًا في كل ما يخص هذه الكلية ولا تجيب عن أي شيء خارج نطاقها.

## معلومات أساسية:
- الاسم: ${kb.college.name}
- الجامعة: ${kb.college.university}
- العنوان: ${kb.college.address}
- البريد الإلكتروني: ${kb.college.email}

## إدارة الكلية:
- عميد الكلية: ${kb.administration.dean.name}
- وكيل التعليم والطلاب: ${kb.administration.vices[0].name}

## الأقسام العلمية:
${deptList}

## مواد الفرقة الأولى:
${subjList}

## قواعد الإجابة الصارمة:
1. تخصصك يقتصر على كلية التربية النوعية بجامعة بورسعيد فقط.
2. اللغة العربية هي الأساس.
3. استخدم Markdown للتنسيق.
4. كن ودوداً ومرشداً.`;
    },

    formatContext(chunks) {
        if (!chunks || !chunks.length) return '';
        const seen = new Set();
        const unique = chunks.filter(c => {
            const key = c.text.substring(0, 100);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
        return unique.map((c, i) => `[مصدر ${i + 1}: ${c.metadata?.source || 'الكلية'}]\n${c.text.substring(0, 500)}`).join('\n\n');
    }
};
