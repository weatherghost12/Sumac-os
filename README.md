# Sumac OS Website (Static)

This repo hosts a static site with Supabase Auth.
Files:
- `index.html`
- `account.html`
- `styles.css`
- `script.js` (contains Supabase URL + anon public key)
- `.github/workflows/deploy.yml` (GitHub Pages workflow)

## Deploy on GitHub Pages
1. Create a new repo on GitHub.
2. Upload these files (drag the *contents* of the ZIP, not the ZIP itself).
3. Push to `main`. The included GitHub Action will publish to Pages.
4. After the action runs, your site will be available at:
   `https://<your-username>.github.io/<repo-name>/`

## Supabase Auth settings
In the Supabase Dashboard:
- **Auth → Providers → Email**: enable **Email/Password**.
- **Auth → URL Configuration**:
  - **Site URL**: your GitHub Pages URL
  - **Additional Redirect URLs**: add `https://<user>.github.io/<repo>/account.html`

## Optional: Use GitHub Secrets for keys
Your anon key is safe to expose in the client when using RLS,
but you can inject it via Secrets if you prefer:
- Add repo secrets `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
- In `script.js`, replace constants with `__SUPABASE_URL__` / `__SUPABASE_ANON_KEY__`.
- Add this step to the workflow before upload:
  ```yaml
  - name: Inject Supabase env
    run: |
      sed -i "s|__SUPABASE_URL__|${{ secrets.SUPABASE_URL }}|g" script.js
      sed -i "s|__SUPABASE_ANON_KEY__|${{ secrets.SUPABASE_ANON_KEY }}|g" script.js
  ```

## Local dev
Use a local server (redirects need http:// origin):
```
python -m http.server 8080
# open http://localhost:8080
```
