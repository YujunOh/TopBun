# Security Notes - TopBun Project

## ⚠️ CRITICAL: Exposed Secrets in Git History

### Incident Summary
The `.env` file containing sensitive credentials was previously committed to the git repository. This file has since been added to `.gitignore`, but the secrets remain in the git history and are accessible to anyone with repository access.

### Exposed Secrets
The following secrets were committed and are now exposed in git history:

- **NEXTAUTH_SECRET** - NextAuth.js session encryption key
- **GITHUB_ID** - GitHub OAuth application ID
- **GITHUB_SECRET** - GitHub OAuth application secret
- **OPENAI_API_KEY** - OpenAI API key for GPT access
- **GEMINI_API_KEY** - Google Gemini API key

### Risk Assessment
- **Severity**: HIGH
- **Scope**: Anyone with git repository access can view these secrets in commit history
- **Impact**: Unauthorized API usage, session hijacking, account compromise

---

## 🔄 Required Actions - BEFORE PRODUCTION DEPLOYMENT

### 1. Rotate All Exposed Secrets

**NEXTAUTH_SECRET**
- Generate a new secret: `openssl rand -base64 32`
- Update in `.env` file
- Invalidate all existing sessions (users will need to re-login)

**GitHub OAuth Credentials**
- Go to: https://github.com/settings/developers
- Navigate to your OAuth App settings
- Click "Regenerate client secret"
- Update `GITHUB_ID` and `GITHUB_SECRET` in `.env`
- Existing GitHub sessions will be invalidated

**OpenAI API Key**
- Go to: https://platform.openai.com/account/api-keys
- Delete the old API key
- Create a new API key
- Update `OPENAI_API_KEY` in `.env`

**Google Gemini API Key**
- Go to: https://aistudio.google.com/app/apikey
- Delete the old API key
- Create a new API key
- Update `GEMINI_API_KEY` in `.env`

### 2. Verify .env is in .gitignore

✅ **Status**: CONFIRMED
- `.env*` is listed in `.gitignore` (line 34)
- This prevents future commits of environment files

### 3. Use .env.example as Template

- `.env.example` has been created as a safe template
- Contains all required keys with placeholder values
- Safe to commit to repository
- New developers should copy this file and fill in their own values

---

## 📋 Setup Instructions for New Developers

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TopBun
   ```

2. **Create local .env file**
   ```bash
   cp .env.example .env
   ```

3. **Fill in the secrets**
   - Obtain your own API keys from the services listed above
   - Update each value in `.env`
   - **NEVER commit .env to git**

4. **Verify .env is ignored**
   ```bash
   git status  # Should NOT show .env
   ```

---

## 🛡️ Best Practices Going Forward

### Environment Variables
- ✅ DO: Use `.env` for local development
- ✅ DO: Use `.env.example` as a template (safe to commit)
- ✅ DO: Use environment-specific secrets in production (CI/CD secrets, cloud provider secrets)
- ❌ DON'T: Commit `.env` files
- ❌ DON'T: Commit any file containing real secrets
- ❌ DON'T: Log or print secret values

### Git Workflow
- Always check `git status` before committing
- Use `.gitignore` to prevent accidental commits
- Review `.gitignore` when adding new secret types
- Consider using `git secrets` hook to prevent secret commits

### Secret Management
- Rotate secrets regularly (quarterly minimum)
- Use different secrets for different environments (dev, staging, production)
- Store production secrets in secure vaults (AWS Secrets Manager, GitHub Secrets, etc.)
- Never share secrets via email, chat, or version control

---

## 🔍 Checking for Secrets in Code

To scan for accidentally committed secrets:

```bash
# Using git-secrets (if installed)
git secrets --scan

# Manual check for common patterns
git log -p | grep -i "secret\|api_key\|password"
```

---

## 📞 If You Suspect a Breach

1. **Immediately rotate all exposed secrets** (see section 1 above)
2. **Audit API usage** for unauthorized access
3. **Review git logs** to determine when secrets were exposed
4. **Notify team members** to rotate their local copies
5. **Consider repository visibility** - if public, consider making private or creating new repository

---

## 📚 References

- [GitHub - Ignoring Files](https://help.github.com/articles/ignoring-files/)
- [NextAuth.js - Environment Variables](https://next-auth.js.org/configuration/options)
- [GitHub OAuth - Creating an OAuth App](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)
- [OpenAI - API Keys](https://platform.openai.com/account/api-keys)
- [Google AI Studio - API Keys](https://aistudio.google.com/app/apikey)
- [OWASP - Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

**Last Updated**: February 4, 2026
**Status**: ✅ .env properly ignored, documentation created
