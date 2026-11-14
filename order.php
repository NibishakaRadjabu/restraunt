<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f7f8f5">
  <title>Order online — Harbor &amp; Hearth</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="order.css">
</head>
<body>
  <header class="store-header">
    <a class="store-brand" href="order.php" aria-label="Harbor and Hearth home">
      <span class="brand-mark">H<span>&amp;</span>H</span>
      <span><strong>Harbor &amp; Hearth</strong><small data-i18n="fresh_from_our_kitchen">FRESH FROM OUR KITCHEN</small></span>
    </a>
    <nav aria-label="Main navigation"><a href="#menu" data-i18n="menu">Menu</a><a href="#orders" data-i18n="my_orders">My orders</a></nav>
    <div class="header-actions">
      <label class="language-picker"><span class="sr-only" data-i18n="language">Language</span><select id="language-select" aria-label="Language"><option value="en">English</option><option value="fr">Français</option><option value="sw">Kiswahili</option></select></label>
      <button class="btn btn-outline" id="account-button" data-i18n="sign_in">Sign in</button>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="hero-copy"><span class="eyebrow" data-i18n="good_food_good_mood">GOOD FOOD, GOOD MOOD</span><h1><span data-i18n="fresh_food">Fresh food.</span><br><em data-i18n="right_to_your_door">Right to your door.</em></h1><p data-i18n="thoughtful_ingredients">Thoughtful ingredients, made fresh and delivered with care.</p><a class="btn btn-primary" href="#menu"><span data-i18n="explore_menu">Explore the menu</span> <span>↓</span></a><small data-i18n="cash_on_delivery_note">Cash on delivery · Made fresh when you order</small></div>
      <div class="hero-art" aria-label="Freshly prepared restaurant dishes">
        <div class="hero-dish hero-dish-one">🍗</div><div class="hero-dish hero-dish-two">🍕</div><div class="hero-dish hero-dish-three">🥗</div>
        <span class="hero-note"><span data-i18n="made_with_care">Made with care</span><br><strong data-i18n="served_fresh">served fresh</strong></span>
        <span class="hero-spark">✳</span>
      </div>
    </section>

    <section class="menu-section" id="menu">
      <div class="section-heading"><div><span class="eyebrow" data-i18n="little_something_delicious">A LITTLE SOMETHING DELICIOUS</span><h2 data-i18n="our_menu">Our menu</h2><p data-i18n="freshly_made_favorites">Freshly made favorites, ready when you are.</p></div><div class="category-list" id="categories" aria-label="Filter menu categories"></div></div>
      <div class="store-layout">
        <div class="food-grid" id="food-grid" aria-live="polite"><div class="loading-card" data-i18n="loading_today_menu">Loading today's menu…</div></div>
        <aside class="cart-panel" id="cart-panel">
          <div class="cart-heading"><div><span class="eyebrow" data-i18n="your_order">YOUR ORDER</span><h2 data-i18n="your_basket">Your basket</h2></div><span class="cart-count" id="cart-count">0</span></div>
          <div id="cart-items" class="cart-items"><p class="cart-empty" data-i18n="basket_waiting">Your basket is waiting for something delicious.</p></div>
          <div class="cart-total"><span data-i18n="total">Total</span><strong id="cart-total">$0.00</strong></div>
          <p class="payment-note" data-i18n="payment_note">Place your order now. Pay cash or Mobile Money when it arrives.</p>
          <p class="payment-collect-note" data-i18n="payment_collect_note">Payment is collected by restaurant staff on delivery.</p>
          <form id="checkout-form">
            <label><span data-i18n="delivery_address">Delivery address</span><textarea name="address" maxlength="500" required data-i18n-placeholder="delivery_address_placeholder" placeholder="Street, neighborhood, city"></textarea></label>
            <label><span data-i18n="delivery_notes">Delivery notes</span> <span class="optional" data-i18n="optional">(optional)</span><textarea name="notes" maxlength="1000" data-i18n-placeholder="delivery_notes_placeholder" placeholder="Gate code, landmarks, or delivery instructions"></textarea></label>
            <button class="btn btn-primary checkout-button" type="submit" data-i18n="pay_place_order">Place order</button>
            <p class="checkout-hint" id="checkout-hint" data-i18n="checkout_hint">Sign in or create an account to place an order.</p>
          </form>
        </aside>
      </div>
    </section>

    <section class="orders-section" id="orders">
      <div class="section-heading"><div><span class="eyebrow" data-i18n="your_table_wherever_you_are">YOUR TABLE, WHEREVER YOU ARE</span><h2 data-i18n="order_history_tracking">Order history &amp; tracking</h2><p data-i18n="sign_in_follow_order">Sign in to follow your order from our kitchen to your door.</p></div><button class="btn btn-outline" id="orders-refresh" hidden>↻ <span data-i18n="refresh">Refresh</span></button></div>
      <div id="order-list" class="order-list"><article class="empty-orders" data-i18n="empty_orders_prompt">Sign in or create an account to see your orders.</article></div>
    </section>
  </main>

  <footer class="store-footer"><a class="store-brand" href="order.php"><span class="brand-mark">H<span>&amp;</span>H</span><span><strong>Harbor &amp; Hearth</strong><small data-i18n="fresh_from_our_kitchen_footer">FRESH FROM OUR KITCHEN</small></span></a><p data-i18n="good_food_shared_with_care">Good food, shared with care.</p><a href="#menu" data-i18n="back_to_menu">Back to menu ↑</a></footer>

  <div class="toast" id="toast" role="status" aria-live="polite" hidden></div>
  <dialog class="account-dialog" id="account-dialog" aria-labelledby="account-title">
    <form method="dialog"><button class="dialog-close" aria-label="Close">×</button></form>
    <span class="eyebrow" data-i18n="welcome_harbor_hearth">WELCOME TO HARBOR &amp; HEARTH</span><h2 id="account-title" data-i18n="your_account">Your account</h2><p class="dialog-description" id="account-description" data-i18n="sign_in_checkout_delivery">Sign in to checkout and follow your delivery.</p>
    <form id="account-form" class="account-form">
      <label id="customer-name-field"><span data-i18n="your_name">Your name</span><input name="name" autocomplete="name" maxlength="120"></label>
      <label><span data-i18n="phone_number">Phone number</span><input name="phone" type="tel" autocomplete="tel" required maxlength="32" data-i18n-placeholder="phone_number_placeholder" placeholder="+250 7xx xxx xxx"></label>
      <label><span data-i18n="password">Password</span><input name="password" type="password" autocomplete="current-password" required minlength="12"></label>
      <p class="password-hint" id="password-hint" hidden data-i18n="password_hint">Use at least 12 characters, including letters and numbers.</p>
      <p class="form-error" id="account-error" hidden></p>
      <button class="btn btn-primary" id="account-submit" type="submit" data-i18n="sign_in">Sign in</button>
    </form>
    <button class="mode-switch" id="account-mode" type="button" data-i18n="new_here_create_account">New here? Create an account</button>
  </dialog>

  <script src="order.js" defer></script>
</body>
</html>
