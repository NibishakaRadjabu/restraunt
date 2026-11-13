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
  let rwfPerUsd = 1470;
  let csrfToken = "";
  let favorites = new Set();
  let orders = [];
  let selectedCategory = "All";
  let accountMode = "login";
  let toastTimer;
  let paymentId = "";
  let paymentAttemptKey = "";
  let paymentPending = false;
  let paymentCheckRunning = false;
  let paymentTimer;
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
      payment_note: "Pay with MTN Mobile Money before your order is sent to our kitchen.",
      delivery_address: "Delivery address",
      delivery_address_placeholder: "Street, neighborhood, city",
      delivery_notes: "Delivery notes",
      optional: "(optional)",
      delivery_notes_placeholder: "Gate code, landmarks, or delivery instructions",
      mtn_mobile_money_number: "MTN Mobile Money number",
      mtn_phone_placeholder: "+250 7xx xxx xxx",
      pay_place_order: "Pay & place order",
      checkout_hint: "Sign in or create an account to checkout.",
      check_payment_status: "Check payment status",
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
      pay_before_kitchen: "Pay before kitchen preparation",
      sign_in_to_save_favorites: "Sign in to save your favorites.",
      sign_in_to_checkout: "Sign in or create an account before checkout.",
      order_number: "Order #",
      delivered_to: "Deliver to:",
      payment_method: "Paid by",
      order_again: "Order again",
      please_sign_in_again: "Please sign in again to view your orders.",
      your_account_ready: "Your account is ready.",
      welcome_back: "Welcome back.",
      payment_confirmed: "Payment confirmed.",
      sent_to_kitchen: "has been sent to our kitchen.",
      sign_out: "You have signed out.",
      finish_pending_payment: "Finish checking the pending Mobile Money payment before signing out.",
      available_items_added: "Available items from your order were added to your basket.",
      favorite_updated: "Favorite updated.",
      create_your_account: "Create your account",
      one_account: "One account keeps your orders and favorites together.",
      welcome_back_message: "Sign in to checkout and follow your delivery.",
      create_account: "Create account",
      already_have_account: "Already have an account? Sign in",
      payment_request_sent: "A payment request for",
      approve_to_place_order: "is being sent to your phone. Approve it to place your order.",
      checking_pending_payment: "Checking your pending MTN Mobile Money payment…",
      pending_mobile_money: "MTN reported a payment that needs a restaurant check. Do not pay again; contact the restaurant with your payment reference.",
      payment_approved: "Payment request sent to",
      approval_phone: "Approve it on your phone, then check again. Amount:",
      billing_info: "MTN charge:",
      usd_to_rwf: "1 USD =",
      percent: "",
      mtn_total: "Mobile Money total:",
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
      payment_note: "Payez par MTN Mobile Money avant que votre commande soit envoyée à la cuisine.",
      delivery_address: "Adresse de livraison",
      delivery_address_placeholder: "Rue, quartier, ville",
      delivery_notes: "Instructions de livraison",
      optional: "(facultatif)",
      delivery_notes_placeholder: "Code porte, repères ou consignes",
      mtn_mobile_money_number: "Numéro MTN Mobile Money",
      mtn_phone_placeholder: "+250 7xx xxx xxx",
      pay_place_order: "Payer et commander",
      checkout_hint: "Connectez-vous ou créez un compte pour payer.",
      check_payment_status: "Vérifier le paiement",
      your_table_wherever_you_are: "VOTRE TABLE, OÙ QUE VOUS SOYEZ",
      order_history_tracking: "Historique et suivi des commandes",
      sign_in_follow_order: "Connectez-vous pour suivre votre commande de la cuisine jusqu’à votre porte.",
      refresh: "Actualiser",
      empty_orders_prompt: "Connectez-vous ou créez un compte pour voir vos commandes.",
      good_food_shared_with_care: "Une bonne cuisine, partagée avec soin.",
      back_to_menu: "Retour au menu ↑",
      welcome_harbor_hearth: "BIENVENUE CHEZ HARBOR & HEARTH",
      your_account: "Votre compte",
      sign_in_checkout_delivery: "Connectez-vous pour payer et suivre votre livraison.",
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
      pay_before_kitchen: "Payer avant la préparation en cuisine",
      sign_in_to_save_favorites: "Connectez-vous pour enregistrer vos favoris.",
      sign_in_to_checkout: "Connectez-vous ou créez un compte avant le paiement.",
      order_number: "Commande #",
      delivered_to: "Livrer à :",
      payment_method: "Payé par",
      order_again: "Commander à nouveau",
      please_sign_in_again: "Veuillez vous reconnecter pour voir vos commandes.",
      your_account_ready: "Votre compte est prêt.",
      welcome_back: "Bon retour.",
      payment_confirmed: "Paiement confirmé.",
      sent_to_kitchen: "a été envoyée à notre cuisine.",
      sign_out: "Vous êtes déconnecté.",
      finish_pending_payment: "Terminez la vérification du paiement Mobile Money avant de vous déconnecter.",
      available_items_added: "Les articles de votre commande ont été ajoutés au panier.",
      create_your_account: "Créez votre compte",
      one_account: "Un compte rassemble vos commandes et vos favoris.",
      welcome_back_message: "Connectez-vous pour payer et suivre votre livraison.",
      create_account: "Créer un compte",
      already_have_account: "Vous avez déjà un compte ? Se connecter",
      payment_request_sent: "Une demande de paiement pour",
      approve_to_place_order: "est envoyée sur votre téléphone. Acceptez-la pour passer votre commande.",
      checking_pending_payment: "Vérification du paiement MTN Mobile Money en attente…",
      pending_mobile_money: "MTN a signalé un paiement nécessitant vérification. Ne payez pas à nouveau ; contactez le restaurant avec votre référence de paiement.",
      payment_approved: "Demande de paiement envoyée à",
      approval_phone: "Acceptez-la sur votre téléphone, puis vérifiez à nouveau. Montant :",
      billing_info: "Frais MTN :",
      usd_to_rwf: "1 USD =",
      mtn_total: "Total Mobile Money :",
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
      payment_note: "Lipa kwa MTN Mobile Money kabla ya agizo lako kutumwa jikoni.",
      delivery_address: "Anwani ya uwasilishaji",
      delivery_address_placeholder: "Mtaa, eneo, jiji",
      delivery_notes: "Maelezo ya uwasilishaji",
      optional: "(si lazima)",
      delivery_notes_placeholder: "Msimbo wa geti, alama, au maelezo ya usafirishaji",
      mtn_mobile_money_number: "Namba ya MTN Mobile Money",
      mtn_phone_placeholder: "+250 7xx xxx xxx",
      pay_place_order: "Lipa na uweke agizo",
      checkout_hint: "Ingia au unda akaunti ili kulipa.",
      check_payment_status: "Kagua hali ya malipo",
      your_table_wherever_you_are: "MEZA YAKO, UKO WAPI WOWOTE",
      order_history_tracking: "Historia ya maagizo na ufuatiliaji",
      sign_in_follow_order: "Ingia ili kufuatilia agizo lako kutoka jikoni hadi mlangoni mwako.",
      refresh: "Sasisha",
      empty_orders_prompt: "Ingia au unda akaunti ili kuona maagizo yako.",
      good_food_shared_with_care: "Chakula kizuri, kilichoshirikiwa kwa makini.",
      back_to_menu: "Rudi kwenye menyu ↑",
      welcome_harbor_hearth: "KARIBUNI HARBOR & HEARTH",
      your_account: "Akaunti yako",
      sign_in_checkout_delivery: "Ingia ili kulipa na kufuatilia usafirishaji wako.",
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
      pay_before_kitchen: "Lipa kabla ya kupikwa",
      sign_in_to_save_favorites: "Ingia ili kuhifadhi vipendwa vyako.",
      sign_in_to_checkout: "Ingia au unda akaunti kabla ya kulipa.",
      order_number: "Agizo #",
      delivered_to: "Isafirishwe kwa:",
      payment_method: "Lilipwa na",
      order_again: "Agiza tena",
      please_sign_in_again: "Tafadhali ingia tena kuona maagizo yako.",
      your_account_ready: "Akaunti yako iko tayari.",
      welcome_back: "Karibu tena.",
      payment_confirmed: "Malipo yamehakikishwa.",
      sent_to_kitchen: "imetumwa kwenye jikoni letu.",
      sign_out: "Umeondoka kwenye mfumo.",
      finish_pending_payment: "Maliza kukagua malipo ya MTN Mobile Money kabla ya kuondoka.",
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

  function moneyRwf(value) {
    return `RWF ${Math.round(Number(value) || 0).toLocaleString("en-RW")}`;
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
    document.getElementById("payment-estimate").textContent = `${t("billing_info", "MTN charge:")} ${moneyRwf(total * rwfPerUsd)} · ${t("usd_to_rwf", "1 USD =")} ${moneyRwf(rwfPerUsd)}`;
    document.getElementById("checkout-hint").textContent = customer
      ? `${t("ordering_as", "Ordering as")} ${customer.name} · ${t("pay_before_kitchen", "Pay before kitchen preparation")}`
      : t("checkout_hint", "Sign in or create an account to checkout.");
    document.getElementById("checkout-form").querySelector('[type="submit"]').disabled = count === 0 || paymentPending;
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
        <div class="order-card-foot"><span>${t("payment_method", "Paid by")} ${escapeHtml(order.paymentMethod || "MTN Mobile Money")}${order.amountRwf ? ` · ${moneyRwf(order.amountRwf)}` : ""}</span><strong>${money(order.total)}</strong><button class="reorder-button" data-action="reorder" data-id="${order.id}">${t("order_again", "Order again")}</button></div>
      </article>`;
    }).join("");
  }

  function setAccount(customerData) {
    customer = customerData;
    document.getElementById("account-button").textContent = customer ? customer.name : t("sign_in", "Sign in");
    const phoneField = document.getElementById("checkout-form").elements.paymentPhone;
    if (customer && !phoneField.value) phoneField.value = customer.phone;
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

  function showPaymentProgress(message, visible = true) {
    const progress = document.getElementById("payment-progress");
    progress.hidden = !visible;
    document.getElementById("payment-progress-message").textContent = message;
  }

  function lockPaymentCheckout(locked) {
    paymentPending = locked;
    document.getElementById("checkout-form").querySelectorAll("textarea, input, button[type='submit']").forEach((control) => {
      control.disabled = locked;
    });
    document.getElementById("cart-panel").querySelectorAll(".quantity-control button, .add-cart").forEach((control) => {
      control.disabled = locked;
    });
    renderCart();
  }

  async function completePayment(result) {
    paymentPending = false;
    paymentId = "";
    paymentAttemptKey = "";
    window.clearTimeout(paymentTimer);
    sessionStorage.removeItem("harbor-hearth-pending-payment");
    cart = {};
    saveCart();
    document.getElementById("checkout-form").reset();
    lockPaymentCheckout(false);
    showPaymentProgress("", false);
    showToast(`${t("payment_confirmed", "Payment confirmed.")} ${t("order_number", "Order #")}${result.orderId} ${t("sent_to_kitchen", "has been sent to our kitchen.")}`);
    await loadOrders();
    location.hash = "orders";
  }

  async function checkPaymentStatus() {
    if (!paymentId || paymentCheckRunning) return;
    paymentCheckRunning = true;
    const checkButton = document.getElementById("payment-check-button");
    checkButton.disabled = true;
    try {
      const result = await api("check_payment", { paymentId });
      const payment = result.payment;
      if (payment.status === "SUCCESSFUL") {
        await completePayment(result);
      } else if (payment.status === "FAILED") {
        paymentId = "";
        paymentAttemptKey = "";
        sessionStorage.removeItem("harbor-hearth-pending-payment");
        lockPaymentCheckout(false);
        showPaymentProgress("MTN did not complete the payment. Check the mobile number and try checkout again.");
      } else if (payment.status === "REVIEW" || result.reviewRequired) {
        lockPaymentCheckout(true);
        showPaymentProgress(t("pending_mobile_money", "MTN reported a payment that needs a restaurant check. Do not pay again; contact the restaurant with your payment reference."));
      } else {
        lockPaymentCheckout(true);
        showPaymentProgress(`${t("payment_approved", "Payment request sent to")} ${document.getElementById("checkout-form").elements.paymentPhone.value}. ${t("approval_phone", "Approve it on your phone, then check again. Amount:")} ${moneyRwf(payment.amountRwf)}.`);
        paymentTimer = window.setTimeout(() => { void checkPaymentStatus(); }, 10000);
      }
    } catch (error) {
      showPaymentProgress(error.message);
    } finally {
      paymentCheckRunning = false;
      checkButton.disabled = false;
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
    button.disabled = true;
    paymentAttemptKey ||= newUuid();
    try {
      const result = await api("start_payment", {
        address: form.elements.address.value.trim(),
        notes: form.elements.notes.value.trim(),
        phone: form.elements.paymentPhone.value.trim(),
        idempotencyKey: paymentAttemptKey,
        items: entries.map(({ food, quantity }) => ({ foodId: food.id, quantity }))
      });
      paymentId = result.payment.paymentId;
      sessionStorage.setItem("harbor-hearth-pending-payment", paymentId);
      lockPaymentCheckout(true);
      showPaymentProgress(`${t("payment_request_sent", "A payment request for")} ${moneyRwf(result.payment.amountRwf)} ${t("approve_to_place_order", "is being sent to your phone. Approve it to place your order.")}`);
      await checkPaymentStatus();
    } catch (error) {
      showToast(error.message);
      if (error.status && error.status < 500) paymentAttemptKey = "";
    } finally {
      if (!paymentPending) button.disabled = cartEntries().length === 0;
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
      if (paymentPending) return;
      cart[id] = Math.min(99, (Number(cart[id]) || 0) + 1);
      saveCart();
    } else if (button.dataset.action === "decrease") {
      if (paymentPending) return;
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
    if (paymentPending) {
      showToast("Finish checking the pending Mobile Money payment before signing out.");
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
  document.getElementById("checkout-form").addEventListener("submit", (event) => {
    event.preventDefault();
    void placeOrder(event.currentTarget);
  });
  document.getElementById("orders-refresh").addEventListener("click", () => { void loadOrders(); });
  document.getElementById("payment-check-button").addEventListener("click", () => { void checkPaymentStatus(); });

  async function initialize() {
    const languageSelect = document.getElementById("language-select");
    languageSelect.value = currentLanguage;
    applyTranslations();
    try {
      const menu = await api("menu", {}, "GET");
      foods = menu.foods;
      rwfPerUsd = Number(menu.payment?.rwfPerUsd) || 1470;
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
        const savedPaymentId = sessionStorage.getItem("harbor-hearth-pending-payment");
        if (savedPaymentId) {
          paymentId = savedPaymentId;
          lockPaymentCheckout(true);
          showPaymentProgress(t("checking_pending_payment", "Checking your pending MTN Mobile Money payment…"));
          void checkPaymentStatus();
        }
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
