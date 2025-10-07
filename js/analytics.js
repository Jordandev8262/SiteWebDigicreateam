/**
 * Système d'analytics pour DigiCreaTeam
 * Track les visiteurs, clics et interactions sur le site
 */

class DigiCreaTeamAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.clickCount = 0;
        this.pageViews = 0;
        this.init();
    }

    // Générer un ID de session unique
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Initialiser le système d'analytics
    init() {
        this.trackPageView();
        this.trackClicks();
        this.trackFormSubmissions();
        this.trackScrollDepth();
        this.trackTimeOnPage();
        this.trackButtonClicks();
        this.trackImageViews();
        this.trackVideoInteractions();
        
        // Enregistrer la session au localStorage
        this.saveSession();
    }

    // Tracker les vues de page
    trackPageView() {
        const currentPage = window.location.pathname;
        const pageData = {
            url: currentPage,
            title: document.title,
            timestamp: new Date().toISOString(),
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language
        };

        this.pageViews++;
        this.savePageView(pageData);
        
        // Ajouter à l'activité récente
        this.addRecentActivity('visit', `Visite de la page ${currentPage}`, this.getRelativeTime());
    }

    // Tracker les clics
    trackClicks() {
        document.addEventListener('click', (event) => {
            const target = event.target;
            const link = target.closest('a');
            
            if (link) {
                this.clickCount++;
                const clickData = {
                    url: link.href,
                    text: link.textContent.trim(),
                    timestamp: new Date().toISOString(),
                    page: window.location.pathname
                };
                
                this.saveClick(clickData);
                
                // Ajouter à l'activité récente avec plus de détails
                const linkText = link.textContent.trim() || link.href;
                this.addRecentActivity('click', `Clic sur "${linkText}"`, this.getRelativeTime());
            }
        });
    }

    // Tracker les soumissions de formulaire
    trackFormSubmissions() {
        document.addEventListener('submit', (event) => {
            const form = event.target;
            
            // Collecter les données du formulaire
            const formData = new FormData(form);
            const formFields = {};
            for (let [key, value] of formData.entries()) {
                formFields[key] = value;
            }
            
            const submissionData = {
                action: form.action,
                method: form.method,
                timestamp: new Date().toISOString(),
                page: window.location.pathname,
                formId: form.id || 'sans-id',
                formClass: form.className || 'sans-classe',
                fields: Object.keys(formFields),
                fieldCount: Object.keys(formFields).length
            };
            
            this.saveFormSubmission(submissionData);
            
            // Ajouter à l'activité récente avec plus de détails
            const formName = form.id || form.className || 'Formulaire de contact';
            const fieldInfo = submissionData.fieldCount > 0 ? ` (${submissionData.fieldCount} champs)` : '';
            this.addRecentActivity('form', `Formulaire "${formName}" soumis${fieldInfo}`, this.getRelativeTime());
        });
    }

    // Tracker la profondeur de scroll
    trackScrollDepth() {
        let maxScroll = 0;
        let scrollMilestones = [25, 50, 75, 90];
        let reachedMilestones = new Set();
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Ajouter une activité pour les jalons de scroll
                scrollMilestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !reachedMilestones.has(milestone)) {
                        reachedMilestones.add(milestone);
                        this.addRecentActivity('scroll', `Scroll atteint ${milestone}% de la page`, this.getRelativeTime());
                    }
                });
            }
        });
        
        // Sauvegarder la profondeur de scroll avant de quitter
        window.addEventListener('beforeunload', () => {
            this.saveScrollDepth(maxScroll);
        });
    }

    // Tracker le temps passé sur la page
    trackTimeOnPage() {
        let timeOnPage = 0;
        
        // Mettre à jour le temps toutes les 5 secondes
        const timeInterval = setInterval(() => {
            timeOnPage += 5;
        }, 5000);
        
        // Sauvegarder le temps avant de quitter
        window.addEventListener('beforeunload', () => {
            clearInterval(timeInterval);
            this.saveTimeOnPage(timeOnPage);
        });
    }

    // Tracker les clics sur les boutons
    trackButtonClicks() {
        document.addEventListener('click', (event) => {
            const target = event.target;
            const button = target.closest('button');
            
            if (button && !button.closest('a')) {
                const buttonText = button.textContent.trim() || button.getAttribute('aria-label') || 'Bouton';
                this.addRecentActivity('button', `Clic sur le bouton "${buttonText}"`, this.getRelativeTime());
            }
        });
    }

    // Tracker les vues d'images
    trackImageViews() {
        const images = document.querySelectorAll('img');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const imgSrc = img.src.split('/').pop() || 'Image';
                    this.addRecentActivity('image', `Image "${imgSrc}" vue`, this.getRelativeTime());
                    imageObserver.unobserve(img);
                }
            });
        }, { threshold: 0.5 });

        images.forEach(img => imageObserver.observe(img));
    }

    // Tracker les interactions vidéo
    trackVideoInteractions() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.addEventListener('play', () => {
                this.addRecentActivity('video', 'Vidéo lancée', this.getRelativeTime());
            });
            
            video.addEventListener('pause', () => {
                this.addRecentActivity('video', 'Vidéo mise en pause', this.getRelativeTime());
            });
            
            video.addEventListener('ended', () => {
                this.addRecentActivity('video', 'Vidéo terminée', this.getRelativeTime());
            });
        });
    }

    // Sauvegarder une vue de page
    savePageView(pageData) {
        const analytics = this.getAnalyticsData();
        analytics.pageViews.push(pageData);
        analytics.totalPages = analytics.pageViews.length;
        this.saveAnalyticsData(analytics);
    }

    // Sauvegarder un clic
    saveClick(clickData) {
        const analytics = this.getAnalyticsData();
        
        // Trouver ou créer l'entrée pour ce lien
        let linkStat = analytics.linkStats.find(link => link.url === clickData.url);
        if (!linkStat) {
            linkStat = { url: clickData.url, clicks: 0 };
            analytics.linkStats.push(linkStat);
        }
        linkStat.clicks++;
        
        analytics.totalClicks = analytics.linkStats.reduce((sum, link) => sum + link.clicks, 0);
        this.saveAnalyticsData(analytics);
    }

    // Sauvegarder une soumission de formulaire
    saveFormSubmission(formData) {
        const analytics = this.getAnalyticsData();
        analytics.formSubmissions = analytics.formSubmissions || [];
        analytics.formSubmissions.push(formData);
        this.saveAnalyticsData(analytics);
    }

    // Sauvegarder la profondeur de scroll
    saveScrollDepth(depth) {
        const analytics = this.getAnalyticsData();
        analytics.scrollDepth = analytics.scrollDepth || [];
        analytics.scrollDepth.push({
            page: window.location.pathname,
            depth: depth,
            timestamp: new Date().toISOString()
        });
        this.saveAnalyticsData(analytics);
    }

    // Sauvegarder le temps passé sur la page
    saveTimeOnPage(time) {
        const analytics = this.getAnalyticsData();
        analytics.timeOnPage = analytics.timeOnPage || [];
        analytics.timeOnPage.push({
            page: window.location.pathname,
            time: time,
            timestamp: new Date().toISOString()
        });
        
        // Calculer le temps moyen
        const totalTime = analytics.timeOnPage.reduce((sum, entry) => sum + entry.time, 0);
        analytics.avgTime = Math.round(totalTime / analytics.timeOnPage.length);
        
        this.saveAnalyticsData(analytics);
    }

    // Obtenir le temps relatif
    getRelativeTime() {
        return 'À l\'instant';
    }

    // Ajouter une activité récente
    addRecentActivity(type, title, time) {
        const analytics = this.getAnalyticsData();
        analytics.recentActivity = analytics.recentActivity || [];
        
        // Éviter les doublons récents (même activité dans les 5 dernières secondes)
        const now = Date.now();
        const recentActivity = analytics.recentActivity.find(activity => 
            activity.title === title && 
            (now - new Date(activity.timestamp).getTime()) < 5000
        );
        
        if (!recentActivity) {
            analytics.recentActivity.unshift({
                type: type,
                title: title,
                time: time,
                timestamp: new Date().toISOString()
            });
            
            // Garder seulement les 20 dernières activités
            if (analytics.recentActivity.length > 20) {
                analytics.recentActivity = analytics.recentActivity.slice(0, 20);
            }
            
            this.saveAnalyticsData(analytics);
        }
    }

    // Sauvegarder la session
    saveSession() {
        const sessionData = {
            sessionId: this.sessionId,
            startTime: this.startTime,
            clickCount: this.clickCount,
            pageViews: this.pageViews
        };
        
        sessionStorage.setItem('digicreateam_session', JSON.stringify(sessionData));
    }

    // Obtenir les données d'analytics
    getAnalyticsData() {
        const data = localStorage.getItem('digicreateam_analytics');
        if (data) {
            return JSON.parse(data);
        }
        
        // Données par défaut
        return {
            totalVisitors: 0,
            totalClicks: 0,
            totalPages: 0,
            avgTime: 0,
            pageViews: [],
            linkStats: [],
            formSubmissions: [],
            scrollDepth: [],
            timeOnPage: [],
            recentActivity: [],
            visitorsData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            pagesData: []
        };
    }

    // Sauvegarder les données d'analytics
    saveAnalyticsData(analytics) {
        localStorage.setItem('digicreateam_analytics', JSON.stringify(analytics));
    }

    // Obtenir les statistiques
    getStats() {
        const analytics = this.getAnalyticsData();
        return {
            totalVisitors: analytics.totalVisitors || 0,
            totalClicks: analytics.totalClicks || 0,
            totalPages: analytics.totalPages || 0,
            avgTime: analytics.avgTime || 0,
            recentActivity: analytics.recentActivity || [],
            linkStats: analytics.linkStats || []
        };
    }

    // Incrémenter le compteur de visiteurs
    incrementVisitors() {
        const analytics = this.getAnalyticsData();
        analytics.totalVisitors++;
        this.saveAnalyticsData(analytics);
    }
}

// Initialiser l'analytics quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si c'est la première visite de la session
    const sessionData = sessionStorage.getItem('digicreateam_session');
    if (!sessionData) {
        // Nouvelle session - incrémenter les visiteurs
        const analytics = new DigiCreaTeamAnalytics();
        analytics.incrementVisitors();
    } else {
        // Session existante - juste initialiser le tracking
        new DigiCreaTeamAnalytics();
    }
});

// Exposer la classe globalement pour utilisation dans d'autres scripts
window.DigiCreaTeamAnalytics = DigiCreaTeamAnalytics;
