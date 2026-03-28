# TROUBLESHOOT: Invalid Environment Variable

## ERROR MESSAGE:
```
Invalid request: `env.NEXT_PUBLIC_FIREBASE_API_KEY` should be string.
```

## WHAT THIS MEANS:
One or more of your Environment Variables has a problem:
- Extra spaces before/after the value
- Wrong format
- Special characters not allowed
- Quotes or apostrophes included

---

## SOLUTION: Step-by-Step Fix

### STEP 1: Go Back to Environment Variables

On the Vercel form, scroll to the Environment Variables section.

You should see your 6 variables listed.

---

### STEP 2: Check EACH Variable

For each variable you added, look at the **Value** field.

**Check for these problems:**

❌ **Spaces at the start:**
```
 AIzaSyCzdq81WVpuczl28Rv6EMuZK8bpXHuhj-Q  (WRONG - space before)
AIzaSyCzdq81WVpuczl28Rv6EMuZK8bpXHuhj-Q   (CORRECT - no space)
```

❌ **Spaces at the end:**
```
AIzaSyCzdq81WVpuczl28Rv6EMuZK8bpXHuhj-Q   (WRONG - space after)
AIzaSyCzdq81WVpuczl28Rv6EMuZK8bpXHuhj-Q    (CORRECT - no space)
```

❌ **Quotes or apostrophes:**
```
"AIzaSyCzdq81WVpuczl28Rv6EMuZK8bpXHuhj-Q"  (WRONG - has quotes)
AIzaSyCzdq81WVpuczl28Rv6EMuZK8bpXHuhj-Q    (CORRECT - no quotes)
```

❌ **Line breaks:**
```
AIzaSyCzdq81WVpuczl28Rv6EMuZK8bpXHuhj-Q
                                          (WRONG - extra line)
```

---

### STEP 3: Fix Bad Variables

If you find one that's wrong:

1. **Click the X or Delete button** next to the bad variable
2. Click **"+ Add"** to add it again
3. **CAREFULLY** copy-paste the value from PHASE_4_LIVE_CHECKLIST.md
4. Before saving, check for spaces!

---

### STEP 4: Verify ALL 6 Are Correct

Here are the EXACT values (no spaces, no quotes):

```
1. NEXT_PUBLIC_FIREBASE_API_KEY
   AIzaSyCzdq81WVpuczl28Rv6EMuZK8bpXHuhj-Q

2. NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   mon-app-cours.firebaseapp.com

3. NEXT_PUBLIC_FIREBASE_PROJECT_ID
   mon-app-cours

4. NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   mon-app-cours.firebasestorage.app

5. NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   246473751652

6. NEXT_PUBLIC_FIREBASE_APP_ID
   1:246473751652:web:a7b8b465fd6ade31313371
```

Check each one in Vercel matches exactly (no extra spaces!).

---

### STEP 5: Try Again

Once all 6 look correct:

Scroll down and try to **click Deploy** again.

---

## QUICK CHECK

Before you click Deploy, verify on the page:

- [ ] All 6 variables are showing
- [ ] No quotes around any values
- [ ] No spaces at start/end of values
- [ ] All Keys spelled exactly right
- [ ] All Values match the list above exactly

---

## IF YOU'RE STILL STUCK:

**Option A: Delete ALL and Start Over**

1. Delete all 6 variables (click X on each)
2. Go to PHASE_4_LIVE_CHECKLIST.md
3. Add them one by one VERY CAREFULLY
4. Check for spaces each time

**Option B: Ask for Help**

Take a screenshot of the Environment Variables section.

Send it to me and describe which variable has the error.

Example:
> "Screenshot shows NEXT_PUBLIC_FIREBASE_API_KEY has value: ' AIzaSyCzdq81WVpuczl28Rv6EMuZK8bpXHuhj-Q'" (notice space at start)

---

**YOU'VE GOT THIS!** 💪

It's usually just extra spaces. Very simple fix!
