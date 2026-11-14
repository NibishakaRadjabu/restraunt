(() => {
  "use strict";

  const categories = ["Breakfast", "Lunch", "Dinner", "Drinks", "Dessert"];
  const translations = {
    fr: {
      "RESTAURANT OS": "SYSTÈME RESTAURANT", "WORKSPACE": "ESPACE DE TRAVAIL", "Dashboard": "Tableau de bord", "Orders": "Commandes", "Kitchen": "Cuisine", "Food menu": "Menu", "Tables": "Tables", "Billing": "Facturation", "MANAGEMENT": "GESTION", "Inventory": "Stocks", "Staff": "Personnel", "Reports": "Rapports",
      "Restaurant open": "Restaurant ouvert", "Service is running": "Le service est en cours", "Restaurant manager": "Gérant du restaurant", "Workspace": "Espace de travail", "Language": "Langue", "Sign out": "Déconnexion",
      "View reports": "Voir les rapports", "+ New order": "+ Nouvelle commande", "Today's sales": "Ventes du jour", "Total orders": "Commandes totales", "Available tables": "Tables disponibles", "Pending orders": "Commandes en attente", "completed today": "terminées aujourd’hui", "tables occupied": "tables occupées", "Orders in the kitchen queue": "Commandes en cuisine", "First sales recorded today": "Premières ventes du jour", "No sales yesterday": "Aucune vente hier", "vs. yesterday": "par rapport à hier", "Good morning": "Bonjour", "Good afternoon": "Bon après-midi", "Good evening": "Bonsoir", "Here’s what’s happening at Harbor & Hearth today.": "Voici l’activité du jour chez Harbor & Hearth.",
      "Sales overview": "Aperçu des ventes", "Payments received over the last 7 days": "Paiements reçus au cours des 7 derniers jours", "Last 7 days": "7 derniers jours", "Top selling foods": "Plats les plus vendus", "Most popular on today's menu": "Les plus populaires aujourd’hui", "Full menu →": "Menu complet →", "Recent orders": "Commandes récentes", "Latest activity from your floor": "Dernière activité en salle", "All orders →": "Toutes les commandes →", "Quick actions": "Actions rapides", "Common tasks, right at your fingertips": "Vos tâches courantes en un clic", "Create an order": "Créer une commande", "View floor plan": "Voir le plan de salle", "Check inventory": "Vérifier les stocks",
      "SERVICE": "SERVICE", "Track and manage every order from the first click to the last bite.": "Suivez chaque commande, de sa création à son service.", "Search orders or customers...": "Rechercher une commande ou un client...", "All orders": "Toutes les commandes", "Order": "Commande", "Customer": "Client", "Items": "Articles", "Amount": "Montant", "Order type": "Type de commande", "Payment": "Paiement", "Status": "Statut", "Actions": "Actions", "Unpaid": "Non payée", "Paid": "Payée", "New": "Nouvelle", "Preparing": "En préparation", "Ready": "Prête", "Completed": "Terminée", "No orders found": "Aucune commande trouvée", "Try a different search or create a new order.": "Modifiez la recherche ou créez une commande.",
      "BACK OF HOUSE": "CUISINE", "Kitchen display": "Écran de cuisine", "Keep the whole kitchen in sync with live order progress.": "Suivez en direct la progression des commandes en cuisine.", "New orders": "Nouvelles commandes", "Preparing": "En préparation", "Ready to serve": "Prêtes à servir", "Start preparing": "Commencer la préparation", "Mark ready": "Marquer comme prête", "Complete order": "Terminer la commande", "Nothing in this queue.": "Aucune commande dans cette file.", "Refresh": "Actualiser",
      "YOUR KITCHEN, YOUR CREATIONS": "VOTRE CUISINE, VOS CRÉATIONS", "Keep your menu fresh, organized, and ready to serve.": "Gérez un menu à jour, organisé et prêt à servir.", "+ Add food item": "+ Ajouter un plat", "Search menu...": "Rechercher dans le menu...", "All categories": "Toutes les catégories", "menu items": "plats", "Food item": "Plat", "Category": "Catégorie", "Price": "Prix", "Description": "Description", "Availability": "Disponibilité", "Available": "Disponible", "Hidden": "Masqué", "Edit": "Modifier", "Hide": "Masquer", "Show": "Afficher", "No menu items found": "Aucun plat trouvé", "Add an item or change your filters.": "Ajoutez un plat ou modifiez les filtres.", "Breakfast": "Petit-déjeuner", "Lunch": "Déjeuner", "Dinner": "Dîner", "Drinks": "Boissons", "Dessert": "Dessert",
      "FRONT OF HOUSE": "SALLE", "Table management": "Gestion des tables", "A live view of your dining room, at a glance.": "Visualisez l’état de votre salle en un coup d’œil.", "+ Add table": "+ Ajouter une table", "Dining room · Main floor": "Salle principale · Rez-de-chaussée", "seats": "places", "Reserved": "Réservée",
      "CHECKOUT": "ENCAISSEMENT", "Billing & payments": "Facturation et paiements", "Take payments, view receipts, and keep every transaction accounted for.": "Encaissez les paiements et consultez les reçus et transactions.", "Print report": "Imprimer le rapport", "Collected today": "Encaissé aujourd’hui", "transactions recorded": "transactions enregistrées", "Awaiting payment": "En attente de paiement", "Orders ready for checkout": "Commandes à encaisser", "Ready for checkout": "À encaisser", "Unpaid orders": "Commandes non payées", "Order total": "Total de la commande", "Order status": "État de la commande", "Take payment": "Encaisser", "All orders are paid. You’re all caught up!": "Toutes les commandes sont payées.", "Recent transactions": "Transactions récentes", "Payment history across all orders": "Historique des paiements", "Payment date": "Date du paiement", "Method": "Mode de paiement", "No payments recorded yet.": "Aucun paiement enregistré.",
      "YOUR TEAM": "VOTRE ÉQUIPE", "Staff management": "Gestion du personnel", "The people who make every service special.": "Les personnes qui rendent chaque service unique.", "+ Add staff member": "+ Ajouter un membre", "team members": "membres de l’équipe", "Monthly": "Mensuel", "Full name": "Nom complet", "Role": "Rôle", "Phone number": "Téléphone", "Monthly salary": "Salaire mensuel",
      "STOCK & SUPPLIERS": "STOCKS ET FOURNISSEURS", "Stay ahead of stock levels and keep your kitchen prepared.": "Suivez les niveaux de stock et préparez votre cuisine.", "+ Add ingredient": "+ Ajouter un ingrédient", "Low-stock alert": "Alerte de stock bas", "Low-stock alerts": "Alertes de stock bas", "Restock soon to avoid running out.": "Réapprovisionnez pour éviter les ruptures.", "ingredients tracked": "ingrédients suivis", "Record purchase": "Enregistrer un achat", "Ingredient": "Ingrédient", "In stock": "En stock", "Low stock": "Stock bas", "Low-stock threshold": "Seuil d’alerte", "Supplier": "Fournisseur", "Stock actions": "Gestion du stock", "Stock in": "Entrée de stock", "Stock out": "Sortie de stock", "Recent purchases": "Achats récents", "Incoming stock records": "Historique des entrées", "Purchase": "Achat", "Quantity": "Quantité", "No purchases recorded yet.": "Aucun achat enregistré.", "Current quantity": "Quantité actuelle", "Supplier name": "Nom du fournisseur",
      "INSIGHTS & PERFORMANCE": "ANALYSES ET PERFORMANCES", "Reports": "Rapports", "Understand your sales, spot trends, and make confident decisions.": "Analysez vos ventes et prenez des décisions éclairées.", "Today's sales": "Ventes du jour", "This week": "Cette semaine", "This month": "Ce mois-ci", "Payments received today": "Paiements reçus aujourd’hui", "payments received": "paiements reçus", "Best-selling foods": "Plats les plus vendus", "Ranked by units sold this month": "Classés par quantité vendue ce mois-ci", "sold": "vendus", "Recent sales activity": "Activité récente des ventes", "Completed payment transactions": "Paiements enregistrés", "No sales recorded in this period.": "Aucune vente sur cette période.", "Sales will appear here as payments are recorded.": "Les ventes apparaîtront ici après les paiements.",
      "Save changes": "Enregistrer", "Cancel": "Annuler", "Close": "Fermer", "Add to menu": "Ajouter au menu", "Add food item": "Ajouter un plat", "Image emoji": "Émoji du plat", "A short, appetizing description": "Une description courte et appétissante", "Table number": "Numéro de table", "Number of seats": "Nombre de places", "Add table": "Ajouter la table", "Create a new order": "Créer une commande", "Customer name": "Nom du client", "Dine-in": "Sur place", "Takeaway": "À emporter", "Delivery": "Livraison", "Dining table": "Table", "No table / takeaway": "Sans table / à emporter", "Choose a menu item": "Choisir un plat", "Food item 1": "Plat 1", "Food item 2": "Plat 2", "Food item 3": "Plat 3", "Food item 4": "Plat 4", "Qty": "Qté", "Order items": "Articles de la commande", "Choose up to four menu items. Leave unused rows blank.": "Choisissez jusqu’à quatre plats. Laissez les lignes inutilisées vides.", "Order total": "Total de la commande", "Create order": "Créer la commande", "Amount received": "Montant reçu", "Payment method": "Mode de paiement", "Cash": "Espèces", "Mobile Money": "Paiement mobile", "Card": "Carte", "Record payment": "Enregistrer le paiement", "Add a team member": "Ajouter un membre", "Add team member": "Ajouter le membre", "Ingredient name": "Nom de l’ingrédient", "Unit": "Unité", "Current quantity": "Quantité actuelle", "Supplier": "Fournisseur",
      "Order summary · unpaid": "Récapitulatif · non payé", "PAYMENT RECEIPT": "REÇU DE PAIEMENT", "ORDER SUMMARY · UNPAID": "RÉCAPITULATIF · NON PAYÉ", "Receipt": "Reçu", "Thank you for dining with us!": "Merci de votre visite !", "We hope to see you again soon.": "À bientôt !",
      "Username": "Nom d’utilisateur", "Password": "Mot de passe", "Sign in": "Se connecter", "Sign in to your restaurant": "Connectez-vous à votre restaurant", "Enter your staff account to continue.": "Saisissez vos identifiants pour continuer.", "Your account is waiting for a manager to create the first login.": "En attente de la création du premier compte manager.", "Sign-in failed": "Échec de connexion", "Change temporary password": "Changer le mot de passe temporaire", "Current password": "Mot de passe actuel", "New password": "Nouveau mot de passe", "Confirm new password": "Confirmer le nouveau mot de passe", "Update password": "Mettre à jour le mot de passe", "Your temporary password must be changed before continuing.": "Vous devez changer le mot de passe temporaire avant de continuer.", "Create staff account": "Créer un compte du personnel", "Temporary password": "Mot de passe temporaire", "Create account": "Créer le compte", "Account": "Compte", "Username": "Nom d’utilisateur", "Last sign in": "Dernière connexion", "Active": "Actif", "Disabled": "Désactivé", "Enable": "Activer", "Disable": "Désactiver", "Manager": "Manager", "Cashier": "Caissier", "Chef": "Cuisinier", "Waiter": "Serveur", "No staff accounts yet.": "Aucun compte du personnel.",
      "FACTURE": "FACTURE", "FACTURE ACQUITTÉE": "FACTURE ACQUITTÉE", "FACTURÉ À": "FACTURÉ À", "DÉTAILS DE LA FACTURE": "DÉTAILS DE LA FACTURE", "DÉSIGNATION": "DÉSIGNATION", "QTÉ": "QTÉ", "PRIX UNIT.": "PRIX UNIT.", "MONTANT": "MONTANT", "Sous-total": "Sous-total", "Total à payer": "Total à payer", "RÉGLÉE": "RÉGLÉE", "À RÉGLER": "À RÉGLER", "Merci de votre confiance.": "Merci de votre confiance.", "Coordonnées légales et TVA non configurées.": "Coordonnées légales et TVA non configurées.",
      "Staff login accounts": "Comptes du personnel", "Role-based access to restaurant data and actions": "Accès aux données selon le rôle", "Create staff account": "Créer un compte du personnel", "Staff account created. Share the temporary password securely.": "Compte créé. Transmettez le mot de passe temporaire de manière sécurisée.", "Account status updated.": "Statut du compte mis à jour.", "Current account": "Compte actuel", "The new staff member must change this password at first sign-in. Use at least 12 characters with letters and numbers.": "Le nouvel employé devra changer son mot de passe à la première connexion. Utilisez au moins 12 caractères avec des lettres et des chiffres.", "Can’t connect to the restaurant database": "Connexion à la base de données impossible", "Connecting to your restaurant database": "Connexion à la base de données du restaurant", "Loading live menu, tables, orders, and reports…": "Chargement du menu, des tables, commandes et rapports…", "Start MySQL in XAMPP and import": "Démarrez MySQL dans XAMPP et importez", "if this is your first run.": "s’il s’agit du premier lancement.", "Start Apache and MySQL in XAMPP.": "Démarrez Apache et MySQL dans XAMPP.", "Try again": "Réessayer", "Retry connection": "Réessayer la connexion", "Change password": "Changer le mot de passe", "No manager account exists yet. Create the first account in a terminal:": "Aucun compte manager. Créez le premier compte dans un terminal :", "Use at least 12 characters, including letters and numbers.": "Utilisez au moins 12 caractères, avec des lettres et des chiffres.", "The new passwords do not match.": "Les nouveaux mots de passe ne correspondent pas.", "Password updated successfully.": "Mot de passe mis à jour.", "Please sign in to continue.": "Connectez-vous pour continuer.", "Change your temporary password before continuing.": "Changez le mot de passe temporaire pour continuer.", "Your account does not have permission to do that.": "Votre compte n’est pas autorisé à effectuer cette action.", "Cross-origin requests are not allowed.": "Les requêtes inter-origines sont interdites.", "Your security token expired. Refresh the page and try again.": "Votre jeton de sécurité a expiré. Actualisez la page et réessayez.", "Username or password is incorrect.": "Nom d’utilisateur ou mot de passe incorrect.", "Too many sign-in attempts. Wait 15 minutes and try again.": "Trop de tentatives. Réessayez dans 15 minutes.", "Current password is incorrect.": "Le mot de passe actuel est incorrect.", "Use at least 12 characters with both letters and numbers.": "Utilisez au moins 12 caractères avec des lettres et des chiffres.", "Choose a password you have not used before.": "Choisissez un mot de passe jamais utilisé.", "The last active manager account cannot be disabled.": "Le dernier compte manager actif ne peut pas être désactivé."
    },
    sw: {
      "RESTAURANT OS": "MFUMO WA MGHAWA", "WORKSPACE": "ENEO LA KAZI", "Dashboard": "Dashibodi", "Orders": "Maagizo", "Kitchen": "Jikoni", "Food menu": "Menyu ya chakula", "Tables": "Meza", "Billing": "Malipo", "MANAGEMENT": "USIMAMIZI", "Inventory": "Hesabu ya bidhaa", "Staff": "Wafanyakazi", "Reports": "Ripoti",
      "Restaurant open": "Mgahawa uko wazi", "Service is running": "Huduma inaendelea", "Restaurant manager": "Msimamizi wa mgahawa", "Workspace": "Eneo la kazi", "Language": "Lugha", "Sign out": "Ondoka",
      "View reports": "Tazama ripoti", "+ New order": "+ Agizo jipya", "Today's sales": "Mauzo ya leo", "Total orders": "Jumla ya maagizo", "Available tables": "Meza zinazopatikana", "Pending orders": "Maagizo yanayosubiri", "completed today": "yaliyokamilika leo", "tables occupied": "meza zenye wateja", "Orders in the kitchen queue": "Maagizo jikoni", "First sales recorded today": "Mauzo ya kwanza ya leo", "No sales yesterday": "Hakukuwa na mauzo jana", "vs. yesterday": "ikilinganishwa na jana", "Good morning": "Habari za asubuhi", "Good afternoon": "Habari za mchana", "Good evening": "Habari za jioni", "Here’s what’s happening at Harbor & Hearth today.": "Haya ndiyo yanayotokea Harbor & Hearth leo.",
      "Sales overview": "Muhtasari wa mauzo", "Payments received over the last 7 days": "Malipo yaliyopokelewa katika siku 7 zilizopita", "Last 7 days": "Siku 7 zilizopita", "Top selling foods": "Vyakula vinavyouzwa zaidi", "Most popular on today's menu": "Vinavyopendwa zaidi leo", "Full menu →": "Menyu yote →", "Recent orders": "Maagizo ya hivi karibuni", "Latest activity from your floor": "Shughuli za hivi karibuni ukumbini", "All orders →": "Maagizo yote →", "Quick actions": "Vitendo vya haraka", "Common tasks, right at your fingertips": "Kazi za kawaida kwa urahisi", "Create an order": "Tengeneza agizo", "View floor plan": "Tazama mpangilio wa meza", "Check inventory": "Angalia bidhaa",
      "SERVICE": "HUDUMA", "Track and manage every order from the first click to the last bite.": "Fuatilia kila agizo kuanzia mwanzo hadi mwisho.", "Search orders or customers...": "Tafuta maagizo au wateja...", "All orders": "Maagizo yote", "Order": "Agizo", "Customer": "Mteja", "Items": "Bidhaa", "Amount": "Kiasi", "Order type": "Aina ya agizo", "Payment": "Malipo", "Status": "Hali", "Actions": "Vitendo", "Unpaid": "Haijalipwa", "Paid": "Imelipwa", "New": "Jipya", "Preparing": "Inaandaliwa", "Ready": "Tayari", "Completed": "Imekamilika", "No orders found": "Hakuna maagizo yaliyopatikana", "Try a different search or create a new order.": "Tafuta tena au tengeneza agizo jipya.",
      "BACK OF HOUSE": "JIKONI", "Kitchen display": "Skrini ya jikoni", "Keep the whole kitchen in sync with live order progress.": "Fuatilia maendeleo ya maagizo jikoni kwa wakati halisi.", "New orders": "Maagizo mapya", "Ready to serve": "Tayari kutolewa", "Start preparing": "Anza kuandaa", "Mark ready": "Weka kuwa tayari", "Complete order": "Kamilisha agizo", "Nothing in this queue.": "Hakuna agizo linalosubiri.", "Refresh": "Onyesha upya",
      "YOUR KITCHEN, YOUR CREATIONS": "JIKONI YAKO, UBUNIFU WAKO", "Keep your menu fresh, organized, and ready to serve.": "Weka menyu yako mpya, nadhifu na tayari kutolewa.", "+ Add food item": "+ Ongeza chakula", "Search menu...": "Tafuta kwenye menyu...", "All categories": "Aina zote", "menu items": "vyakula", "Food item": "Chakula", "Category": "Aina", "Price": "Bei", "Description": "Maelezo", "Availability": "Upatikanaji", "Available": "Kinapatikana", "Hidden": "Kimefichwa", "Edit": "Hariri", "Hide": "Ficha", "Show": "Onyesha", "No menu items found": "Hakuna chakula kilichopatikana", "Add an item or change your filters.": "Ongeza chakula au badilisha utafutaji.", "Breakfast": "Kifungua kinywa", "Lunch": "Chakula cha mchana", "Dinner": "Chakula cha jioni", "Drinks": "Vinywaji", "Dessert": "Kitindamlo",
      "FRONT OF HOUSE": "UKUMBI", "Table management": "Usimamizi wa meza", "A live view of your dining room, at a glance.": "Tazama hali ya ukumbi wako kwa haraka.", "+ Add table": "+ Ongeza meza", "Dining room · Main floor": "Ukumbi · Ghorofa kuu", "seats": "viti", "Reserved": "Imewekewa nafasi",
      "CHECKOUT": "MALIPO", "Billing & payments": "Bili na malipo", "Take payments, view receipts, and keep every transaction accounted for.": "Pokea malipo na uangalie risiti na miamala.", "Print report": "Chapisha ripoti", "Collected today": "Yaliyopokelewa leo", "transactions recorded": "miamala iliyorekodiwa", "Awaiting payment": "Inasubiri malipo", "Orders ready for checkout": "Maagizo yanayosubiri kulipiwa", "Ready for checkout": "Tayari kulipiwa", "Unpaid orders": "Maagizo ambayo hayajalipwa", "Order total": "Jumla ya agizo", "Order status": "Hali ya agizo", "Take payment": "Pokea malipo", "All orders are paid. You’re all caught up!": "Maagizo yote yamelipwa.", "Recent transactions": "Miamala ya hivi karibuni", "Payment history across all orders": "Historia ya malipo", "Payment date": "Tarehe ya malipo", "Method": "Njia", "No payments recorded yet.": "Hakuna malipo yaliyorekodiwa.",
      "YOUR TEAM": "TIMU YAKO", "Staff management": "Usimamizi wa wafanyakazi", "The people who make every service special.": "Watu wanaofanya kila huduma iwe ya pekee.", "+ Add staff member": "+ Ongeza mfanyakazi", "team members": "wafanyakazi", "Monthly": "Kwa mwezi", "Full name": "Jina kamili", "Role": "Wadhifa", "Phone number": "Nambari ya simu", "Monthly salary": "Mshahara wa mwezi",
      "STOCK & SUPPLIERS": "BIDHAA NA WASAMBAZAJI", "Stay ahead of stock levels and keep your kitchen prepared.": "Fuatilia bidhaa na uandae jikoni.", "+ Add ingredient": "+ Ongeza kiungo", "Low-stock alert": "Tahadhari ya bidhaa chache", "Low-stock alerts": "Tahadhari za bidhaa chache", "Restock soon to avoid running out.": "Ongeza bidhaa mapema ili zisiishe.", "ingredients tracked": "viungo vinavyofuatiliwa", "Record purchase": "Rekodi ununuzi", "Ingredient": "Kiungo", "In stock": "Ipo", "Low stock": "Bidhaa chache", "Low-stock threshold": "Kiwango cha tahadhari", "Supplier": "Msambazaji", "Stock actions": "Vitendo vya bidhaa", "Stock in": "Ongeza bidhaa", "Stock out": "Punguza bidhaa", "Recent purchases": "Manunuzi ya hivi karibuni", "Incoming stock records": "Rekodi za bidhaa zilizoingia", "Purchase": "Ununuzi", "Quantity": "Kiasi", "No purchases recorded yet.": "Hakuna manunuzi yaliyorekodiwa.", "Current quantity": "Kiasi kilichopo", "Supplier name": "Jina la msambazaji",
      "INSIGHTS & PERFORMANCE": "UCHAMBUZI NA MATOKEO", "Reports": "Ripoti", "Understand your sales, spot trends, and make confident decisions.": "Elewa mauzo yako na ufanye maamuzi bora.", "This week": "Wiki hii", "This month": "Mwezi huu", "Payments received today": "Malipo yaliyopokelewa leo", "payments received": "malipo yaliyopokelewa", "Best-selling foods": "Vyakula vinavyouzwa zaidi", "Ranked by units sold this month": "Vimepangwa kwa mauzo ya mwezi huu", "sold": "vilivyouzwa", "Recent sales activity": "Mauzo ya hivi karibuni", "Completed payment transactions": "Miamala ya malipo iliyokamilika", "No sales recorded in this period.": "Hakuna mauzo katika kipindi hiki.", "Sales will appear here as payments are recorded.": "Mauzo yataonekana hapa yakirekodiwa.",
      "Save changes": "Hifadhi mabadiliko", "Cancel": "Ghairi", "Close": "Funga", "Add to menu": "Ongeza kwenye menyu", "Add food item": "Ongeza chakula", "Image emoji": "Emoji ya picha", "A short, appetizing description": "Maelezo mafupi ya kuvutia", "Table number": "Nambari ya meza", "Number of seats": "Idadi ya viti", "Add table": "Ongeza meza", "Create a new order": "Tengeneza agizo jipya", "Customer name": "Jina la mteja", "Dine-in": "Kula hapa", "Takeaway": "Kuchukua", "Delivery": "Kusafirisha", "Dining table": "Meza", "No table / takeaway": "Hakuna meza / kuchukua", "Choose a menu item": "Chagua chakula", "Food item 1": "Chakula 1", "Food item 2": "Chakula 2", "Food item 3": "Chakula 3", "Food item 4": "Chakula 4", "Qty": "Idadi", "Order items": "Bidhaa za agizo", "Choose up to four menu items. Leave unused rows blank.": "Chagua hadi vyakula vinne. Acha sehemu nyingine wazi.", "Order total": "Jumla ya agizo", "Create order": "Tengeneza agizo", "Amount received": "Kiasi kilichopokelewa", "Payment method": "Njia ya malipo", "Cash": "Pesa taslimu", "Mobile Money": "Pesa kwa simu", "Card": "Kadi", "Record payment": "Rekodi malipo", "Add a team member": "Ongeza mfanyakazi", "Add team member": "Ongeza mfanyakazi", "Ingredient name": "Jina la kiungo", "Unit": "Kipimo",
      "Receipt": "Risiti", "Thank you for dining with us!": "Asante kwa kutembelea!", "We hope to see you again soon.": "Tunatumaini kukuona tena hivi karibuni.",
      "Username": "Jina la mtumiaji", "Password": "Nenosiri", "Sign in": "Ingia", "Sign in to your restaurant": "Ingia kwenye mgahawa wako", "Enter your staff account to continue.": "Weka akaunti yako ya mfanyakazi ili kuendelea.", "Your account is waiting for a manager to create the first login.": "Subiri msimamizi atengeneze akaunti ya kwanza.", "Sign-in failed": "Kuingia kumeshindikana", "Change temporary password": "Badilisha nenosiri la muda", "Current password": "Nenosiri la sasa", "New password": "Nenosiri jipya", "Confirm new password": "Thibitisha nenosiri jipya", "Update password": "Sasisha nenosiri", "Your temporary password must be changed before continuing.": "Lazima ubadilishe nenosiri la muda kabla ya kuendelea.", "Create staff account": "Tengeneza akaunti ya mfanyakazi", "Temporary password": "Nenosiri la muda", "Create account": "Tengeneza akaunti", "Account": "Akaunti", "Last sign in": "Kuingia kwa mwisho", "Active": "Inatumika", "Disabled": "Imezimwa", "Enable": "Washa", "Disable": "Zima", "Manager": "Msimamizi", "Cashier": "Mhasibu", "Chef": "Mpishi", "Waiter": "Mhudumu", "No staff accounts yet.": "Bado hakuna akaunti za wafanyakazi.",
      "FACTURE": "ANKARA", "FACTURE ACQUITTÉE": "ANKARA IMELIPWA", "FACTURÉ À": "ILIYOTOLEWA KWA", "DÉTAILS DE LA FACTURE": "MAELEZO YA ANKARA", "DÉSIGNATION": "BIDHAA", "QTÉ": "IDADI", "PRIX UNIT.": "BEI YA KIMOJA", "MONTANT": "KIASI", "Sous-total": "Jumla ndogo", "Total à payer": "Jumla ya kulipa", "RÉGLÉE": "IMELIPWA", "À RÉGLER": "LIPWA", "Merci de votre confiance.": "Asante kwa kutuamini.", "Coordonnées légales et TVA non configurées.": "Taarifa za kisheria na kodi hazijawekwa.",
      "Staff login accounts": "Akaunti za wafanyakazi", "Role-based access to restaurant data and actions": "Ufikiaji kulingana na wadhifa", "Create staff account": "Tengeneza akaunti ya mfanyakazi", "Staff account created. Share the temporary password securely.": "Akaunti imetengenezwa. Shiriki nenosiri la muda kwa usalama.", "Account status updated.": "Hali ya akaunti imesasishwa.", "Current account": "Akaunti ya sasa", "The new staff member must change this password at first sign-in. Use at least 12 characters with letters and numbers.": "Mfanyakazi mpya lazima abadilishe nenosiri hili anapoingia mara ya kwanza. Tumia angalau herufi na nambari 12.", "Can’t connect to the restaurant database": "Imeshindwa kuunganisha hifadhidata ya mgahawa", "Connecting to your restaurant database": "Inaunganisha hifadhidata ya mgahawa", "Loading live menu, tables, orders, and reports…": "Inapakia menyu, meza, maagizo na ripoti…", "Start MySQL in XAMPP and import": "Washa MySQL kwenye XAMPP na uingize", "if this is your first run.": "ikiwa unaendesha kwa mara ya kwanza.", "Try again": "Jaribu tena", "Retry connection": "Jaribu kuunganisha tena", "Change password": "Badilisha nenosiri", "No manager account exists yet. Create the first account in a terminal:": "Hakuna akaunti ya msimamizi. Tengeneza akaunti ya kwanza kwenye terminal:", "Use at least 12 characters, including letters and numbers.": "Tumia angalau herufi na nambari 12.", "The new passwords do not match.": "Nenosiri jipya halilingani.", "Password updated successfully.": "Nenosiri limesasishwa.", "Please sign in to continue.": "Ingia ili uendelee.", "Change your temporary password before continuing.": "Badilisha nenosiri la muda kabla ya kuendelea.", "Your account does not have permission to do that.": "Akaunti yako haina ruhusa ya kufanya hivyo.", "Cross-origin requests are not allowed.": "Maombi kutoka asili nyingine hayaruhusiwi.", "Your security token expired. Refresh the page and try again.": "Tokeni ya usalama imekwisha. Onyesha ukurasa upya kisha ujaribu tena.", "Username or password is incorrect.": "Jina la mtumiaji au nenosiri si sahihi.", "Too many sign-in attempts. Wait 15 minutes and try again.": "Majaribio mengi ya kuingia. Subiri dakika 15 ujaribu tena.", "Current password is incorrect.": "Nenosiri la sasa si sahihi.", "Use at least 12 characters with both letters and numbers.": "Tumia angalau herufi na nambari 12.", "Choose a password you have not used before.": "Chagua nenosiri ambalo hujawahi kutumia.", "The last active manager account cannot be disabled.": "Akaunti ya mwisho ya msimamizi haiwezi kuzimwa."
    }
  };
  Object.assign(translations.fr, {
    "YOUR RESTAURANT AT A GLANCE": "VOTRE RESTAURANT EN UN COUP D’ŒIL", "Invoice": "Facture", "Staff login accounts": "Comptes de connexion du personnel",
    "STAFF ACCESS": "ACCÈS DU PERSONNEL", "ACCOUNT SECURITY": "SÉCURITÉ DU COMPTE", "Create staff account": "Créer un compte du personnel",
    "No roles yet": "Aucun rôle pour le moment", "Add your first team member to get started.": "Ajoutez votre premier membre pour commencer.",
    "Action": "Action", "Manager": "Gérant",
    "There are no orders yet today.": "Aucune commande aujourd’hui.", "Create the first manager account from a terminal:": "Créez le premier compte manager depuis un terminal :",
    "Orders in the kitchen queue": "Commandes en attente en cuisine", "No menu items found": "Aucun plat trouvé", "Available": "Disponible",
    "Order summary · unpaid": "Récapitulatif · non payé", "PAYMENT RECEIPT": "REÇU DE PAIEMENT", "ORDER SUMMARY · UNPAID": "RÉCAPITULATIF · NON PAYÉ",
    "Invoice": "Facture", "INVOICE": "FACTURE", "PAID INVOICE": "FACTURE ACQUITTÉE", "BILL TO": "FACTURÉ À", "INVOICE DETAILS": "DÉTAILS DE LA FACTURE",
    "DESCRIPTION": "DÉSIGNATION", "QTY": "QTÉ", "UNIT PRICE": "PRIX UNIT.", "Subtotal": "Sous-total", "Total due": "Total à payer",
    "DUE": "À RÉGLER", "Thank you for your business.": "Merci de votre confiance.", "Business address and tax details are not configured.": "Coordonnées légales et TVA non configurées.",
    "Print invoice": "Imprimer la facture", "Customer invoice": "Facture client", "Kitchen orders": "Commandes en cuisine",
    "Head Chef": "Chef cuisinier", "Sous Chef": "Sous-chef", "Delivery": "Livraison", "Never": "Jamais", "Current account": "Compte actuel",
    "Enter your staff account to continue.": "Saisissez vos identifiants pour continuer.", "The new passwords do not match.": "Les nouveaux mots de passe ne correspondent pas.",
    "Stock out quantity cannot exceed current stock.": "La quantité retirée ne peut pas dépasser le stock actuel.",
    "Add an available menu item before creating an order.": "Ajoutez un plat disponible avant de créer une commande.",
    "Choose at least one menu item for this order.": "Choisissez au moins un plat pour cette commande.",
    "Payment must be at least": "Le paiement doit être au moins égal à",
    "Order created and sent to the kitchen.": "Commande créée et envoyée en cuisine.", "Password updated successfully.": "Mot de passe mis à jour."
  });
  Object.assign(translations.sw, {
    "YOUR RESTAURANT AT A GLANCE": "MUHTASARI WA MGHAWA WAKO", "Invoice": "Ankara", "STAFF ACCESS": "UFIKIAJI WA WAFANYAKAZI", "ACCOUNT SECURITY": "USALAMA WA AKAUNTI",
    "No roles yet": "Bado hakuna wadhifa", "Add your first team member to get started.": "Ongeza mfanyakazi wa kwanza ili uanze.",
    "Action": "Hatua", "Current account": "Akaunti ya sasa", "Never": "Kamwe", "No staff accounts yet.": "Bado hakuna akaunti za wafanyakazi.",
    "Staff login accounts": "Akaunti za kuingia za wafanyakazi", "Role-based access to restaurant data and actions": "Ufikiaji wa data na vitendo kulingana na wadhifa",
    "Account status updated.": "Hali ya akaunti imesasishwa.", "Manager": "Msimamizi", "Cashier": "Mhasibu", "Chef": "Mpishi", "Waiter": "Mhudumu",
    "There are no orders yet today.": "Hakuna maagizo leo bado.", "Create the first manager account from a terminal:": "Tengeneza akaunti ya kwanza ya msimamizi kwenye terminal:",
    "Orders in the kitchen queue": "Maagizo yanayosubiri jikoni", "Order summary · unpaid": "Muhtasari wa agizo · halijalipwa",
    "PAYMENT RECEIPT": "RISITI YA MALIPO", "ORDER SUMMARY · UNPAID": "MUHTASARI WA AGIZO · HALIJALIPWA",
    "INVOICE": "ANKARA", "PAID INVOICE": "ANKARA IMELIPWA", "BILL TO": "BILI KWA", "INVOICE DETAILS": "MAELEZO YA ANKARA",
    "DESCRIPTION": "MAELEZO", "QTY": "IDADI", "UNIT PRICE": "BEI YA KIMOJA", "Subtotal": "Jumla ndogo", "Total due": "Jumla inayodaiwa",
    "DUE": "INADAIDWA", "Thank you for your business.": "Asante kwa kufanya biashara nasi.", "Business address and tax details are not configured.": "Anwani ya biashara na kodi hazijawekwa.",
    "Print invoice": "Chapisha ankara", "Customer invoice": "Ankara ya mteja", "Kitchen orders": "Maagizo ya jikoni", "Head Chef": "Mpishi mkuu", "Sous Chef": "Msaidizi wa mpishi",
    "Never": "Kamwe", "Current account": "Akaunti ya sasa", "Stock out quantity cannot exceed current stock.": "Bidhaa zinazotolewa haziwezi kuzidi bidhaa zilizopo.",
    "Add an available menu item before creating an order.": "Ongeza chakula kinachopatikana kabla ya kutengeneza agizo.",
    "Choose at least one menu item for this order.": "Chagua angalau chakula kimoja kwa agizo hili.",
    "Order created and sent to the kitchen.": "Agizo limetengenezwa na kutumwa jikoni.", "Password updated successfully.": "Nenosiri limesasishwa."
  });
  const savedLanguage = localStorage.getItem("harbor-hearth-language");
  let language = ["en", "fr", "sw"].includes(savedLanguage) ? savedLanguage : "en";
  let csrfToken = "";
  let currentUser = null;
  let setupRequired = false;
  let changingPassword = false;
  const money = (amount) => new Intl.NumberFormat({ en: "en-US", fr: "fr-FR", sw: "sw-KE" }[language], { style: "currency", currency: "USD" }).format(Number(amount) || 0);
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const today = () => dateKey(new Date());
  const dateLabel = (value, options = { month: "short", day: "numeric" }) => new Intl.DateTimeFormat("en-US", options).format(new Date(`${value}T12:00:00`));

  let data = { foods: [], tables: [], orders: [], payments: [], staff: [], inventory: [], purchases: [], users: [], deliveries: [], drivers: [] };
  let dataLoaded = false;
  let currentPage = "dashboard";
  let orderSearch = "";
  let menuSearch = "";
  let menuCategory = "All categories";
  let foodPreviewUrl = "";
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();

  function localizeText(value) {
    return translations[language]?.[value] || value;
  }

  function localizeDOM(root = document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      const source = originalText.get(node);
      const trimmed = source.trim();
      if (!trimmed) return;
      const dictionary = translations[language] || {};
      if (dictionary[trimmed]) {
        node.nodeValue = source.replace(trimmed, dictionary[trimmed]);
        return;
      }
      let localized = source;
      Object.keys(dictionary).sort((a, b) => b.length - a.length).forEach((source) => {
        if (source.length < 4 || !/[\s·,]/.test(source)) return;
        const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        localized = localized.replace(new RegExp(`(^|[\\s·,])${escaped}(?=$|[\\s·,:])`, "g"), `$1${dictionary[source]}`);
      });
      node.nodeValue = localized;
    });
    root.querySelectorAll("[placeholder], [aria-label], [title]").forEach((element) => {
      if (!originalAttributes.has(element)) originalAttributes.set(element, {});
      const originals = originalAttributes.get(element);
      ["placeholder", "aria-label", "title"].forEach((attribute) => {
        if (!Object.hasOwn(originals, attribute)) originals[attribute] = element.getAttribute(attribute);
        const value = originals[attribute];
        if (value !== null) element.setAttribute(attribute, translations[language]?.[value] || value);
      });
    });
    document.documentElement.lang = language;
  }

  async function api(action = null, payload = {}) {
    const options = action
      ? { method: "POST", headers: { "Content-Type": "application/json", ...(csrfToken && action !== "login" ? { "X-CSRF-Token": csrfToken } : {}) }, body: JSON.stringify({ ...payload, action }) }
      : { method: "GET" };
    const response = await fetch("api.php", options);
    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error("The server returned an invalid response.");
    }
    if (!response.ok) {
      const error = new Error(result.error || `Request failed (${response.status}).`);
      error.code = result.code || "";
      throw error;
    }
    if (result.csrfToken) csrfToken = result.csrfToken;
    if (result.user !== undefined) currentUser = result.user;
    if (result.data) {
      data = result.data;
      dataLoaded = true;
    }
    return result;
  }

  async function uploadFoodImage(file) {
    const body = new FormData();
    body.append("action", "upload_food_image");
    body.append("image", file);
    const response = await fetch("api.php", {
      method: "POST",
      headers: csrfToken ? { "X-CSRF-Token": csrfToken } : {},
      body
    });
    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error("The server returned an invalid response.");
    }
    if (!response.ok) throw new Error(result.error || `Request failed (${response.status}).`);
    return result.image;
  }

  function foodPhotoPath(image) {
    return /^uploads\/food-images\/[a-f0-9]{32}\.(?:jpg|png|gif|webp)$/.test(image || "") ? image : "";
  }

  function foodIcon(image) {
    return /[\u{1F000}-\u{1FAFF}\u2600-\u27BF]/u.test(image || "") ? image : "🍽️";
  }

  function tableById(id) { return data.tables.find((table) => table.id === Number(id)); }
  function orderItemsCount(order) { return order.items.reduce((sum, item) => sum + item.quantity, 0); }
  function titleCase(value) { return value.charAt(0).toUpperCase() + value.slice(1); }
  function statusClass(status) { return String(status).toLowerCase().replace(/\s+/g, "-"); }

  function toast(message) {
    const node = document.createElement("div");
    node.className = "toast";
    node.textContent = localizeText(message);
    document.getElementById("toast-region").append(node);
    window.setTimeout(() => node.remove(), 3000);
  }

  function pageHeader(kicker, title, subtitle, actions = "") {
    return `<div class="page-heading"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="page-subtitle">${subtitle}</p></div><div class="heading-actions">${actions}</div></div>`;
  }

  function btn(label, action, style = "secondary", extra = "") {
    return `<button class="btn btn-${style}" data-action="${action}" ${extra}>${label}</button>`;
  }

  function panelHeading(title, subtitle = "", action = "") {
    return `<div class="panel-heading"><div><h2>${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ""}</div>${action}</div>`;
  }

  function statCard(label, value, note, icon) {
    return `<article class="stat-card"><div class="stat-top"><span>${label}</span><span class="stat-icon">${icon}</span></div><strong class="stat-value">${value}</strong><div class="stat-foot">${note}</div></article>`;
  }

  function foodRow(food, sold) {
    return `<div class="food-row"><span class="food-emoji">${escapeHtml(food.image || "🍽️")}</span><div class="food-row-copy"><strong>${escapeHtml(food.name)}</strong><small>${sold} orders</small></div><b>${money(food.price)}</b></div>`;
  }

  function renderChart() {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = dateKey(date);
      const amount = data.payments.filter((payment) => payment.date === key).reduce((sum, payment) => sum + Number(payment.amount), 0);
      return { key, amount, label: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date) };
    });
    const max = Math.max(...days.map((day) => day.amount), 1);
    const xs = days.map((_, index) => 38 + index * 95);
    const ys = days.map((day) => 145 - (day.amount / max) * 92);
    const line = ys.map((y, index) => `${index ? "L" : "M"} ${xs[index]} ${y}`).join(" ");
    const area = `${line} L ${xs[xs.length - 1]} 160 L ${xs[0]} 160 Z`;
    return `<div class="chart-wrap"><svg viewBox="0 0 640 180" role="img" aria-label="Sales trend chart">
      <defs><linearGradient id="sales-gradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#6da486" stop-opacity=".24"/><stop offset="100%" stop-color="#6da486" stop-opacity="0"/></linearGradient></defs>
      ${[40, 75, 110, 145].map((y) => `<line class="chart-grid" x1="35" y1="${y}" x2="625" y2="${y}"/>`).join("")}
      <path class="chart-fill" d="${area}"/><path class="chart-line" d="${line}"/>
      ${days.map((day, index) => `<circle class="chart-dot" cx="${xs[index]}" cy="${ys[index]}" r="3" aria-label="${escapeHtml(day.label)}: ${money(day.amount)}"/>`).join("")}
      ${days.map((day, index) => `<text class="chart-label" x="${xs[index]}" y="174" text-anchor="middle">${day.label}</text>`).join("")}
    </svg></div>`;
  }

  function renderDashboard() {
    const todaysOrders = data.orders.filter((order) => order.date === today());
    const sales = data.payments.filter((payment) => payment.date === today()).reduce((sum, payment) => sum + Number(payment.amount), 0);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdaySales = data.payments.filter((payment) => payment.date === dateKey(yesterday)).reduce((sum, payment) => sum + Number(payment.amount), 0);
    const salesChange = yesterdaySales > 0 ? ((sales - yesterdaySales) / yesterdaySales) * 100 : null;
    const salesComparison = salesChange === null
      ? (sales > 0 ? "First sales recorded today" : "No sales yesterday")
      : `<span class="${salesChange >= 0 ? "positive" : "negative"}">${salesChange >= 0 ? "↑" : "↓"} ${Math.abs(salesChange).toFixed(1)}%</span> &nbsp;vs. yesterday`;
    const pending = todaysOrders.filter((order) => order.status !== "Completed").length;
    const available = data.tables.filter((table) => table.status === "Available").length;
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    const weekday = new Intl.DateTimeFormat({ en: "en-US", fr: "fr-FR", sw: "sw-KE" }[language], { weekday: "long" }).format(new Date()).toUpperCase();
    const sold = new Map();
    todaysOrders.forEach((order) => order.items.forEach((item) => sold.set(item.foodId, (sold.get(item.foodId) || 0) + item.quantity)));
    const topFoods = [...sold.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4)
      .map(([id, quantity]) => ({ food: data.foods.find((food) => food.id === id) || { name: "Removed menu item", price: 0 }, quantity }));
    const recent = todaysOrders.slice().sort((a, b) => b.id - a.id).slice(0, 4);
    const actions = `${["manager", "cashier"].includes(currentUser.role) ? '<button class="btn btn-secondary" data-action="go-reports">◷ &nbsp;View reports</button>' : ""}${["manager", "cashier", "waiter"].includes(currentUser.role) ? btn("+ New order", "new-order", "primary") : ""}`;
    return `${pageHeader(`${weekday}, ${localizeText("YOUR RESTAURANT AT A GLANCE")}`, `${localizeText(greeting)}, ${escapeHtml(currentUser.name)}`, "Here’s what’s happening at Harbor & Hearth today.", actions)}
      <section class="stat-grid">
        ${statCard("Today's sales", money(sales), salesComparison, "＄")}
        ${statCard("Total orders", todaysOrders.length, `${todaysOrders.filter((order) => order.status === "Completed").length} completed today`, "▤")}
        ${statCard("Available tables", `${available}<span style="font:400 12px 'DM Sans';color:#929b95"> / ${data.tables.length}</span>`, `${data.tables.filter((table) => table.status === "Occupied").length} tables occupied`, "▦")}
        ${statCard("Pending orders", pending, "Orders in the kitchen queue", "♨")}
      </section>
      <section class="dashboard-grid">
        <article class="panel">${panelHeading("Sales overview", "Payments received over the last 7 days", '<span class="badge green">Last 7 days</span>')}
          <div class="sales-summary"><strong>${money(sales)}</strong><span>${salesChange === null ? escapeHtml(salesComparison) : `${salesChange >= 0 ? "↑" : "↓"} ${Math.abs(salesChange).toFixed(1)}%`}</span></div>${renderChart()}</article>
        <article class="panel">${panelHeading("Top selling foods", "Most popular on today's menu", '<button class="text-link" data-page="menu">Full menu →</button>')}
          <div class="top-food-list">${topFoods.length ? topFoods.map((row) => foodRow(row.food, row.quantity)).join("") : '<div class="empty-state">No items sold today yet.</div>'}</div>
        </article>
      </section>
      <section class="two-column" style="margin-top:16px">
        <article class="panel">${panelHeading("Recent orders", "Latest activity from your floor", '<button class="text-link" data-page="orders">All orders →</button>')}
          ${recent.length ? `<div class="table-panel" style="border:0;border-radius:0"><table class="data-table"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th></tr></thead><tbody>${recent.map(orderRow).join("")}</tbody></table></div>` : '<div class="empty-state">No orders yet today.</div>'}
        </article>
        <article class="panel">${panelHeading("Quick actions", "Common tasks, right at your fingertips")}
          <div class="quick-actions"><button class="quick-action" data-action="new-order"><span>＋</span><strong>Create an order</strong></button><button class="quick-action" data-page="tables"><span>▦</span><strong>View floor plan</strong></button><button class="quick-action" data-page="inventory"><span>▥</span><strong>Check inventory</strong></button></div>
        </article>
      </section>`;
  }

  function orderRow(order) {
    const table = order.tableId ? tableById(order.tableId) : null;
    return `<tr><td><strong>#${order.id}</strong><span class="cell-sub">${escapeHtml(order.time)}</span></td><td><strong>${escapeHtml(order.customer)}</strong><span class="cell-sub">${escapeHtml(order.type)}${table ? ` · Table ${escapeHtml(table.number)}` : ""}</span></td><td>${orderItemsCount(order)} items</td><td><strong>${money(order.total)}</strong></td><td><span class="badge ${statusClass(order.status)}">${escapeHtml(order.status)}</span></td></tr>`;
  }

  function renderOrders() {
    const list = data.orders.slice().sort((a, b) => b.id - a.id).filter((order) => {
      const text = `${order.id} ${order.customer} ${order.type}`.toLowerCase();
      return text.includes(orderSearch.toLowerCase());
    });
    const actions = btn("+ New order", "new-order", "primary");
    return `${pageHeader("SERVICE", "Orders", "Track and manage every order from the first click to the last bite.", actions)}
      <div class="filter-bar"><label class="search-box"><span>⌕</span><input id="order-search" placeholder="Search orders or customers..." value="${escapeHtml(orderSearch)}"></label><select class="filter-select" id="order-filter"><option value="All orders">All orders</option><option value="New">New</option><option value="Preparing">Preparing</option><option value="Ready">Ready</option><option value="Completed">Completed</option></select></div>
      <section class="table-panel"><table class="data-table"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Amount</th><th>Order type</th><th>Payment</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${list.length ? list.map((order) => {
        const table = order.tableId ? tableById(order.tableId) : null;
        const next = nextOrderStatus(order.status);
        return `<tr><td><strong>#${order.id}</strong><span class="cell-sub">${escapeHtml(order.date)} · ${escapeHtml(order.time)}</span></td><td><strong>${escapeHtml(order.customer)}</strong><span class="cell-sub">${table ? `Table ${escapeHtml(table.number)}` : "—"}</span></td><td>${orderItemsCount(order)} items</td><td><strong>${money(order.total)}</strong></td><td>${escapeHtml(order.type)}</td><td><span class="badge ${order.paymentStatus === "Paid" ? "paid" : "pending"}">${escapeHtml(order.paymentStatus)}</span></td><td><span class="badge ${statusClass(order.status)}">${escapeHtml(order.status)}</span></td><td><div class="table-actions">${order.paymentStatus !== "Paid" ? `<button class="btn btn-quiet btn-small" data-action="pay-order" data-id="${order.id}">Pay</button>` : ""}<button class="btn btn-quiet btn-small" data-action="invoice" data-id="${order.id}">Facture</button><button class="btn btn-quiet btn-small" data-action="receipt" data-id="${order.id}">Receipt</button>${next ? `<button class="btn btn-quiet btn-small" data-action="advance-order" data-id="${order.id}">${next} →</button>` : ""}</div></td></tr>`;
      }).join("") : '<tr><td colspan="8"><div class="empty-state"><strong>No orders found</strong>Try a different search or create a new order.</div></td></tr>'}</tbody></table></section>`;
  }

  function nextOrderStatus(status) {
    if (status === "New") return "Start";
    if (status === "Preparing") return "Mark ready";
    if (status === "Ready") return "Complete";
    return "";
  }

  function renderKitchen() {
    const columns = [
      { title: "New orders", status: "New", action: "Start preparing" },
      { title: "Preparing", status: "Preparing", action: "Mark ready" },
      { title: "Ready to serve", status: "Ready", action: "Complete order" }
    ];
    return `${pageHeader("BACK OF HOUSE", "Kitchen display", "Keep the whole kitchen in sync with live order progress.", '<button class="btn btn-secondary" data-action="refresh">↻ &nbsp;Refresh</button>')}
      <div class="kitchen-grid">${columns.map((column) => {
        const orders = data.orders.filter((order) => order.status === column.status).sort((a, b) => a.id - b.id);
        return `<section class="kitchen-column"><div class="kitchen-column-heading">${column.title}<span>${orders.length}</span></div>${orders.length ? orders.map((order) => {
          const table = order.tableId ? tableById(order.tableId) : null;
          return `<article class="kitchen-card"><div class="kitchen-card-top"><span>#${order.id} · ${escapeHtml(order.type)}</span><small>${escapeHtml(order.time)}</small></div><small>${escapeHtml(order.customer)}${table ? ` · Table ${escapeHtml(table.number)}` : ""}</small><div class="kitchen-items">${order.items.map((item) => `<div>${item.quantity} × ${escapeHtml(item.name)}</div>`).join("")}</div><button class="btn btn-primary btn-small" data-action="advance-order" data-id="${order.id}">${column.action} →</button></article>`;
        }).join("") : '<div class="empty-state" style="padding:25px 5px">Nothing in this queue.</div>'}</section>`;
      }).join("")}</div>`;
  }

  function renderMenu() {
    const foods = data.foods.filter((food) => food.name.toLowerCase().includes(menuSearch.toLowerCase()) && (menuCategory === "All categories" || food.category === menuCategory));
    const categoriesOptions = ["All categories", ...categories].map((category) => `<option value="${escapeHtml(category)}" ${menuCategory === category ? "selected" : ""}>${escapeHtml(category)}</option>`).join("");
    return `${pageHeader("YOUR KITCHEN, YOUR CREATIONS", "Food menu", "Keep your menu fresh, organized, and ready to serve.", btn("+ Add food item", "add-food", "primary"))}
      <div class="filter-bar"><label class="search-box"><span>⌕</span><input id="menu-search" placeholder="Search menu..." value="${escapeHtml(menuSearch)}"></label><select class="filter-select" id="menu-category">${categoriesOptions}</select><span class="page-subtitle">${foods.length} menu items</span></div>
      <section class="table-panel"><table class="data-table"><thead><tr><th>Food item</th><th>Category</th><th>Price</th><th>Description</th><th>Availability</th><th>Actions</th></tr></thead><tbody>${foods.length ? foods.map((food) => {
        const photo = foodPhotoPath(food.image);
        const thumbnail = photo ? `<img src="${escapeHtml(photo)}" alt="">` : escapeHtml(foodIcon(food.image));
        return `<tr><td><div class="primary-cell"><span class="food-thumb">${thumbnail}</span><div><strong>${escapeHtml(food.name)}</strong><span class="cell-sub">Menu item #${food.id}</span></div></div></td><td>${escapeHtml(food.category)}</td><td><strong>${money(food.price)}</strong></td><td>${escapeHtml(food.description || "—")}</td><td><span class="badge ${food.active ? "available" : "low"}">${food.active ? "Available" : "Hidden"}</span></td><td><div class="table-actions"><button class="btn btn-quiet btn-small" data-action="edit-food" data-id="${food.id}">Edit</button><button class="btn btn-quiet btn-small" data-action="toggle-food" data-id="${food.id}">${food.active ? "Hide" : "Show"}</button></div></td></tr>`;
      }).join("") : '<tr><td colspan="6"><div class="empty-state"><strong>No menu items found</strong>Add an item or change your filters.</div></td></tr>'}</tbody></table></section>`;
  }

  function renderTables() {
    const counts = ["Available", "Occupied", "Reserved"].map((status) => `${data.tables.filter((table) => table.status === status).length} ${status.toLowerCase()}`).join(" · ");
    return `${pageHeader("FRONT OF HOUSE", "Table management", "A live view of your dining room, at a glance.", btn("+ Add table", "add-table", "primary"))}
      <div class="panel" style="padding:15px;margin-bottom:16px"><div style="display:flex;align-items:center;justify-content:space-between"><div><strong style="font-size:11px">Dining room · Main floor</strong><div class="page-subtitle" style="margin-top:5px">${counts}</div></div><span class="badge green">● Live floor plan</span></div></div>
      <section class="table-map">${data.tables.slice().sort((a, b) => a.number.localeCompare(b.number, undefined, { numeric: true })).map((table) => `<button class="table-tile ${statusClass(table.status)}" data-action="edit-table" data-id="${table.id}"><span class="tile-edit">···</span><span class="table-shape">${escapeHtml(table.number)}</span><strong>Table ${escapeHtml(table.number)}</strong><small>${table.seats} seats · ${escapeHtml(table.status)}</small></button>`).join("")}</section>`;
  }

  function renderDeliveries() {
    const manager = currentUser.role === "manager";
    const rows = data.deliveries || [];
    const deliveryCards = rows.map((delivery) => {
      const driverControl = manager && ["Pending", "Assigned"].includes(delivery.status)
        ? `<form class="delivery-assign-form" data-form="assign-delivery" data-order-id="${delivery.orderId}"><select name="driverId" aria-label="Assign driver" required><option value="">Choose driver</option>${(data.drivers || []).map((driver) => `<option value="${driver.id}" ${delivery.driverId === driver.id ? "selected" : ""}>${escapeHtml(driver.name)}</option>`).join("")}</select><button class="btn btn-secondary btn-small" type="submit">Assign driver</button></form>`
        : "";
      const next = { Assigned: "Accept delivery", Accepted: "Pick up order", "Picked up": "Mark delivered" }[delivery.status];
      const waitForKitchen = next === "Pick up order" && delivery.kitchenStatus !== "Ready";
      const driverAction = !manager && next
        ? `<button class="btn btn-primary btn-small" data-action="update-delivery" data-id="${delivery.id}" ${waitForKitchen ? "disabled title=\"The kitchen must mark this order ready first.\"" : ""}>${waitForKitchen ? "Waiting for kitchen" : `${next} →`}</button>`
        : "";
      const assignment = delivery.driverName
        ? `<span class="delivery-driver">Driver: ${escapeHtml(delivery.driverName)}</span>`
        : '<span class="delivery-driver">Unassigned</span>';
      return `<article class="delivery-card">
        <div class="delivery-card-heading"><div><strong>Order #${delivery.orderId} · ${escapeHtml(delivery.customer)}</strong><small>${escapeHtml(delivery.date)} · ${escapeHtml(delivery.time)} · Kitchen: ${escapeHtml(delivery.kitchenStatus)}</small></div><span class="badge ${statusClass(delivery.status)}">${escapeHtml(delivery.status)}</span></div>
        <div class="delivery-details"><div><strong>Address</strong><span>${escapeHtml(delivery.address)}</span></div><div><strong>Phone</strong><a href="tel:${escapeHtml(delivery.phone)}">${escapeHtml(delivery.phone)}</a></div>${delivery.notes ? `<div><strong>Notes</strong><span>${escapeHtml(delivery.notes)}</span></div>` : ""}</div>
        <div class="delivery-items">${delivery.items.map((item) => `${item.quantity} × ${escapeHtml(item.name)}`).join(" · ")}<strong>${money(delivery.total)} · Cash on delivery</strong></div>
        <div class="delivery-card-footer">${assignment}${driverControl}${driverAction}</div>
      </article>`;
    }).join("");
    const subtitle = manager ? "Assign drivers and monitor every customer delivery." : "Your assigned deliveries, with customer contact and address details.";
    return `${pageHeader("LAST MILE", "Deliveries", subtitle, '<button class="btn btn-secondary" data-action="refresh">↻ &nbsp;Refresh</button>')}
      <section class="delivery-list">${deliveryCards || '<div class="empty-state">No customer deliveries are waiting right now.</div>'}</section>`;
  }

  function renderBilling() {
    const unpaid = data.orders.filter((order) => order.paymentStatus !== "Paid").sort((a, b) => b.id - a.id);
    const paidToday = data.payments.filter((payment) => payment.date === today()).reduce((sum, payment) => sum + Number(payment.amount), 0);
    const actions = `<button class="btn btn-secondary" data-action="print-summary">⎙ &nbsp;Print report</button>`;
    return `${pageHeader("CHECKOUT", "Billing & payments", "Take payments, view receipts, and keep every transaction accounted for.", actions)}
      <section class="stat-grid" style="grid-template-columns:repeat(2,minmax(0,1fr));max-width:520px">${statCard("Collected today", money(paidToday), `${data.payments.filter((payment) => payment.date === today()).length} transactions recorded`, "＄")}${statCard("Awaiting payment", unpaid.length, "Orders ready for checkout", "▧")}</section>
      <div class="panel" style="margin-bottom:14px">${panelHeading("Ready for checkout", "Unpaid orders")}<div class="table-panel" style="border:0;border-radius:0"><table class="data-table"><thead><tr><th>Order</th><th>Customer</th><th>Order total</th><th>Order status</th><th>Action</th></tr></thead><tbody>${unpaid.length ? unpaid.map((order) => `<tr><td><strong>#${order.id}</strong><span class="cell-sub">${escapeHtml(order.date)} · ${escapeHtml(order.time)}</span></td><td><strong>${escapeHtml(order.customer)}</strong></td><td><strong>${money(order.total)}</strong></td><td><span class="badge ${statusClass(order.status)}">${escapeHtml(order.status)}</span></td><td><div class="table-actions"><button class="btn btn-quiet btn-small" data-action="invoice" data-id="${order.id}">Facture</button><button class="btn btn-quiet btn-small" data-action="receipt" data-id="${order.id}">Receipt</button><button class="btn btn-primary btn-small" data-action="pay-order" data-id="${order.id}">Take payment</button></div></td></tr>`).join("") : '<tr><td colspan="5"><div class="empty-state">All orders are paid. You’re all caught up!</div></td></tr>'}</tbody></table></div></div>
      <section class="table-panel"><div class="panel-heading"><div><h2>Recent transactions</h2><p>Payment history across all orders</p></div></div><table class="data-table"><thead><tr><th>Payment</th><th>Order</th><th>Payment date</th><th>Method</th><th>Amount</th></tr></thead><tbody>${data.payments.slice().sort((a, b) => b.id - a.id).slice(0, 12).map((payment) => `<tr><td><strong>#P-${payment.id}</strong></td><td><strong>#${payment.orderId}</strong></td><td>${escapeHtml(payment.date)}</td><td>${escapeHtml(payment.method)}${payment.method === "Mobile Money" && payment.providerReference ? `<span class="cell-sub">Ref ${escapeHtml(payment.providerReference)}</span>` : ""}</td><td><strong>${money(payment.amount)}</strong></td></tr>`).join("") || '<tr><td colspan="5"><div class="empty-state">No payments recorded yet.</div></td></tr>'}</tbody></table></section>`;
  }

  function renderStaff() {
    const roles = [...new Set(data.staff.map((member) => member.role))];
    return `${pageHeader("YOUR TEAM", "Staff management", "The people who make every service special.", btn("+ Add staff member", "add-staff", "primary"))}
      <div class="filter-bar"><span class="page-subtitle">${data.staff.length} team members</span><span class="page-subtitle" style="margin-left:auto">${roles.map(localizeText).join(" · ") || "No roles yet"}</span></div>
      <section class="staff-grid">${data.staff.map((member) => {
        const initials = member.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
        return `<article class="staff-card"><div class="staff-card-top"><span class="staff-initials">${escapeHtml(initials)}</span><div class="staff-info"><strong>${escapeHtml(member.name)}</strong><small>${escapeHtml(localizeText(member.role))}</small></div><button class="text-link" data-action="edit-staff" data-id="${member.id}">Edit</button></div><div class="staff-details"><span>${escapeHtml(member.phone)}</span><span>Monthly <strong>${money(member.salary)}</strong></span></div></article>`;
      }).join("") || '<div class="empty-state">Add your first team member to get started.</div>'}</section>
      <section class="table-panel" style="margin-top:20px"><div class="panel-heading"><div><h2>Staff login accounts</h2><p>Role-based access to restaurant data and actions</p></div><button class="btn btn-secondary" data-action="add-user">＋ &nbsp;Create staff account</button></div>
        <table class="data-table"><thead><tr><th>Account</th><th>Username</th><th>Role</th><th>Last sign in</th><th>Status</th><th>Action</th></tr></thead><tbody>${(data.users || []).map((user) => `<tr><td><strong>${escapeHtml(user.name)}</strong></td><td>${escapeHtml(user.username)}</td><td>${escapeHtml(translateRole(user.role))}</td><td>${escapeHtml(user.lastLogin || "Never")}</td><td><span class="badge ${user.active ? "available" : "low"}">${user.active ? "Active" : "Disabled"}</span></td><td>${user.id === currentUser.id ? "Current account" : `<button class="btn btn-quiet btn-small" data-action="toggle-user" data-id="${user.id}" data-active="${user.active ? "false" : "true"}">${user.active ? "Disable" : "Enable"}</button>`}</td></tr>`).join("") || '<tr><td colspan="6"><div class="empty-state">No staff accounts yet.</div></td></tr>'}</tbody></table>
      </section>`;
  }

  function renderInventory() {
    const low = data.inventory.filter((item) => Number(item.quantity) <= Number(item.minimum));
    return `${pageHeader("STOCK & SUPPLIERS", "Inventory", "Stay ahead of stock levels and keep your kitchen prepared.", btn("+ Add ingredient", "add-inventory", "primary"))}
      ${low.length ? `<div class="inventory-alert"><strong>⚠ ${low.length} low-stock alert${low.length === 1 ? "" : "s"}:</strong> ${low.map((item) => escapeHtml(item.name)).join(", ")}. Restock soon to avoid running out.</div>` : ""}
      <div class="filter-bar"><span class="page-subtitle">${data.inventory.length} ingredients tracked</span><button class="btn btn-secondary" style="margin-left:auto" data-action="add-purchase">＋ &nbsp;Record purchase</button></div>
      <section class="table-panel"><table class="data-table"><thead><tr><th>Ingredient</th><th>In stock</th><th>Low-stock threshold</th><th>Supplier</th><th>Status</th><th>Stock actions</th></tr></thead><tbody>${data.inventory.map((item) => {
        const isLow = Number(item.quantity) <= Number(item.minimum);
        return `<tr><td><strong>${escapeHtml(item.name)}</strong><span class="cell-sub">Ingredient #${item.id}</span></td><td><strong>${Number(item.quantity)} ${escapeHtml(item.unit)}</strong></td><td>${Number(item.minimum)} ${escapeHtml(item.unit)}</td><td>${escapeHtml(item.supplier || "—")}</td><td><span class="badge ${isLow ? "low" : "available"}">${isLow ? "Low stock" : "In stock"}</span></td><td><div class="table-actions"><button class="btn btn-quiet btn-small" data-action="stock-change" data-kind="in" data-id="${item.id}">Stock in</button><button class="btn btn-quiet btn-small" data-action="stock-change" data-kind="out" data-id="${item.id}">Stock out</button></div></td></tr>`;
      }).join("") || '<tr><td colspan="6"><div class="empty-state">Add ingredients to start tracking stock.</div></td></tr>'}</tbody></table></section>
      <section class="table-panel" style="margin-top:16px"><div class="panel-heading"><div><h2>Recent purchases</h2><p>Incoming stock records</p></div></div><table class="data-table"><thead><tr><th>Purchase</th><th>Ingredient</th><th>Quantity</th><th>Supplier</th><th>Date</th></tr></thead><tbody>${data.purchases.slice().reverse().slice(0, 8).map((purchase) => `<tr><td><strong>#PO-${purchase.id}</strong></td><td>${escapeHtml(purchase.name)}</td><td>${purchase.quantity} ${escapeHtml(purchase.unit)}</td><td>${escapeHtml(purchase.supplier)}</td><td>${escapeHtml(purchase.date)}</td></tr>`).join("") || '<tr><td colspan="5"><div class="empty-state">No purchases recorded yet.</div></td></tr>'}</tbody></table></section>`;
  }

  function renderReports() {
    const now = new Date();
    const startWeek = new Date(now);
    startWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const weekStart = dateKey(startWeek);
    const monthStart = `${today().slice(0, 7)}-01`;
    const total = (start) => data.payments.filter((payment) => payment.date >= start && payment.date <= today()).reduce((sum, payment) => sum + Number(payment.amount), 0);
    const monthPayments = data.payments.filter((payment) => payment.date >= monthStart && payment.date <= today());
    const monthOrderIds = new Set(monthPayments.map((payment) => payment.orderId));
    const monthOrders = data.orders.filter((order) => monthOrderIds.has(order.id));
    const itemsSold = new Map();
    monthOrders.forEach((order) => order.items.forEach((item) => itemsSold.set(item.name, (itemsSold.get(item.name) || 0) + item.quantity)));
    const best = [...itemsSold.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    return `${pageHeader("INSIGHTS & PERFORMANCE", "Reports", "Understand your sales, spot trends, and make confident decisions.", '<button class="btn btn-secondary" data-action="print-summary">⎙ &nbsp;Print report</button>')}
      <section class="report-cards">${[
        ["Today's sales", money(total(today())), "Payments received today"],
        ["This week", money(total(weekStart)), `Since ${dateLabel(weekStart)}`],
        ["This month", money(total(monthStart)), `${monthPayments.length} payments received`]
      ].map((item) => `<article class="report-card"><span>${item[0]}</span><strong>${item[1]}</strong><small>${item[2]}</small></article>`).join("")}</section>
      <section class="dashboard-grid">
        <article class="panel">${panelHeading("Sales performance", "Payments received over the last 7 days")}<div class="sales-summary"><strong>${money(total(monthStart))}</strong><span>${monthPayments.length} transactions this month</span></div>${renderChart()}</article>
        <article class="panel">${panelHeading("Best-selling foods", "Ranked by units sold this month")}
          <div class="top-food-list">${best.length ? best.map(([name, count], index) => `<div class="food-row"><span class="food-emoji">${["🥇", "🥈", "🥉", "🍽️", "🍽️"][index]}</span><div class="food-row-copy"><strong>${escapeHtml(name)}</strong><small>${count} sold</small></div><b>#${index + 1}</b></div>`).join("") : '<div class="empty-state">Sales will appear here as payments are recorded.</div>'}</div>
        </article>
      </section>
      <section class="table-panel" style="margin-top:16px"><div class="panel-heading"><div><h2>Recent sales activity</h2><p>Completed payment transactions</p></div></div><table class="data-table"><thead><tr><th>Date</th><th>Order</th><th>Payment method</th><th>Amount</th></tr></thead><tbody>${data.payments.slice().sort((a, b) => b.id - a.id).slice(0, 10).map((payment) => `<tr><td>${escapeHtml(payment.date)}</td><td><strong>#${payment.orderId}</strong></td><td>${escapeHtml(payment.method)}</td><td><strong>${money(payment.amount)}</strong></td></tr>`).join("") || '<tr><td colspan="4"><div class="empty-state">No sales recorded in this period.</div></td></tr>'}</tbody></table></section>`;
  }

  const pages = { dashboard: renderDashboard, orders: renderOrders, kitchen: renderKitchen, menu: renderMenu, tables: renderTables, deliveries: renderDeliveries, billing: renderBilling, inventory: renderInventory, staff: renderStaff, reports: renderReports };

  function render() {
    const shell = document.querySelector(".app-shell");
    const languagePicker = document.getElementById("language-select");
    languagePicker.value = language;
    if (!currentUser) {
      shell.classList.add("signed-out");
      document.getElementById("page-content").innerHTML = renderLogin();
      document.getElementById("current-section").textContent = "Sign in";
      localizeDOM();
      return;
    }
    shell.classList.remove("signed-out");
    if (currentUser.mustChangePassword || changingPassword) {
      document.getElementById("page-content").innerHTML = renderPasswordChange();
      localizeDOM();
      return;
    }
    if (!canAccessPage(currentUser.role, currentPage)) currentPage = "dashboard";
    document.getElementById("profile-name").textContent = currentUser.name;
    document.getElementById("profile-role").textContent = translateRole(currentUser.role);
    document.getElementById("profile-avatar").textContent = initials(currentUser.name);
    document.getElementById("top-avatar").textContent = initials(currentUser.name);
    if (!dataLoaded) {
      document.getElementById("page-content").innerHTML = `<section class="panel startup-panel"><span class="stat-icon">♨</span><h1>Connecting to your restaurant database</h1><p class="page-subtitle">Loading live menu, tables, orders, and reports…</p><button class="btn btn-secondary" data-action="retry-connection">Retry connection</button><p class="startup-help">Start MySQL in XAMPP and import <strong>database.sql</strong> if this is your first run.</p></section>`;
      localizeDOM();
      return;
    }
    document.getElementById("page-content").innerHTML = pages[currentPage]();
    document.getElementById("current-section").textContent = titleCase(currentPage);
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.toggle("active", link.dataset.page === currentPage);
      link.hidden = !canAccessPage(currentUser.role, link.dataset.page);
    });
    document.querySelector(".management-label").hidden = !["manager", "cashier"].includes(currentUser.role);
    const pendingCount = data.orders.filter((order) => ["New", "Preparing", "Ready"].includes(order.status)).length;
    document.getElementById("order-count").textContent = pendingCount || "";
    const locales = { en: "en-US", fr: "fr-FR", sw: "sw-KE" };
    document.getElementById("today-label").textContent = new Intl.DateTimeFormat(locales[language], { weekday: "short", month: "short", day: "numeric" }).format(new Date());
    localizeDOM();
  }

  function initials(name) {
    return name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  }

  function translateRole(role) {
    return localizeText(({ manager: "Manager", cashier: "Cashier", chef: "Chef", waiter: "Waiter", driver: "Driver" })[role] || role);
  }

  function canAccessPage(role, page) {
    const access = {
      manager: ["dashboard", "orders", "kitchen", "menu", "tables", "deliveries", "billing", "inventory", "staff", "reports"],
      cashier: ["dashboard", "orders", "menu", "billing", "reports"],
      chef: ["dashboard", "orders", "kitchen", "menu"],
      waiter: ["dashboard", "orders", "menu", "tables"],
      driver: ["dashboard", "deliveries"]
    };
    return (access[role] || []).includes(page);
  }

  function renderLogin() {
    const setupMessage = setupRequired
      ? `<p class="auth-notice">${localizeText("No manager account exists yet. Create the first account in a terminal:")} <code>php create_admin.php manager</code></p>`
      : "";
    return `<section class="auth-panel"><div class="auth-brand"><span class="brand-mark">H<span>&amp;</span>H</span><span class="brand-copy"><strong>Harbor &amp; Hearth</strong><small>RESTAURANT OS</small></span></div><p class="eyebrow">STAFF ACCESS</p><h1>Sign in to your restaurant</h1><p class="page-subtitle">Enter your staff account to continue.</p>${setupMessage}<form id="login-form" class="auth-form"><div class="form-field"><label for="login-username">Username</label><input id="login-username" name="username" autocomplete="username" required></div><div class="form-field"><label for="login-password">Password</label><input id="login-password" name="password" type="password" autocomplete="current-password" required></div><p class="auth-error" id="login-error" hidden></p><button class="btn btn-primary" type="submit">Sign in</button></form><a class="customer-site-link" href="order.php">Open the customer ordering website →</a></section>`;
  }

  function renderPasswordChange() {
    const forced = currentUser.mustChangePassword;
    return `<section class="auth-panel"><p class="eyebrow">ACCOUNT SECURITY</p><h1>${forced ? "Change temporary password" : "Change password"}</h1><p class="page-subtitle">${forced ? "Your temporary password must be changed before continuing." : "Choose a new password for your staff account."}</p><form id="change-password-form" class="auth-form"><div class="form-field"><label for="current-password">Current password</label><input id="current-password" name="currentPassword" type="password" autocomplete="current-password" required></div><div class="form-field"><label for="new-password">New password</label><input id="new-password" name="newPassword" type="password" autocomplete="new-password" minlength="12" required><span class="form-help">At least 12 characters, including letters and numbers.</span></div><div class="form-field"><label for="confirm-password">Confirm new password</label><input id="confirm-password" name="confirmPassword" type="password" autocomplete="new-password" minlength="12" required></div><p class="auth-error" id="password-error" hidden></p><div class="auth-actions"><button class="btn btn-primary" type="submit">Update password</button>${forced ? "" : '<button class="btn btn-secondary" type="button" data-action="cancel-password-change">Cancel</button>'}</div></form></section>`;
  }

  async function reloadData() {
    try {
      await api();
      render();
    } catch (error) {
      console.error("Could not load restaurant data.", error);
      if (error.code === "authentication_required") {
        currentUser = null;
        csrfToken = "";
        dataLoaded = false;
        render();
        return;
      }
      if (error.code === "password_change_required") {
        currentUser.mustChangePassword = true;
        render();
        return;
      }
      document.getElementById("page-content").innerHTML = `<section class="panel startup-panel"><span class="stat-icon">!</span><h1>Can’t connect to the restaurant database</h1><p class="page-subtitle">${escapeHtml(error.message)}</p><button class="btn btn-primary" data-action="retry-connection">Try again</button><p class="startup-help">Check that Apache and MySQL are running in XAMPP, then import <strong>database.sql</strong> using phpMyAdmin.</p></section>`;
    }
  }

  async function loadSession() {
    try {
      const response = await fetch("api.php?action=session", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not check sign-in status.");
      csrfToken = result.csrfToken || "";
      currentUser = result.user || null;
      setupRequired = Boolean(result.setupRequired);
      if (currentUser && !currentUser.mustChangePassword) await api();
      render();
    } catch (error) {
      console.error("Could not check sign-in status.", error);
      document.getElementById("page-content").innerHTML = `<section class="panel startup-panel"><h1>Can’t connect to the restaurant database</h1><p class="page-subtitle">${escapeHtml(error.message)}</p><button class="btn btn-primary" data-action="retry-connection">Try again</button></section>`;
    }
  }

  async function signIn(form) {
    const values = Object.fromEntries(new FormData(form).entries());
    const errorElement = document.getElementById("login-error");
    try {
      const result = await api("login", values);
      currentUser = result.user;
      if (currentUser.mustChangePassword) {
        render();
        return;
      }
      await api();
      currentPage = "dashboard";
      render();
    } catch (error) {
      errorElement.textContent = localizeText(error.message);
      errorElement.hidden = false;
    }
  }

  async function updatePassword(form) {
    const values = Object.fromEntries(new FormData(form).entries());
    const errorElement = document.getElementById("password-error");
    if (values.newPassword !== values.confirmPassword) {
      errorElement.textContent = localizeText("The new passwords do not match.");
      errorElement.hidden = false;
      return;
    }
    try {
      const result = await api("change_password", values);
      currentUser = result.user;
      changingPassword = false;
      await api();
      currentPage = "dashboard";
      render();
      toast(localizeText("Password updated successfully."));
    } catch (error) {
      errorElement.textContent = localizeText(error.message);
      errorElement.hidden = false;
    }
  }

  async function signOut() {
    try {
      await api("logout");
      currentUser = null;
      csrfToken = "";
      dataLoaded = false;
      changingPassword = false;
      render();
    } catch (error) {
      toast(error.message);
    }
  }

  async function runMutation(action, payload, message, page = currentPage) {
    try {
      await api(action, payload);
      currentPage = page;
      render();
      if (message) toast(message);
    } catch (error) {
      console.error(`Could not complete ${action}.`, error);
      toast(error.message);
    }
  }

  function switchPage(page) {
    if (!pages[page] || !currentUser || !canAccessPage(currentUser.role, page)) return;
    currentPage = page;
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("mobile-menu").setAttribute("aria-expanded", "false");
    render();
  }

  function field(label, name, value = "", type = "text", options = null, extra = "") {
    const control = options
      ? `<select id="field-${name}" name="${name}" ${extra}>${options.map((option) => `<option value="${escapeHtml(option.value)}" ${String(option.value) === String(value) ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}</select>`
      : `<input id="field-${name}" name="${name}" type="${type}" value="${escapeHtml(value)}" ${extra}>`;
    return `<div class="form-field"><label for="field-${name}">${label}</label>${control}</div>`;
  }

  function showModal(title, content, eyebrow = "WORKSPACE") {
    document.getElementById("modal-backdrop").classList.remove("invoice-backdrop");
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-eyebrow").textContent = eyebrow;
    document.getElementById("modal-content").innerHTML = content;
    document.getElementById("modal-backdrop").hidden = false;
    const first = document.querySelector("#modal-content input, #modal-content select, #modal-content button");
    if (first) first.focus();
    localizeDOM(document.getElementById("modal-content"));
  }

  function closeModal() {
    document.getElementById("modal-backdrop").hidden = true;
    document.getElementById("modal-backdrop").classList.remove("invoice-backdrop");
    if (foodPreviewUrl) {
      URL.revokeObjectURL(foodPreviewUrl);
      foodPreviewUrl = "";
    }
  }

  function formShell(fields, submitLabel = "Save changes", formName = "") {
    return `<form data-form="${formName}"><div class="form-grid">${fields}</div><div class="modal-actions"><button type="button" class="btn btn-secondary" data-close-modal>Cancel</button><button class="btn btn-primary" type="submit">${submitLabel}</button></div></form>`;
  }

  function openFoodForm(food = null) {
    const photo = foodPhotoPath(food?.image);
    const preview = photo ? `<img src="${escapeHtml(photo)}" alt="Current food photo">` : `<span>${escapeHtml(foodIcon(food?.image))}</span>`;
    const fields = `${field("Food name", "name", food?.name || "")}${field("Category", "category", food?.category || "Dinner", "text", categories.map((item) => ({ value: item, label: item })))}
      ${field("Price", "price", food?.price ?? "", "number", null, 'min="0" step="0.01" required')}
      <div class="form-field full"><label for="field-imageFile">Food photo</label><input id="field-imageFile" name="imageFile" type="file" accept="image/jpeg,image/png,image/gif,image/webp"><input type="hidden" name="image" value="${escapeHtml(food?.image || "🍽️")}"><span class="form-help">JPEG, PNG, GIF, or WebP · up to 5 MB</span><div class="food-image-preview" id="food-image-preview">${preview}</div></div>
      <div class="form-field full"><label for="field-description">Description</label><textarea name="description" id="field-description" placeholder="A short, appetizing description">${escapeHtml(food?.description || "")}</textarea></div>`;
    showModal(food ? "Edit food item" : "Add food item", formShell(fields, food ? "Save changes" : "Add to menu", food ? "edit-food" : "add-food"), "FOOD MENU");
    document.querySelector("#modal-content form").dataset.id = food?.id || "";
  }

  function openTableForm(table = null) {
    const fields = `${field("Table number", "number", table?.number || "")}${field("Number of seats", "seats", table?.seats || 2, "number", null, 'min="1" step="1" required')}
      ${field("Status", "status", table?.status || "Available", "text", ["Available", "Occupied", "Reserved"].map((item) => ({ value: item, label: item })))}`;
    showModal(table ? `Table ${table.number}` : "Add a table", formShell(fields, table ? "Save changes" : "Add table", table ? "edit-table" : "add-table"), "FLOOR PLAN");
    document.querySelector("#modal-content form").dataset.id = table?.id || "";
  }

  function openOrderForm() {
    const activeFoods = data.foods.filter((food) => food.active);
    if (!activeFoods.length) { toast("Add an available menu item before creating an order."); return; }
    const foodOptions = [{ value: "", label: "Choose a menu item" }, ...activeFoods.map((food) => ({ value: food.id, label: `${food.name} — ${money(food.price)}` }))];
    const tableOptions = [{ value: "", label: "No table / takeaway" }, ...data.tables.filter((table) => table.status !== "Occupied").map((table) => ({ value: table.id, label: `Table ${table.number} (${table.status.toLowerCase()})` }))];
    const fields = `${field("Customer name", "customer", "Walk-in guest", "text", null, 'required')}${field("Order type", "type", "Dine-in", "text", ["Dine-in", "Takeaway", "Delivery"].map((item) => ({ value: item, label: item })))}
      <div class="form-field full" id="table-field">${field("Dining table", "tableId", "", "text", tableOptions).replace('<div class="form-field">', '<div class="form-field" style="margin:0">')}</div>
      <div class="form-field full"><label>Order items</label><div id="order-item-list">${[0, 1, 2, 3].map((index) => `<div class="order-item-fields"><select name="food-${index}" aria-label="Food item ${index + 1}">${foodOptions.map((option) => `<option value="${option.value}">${escapeHtml(option.label)}</option>`).join("")}</select><input name="quantity-${index}" type="number" min="1" step="1" placeholder="Qty" aria-label="Quantity ${index + 1}"></div>`).join("")}</div><span class="form-help">Choose up to four menu items. Leave unused rows blank.</span></div>
      <div class="form-field full"><div class="modal-total"><span>Order total</span><strong id="order-total-preview">${money(0)}</strong></div></div>`;
    showModal("Create a new order", formShell(fields, "Create order", "new-order"), "CUSTOMER ORDER");
    const form = document.querySelector("#modal-content form");
    const typeSelect = form.elements.type;
    const tableField = document.getElementById("table-field");
    const tableSelect = form.elements.tableId;
    typeSelect.addEventListener("change", () => { tableField.hidden = typeSelect.value !== "Dine-in"; if (typeSelect.value !== "Dine-in") tableSelect.value = ""; });
    tableField.hidden = typeSelect.value !== "Dine-in";
    form.addEventListener("change", updateOrderTotal);
    form.addEventListener("input", updateOrderTotal);
    updateOrderTotal();
  }

  function updateOrderTotal() {
    const form = document.querySelector("#modal-content form[data-form='new-order']");
    if (!form) return;
    let total = 0;
    for (let index = 0; index < 4; index += 1) {
      const id = Number(form.elements[`food-${index}`]?.value);
      const quantity = Number(form.elements[`quantity-${index}`]?.value || 0);
      const food = data.foods.find((item) => item.id === id);
      if (food && quantity > 0) total += food.price * quantity;
    }
    document.getElementById("order-total-preview").textContent = money(total);
  }

  function openPaymentForm(order) {
    const fields = `<div class="form-field full"><label>Order</label><div class="field-control" style="display:flex;align-items:center;background:#fafbf9">#${order.id} · ${escapeHtml(order.customer)} · ${money(order.total)}</div></div>
      ${field("Amount received", "amount", order.total, "number", null, 'min="0.01" step="0.01" required')}
      ${field("Payment method", "method", "Cash", "text", ["Cash", "Mobile Money", "Card"].map((item) => ({ value: item, label: item }))) }
      <div id="mobile-money-payment-fields" style="display:none">
        ${field("Phone number", "customerPhone", order.customerPhone || "", "tel", null, 'placeholder="+250 7xx xxx xxx"')}
        ${field("MoMo code / reference", "momoCode", "", "text", null, 'placeholder="e.g. MOMO-12345"')}
      </div>`;
    showModal("Take payment", formShell(fields, "Record payment", "pay-order"), "BILLING");
    const form = document.querySelector("#modal-content form");
    form.dataset.id = order.id;
    const methodField = form.elements.method;
    const mobileFields = document.getElementById("mobile-money-payment-fields");
    const syncMobileMoneyFields = () => {
      const showMobile = methodField.value === "Mobile Money";
      mobileFields.style.display = showMobile ? "block" : "none";
      mobileFields.querySelectorAll("input").forEach((input) => {
        input.required = showMobile;
      });
    };
    methodField.addEventListener("change", syncMobileMoneyFields);
    syncMobileMoneyFields();
  }

  function openStaffForm(member = null) {
    const fields = `${field("Full name", "name", member?.name || "")}${field("Role", "role", member?.role || "Waiter", "text", ["Waiter", "Cashier", "Chef", "Sous Chef", "Head Chef", "Manager"].map((item) => ({ value: item, label: item })))}
      ${field("Phone number", "phone", member?.phone || "", "tel")}${field("Monthly salary", "salary", member?.salary || "", "number", null, 'min="0" step="0.01" required')}`;
    showModal(member ? "Edit team member" : "Add a team member", formShell(fields, member ? "Save changes" : "Add team member", member ? "edit-staff" : "add-staff"), "YOUR TEAM");
    document.querySelector("#modal-content form").dataset.id = member?.id || "";
  }

  function openUserForm() {
    const fields = `${field("Full name", "name", "")}${field("Username", "username", "", "text", null, 'minlength="3" maxlength="80" autocomplete="off" required')}
      ${field("Role", "role", "waiter", "text", ["manager", "cashier", "chef", "waiter", "driver"].map((role) => ({ value: role, label: translateRole(role) })))}
      ${field("Temporary password", "password", "", "password", null, 'minlength="12" autocomplete="new-password" required')}
      <div class="form-field full"><span class="form-help">The new staff member must change this password at first sign-in. Use at least 12 characters with letters and numbers.</span></div>`;
    showModal("Create staff account", formShell(fields, "Create account", "create-user"), "ACCOUNT SECURITY");
  }

  function openInventoryForm(item = null) {
    const fields = `${field("Ingredient name", "name", item?.name || "")}${field("Unit", "unit", item?.unit || "kg", "text", ["kg", "g", "L", "ml", "pcs", "boxes"].map((unit) => ({ value: unit, label: unit })))}
      ${field("Current quantity", "quantity", item?.quantity ?? 0, "number", null, 'min="0" step="0.01" required')}${field("Low-stock threshold", "minimum", item?.minimum ?? 1, "number", null, 'min="0" step="0.01" required')}
      <div class="form-field full"><label for="field-supplier">Supplier</label><input id="field-supplier" name="supplier" value="${escapeHtml(item?.supplier || "")}" placeholder="Supplier name"></div>`;
    showModal(item ? "Edit ingredient" : "Add an ingredient", formShell(fields, item ? "Save changes" : "Add ingredient", item ? "edit-inventory" : "add-inventory"), "INVENTORY");
    document.querySelector("#modal-content form").dataset.id = item?.id || "";
  }

  function openStockChange(item, kind) {
    const fields = `<div class="form-field full"><label>Ingredient</label><div class="field-control" style="display:flex;align-items:center;background:#fafbf9">${escapeHtml(item.name)} · Current stock: ${item.quantity} ${escapeHtml(item.unit)}</div></div>
      ${field("Quantity", "quantity", "", "number", null, 'min="0.01" step="0.01" required')}`;
    showModal(kind === "in" ? "Stock in" : "Stock out", formShell(fields, kind === "in" ? "Add stock" : "Remove stock", `stock-${kind}`), "INVENTORY");
    const form = document.querySelector("#modal-content form");
    form.dataset.id = item.id;
    form.dataset.kind = kind;
  }

  function openPurchaseForm() {
    const options = data.inventory.map((item) => ({ value: item.id, label: `${item.name} (${item.unit})` }));
    const fields = `${field("Ingredient", "inventoryId", options[0]?.value || "", "text", options)}${field("Quantity purchased", "quantity", "", "number", null, 'min="0.01" step="0.01" required')}
      <div class="form-field full"><label for="field-supplier">Supplier</label><input id="field-supplier" name="supplier" placeholder="Supplier name"></div>`;
    if (!options.length) { toast("Add an ingredient before recording a purchase."); return; }
    showModal("Record a purchase", formShell(fields, "Record purchase", "add-purchase"), "INVENTORY");
  }

  async function advanceOrder(id) {
    const order = data.orders.find((item) => item.id === Number(id));
    if (!order) return;
    const next = { New: "Preparing", Preparing: "Ready", Ready: "Completed" }[order.status];
    if (!next) return;
    await runMutation("advance_order", { id: order.id }, `Order #${order.id} marked ${next.toLowerCase()}.`);
  }

  function printReceipt(order) {
    const receipt = document.createElement("div");
    receipt.className = "print-receipt";
    const table = order.tableId ? tableById(order.tableId) : null;
    const payment = data.payments.find((item) => item.orderId === order.id);
    const paid = order.paymentStatus === "Paid";
    receipt.innerHTML = `
      <header class="receipt-header">
        <span class="receipt-brand-mark">H<span>&amp;</span>H</span>
        <h3>Harbor &amp; Hearth</h3>
        <p>Serving Freshness Every Day</p>
      </header>
      <div class="receipt-title">${paid ? "PAYMENT RECEIPT" : "ORDER SUMMARY · UNPAID"}</div>
      <section class="receipt-meta">
        <div><span>Receipt</span><strong>HH-${escapeHtml(order.date.replace(/-/g, ""))}-${escapeHtml(order.id)}</strong></div>
        <div><span>Order</span><strong>#${escapeHtml(order.id)}</strong></div>
        <div><span>Date</span><strong>${escapeHtml(order.date)} · ${escapeHtml(order.time)}</strong></div>
        <div><span>Customer</span><strong>${escapeHtml(order.customer)}</strong></div>
        <div><span>Order type</span><strong>${escapeHtml(order.type)}${table ? ` · Table ${escapeHtml(table.number)}` : ""}</strong></div>
      </section>
      <div class="receipt-items-heading"><span>ITEM</span><span>AMOUNT</span></div>
      <section class="receipt-items">${order.items.map((item) => `
        <div class="receipt-item">
          <div class="receipt-item-name">${escapeHtml(item.name)}</div>
          <div class="receipt-item-detail"><span>${item.quantity} × ${money(item.price)}</span><strong>${money(item.quantity * item.price)}</strong></div>
        </div>`).join("")}</section>
      <section class="receipt-totals">
        <div><span>Subtotal</span><span>${money(order.total)}</span></div>
        <div class="receipt-grand-total"><strong>Total</strong><strong>${money(order.total)}</strong></div>
        ${paid ? `<div><span>Payment method</span><strong>${escapeHtml(payment?.method || "Recorded payment")}</strong></div>${payment?.method === "Mobile Money" && payment?.customerPhone ? `<div><span>Phone</span><strong>${escapeHtml(payment.customerPhone)}</strong></div>` : ""}${payment?.method === "Mobile Money" && payment?.providerReference ? `<div><span>MoMo code</span><strong>${escapeHtml(payment.providerReference)}</strong></div>` : ""}<div><span>Payment status</span><strong>PAID</strong></div>` : `<div class="receipt-due"><strong>Payment status</strong><strong>PAYMENT DUE</strong></div>`}
      </section>
      <footer class="receipt-footer"><strong>Thank you for dining with us!</strong><span>We hope to see you again soon.</span></footer>`;
    const content = document.getElementById("modal-content");
    content.innerHTML = "";
    content.append(receipt);
    content.insertAdjacentHTML("beforeend", `<div class="modal-actions"><button class="btn btn-secondary" data-close-modal>Close</button><button class="btn btn-primary" data-action="print-receipt">⎙ &nbsp;Print ${paid ? "receipt" : "order summary"}</button></div>`);
    document.getElementById("modal-title").textContent = paid ? "Payment receipt" : "Unpaid order summary";
    document.getElementById("modal-eyebrow").textContent = "BILLING";
    document.getElementById("modal-backdrop").hidden = false;
    localizeDOM(document.getElementById("modal-content"));
  }

  function printInvoice(order) {
    const invoice = document.createElement("article");
    invoice.className = "print-invoice";
    const table = order.tableId ? tableById(order.tableId) : null;
    const payment = data.payments.find((item) => item.orderId === order.id);
    const paid = order.paymentStatus === "Paid";
    const invoiceNumber = `HH-${order.date.replace(/-/g, "")}-${order.id}`;
    invoice.innerHTML = `
      <header class="invoice-header">
        <div class="invoice-seller">
          <span class="receipt-brand-mark">H<span>&amp;</span>H</span>
          <div><h2>Harbor &amp; Hearth</h2><p>Serving Freshness Every Day</p></div>
        </div>
        <div class="invoice-heading"><span>${paid ? "FACTURE ACQUITTÉE" : "FACTURE"}</span><strong>${invoiceNumber}</strong></div>
      </header>
      <section class="invoice-parties">
        <div><span class="invoice-label">FACTURÉ À</span><strong>${escapeHtml(order.customer)}</strong><span>${escapeHtml(order.type)}${table ? ` · Table ${escapeHtml(table.number)}` : ""}</span></div>
        <div><span class="invoice-label">DÉTAILS DE LA FACTURE</span><span>Facture n° <strong>${invoiceNumber}</strong></span><span>Date <strong>${escapeHtml(order.date)}</strong></span><span>Commande <strong>#${escapeHtml(order.id)}</strong></span></div>
      </section>
      <table class="invoice-items">
        <thead><tr><th>DÉSIGNATION</th><th>QTÉ</th><th>PRIX UNIT.</th><th>MONTANT</th></tr></thead>
        <tbody>${order.items.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${item.quantity}</td><td>${money(item.price)}</td><td>${money(item.quantity * item.price)}</td></tr>`).join("")}</tbody>
      </table>
      <section class="invoice-summary">
        <div><span>Sous-total</span><strong>${money(order.total)}</strong></div>
        <div class="invoice-total"><span>Total à payer</span><strong>${money(order.total)}</strong></div>
        <div><span>Statut</span><strong class="${paid ? "invoice-paid" : "invoice-unpaid"}">${paid ? "RÉGLÉE" : "À RÉGLER"}</strong></div>
        ${paid ? `<div><span>Mode de paiement</span><strong>${escapeHtml(payment?.method || "Paiement enregistré")}</strong></div>${payment?.method === "Mobile Money" && payment?.customerPhone ? `<div><span>Téléphone</span><strong>${escapeHtml(payment.customerPhone)}</strong></div>` : ""}${payment?.method === "Mobile Money" && payment?.providerReference ? `<div><span>Code MoMo</span><strong>${escapeHtml(payment.providerReference)}</strong></div>` : ""}` : ""}
      </section>
      <footer class="invoice-footer">Merci de votre confiance.<br><span>Coordonnées légales et TVA non configurées.</span></footer>`;

    const content = document.getElementById("modal-content");
    content.innerHTML = "";
    content.append(invoice);
    content.insertAdjacentHTML("beforeend", '<div class="modal-actions"><button class="btn btn-secondary" data-close-modal>Fermer</button><button class="btn btn-primary" data-action="print-receipt">⎙ &nbsp;Imprimer la facture</button></div>');
    document.getElementById("modal-title").textContent = "Facture client";
    document.getElementById("modal-eyebrow").textContent = "FACTURATION";
    document.getElementById("modal-backdrop").classList.add("invoice-backdrop");
    document.getElementById("modal-backdrop").hidden = false;
    localizeDOM(document.getElementById("modal-content"));
  }

  function printSummary() {
    const receipt = document.createElement("div");
    receipt.className = "print-receipt";
    const payments = data.payments.filter((payment) => payment.date === today());
    receipt.innerHTML = `
      <header class="receipt-header"><span class="receipt-brand-mark">H<span>&amp;</span>H</span><h3>Harbor &amp; Hearth</h3><p>Daily sales summary</p></header>
      <div class="receipt-title">PAYMENT REPORT · ${escapeHtml(today())}</div>
      <section class="receipt-items">${payments.map((payment) => `
        <div class="receipt-item">
          <div class="receipt-item-name">Order #${escapeHtml(payment.orderId)}</div>
          <div class="receipt-item-detail"><span>${escapeHtml(payment.method)}</span><strong>${money(payment.amount)}</strong></div>
        </div>`).join("") || '<div class="receipt-item">No payments recorded today.</div>'}</section>
      <section class="receipt-totals"><div class="receipt-grand-total"><strong>Total collected</strong><strong>${money(payments.reduce((sum, payment) => sum + Number(payment.amount), 0))}</strong></div></section>`;
    const content = document.getElementById("modal-content");
    content.innerHTML = "";
    content.append(receipt);
    content.insertAdjacentHTML("beforeend", '<div class="modal-actions"><button class="btn btn-secondary" data-close-modal>Close</button><button class="btn btn-primary" data-action="print-receipt">⎙ &nbsp;Print report</button></div>');
    document.getElementById("modal-title").textContent = "Daily sales report";
    document.getElementById("modal-eyebrow").textContent = "REPORTS";
    document.getElementById("modal-backdrop").hidden = false;
    localizeDOM(document.getElementById("modal-content"));
  }

  async function handleFormSubmit(form) {
    const values = Object.fromEntries(new FormData(form).entries());
    const kind = form.dataset.form;
    const id = Number(form.dataset.id);
    let foodImageFile = null;
    let action;
    let payload;
    let message;
    let page = currentPage;
    if (kind === "add-food" || kind === "edit-food") {
      payload = { id: kind === "edit-food" ? id : undefined, name: values.name.trim(), category: values.category, price: Number(values.price), image: values.image.trim() || "🍽️", description: values.description.trim() };
      if (!payload.name || payload.price < 0 || !Number.isFinite(payload.price)) { toast("Enter a valid food name and price."); return; }
      foodImageFile = form.elements.imageFile.files[0] || null;
      if (foodImageFile && foodImageFile.size > 5 * 1024 * 1024) { toast("Food photos must be 5 MB or smaller."); return; }
      action = "save_food";
      message = kind === "edit-food" ? "Food item updated." : "Food item added to your menu.";
    } else if (kind === "add-table" || kind === "edit-table") {
      payload = { id: kind === "edit-table" ? id : undefined, number: values.number.trim(), seats: Number(values.seats), status: values.status };
      if (!payload.number || payload.seats < 1 || !Number.isInteger(payload.seats)) { toast("Enter a table number and valid seat count."); return; }
      action = "save_table";
      message = kind === "edit-table" ? "Table updated." : "Table added to the floor plan.";
    } else if (kind === "new-order") {
      const items = [];
      for (let index = 0; index < 4; index += 1) {
        const foodId = Number(values[`food-${index}`]);
        const quantity = Number(values[`quantity-${index}`] || 0);
        if (foodId && quantity > 0) items.push({ foodId, quantity });
      }
      if (!items.length) { toast("Choose at least one menu item for this order."); return; }
      payload = { customer: values.customer.trim() || "Walk-in guest", type: values.type, tableId: values.tableId || null, items };
      action = "create_order";
      message = "Order created and sent to the kitchen.";
      page = "orders";
    } else if (kind === "pay-order") {
      const order = data.orders.find((item) => item.id === id);
      const amount = Number(values.amount);
      const method = values.method;
      const customerPhone = (values.customerPhone || "").trim();
      const momoCode = (values.momoCode || "").trim();
      if (!order || order.paymentStatus === "Paid") { toast("This order has already been paid."); return; }
      if (!Number.isFinite(amount) || amount < order.total) { toast(`Payment must be at least ${money(order.total)}.`); return; }
      if (method === "Mobile Money") {
        if (!customerPhone || !/^\+?[0-9\s\-\(\)]{8,32}$/.test(customerPhone)) { toast("Enter a valid phone number for the Mobile Money payment."); return; }
        if (!momoCode) { toast("Add the Mobile Money code or reference number."); return; }
      }
      payload = { id, amountReceived: amount, method, customerPhone, momoCode };
      action = "record_payment";
      message = `Payment recorded for order #${id}.`;
    } else if (kind === "add-staff" || kind === "edit-staff") {
      payload = { id: kind === "edit-staff" ? id : undefined, name: values.name.trim(), role: values.role, phone: values.phone.trim(), salary: Number(values.salary) };
      if (!payload.name || payload.salary < 0 || !Number.isFinite(payload.salary)) { toast("Enter a valid name and salary."); return; }
      action = "save_staff";
      message = kind === "edit-staff" ? "Staff member updated." : "Staff member added.";
    } else if (kind === "create-user") {
      payload = { name: values.name.trim(), username: values.username.trim(), role: values.role, password: values.password };
      action = "create_user";
      message = "Staff account created. Share the temporary password securely.";
    } else if (kind === "add-inventory" || kind === "edit-inventory") {
      payload = { id: kind === "edit-inventory" ? id : undefined, name: values.name.trim(), unit: values.unit, quantity: Number(values.quantity), minimum: Number(values.minimum), supplier: values.supplier.trim() };
      if (!payload.name || payload.quantity < 0 || payload.minimum < 0) { toast("Enter a valid ingredient and stock quantity."); return; }
      action = "save_inventory";
      message = kind === "edit-inventory" ? "Ingredient updated." : "Ingredient added to inventory.";
    } else if (kind === "stock-in" || kind === "stock-out") {
      const item = data.inventory.find((entry) => entry.id === id);
      const quantity = Number(values.quantity);
      if (!item || quantity <= 0 || !Number.isFinite(quantity)) { toast("Enter a valid stock quantity."); return; }
      if (kind === "stock-out" && quantity > Number(item.quantity)) { toast("Stock out quantity cannot exceed current stock."); return; }
      payload = { id, quantity, direction: kind === "stock-in" ? "in" : "out" };
      action = "adjust_stock";
      message = `${quantity} ${item.unit} ${kind === "stock-in" ? "added to" : "removed from"} ${item.name}.`;
    } else if (kind === "add-purchase") {
      const item = data.inventory.find((entry) => entry.id === Number(values.inventoryId));
      const quantity = Number(values.quantity);
      if (!item || quantity <= 0 || !Number.isFinite(quantity)) { toast("Select an ingredient and enter a valid quantity."); return; }
      payload = { inventoryId: item.id, quantity, supplier: values.supplier.trim() };
      action = "create_purchase";
      message = `${quantity} ${item.unit} of ${item.name} recorded as purchased.`;
    } else {
      return;
    }

    const submitButton = form.querySelector('[type="submit"]');
    submitButton.disabled = true;
    try {
      if (foodImageFile) payload.image = await uploadFoodImage(foodImageFile);
      await api(action, payload);
      if (kind === "new-order") message = `Order #${data.orders[0]?.id ?? ""} created and sent to the kitchen.`;
      closeModal();
      currentPage = page;
      render();
      toast(message);
    } catch (error) {
      console.error(`Could not complete ${action}.`, error);
      toast(error.message);
      submitButton.disabled = false;
    }
  }

  document.addEventListener("click", async (event) => {
    const pageLink = event.target.closest("[data-page]");
    if (pageLink) { switchPage(pageLink.dataset.page); return; }
    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;
    const { action, id } = actionButton.dataset;
    if (action === "close-modal") closeModal();
    else if (action === "logout") await signOut();
    else if (action === "change-password") { changingPassword = true; render(); }
    else if (action === "cancel-password-change") { changingPassword = false; render(); }
    else if (action === "retry-connection") await reloadData();
    else if (action === "new-order") openOrderForm();
    else if (action === "add-food") openFoodForm();
    else if (action === "edit-food") openFoodForm(data.foods.find((item) => item.id === Number(id)));
    else if (action === "toggle-food") { const food = data.foods.find((item) => item.id === Number(id)); if (food) await runMutation("toggle_food", { id: food.id }, `${food.name} availability updated.`); }
    else if (action === "add-table") openTableForm();
    else if (action === "edit-table") openTableForm(tableById(id));
    else if (action === "advance-order") advanceOrder(id);
    else if (action === "pay-order") { const order = data.orders.find((item) => item.id === Number(id)); if (order) openPaymentForm(order); }
    else if (action === "invoice") { const order = data.orders.find((item) => item.id === Number(id)); if (order) printInvoice(order); }
    else if (action === "receipt") { const order = data.orders.find((item) => item.id === Number(id)); if (order) printReceipt(order); }
    else if (action === "print-summary") printSummary();
    else if (action === "print-receipt") window.print();
    else if (action === "add-staff") openStaffForm();
    else if (action === "edit-staff") openStaffForm(data.staff.find((item) => item.id === Number(id)));
    else if (action === "add-user") openUserForm();
    else if (action === "toggle-user") await runMutation("set_user_active", { id: Number(id), active: actionButton.dataset.active === "true" }, localizeText("Account status updated."));
    else if (action === "update-delivery") await runMutation("update_delivery", { id: Number(id) }, localizeText("Delivery status updated."));
    else if (action === "add-inventory") openInventoryForm();
    else if (action === "stock-change") openStockChange(data.inventory.find((item) => item.id === Number(id)), actionButton.dataset.kind);
    else if (action === "add-purchase") openPurchaseForm();
    else if (action === "refresh") { await reloadData(); toast("Kitchen orders refreshed."); }
    else if (action === "go-reports") switchPage("reports");
  });

  document.addEventListener("submit", async (event) => {
    const form = event.target.closest("#modal-content form, #login-form, #change-password-form, [data-form='assign-delivery']");
    if (!form) return;
    event.preventDefault();
    if (form.id === "login-form") await signIn(form);
    else if (form.id === "change-password-form") await updatePassword(form);
    else if (form.dataset.form === "assign-delivery") {
      await runMutation("assign_delivery", { orderId: Number(form.dataset.orderId), driverId: Number(form.elements.driverId.value) }, localizeText("Driver assigned to delivery."));
    }
    else await handleFormSubmit(form);
  });

  document.addEventListener("input", (event) => {
    if (event.target.id === "order-search") { orderSearch = event.target.value; const cursor = event.target.selectionStart; render(); const input = document.getElementById("order-search"); input.focus(); input.setSelectionRange(cursor, cursor); }
    if (event.target.id === "menu-search") { menuSearch = event.target.value; const cursor = event.target.selectionStart; render(); const input = document.getElementById("menu-search"); input.focus(); input.setSelectionRange(cursor, cursor); }
  });

  document.addEventListener("change", (event) => {
    if (event.target.id === "field-imageFile") {
      const file = event.target.files[0];
      const preview = document.getElementById("food-image-preview");
      if (!file || !preview) return;
      if (foodPreviewUrl) URL.revokeObjectURL(foodPreviewUrl);
      foodPreviewUrl = URL.createObjectURL(file);
      const image = document.createElement("img");
      image.src = foodPreviewUrl;
      image.alt = "Selected food photo";
      preview.replaceChildren(image);
    }
    if (event.target.id === "language-select") {
      language = event.target.value;
      localStorage.setItem("harbor-hearth-language", language);
      render();
      return;
    }
    if (event.target.id === "menu-category") { menuCategory = event.target.value; render(); }
    if (event.target.id === "order-filter") {
      const selected = event.target.value;
      const rows = document.querySelectorAll("#page-content .data-table tbody tr");
      rows.forEach((row) => { row.hidden = selected !== "All orders" && !row.textContent.includes(selected); });
    }
  });

  document.getElementById("mobile-menu").addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    const isOpen = sidebar.classList.toggle("open");
    document.getElementById("mobile-menu").setAttribute("aria-expanded", String(isOpen));
  });
  document.getElementById("modal-backdrop").addEventListener("click", (event) => { if (event.target.id === "modal-backdrop") closeModal(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });

  render();
  loadSession();
})();
