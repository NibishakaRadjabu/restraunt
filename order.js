(() => {
  "use strict";

  const cartKey = "harbor-hearth-customer-cart";
  const menuRoot = document.getElementById("food-grid");
  const cartRoot = document.getElementById("cart-items");
  const ordersRoot = document.getElementById("order-list");
  const accountDialog = document.getElementById("account-dialog");
  let foods = [];
  let cart = readCart();
  let customer = null;
  let csrfToken = "";
  let favorites = new Set();
  let orders = [];
  let selectedCategory = "All";
  let accountMode = "login";
  let toastTimer;
  let orderSubmissionKey = sessionStorage.getItem("harbor-hearth-order-key") || "";
  let orderSubmitting = false;
  let currentLanguage = localStorage.getItem("harbor-hearth-language") || "en";

  const translations = {
    en: {
      menu: "Menu",
      my_orders: "My orders",
      sign_in: "Sign in",
      language: "Language",
      fresh_from_our_kitchen: "FRESH FROM OUR KITCHEN",
      good_food_good_mood: "GOOD FOOD, GOOD MOOD",
      fresh_food: "Fresh food.",
      right_to_your_door: "Right to your door.",
      thoughtful_ingredients: "Thoughtful ingredients, made fresh and delivered with care.",
      explore_menu: "Explore the menu",
      cash_on_delivery_note: "Cash on delivery · Made fresh when you order",
      made_with_care: "Made with care",
      served_fresh: "served fresh",
      little_something_delicious: "A LITTLE SOMETHING DELICIOUS",
      our_menu: "Our menu",
      freshly_made_favorites: "Freshly made favorites, ready when you are.",
      loading_today_menu: "Loading today's menu…",
      your_order: "YOUR ORDER",
      your_basket: "Your basket",
      basket_waiting: "Your basket is waiting for something delicious.",
      total: "Total",
      payment_note: "Place your order now. Pay cash or Mobile Money when it arrives.",
      delivery_address: "Delivery address",
      delivery_address_placeholder: "Street, neighborhood, city",
      delivery_notes: "Delivery notes",
      optional: "(optional)",
      delivery_notes_placeholder: "Gate code, landmarks, or delivery instructions",
      pay_place_order: "Place order",
      checkout_hint: "Sign in or create an account to place an order.",
      payment_collect_note: "Payment is collected by restaurant staff on delivery.",
      your_table_wherever_you_are: "YOUR TABLE, WHEREVER YOU ARE",
      order_history_tracking: "Order history & tracking",
      sign_in_follow_order: "Sign in to follow your order from our kitchen to your door.",
      refresh: "Refresh",
      empty_orders_prompt: "Sign in or create an account to see your orders.",
      good_food_shared_with_care: "Good food, shared with care.",
      back_to_menu: "Back to menu ↑",
      welcome_harbor_hearth: "WELCOME TO HARBOR & HEARTH",
      your_account: "Your account",
      sign_in_checkout_delivery: "Sign in to checkout and follow your delivery.",
      your_name: "Your name",
      phone_number: "Phone number",
      phone_number_placeholder: "+250 7xx xxx xxx",
      password: "Password",
      password_hint: "Use at least 12 characters, including letters and numbers.",
      new_here_create_account: "New here? Create an account",
      all_dishes: "All dishes",
      no_dishes_in_category: "No dishes in this category just yet.",
      add_to_favorites: "Add to favorites",
      remove_from_favorites: "Remove from favorites",
      add_to_basket: "Add to basket",
      remove_one: "Remove one",
      add_one: "Add one",
      ordering_as: "Ordering as",
      pay_before_kitchen: "Pay cash or Mobile Money to restaurant staff on delivery.",
      sign_in_to_save_favorites: "Sign in to save your favorites.",
      sign_in_to_checkout: "Sign in or create an account before checkout.",
      order_number: "Order #",
      delivered_to: "Deliver to:",
      payment_method: "Payment",
      pay_on_delivery: "Pay on delivery",
      order_again: "Order again",
      please_sign_in_again: "Please sign in again to view your orders.",
      your_account_ready: "Your account is ready.",
      welcome_back: "Welcome back.",
      sent_to_kitchen: "has been sent to our kitchen.",
      sign_out: "You have signed out.",
      order_placed: "Your order has been placed.",
      available_items_added: "Available items from your order were added to your basket.",
      favorite_updated: "Favorite updated.",
      create_your_account: "Create your account",
      one_account: "One account keeps your orders and favorites together.",
      welcome_back_message: "Sign in to checkout and follow your delivery.",
      create_account: "Create account",
      already_have_account: "Already have an account? Sign in",
      received: "Received",
      preparing: "Preparing",
      ready_for_pickup: "Ready for pickup",
      on_the_way: "On the way",
      delivered: "Delivered",
      pick_up: "Picked up",
      customers_name: "Customer name",
      category: "Category",
      total_amount: "Total",
      order_status: "Order status",
      payment_method_label: "Payment method",
      payment_status: "Payment status",
      payment_pending: "Payment pending",
      add_item: "Add",
      no_items: "No items",
      orders_refresh: "Refresh",
      continue: "Continue",
      close: "Close",
      check_out: "Checkout"
    },
    fr: {
      menu: "Menu",
      my_orders: "Mes commandes",
      sign_in: "Se connecter",
      language: "Langue",
      fresh_from_our_kitchen: "FRAIS DE NOTRE CUISINE",
      good_food_good_mood: "BONNE NOURRITURE, BONNE HUMEUR",
      fresh_food: "Nourriture fraîche.",
      right_to_your_door: "À votre porte.",
      thoughtful_ingredients: "Des ingrédients soigneusement choisis, préparés frais et livrés avec soin.",
      explore_menu: "Découvrir le menu",
      cash_on_delivery_note: "Paiement à la livraison · Préparé frais à la commande",
      made_with_care: "Préparé avec soin",
      served_fresh: "servi frais",
      little_something_delicious: "UN PETIT SOMETHING DE DÉLICIEUX",
      our_menu: "Notre menu",
      freshly_made_favorites: "Des favorites préparées avec soin, prêtes quand vous l’êtes.",
      loading_today_menu: "Chargement du menu du jour…",
      your_order: "VOTRE COMMANDE",
      your_basket: "Votre panier",
      basket_waiting: "Votre panier attend un plat délicieux.",
      total: "Total",
      payment_note: "Passez votre commande maintenant. Payez en espèces ou par Mobile Money à la livraison.",
      delivery_address: "Adresse de livraison",
      delivery_address_placeholder: "Rue, quartier, ville",
      delivery_notes: "Instructions de livraison",
      optional: "(facultatif)",
      delivery_notes_placeholder: "Code porte, repères ou consignes",
      pay_place_order: "Commander",
      checkout_hint: "Connectez-vous ou créez un compte pour commander.",
      payment_collect_note: "Le paiement est encaissé par le personnel du restaurant à la livraison.",
      your_table_wherever_you_are: "VOTRE TABLE, OÙ QUE VOUS SOYEZ",
      order_history_tracking: "Historique et suivi des commandes",
      sign_in_follow_order: "Connectez-vous pour suivre votre commande de la cuisine jusqu’à votre porte.",
      refresh: "Actualiser",
      empty_orders_prompt: "Connectez-vous ou créez un compte pour voir vos commandes.",
      good_food_shared_with_care: "Une bonne cuisine, partagée avec soin.",
      back_to_menu: "Retour au menu ↑",
      welcome_harbor_hearth: "BIENVENUE CHEZ HARBOR & HEARTH",
      your_account: "Votre compte",
      sign_in_checkout_delivery: "Connectez-vous pour commander et suivre votre livraison.",
      your_name: "Votre nom",
      phone_number: "Numéro de téléphone",
      phone_number_placeholder: "+250 7xx xxx xxx",
      password: "Mot de passe",
      password_hint: "Utilisez au moins 12 caractères, dont des lettres et des chiffres.",
      new_here_create_account: "Nouveau ? Créer un compte",
      all_dishes: "Tous les plats",
      no_dishes_in_category: "Aucun plat dans cette catégorie pour le moment.",
      add_to_favorites: "Ajouter aux favoris",
      remove_from_favorites: "Retirer des favoris",
      add_to_basket: "Ajouter au panier",
      remove_one: "Retirer un",
      add_one: "Ajouter un",
      ordering_as: "Commander en tant que",
      pay_before_kitchen: "Payez en espèces ou par Mobile Money au personnel à la livraison.",
      sign_in_to_save_favorites: "Connectez-vous pour enregistrer vos favoris.",
      sign_in_to_checkout: "Connectez-vous ou créez un compte avant de commander.",
      order_number: "Commande #",
      delivered_to: "Livrer à :",
      payment_method: "Paiement",
      pay_on_delivery: "Paiement à la livraison",
      order_again: "Commander à nouveau",
      please_sign_in_again: "Veuillez vous reconnecter pour voir vos commandes.",
      your_account_ready: "Votre compte est prêt.",
      welcome_back: "Bon retour.",
      sent_to_kitchen: "a été envoyée à notre cuisine.",
      sign_out: "Vous êtes déconnecté.",
      order_placed: "Votre commande a été passée.",
      available_items_added: "Les articles de votre commande ont été ajoutés au panier.",
      create_your_account: "Créez votre compte",
      one_account: "Un compte rassemble vos commandes et vos favoris.",
      welcome_back_message: "Connectez-vous pour commander et suivre votre livraison.",
      create_account: "Créer un compte",
      already_have_account: "Vous avez déjà un compte ? Se connecter",
      received: "Reçu",
      preparing: "En préparation",
      ready_for_pickup: "Prêt à récupérer",
      on_the_way: "En chemin",
      delivered: "Livré",
      pick_up: "Retiré",
      check_out: "Commander"
    },
    sw: {
      menu: "Menyu",
      my_orders: "Maagizo yangu",
      sign_in: "Ingia",
      language: "Lugha",
      fresh_from_our_kitchen: "KILICHO TUMEKUZA KUTOKA KATIKA JIKONI LETU",
      good_food_good_mood: "CHAKULA CHAFY, MOYO MWEMA",
      fresh_food: "Chakula kipya.",
      right_to_your_door: "Kwenye mlango wako.",
      thoughtful_ingredients: "Vyakula vilivyochaguliwa kwa makini, vilivyotayarishwa na kupelekwa kwa makini.",
      explore_menu: "Angalia menyu",
      cash_on_delivery_note: "Malipo ukifika · Tayarishwa kwa upya kila unapotuma agizo",
      made_with_care: "Imetengenezwa kwa makini",
      served_fresh: "inatolewa mpya",
      little_something_delicious: "KITU KIDOGO CHENYE LEMBE",
      our_menu: "Menyu yetu",
      freshly_made_favorites: "Vipendwa vilivyotayarishwa vizuri, tayari unapotaka.",
      loading_today_menu: "Inapakia menyu ya leo…",
      your_order: "AGIZO LAKO",
      your_basket: "Kikapu chako",
      basket_waiting: "Kikapu chako kimeka tayari kwa kitu kitamu.",
      total: "Jumla",
      payment_note: "Weka agizo lako sasa. Lipa taslimu au kwa Mobile Money linapowasili.",
      delivery_address: "Anwani ya uwasilishaji",
      delivery_address_placeholder: "Mtaa, eneo, jiji",
      delivery_notes: "Maelezo ya uwasilishaji",
      optional: "(si lazima)",
      delivery_notes_placeholder: "Msimbo wa geti, alama, au maelezo ya usafirishaji",
      pay_place_order: "Weka agizo",
      checkout_hint: "Ingia au unda akaunti ili kuweka agizo.",
      payment_collect_note: "Malipo yatapokelewa na wafanyakazi wa mgahawa wakati wa usafirishaji.",
      your_table_wherever_you_are: "MEZA YAKO, UKO WAPI WOWOTE",
      order_history_tracking: "Historia ya maagizo na ufuatiliaji",
      sign_in_follow_order: "Ingia ili kufuatilia agizo lako kutoka jikoni hadi mlangoni mwako.",
      refresh: "Sasisha",
      empty_orders_prompt: "Ingia au unda akaunti ili kuona maagizo yako.",
      good_food_shared_with_care: "Chakula kizuri, kilichoshirikiwa kwa makini.",
      back_to_menu: "Rudi kwenye menyu ↑",
      welcome_harbor_hearth: "KARIBUNI HARBOR & HEARTH",
      your_account: "Akaunti yako",
      sign_in_checkout_delivery: "Ingia ili kuagiza na kufuatilia usafirishaji wako.",
      your_name: "Jina lako",
      phone_number: "Namba ya simu",
      phone_number_placeholder: "+250 7xx xxx xxx",
      password: "Nywila",
      password_hint: "Tumia angalau herufi 12, ikijumuisha herufi na nambari.",
      new_here_create_account: "Mgeni? Unda akaunti",
      all_dishes: "Vyakula vyote",
      no_dishes_in_category: "Hakuna vyakula katika kategoria hii bado.",
      add_to_favorites: "Ongeza kwenye vipendwa",
      remove_from_favorites: "Ondoa kwenye vipendwa",
      add_to_basket: "Ongeza kwenye kikapu",
      remove_one: "Ondoa moja",
      add_one: "Ongeza moja",
      ordering_as: "Unaagiza kama",
      pay_before_kitchen: "Lipa taslimu au kwa Mobile Money kwa mfanyakazi wa mgahawa ukiletewa.",
      sign_in_to_save_favorites: "Ingia ili kuhifadhi vipendwa vyako.",
      sign_in_to_checkout: "Ingia au unda akaunti kabla ya kuagiza.",
      order_number: "Agizo #",
      delivered_to: "Isafirishwe kwa:",
      payment_method: "Malipo",
      pay_on_delivery: "Lipa ukiletewa",
      order_again: "Agiza tena",
      please_sign_in_again: "Tafadhali ingia tena kuona maagizo yako.",
      your_account_ready: "Akaunti yako iko tayari.",
      welcome_back: "Karibu tena.",
      sent_to_kitchen: "imetumwa kwenye jikoni letu.",
      sign_out: "Umeondoka kwenye mfumo.",
      order_placed: "Agizo lako limetumwa.",
      available_items_added: "Vipengee kutoka agizo lako vimeongeza kwenye kikapu chako.",
      create_your_account: "Unda akaunti yako",
      one_account: "Akaunti moja hukusanya maagizo na vipendwa vyako."
    }
  };

  function t(key, fallback = key) {
    const dictionary = translations[currentLanguage] || translations.en;
    return dictionary[key] || fallback;
  }

  function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      const value = t(key, key);
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.value = value;
      } else {
        element.textContent = value;
      }
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const key = element.dataset.i18nPlaceholder;
      element.placeholder = t(key, element.placeholder || "");
    });
  }

  function readCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(cartKey) || "{}");
      return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
    } catch (error) {
      console.warn("Saved customer cart could not be read.", error);
      return {};
    }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }

  function money(value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value) || 0);
  }

  function newUuid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      const random = Math.random() * 16 | 0;
      return (char === "x" ? random : (random & 0x3 | 0x8)).toString(16);
    });
  }

  function foodPhotoPath(image) {
    return /^uploads\/food-images\/[a-f0-9]{32}\.(?:jpg|png|gif|webp)$/.test(image || "") ? image : "";
  }

  function foodIcon(image) {
    return /[\u{1F000}-\u{1FAFF}\u2600-\u27BF]/u.test(image || "") ? image : "🍽️";
  }

  async function api(action, payload = {}, method = "POST") {
    const options = method === "GET"
      ? { method: "GET", credentials: "same-origin", cache: "no-store" }
      : {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json", ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}) },
          body: JSON.stringify({ ...payload, action })
        };
    const url = method === "GET" ? `customer_api.php?action=${encodeURIComponent(action)}` : "customer_api.php";
    const response = await fetch(url, options);
    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error("The server returned an invalid response.");
    }
    if (!response.ok) {
      const error = new Error(result.error || `Request failed (${response.status}).`);
      error.status = response.status;
      throw error;
    }
    if (result.csrfToken) csrfToken = result.csrfToken;
    return result;
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => { toast.hidden = true; }, 3200);
  }

  function saveCart() {
    localStorage.setItem(cartKey, JSON.stringify(cart));
    renderCart();
  }

  function renderCategories() {
    const available = new Set(foods.map((food) => food.category));
    const featured = ["Breakfast", "Lunch", "Dinner", "Drinks", "Dessert"].filter((category) => available.has(category));
    const other = [...available].filter((category) => !featured.includes(category)).sort((first, second) => first.localeCompare(second));
    const categories = ["All", ...featured, ...other];
    document.getElementById("categories").innerHTML = categories.map((category) => {
      const label = category === "All" ? t("all_dishes", "All dishes") : t(category, category);
      return `<button class="category-chip ${category === selectedCategory ? "active" : ""}" data-category="${escapeHtml(category)}">${escapeHtml(label)}</button>`;
    }).join("");
  }

  function renderFoods() {
    const visibleFoods = foods.filter((food) => selectedCategory === "All" || food.category === selectedCategory);
    if (!visibleFoods.length) {
      menuRoot.innerHTML = `<div class="loading-card">${escapeHtml(t("no_dishes_in_category", "No dishes in this category just yet."))}</div>`;
      return;
    }
    menuRoot.innerHTML = visibleFoods.map((food) => {
      const photo = foodPhotoPath(food.image);
      const favoriteLabel = favorites.has(food.id) ? t("remove_from_favorites", "Remove from favorites") : t("add_to_favorites", "Add to favorites");
      return `<article class="food-card">
        <div class="food-art ${photo ? "has-photo" : ""}">
          ${photo
            ? `<img class="food-photo" src="${escapeHtml(photo)}" alt="${escapeHtml(food.name)}"><span class="food-fallback" aria-hidden="true" hidden>${escapeHtml("🍽️")}</span>`
            : `<span aria-hidden="true">${escapeHtml(foodIcon(food.image))}</span>`}
          <button class="favorite-button ${favorites.has(food.id) ? "active" : ""}" data-action="favorite" data-id="${food.id}" aria-label="${escapeHtml(favoriteLabel)}">${favorites.has(food.id) ? "♥" : "♡"}</button>
        </div>
        <div class="food-copy"><span class="food-category">${escapeHtml(t(food.category, food.category))}</span><h3>${escapeHtml(food.name)}</h3><p>${escapeHtml(food.description || t("freshly_made_in_our_kitchen", "Freshly made in our kitchen."))}</p>
          <div class="food-card-bottom"><span class="food-price">${money(food.price)}</span><button class="add-cart" data-action="add" data-id="${food.id}" aria-label="${escapeHtml(t("add_to_basket", "Add to basket"))} ${escapeHtml(food.name)}">+</button></div>
        </div>
      </article>`;
    }).join("");
    menuRoot.querySelectorAll(".food-photo").forEach((image) => {
      image.addEventListener("error", () => {
        image.remove();
        const fallback = image.parentElement.querySelector(".food-fallback");
        if (fallback) fallback.hidden = false;
        if (image.parentElement) image.parentElement.classList.remove("has-photo");
      }, { once: true });
    });
  }

  function cartEntries() {
    return Object.entries(cart).map(([id, quantity]) => {
      const food = foods.find((item) => item.id === Number(id));
      const count = Math.min(99, Math.max(0, Math.floor(Number(quantity) || 0)));
      return food && count ? { food, quantity: count } : null;
    }).filter(Boolean);
  }

  function renderCart() {
    const entries = cartEntries();
    const count = entries.reduce((sum, entry) => sum + entry.quantity, 0);
    const total = entries.reduce((sum, entry) => sum + entry.quantity * entry.food.price, 0);
    document.getElementById("cart-count").textContent = String(count);
    document.getElementById("cart-total").textContent = money(total);
    document.getElementById("checkout-hint").textContent = customer
      ? `${t("ordering_as", "Ordering as")} ${customer.name} (${customer.phone}) · ${t("pay_before_kitchen", "Pay cash or Mobile Money to restaurant staff on delivery.")}`
      : t("checkout_hint", "Sign in or create an account to checkout.");
    document.getElementById("checkout-form").querySelector('[type="submit"]').disabled = count === 0 || orderSubmitting;
    cartRoot.innerHTML = entries.length ? entries.map(({ food, quantity }) => `
      <div class="cart-line">
        <div class="cart-line-copy"><strong>${escapeHtml(food.name)}</strong><small>${money(food.price * quantity)}</small></div>
        <div class="quantity-control"><button data-action="decrease" data-id="${food.id}" aria-label="${escapeHtml(t("remove_one", "Remove one"))} ${escapeHtml(food.name)}">−</button><span>${quantity}</span><button data-action="increase" data-id="${food.id}" aria-label="${escapeHtml(t("add_one", "Add one"))} ${escapeHtml(food.name)}">+</button></div>
      </div>`).join("") : `<p class="cart-empty">${escapeHtml(t("basket_waiting", "Your basket is waiting for something delicious."))}</p>`;
  }

  function renderOrders() {
    document.getElementById("orders-refresh").hidden = !customer;
    if (!customer) {
      ordersRoot.innerHTML = `<article class="empty-orders">${escapeHtml(t("empty_orders_prompt", "Sign in or create an account to see your orders."))}</article>`;
      return;
    }
    if (!orders.length) {
      ordersRoot.innerHTML = '<article class="empty-orders">You have no active orders yet.</article>';
      return;
    }
    ordersRoot.innerHTML = orders.map((order) => {
      const delivery = order.deliveryStatus;
      const currentStep = delivery === "Delivered" ? 4 : delivery === "Picked up" ? 3 : order.kitchenStatus === "Ready" ? 2 : order.kitchenStatus === "Preparing" ? 1 : 0;
      const steps = [t("received", "Received"), t("preparing", "Preparing"), t("ready_for_pickup", "Ready for pickup"), t("on_the_way", "On the way"), t("delivered", "Delivered")];
      const items = order.items.map((item) => `${item.quantity} × ${escapeHtml(item.name)}`).join("<br>");
      return `<article class="order-card">
        <div class="order-card-head"><div><strong>${t("order_number", "Order #")}${order.id}</strong><small>${escapeHtml(order.date)} · ${escapeHtml(order.time)}</small></div><span class="order-status">${escapeHtml(delivery)}</span></div>
        <p class="order-address"><strong>${t("delivered_to", "Deliver to:")}</strong> ${escapeHtml(order.address)}</p>
        <div class="order-items">${items}</div>
        <div class="tracking-steps" aria-label="Order progress">${steps.map((step, index) => `<span class="tracking-step ${index < currentStep ? "done" : ""} ${index === currentStep ? "current" : ""}">${step}</span>`).join("")}</div>
        <div class="order-card-foot"><span>${t("payment_method", "Payment")}: ${escapeHtml(order.paymentMethod || t("pay_on_delivery", "Pay on delivery"))}</span><strong>${money(order.total)}</strong><button class="reorder-button" data-action="reorder" data-id="${order.id}">${t("order_again", "Order again")}</button></div>
      </article>`;
    }).join("");
  }

  function setAccount(customerData) {
    customer = customerData;
    document.getElementById("account-button").textContent = customer ? customer.name : t("sign_in", "Sign in");
    renderCart();
    renderOrders();
  }

  async function loadOrders() {
    if (!customer) return;
    try {
      const result = await api("orders", {}, "GET");
      orders = result.orders;
      renderOrders();
    } catch (error) {
      if (error.status === 401) {
        setAccount(null);
        showToast(t("please_sign_in_again", "Please sign in again to view your orders."));
      } else {
        console.error("Could not load customer orders.", error);
        showToast(error.message);
      }
    }
  }

  async function loadFavorites() {
    if (!customer) {
      favorites = new Set();
      renderFoods();
      return;
    }
    try {
      const result = await api("favorites", {}, "GET");
      favorites = new Set(result.foodIds);
      renderFoods();
    } catch (error) {
      console.error("Could not load customer favorites.", error);
      showToast(error.message);
    }
  }

  function openAccount(mode = "login") {
    accountMode = mode;
    updateAccountMode();
    document.getElementById("account-error").hidden = true;
    accountDialog.showModal();
  }

  function updateAccountMode() {
    const registering = accountMode === "register";
    document.getElementById("account-title").textContent = registering ? t("create_your_account", "Create your account") : t("welcome_back", "Welcome back");
    document.getElementById("account-description").textContent = registering ? t("one_account", "One account keeps your orders and favorites together.") : t("welcome_back_message", "Sign in to checkout and follow your delivery.");
    document.getElementById("customer-name-field").hidden = !registering;
    document.getElementById("account-form").elements.name.required = registering;
    document.getElementById("password-hint").hidden = !registering;
    document.getElementById("account-form").elements.password.autocomplete = registering ? "new-password" : "current-password";
    document.getElementById("account-submit").textContent = registering ? t("create_account", "Create account") : t("sign_in", "Sign in");
    document.getElementById("account-mode").textContent = registering ? t("already_have_account", "Already have an account? Sign in") : t("new_here_create_account", "New here? Create an account");
  }

  async function submitAccount(form) {
    const values = Object.fromEntries(new FormData(form).entries());
    const errorElement = document.getElementById("account-error");
    errorElement.hidden = true;
    try {
      const result = await api(accountMode, values);
      setAccount(result.customer);
      accountDialog.close();
      form.reset();
      await Promise.all([loadOrders(), loadFavorites()]);
      showToast(accountMode === "register" ? t("your_account_ready", "Your account is ready.") : t("welcome_back", "Welcome back."));
      if (cartEntries().length) document.getElementById("checkout-form").elements.address.focus();
    } catch (error) {
      errorElement.textContent = error.message;
      errorElement.hidden = false;
    }
  }

  async function placeOrder(form) {
    if (!customer) {
      openAccount("login");
      showToast(t("sign_in_to_checkout", "Sign in or create an account before checkout."));
      return;
    }
    const entries = cartEntries();
    if (!entries.length) return;
    const button = form.querySelector('[type="submit"]');
    orderSubmitting = true;
    renderCart();
    orderSubmissionKey ||= newUuid();
    sessionStorage.setItem("harbor-hearth-order-key", orderSubmissionKey);
    try {
      const result = await api("place_order", {
        address: form.elements.address.value.trim(),
        notes: form.elements.notes.value.trim(),
        idempotencyKey: orderSubmissionKey,
        items: entries.map(({ food, quantity }) => ({ foodId: food.id, quantity }))
      });
      orderSubmissionKey = "";
      sessionStorage.removeItem("harbor-hearth-order-key");
      cart = {};
      saveCart();
      form.reset();
      showToast(`${t("order_placed", "Your order has been placed.")} ${t("order_number", "Order #")}${result.orderId} ${t("sent_to_kitchen", "has been sent to our kitchen.")}`);
      await loadOrders();
      location.hash = "orders";
    } catch (error) {
      showToast(error.message);
      if (error.status && error.status < 500) {
        orderSubmissionKey = "";
        sessionStorage.removeItem("harbor-hearth-order-key");
      }
    } finally {
      orderSubmitting = false;
      button.disabled = cartEntries().length === 0;
    }
  }

  async function handleClick(event) {
    const category = event.target.closest("[data-category]");
    if (category) {
      selectedCategory = category.dataset.category;
      renderCategories();
      renderFoods();
      return;
    }
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const id = Number(button.dataset.id);
    if (button.dataset.action === "add" || button.dataset.action === "increase") {
      if (orderSubmitting) return;
      cart[id] = Math.min(99, (Number(cart[id]) || 0) + 1);
      saveCart();
    } else if (button.dataset.action === "decrease") {
      if (orderSubmitting) return;
      cart[id] = Math.max(0, (Number(cart[id]) || 0) - 1);
      if (!cart[id]) delete cart[id];
      saveCart();
    } else if (button.dataset.action === "favorite") {
      if (!customer) {
        openAccount("login");
        showToast(t("sign_in_to_save_favorites", "Sign in to save your favorites."));
        return;
      }
      try {
        const result = await api("toggle_favorite", { foodId: id });
        if (result.favorite) favorites.add(id);
        else favorites.delete(id);
        renderFoods();
      } catch (error) {
        showToast(error.message);
      }
    } else if (button.dataset.action === "reorder") {
      const order = orders.find((item) => item.id === id);
      if (!order) return;
      order.items.forEach((item) => {
        const food = foods.find((menuItem) => menuItem.id === item.foodId);
        if (food) cart[food.id] = Math.min(99, (Number(cart[food.id]) || 0) + item.quantity);
      });
      saveCart();
      document.getElementById("cart-panel").scrollIntoView({ behavior: "smooth", block: "center" });
      showToast(t("available_items_added", "Available items from your order were added to your basket."));
    }
  }

  document.addEventListener("click", (event) => { void handleClick(event); });
  document.getElementById("account-button").addEventListener("click", async () => {
    if (!customer) {
      openAccount("login");
      return;
    }
    try {
      await api("logout");
      setAccount(null);
      favorites = new Set();
      orders = [];
      renderFoods();
      renderOrders();
      showToast(t("sign_out", "You have signed out."));
    } catch (error) {
      showToast(error.message);
    }
  });
  document.getElementById("account-mode").addEventListener("click", () => {
    accountMode = accountMode === "login" ? "register" : "login";
    document.getElementById("account-error").hidden = true;
    updateAccountMode();
  });
  document.getElementById("language-select").addEventListener("change", (event) => {
    currentLanguage = event.target.value;
    localStorage.setItem("harbor-hearth-language", currentLanguage);
    applyTranslations();
    renderCategories();
    renderFoods();
    renderCart();
    renderOrders();
  });
  document.getElementById("account-form").addEventListener("submit", (event) => {
    event.preventDefault();
    void submitAccount(event.currentTarget);
  });
  sessionStorage.removeItem("harbor-hearth-pending-payment");
  document.getElementById("checkout-form").addEventListener("submit", (event) => {
    event.preventDefault();
    void placeOrder(event.currentTarget);
  });
  document.getElementById("orders-refresh").addEventListener("click", () => { void loadOrders(); });

  async function initialize() {
    const languageSelect = document.getElementById("language-select");
    languageSelect.value = currentLanguage;
    applyTranslations();
    try {
      const menu = await api("menu", {}, "GET");
      foods = menu.foods;
      csrfToken = menu.csrfToken;
      cart = Object.fromEntries(Object.entries(cart).filter(([id, quantity]) => foods.some((food) => food.id === Number(id)) && Number(quantity) > 0));
      saveCart();
      renderCategories();
      renderFoods();
      const session = await api("session", {}, "GET");
      csrfToken = session.csrfToken;
      setAccount(session.customer);
      if (customer) {
        await Promise.all([loadOrders(), loadFavorites()]);
      }
    } catch (error) {
      console.error("Could not start the customer ordering page.", error);
      menuRoot.innerHTML = `<div class="loading-card">${escapeHtml(error.message)}<br><br>Keep the application open on the restaurant computer and try again.</div>`;
    }
  }

  void initialize();
  window.setInterval(() => {
    if (customer && !document.hidden) void loadOrders();
  }, 30000);
})();
