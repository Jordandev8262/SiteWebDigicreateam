/**
 * Simulateur d'activité pour tester le système d'analytics
 * Ce script simule des activités utilisateur pour tester le dashboard admin
 */

class ActivitySimulator {
    constructor() {
        this.isSimulating = false;
        this.simulationInterval = null;
    }

    // Démarrer la simulation d'activité
    startSimulation() {
        if (this.isSimulating) return;
        
        this.isSimulating = true;
        console.log('🎯 Simulation d\'activité démarrée');
        
        // Simuler des activités toutes les 3-8 secondes
        this.simulationInterval = setInterval(() => {
            this.simulateRandomActivity();
        }, Math.random() * 5000 + 3000);
    }

    // Arrêter la simulation
    stopSimulation() {
        if (!this.isSimulating) return;
        
        this.isSimulating = false;
        clearInterval(this.simulationInterval);
        console.log('⏹️ Simulation d\'activité arrêtée');
    }

    // Simuler une activité aléatoire
    simulateRandomActivity() {
        const activities = [
            () => this.simulatePageVisit(),
            () => this.simulateLinkClick(),
            () => this.simulateButtonClick(),
            () => this.simulateFormSubmission(),
            () => this.simulateScroll(),
            () => this.simulateImageView()
        ];

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        randomActivity();
    }

    // Simuler une visite de page
    simulatePageVisit() {
        const pages = ['index.html', 'Ourteams.html', 'Boutique.html'];
        const randomPage = pages[Math.floor(Math.random() * pages.length)];
        
        // Simuler un changement de page
        const analytics = window.DigiCreaTeamAnalytics;
        if (analytics) {
            const instance = new analytics();
            instance.addRecentActivity('visit', `Visite simulée de ${randomPage}`, 'À l\'instant');
        }
        
        console.log('📄 Visite simulée:', randomPage);
    }

    // Simuler un clic sur un lien
    simulateLinkClick() {
        const links = [
            'ACCUEIL', 'A PROPOS', 'Services', 'Projets', 'Contact', 'Equipe', 'Admin'
        ];
        const randomLink = links[Math.floor(Math.random() * links.length)];
        
        const analytics = window.DigiCreaTeamAnalytics;
        if (analytics) {
            const instance = new analytics();
            instance.addRecentActivity('click', `Clic simulé sur "${randomLink}"`, 'À l\'instant');
        }
        
        console.log('🖱️ Clic simulé:', randomLink);
    }

    // Simuler un clic sur un bouton
    simulateButtonClick() {
        const buttons = [
            'Découvrir', 'Commencer', 'Contacter', 'Explorer', 'Débuter', 'Envoyer'
        ];
        const randomButton = buttons[Math.floor(Math.random() * buttons.length)];
        
        const analytics = window.DigiCreaTeamAnalytics;
        if (analytics) {
            const instance = new analytics();
            instance.addRecentActivity('button', `Clic simulé sur le bouton "${randomButton}"`, 'À l\'instant');
        }
        
        console.log('🔘 Bouton simulé:', randomButton);
    }

    // Simuler une soumission de formulaire
    simulateFormSubmission() {
        const forms = ['Formulaire de contact', 'Formulaire d\'inscription', 'Formulaire de demande'];
        const randomForm = forms[Math.floor(Math.random() * forms.length)];
        
        const analytics = window.DigiCreaTeamAnalytics;
        if (analytics) {
            const instance = new analytics();
            instance.addRecentActivity('form', `Soumission simulée: ${randomForm}`, 'À l\'instant');
        }
        
        console.log('📝 Formulaire simulé:', randomForm);
    }

    // Simuler un scroll
    simulateScroll() {
        const scrollPercentages = [25, 50, 75, 90];
        const randomPercent = scrollPercentages[Math.floor(Math.random() * scrollPercentages.length)];
        
        const analytics = window.DigiCreaTeamAnalytics;
        if (analytics) {
            const instance = new analytics();
            instance.addRecentActivity('scroll', `Scroll simulé à ${randomPercent}%`, 'À l\'instant');
        }
        
        console.log('📜 Scroll simulé:', randomPercent + '%');
    }

