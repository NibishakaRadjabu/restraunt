# Harbor & Hearth Restaurant Management

## Step 1: Run the app with MySQL storage

1. Start **Apache** and **MySQL** in the XAMPP Control Panel.
2. Create the database by importing `database.sql` in phpMyAdmin (`http://localhost/phpmyadmin`), or from PowerShell run:

   ```powershell
   & C:\xampp\mysql\bin\mysql.exe -u root -e "source C:/xampp/htdocs/restraunt/database.sql"
   ```

   If your MySQL root account has a password, add `-p` after `-u root`.
3. If your MySQL credentials differ, set `RESTAURANT_DB_HOST`, `RESTAURANT_DB_PORT`, `RESTAURANT_DB_NAME`, `RESTAURANT_DB_USER`, and `RESTAURANT_DB_PASSWORD` in Apache's environment. The local defaults are `127.0.0.1:3306`, database `harbor_hearth_restored_20261113` (the recovered local database), user `root`, and an empty password. For a fresh installation created from `database.sql`, set `RESTAURANT_DB_NAME=harbor_hearth_restaurant`.
4. Open **http://localhost/restraunt/**. Do not open `index.html` directly as a file; PHP must serve `api.php`.

The database contains starter menu items and eight available tables. Orders, payments, staff, inventory, and purchases are real MySQL records. The API uses prepared statements, calculates order totals from current menu prices, and commits order, payment, table, and stock changes transactionally. Staff-entered payment methods record a payment; customer Mobile Money checkout is processed separately by MTN before an order is created.

Customers can browse the live menu, filter Breakfast, Lunch, Dinner, Drinks, and Dessert, and add items to a basket at **http://localhost/restraunt/order.php**. At checkout, the page displays the USD basket total and its RWF equivalent, asks the customer to approve an MTN Mobile Money request on their phone, and creates the admin-visible order only after MTN confirms the matching amount and currency. Managers see confirmed MTN payments in **Billing & payments**. Unmatched successful provider responses are held for manager review instead of being sent to the kitchen.

### MTN Mobile Money setup

The existing database needs the additive payment migration once:

```powershell
& C:\xampp\mysql\bin\mysql.exe -u root -e "source C:/xampp/htdocs/restraunt/mtn_momo_migration.sql"
```

Configure these values in Apache's server environment, never in JavaScript or source control:

- `MTN_MOMO_MODE=production` (the configured default); use `sandbox` only for test credentials.
- `MTN_MOMO_TARGET_ENVIRONMENT=mtnrwanda` for an MTN Rwanda merchant account; use the target environment issued for your account.
- `MTN_MOMO_SUBSCRIPTION_KEY`, `MTN_MOMO_API_USER`, and `MTN_MOMO_API_KEY` from the MTN Collections product.
- `MTN_MOMO_RWF_PER_USD=1470` sets the checkout conversion rate. Update it when your business exchange rate changes.

Restart Apache after changing its environment. Production requests use MTN's production host; sandbox mode uses MTN's sandbox host. The server polls MTN's transaction status and does not treat an accepted request as paid. Verify your live account's target environment, currency support, and production onboarding with MTN before accepting real payments. The app remains restricted to the restaurant computer; this does not make it safe or accessible for public internet ordering.

Managers can add or edit menu photos from **Food menu → Add food item / Edit**. JPEG, PNG, GIF, and WebP images up to 5 MB are saved in `uploads/food-images` and shown on the customer menu.

From Orders or Billing, use **Facture** to preview and print a French A4 invoice, or **Receipt** for a thermal receipt. The invoice shows the order, customer, items, amounts, and payment status. Business address and tax/VAT details are not configured, so the invoice does not invent or calculate them.

## Step 2: Staff security process (English)

### Create and manage accounts

1. Keep the app on the restaurant computer and open PowerShell in the project folder.
2. Create the first manager account once:

   ```powershell
   & C:\xampp\php\php.exe create_admin.php manager
   ```

   The command prints a random one-time password. Share it privately, sign in at `http://localhost/restraunt/`, and change it immediately. The password is not displayed again. Do not send it in chat or store it in source control.
   To choose the initial password instead, set it only for the current PowerShell session before running the command; it will not be printed:

   ```powershell
   $env:RESTAURANT_INITIAL_ADMIN_PASSWORD = Read-Host "Initial manager password"
   & C:\xampp\php\php.exe create_admin.php restraunadmin
   Remove-Item Env:\RESTAURANT_INITIAL_ADMIN_PASSWORD
   ```

   It must be at least 12 characters and include letters and numbers. It is still a temporary password and must be changed at first sign-in.
3. Managers create staff login accounts in **Staff → Create staff account**. Give each person an individual account and a temporary password privately. Every new account must change that password at first sign-in.
4. Use **Change password** to update a password. Passwords must be at least 12 characters and include letters and numbers. To issue a new one-time password for a locked-out account, run this locally:

   ```powershell
   & C:\xampp\php\php.exe reset_user_password.php username
   ```

   Replace `username` with the account name, share the generated password privately, and have the user sign in and replace it. The script is CLI-only.
5. Disable departed staff accounts from the Staff page. The current account and the last active manager cannot be disabled.

### Permissions and safeguards

- **Manager:** restaurant data, staff accounts, inventory, and reports.
- **Cashier:** orders, billing and payments, and reports.
- **Chef:** kitchen order progress.
- **Waiter:** orders and table status.
- The API checks login and role permissions on the server; hiding a page in the interface is not the security boundary.
- Sessions use HTTP-only, SameSite cookies and regenerate their ID after sign-in and password changes. Mutating requests require a CSRF token and same-origin check. Sign-in is temporarily blocked after eight failed attempts for the same username within 15 minutes.
- Login, account, password, and data changes are recorded in `audit_logs`; failed sign-ins are rate-limited using hashed usernames in `auth_login_attempts`. Review these tables in phpMyAdmin when investigating activity.

### Backups and incident response

- Regularly export `harbor_hearth_restaurant` from phpMyAdmin and store backups somewhere access-controlled. Periodically verify a backup can be restored.
- If an account may be compromised, disable it in Staff, reset its password with the CLI script, share the new temporary password privately, review `audit_logs`, and restore from a known-good backup if data was changed unexpectedly.
- This setup is intentionally restricted to requests from the same computer. It is **not ready for LAN, internet, or multi-device exposure**. Before any such deployment, configure HTTPS, a dedicated least-privilege database account, protected backups, firewall controls, and an operational security review. Do not expose Apache/phpMyAdmin or use the default local database credentials on a public host.

## Sécurité du personnel (Français)

### Création et gestion des comptes

1. Gardez l’application sur l’ordinateur du restaurant et ouvrez PowerShell dans le dossier du projet.
2. Créez une seule fois le premier compte gestionnaire :

   ```powershell
   & C:\xampp\php\php.exe create_admin.php manager
   ```

   La commande affiche un mot de passe temporaire aléatoire, visible une seule fois. Transmettez-le en privé, connectez-vous à `http://localhost/restraunt/` et changez-le immédiatement. Ne l’envoyez pas dans une conversation et ne le stockez pas dans le code source.
3. Dans **Personnel → Créer un compte du personnel**, le gestionnaire crée un compte individuel pour chaque employé et lui transmet un mot de passe temporaire en privé. Chaque nouvel utilisateur doit le changer à sa première connexion.
4. Utilisez **Changer le mot de passe** pour le modifier. Il doit contenir au moins 12 caractères, avec des lettres et des chiffres. Pour réinitialiser un compte, exécutez localement :

   ```powershell
   & C:\xampp\php\php.exe reset_user_password.php username
   ```

   Remplacez `username` par le nom du compte, transmettez le mot de passe généré en privé et demandez à l’utilisateur de le remplacer après connexion. Ce script fonctionne uniquement en ligne de commande.
5. Désactivez les comptes des employés partis depuis la page Personnel. Le compte utilisé et le dernier gestionnaire actif ne peuvent pas être désactivés.

### Rôles et protections

- **Gestionnaire :** données du restaurant, comptes du personnel, stocks et rapports.
- **Caissier :** commandes, facturation, paiements et rapports.
- **Cuisinier :** progression des commandes en cuisine.
- **Serveur :** commandes et état des tables.
- L’API vérifie les connexions et les autorisations côté serveur ; masquer une page dans l’interface ne constitue pas une protection.
- Les sessions utilisent des cookies HTTP-only et SameSite, et leur identifiant est renouvelé après connexion et changement de mot de passe. Les modifications exigent un jeton CSRF et une origine identique. Après huit échecs de connexion pour un même nom d’utilisateur en 15 minutes, les tentatives sont temporairement bloquées.
- Les connexions, comptes, mots de passe et modifications de données sont consignés dans `audit_logs`. Les noms d’utilisateur des échecs de connexion sont hachés dans `auth_login_attempts`. Consultez ces tables dans phpMyAdmin pour vérifier une activité.

### Sauvegardes et incident