    // Simuler une vue d'image
    simulateImageView() {
        const images = ['person_1.jpg', 'product-1.png', 'drone.jpg', 'Presentation.jpg'];
        const randomImage = images[Math.floor(Math.random() * images.length)];
        
        const analytics = window.DigiCreaTeamAnalytics;
        if (analytics) {
            const instance = new analytics();
            instance.addRecentActivity('image', `Image simulée vue: ${randomImage}`, 'À l\'instant');
        }
        
        console.log('🖼️ Image simulée:', randomImage);
    }

    // Générer des données de test
    generateTestData() {
        const analytics = this.getAnalyticsData();
        
        // Ajouter des données de test
        analytics.totalVisitors = Math.floor(Math.random() * 1000) + 500;
        analytics.totalClicks = Math.floor(Math.random() * 5000) + 2000;
        analytics.totalPages = Math.floor(Math.random() * 10000) + 5000;
        analytics.avgTime = Math.floor(Math.random() * 300) + 60;
        
        // Générer des données de visiteurs par mois
        analytics.visitorsData = Array.from({length: 12}, () => Math.floor(Math.random() * 100) + 20);
        
        // Générer des données de pages
        analytics.pagesData = [
            { name: 'Accueil', views: Math.floor(Math.random() * 500) + 200 },
            { name: 'Services', views: Math.floor(Math.random() * 300) + 150 },
            { name: 'Équipe', views: Math.floor(Math.random() * 250) + 100 },
            { name: 'Boutique', views: Math.floor(Math.random() * 200) + 80 },
            { name: 'Contact', views: Math.floor(Math.random() * 150) + 50 }
        ];
        
        // Générer des statistiques de liens
        analytics.linkStats = [
            { url: 'index.html', clicks: Math.floor(Math.random() * 200) + 100 },
            { url: 'Ourteams.html', clicks: Math.floor(Math.random() * 150) + 80 },
            { url: 'Boutique.html', clicks: Math.floor(Math.random() * 120) + 60 },
            { url: '#section_3', clicks: Math.floor(Math.random() * 100) + 40 },
            { url: '#section_5', clicks: Math.floor(Math.random() * 80) + 30 }
        ];
        
        localStorage.setItem('digicreateam_analytics', JSON.stringify(analytics));
        console.log('📊 Données de test générées');
    }

    // Obtenir les données d'analytics
    getAnalyticsData() {
        const data = localStorage.getItem('digicreateam_analytics');
        if (data) {
            return JSON.parse(data);
        }
        return {
            totalVisitors: 0,
            totalClicks: 0,
            totalPages: 0,
            avgTime: 0,
            recentActivity: [],
            linkStats: [],
            visitorsData: [],
            pagesData: []
        };
    }
}

// Exposer le simulateur globalement
window.ActivitySimulator = ActivitySimulator;

// Ajouter des boutons de contrôle en mode développement
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', function() {
        // Créer les boutons de contrôle
        const controlPanel = document.createElement('div');
        controlPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
        `;
        
        controlPanel.innerHTML = `
            <div>🎯 Simulateur d'Activité</div>
            <button id="startSimulation" style="margin: 5px; padding: 5px;">Démarrer</button>
            <button id="stopSimulation" style="margin: 5px; padding: 5px;">Arrêter</button>
            <button id="generateTestData" style="margin: 5px; padding: 5px;">Données Test</button>
        `;
        
        document.body.appendChild(controlPanel);
        
        // Gérer les clics sur les boutons
        const simulator = new ActivitySimulator();
        
        document.getElementById('startSimulation').addEventListener('click', () => {
            simulator.startSimulation();
        });
        
        document.getElementById('stopSimulation').addEventListener('click', () => {
            simulator.stopSimulation();
        });
        
        document.getElementById('generateTestData').addEventListener('click', () => {
            simulator.generateTestData();
            location.reload();
        });
    });
}