- Exportez régulièrement `harbor_hearth_restaurant` depuis phpMyAdmin, protégez l’accès aux sauvegardes et vérifiez périodiquement qu’elles peuvent être restaurées.
- En cas de compte compromis, désactivez-le dans Personnel, réinitialisez son mot de passe avec le script CLI, transmettez le mot de passe temporaire en privé, examinez `audit_logs` et restaurez une sauvegarde saine si des données ont été modifiées sans autorisation.
- Cette version est volontairement limitée aux requêtes provenant du même ordinateur. Elle **n’est pas prête pour un réseau local, Internet ou plusieurs appareils**. Avant tout déploiement, configurez HTTPS, un compte de base de données dédié aux privilèges minimaux, des sauvegardes protégées, un pare-feu et une revue de sécurité. N’exposez pas Apache/phpMyAdmin et n’utilisez pas les identifiants locaux par défaut sur un serveur public.

## Mchakato wa usalama wa wafanyakazi (Kiswahili)

### Kutengeneza na kusimamia akaunti

1. Tumia programu kwenye kompyuta ya mgahawa pekee na ufungue PowerShell ndani ya folda ya mradi.
2. Tengeneza akaunti ya kwanza ya msimamizi mara moja:

   ```powershell
   & C:\xampp\php\php.exe create_admin.php manager
   ```

   Amri itaonyesha nenosiri la muda la nasibu mara moja tu. Litume kwa njia ya faragha, ingia kwenye `http://localhost/restraunt/`, kisha libadilishe mara moja. Usilitume kwenye mazungumzo ya kikazi wala kuliweka kwenye msimbo.
3. Msimamizi hutengeneza akaunti tofauti ya kila mfanyakazi kwenye **Wafanyakazi → Tengeneza akaunti ya mfanyakazi** na kumtumia nenosiri la muda kwa faragha. Kila akaunti mpya lazima ibadilishe nenosiri hilo inapoingia mara ya kwanza.
4. Tumia **Badilisha nenosiri** kulibadilisha. Linahitaji angalau herufi 12, zikiwemo herufi na nambari. Ili kuweka nenosiri jipya la muda kwa akaunti, endesha amri hii kwenye kompyuta ya mgahawa:

   ```powershell
   & C:\xampp\php\php.exe reset_user_password.php username
   ```

   Badilisha `username` kwa jina la akaunti, mtumie mmiliki nenosiri jipya kwa faragha, na amwombe alibadilishe baada ya kuingia. Hati hii hufanya kazi kwenye terminal pekee.
5. Zima akaunti za wafanyakazi walioondoka kupitia ukurasa wa Wafanyakazi. Akaunti unayotumia na akaunti ya mwisho ya msimamizi haiwezi kuzimwa.

### Ruhusa na ulinzi

- **Msimamizi:** data za mgahawa, akaunti za wafanyakazi, bidhaa na ripoti.
- **Mhasibu:** maagizo, bili, malipo na ripoti.
- **Mpishi:** hatua za maandalizi ya maagizo jikoni.
- **Mhudumu:** maagizo na hali ya meza.
- API hukagua kuingia na ruhusa za kila jukumu upande wa seva; kuficha ukurasa kwenye kiolesura si kinga ya usalama.
- Vikao hutumia vidakuzi vya HTTP-only na SameSite, na kitambulisho hubadilishwa baada ya kuingia na kubadilisha nenosiri. Mabadiliko yanahitaji tokeni ya CSRF na ombi kutoka chanzo kilekile. Baada ya majaribio 8 ya kuingia yasiyofanikiwa kwa jina lilelile ndani ya dakika 15, majaribio huzuiwa kwa muda.
- Kuingia, akaunti, nenosiri na mabadiliko ya data huhifadhiwa kwenye `audit_logs`. Majina ya watumiaji ya majaribio yaliyoshindikana huhifadhiwa kwa mfumo wa hash kwenye `auth_login_attempts`. Kagua majedwali haya kupitia phpMyAdmin unapochunguza shughuli.

### Hifadhi rudufu na hatua za tukio

- Hamisha nakala rudufu ya `harbor_hearth_restaurant` mara kwa mara kupitia phpMyAdmin, ihifadhi mahali salama, na ujaribu mara kwa mara kuirejesha.
- Ikiwa akaunti inashukiwa kuingiliwa, izime kwenye ukurasa wa Wafanyakazi, weka nenosiri jipya kwa hati ya CLI, mtumie mtumiaji nenosiri la muda kwa faragha, kagua `audit_logs`, na urejeshe nakala rudufu salama ikiwa data ilibadilishwa bila ruhusa.
- Toleo hili limezuiwa kimakusudi kwa maombi kutoka kompyuta hiyo hiyo. **Haliko tayari kutumiwa kwenye mtandao wa ndani, intaneti au vifaa vingi.** Kabla ya kusambaza, weka HTTPS, akaunti maalum ya hifadhidata yenye ruhusa chache, nakala rudufu salama, vidhibiti vya firewall na ukaguzi wa usalama. Usifungue Apache/phpMyAdmin kwa umma wala kutumia taarifa za kawaida za hifadhidata kwenye seva ya umma.
