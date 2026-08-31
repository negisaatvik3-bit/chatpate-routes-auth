# Chatpate Routes Auth

We are building the authentication experience for a travel community and curated group-trip platform called "Chatpate Routes".

I am providing a reference image for the desired authentication UI. Use the reference image as the primary visual inspiration for the layout, composition, spacing, proportions, typography hierarchy, image treatment, and overall premium travel aesthetic.

IMPORTANT:

- Recreate the DESIGN DIRECTION of the reference, but do not copy the Voyager branding, text, logo, or exact content.

- Replace Voyager with Chatpate Routes branding.

- The UI should feel like a premium, adventurous, modern travel community rather than a generic SaaS login page.

- Keep the implementation clean, reusable, responsive, and easy to connect to Supabase Auth.

- Do NOT create fake authentication, mock login success, fake users, or fake Supabase calls.

- For now, focus on the UI and frontend structure. Authentication logic should be structured so Supabase Auth can be connected cleanly later.

- Do not modify unrelated pages or features in the existing project.

AUTHENTICATION PAGES

Create the following routes:

1. /login

2. /signup

3. /admin/login

USER SIGNUP PAGE

Use the attached reference image as inspiration.

Desktop layout:

- Full-screen authentication experience.

- Split the page into two major sections.

- Left side: authentication form.

- Right side: large travel image.

- The image should occupy roughly 55–60% of the screen width.

- The form section should occupy roughly 40–45%.

- Use generous whitespace and rounded image corners similar to the reference.

- The design should feel editorial and premium.

Left side signup content:

Brand:

"Chatpate Routes"

Main heading:

"Start your next adventure"

Supporting text:

"Join the Chatpate Routes community and discover experiences worth travelling for."

Social sign-in area:

- Google

- Apple

- Facebook

Show a subtle "or" separator underneath.

Signup form:

- Full Name

- Email

- Password

- Confirm Password

Password fields should have a show/hide password icon.

Primary CTA:

"Create Account"

Below the button:

"Already have an account? Log in"

The login text should navigate to /login.

Include appropriate validation UI:

- Required fields

- Valid email format

- Password requirements

- Password confirmation matching

- Clear inline error messages

- Loading state on submit

LOGIN PAGE

Keep the same visual language and layout as signup.

Left side:

Brand:

"Chatpate Routes"

Heading:

"Welcome back"

Supporting text:

"Your next adventure is waiting."

Social sign-in:

- Google

- Apple

- Facebook

Separator:

"or"

Fields:

- Email

- Password

Password visibility toggle.

Secondary link:

"Forgot password?"

Primary CTA:

"Log In"

Below:

"Don't have an account? Sign up"

Sign up should navigate to /signup.

ADMIN LOGIN PAGE

Create a separate admin authentication page at:

/admin/login

This should NOT look like a completely different product.

Keep the same Chatpate Routes design system but make the page slightly more professional and administrative.

Content:

"Chatpate Routes"

"Admin Portal"

Heading:

"Welcome back, Admin"

Fields:

- Email

- Password

Password visibility toggle.

Primary CTA:

"Log In"

Do NOT add an admin/user role selector.

Do NOT allow public signup to choose an "Admin" role.

Admin authorization will be handled by the backend/Supabase and not by the frontend.

VISUAL DESIGN

Use the reference image for inspiration:

- Clean split-screen layout

- Large rounded travel photograph

- Minimal white/light form area

- Strong black/dark typography

- Soft neutral backgrounds

- Rounded inputs

- Rounded primary CTA

- Premium editorial typography

- Large bold heading

- Subtle spacing and hierarchy

- Minimal borders

- Elegant micro-interactions

However, adapt the colors to the Chatpate Routes brand.

Suggested palette:

- Warm off-white / cream background

- Deep forest green

- Dark charcoal text

- Muted sage/green secondary elements

- White cards where appropriate

Avoid making the interface look overly corporate, overly colorful, or like a typical SaaS dashboard.

TRAVEL IMAGE

Use a high-quality travel/adventure photograph on the right side.

Prefer:

- Mountains

- Roads

- Hiking

- Valleys

- Group travel

- Indian landscapes

The image should feel adventurous and authentic.

Use:

- rounded corners

- object-cover

- subtle overlay if needed for readability

- responsive behavior

On mobile:

- Do not keep the desktop split-screen layout if it makes the form cramped.

- Stack the layout naturally.

- Put the image either above the form or as a compact hero section.

- Keep the form easy to use on a phone.

RESPONSIVE BEHAVIOR

Desktop:

- Split screen authentication layout.

Tablet:

- Reduce image width while maintaining the visual balance.

Mobile:

- Single-column layout.

- Form should be the primary focus.

- Image should become a smaller visual hero.

- No horizontal scrolling.

- Inputs and buttons should be touch-friendly.

COMPONENT STRUCTURE

Create reusable components where appropriate:

- AuthLayout

- AuthBrand

- SocialAuthButtons

- AuthInput

- PasswordInput

- AuthDivider

- LoginForm

- SignupForm

Do not duplicate the entire layout between login and signup.

Use a shared authentication design system.

SUPABASE PREPARATION

Prepare the frontend architecture for Supabase Auth integration.

Use clear handlers such as:

handleLogin()

handleSignup()

handleGoogleLogin()

handleAppleLogin()

handleFacebookLogin()

BUT do not implement fake authentication.

If Supabase is not currently configured in the project, leave the actual authentication calls ready to be connected rather than inventing mock behavior.

Do not store passwords manually in localStorage, sessionStorage, or frontend state beyond the form input lifecycle.

Do not create fake authentication tokens.

After successful authentication is eventually connected:

- User login should go to the user dashboard.

- User signup should go to the appropriate onboarding/dashboard flow.

- Admin login should go to the admin dashboard only after backend authorization confirms the account has admin privileges.

ACCESS CONTROL

Do not expose an "Admin" option on the normal signup page.

Do not allow users to select their own role.

The backend/Supabase will determine whether an authenticated account is a normal user or an admin.

UX DETAILS

Add:

- Smooth hover states

- Button loading state

- Disabled submit state while submitting

- Accessible labels

- Keyboard-friendly forms

- Focus states

- Password visibility toggle

- Clear error states

- Success feedback where appropriate

Do not add unnecessary animations.

Keep the experience fast and polished.

IMPORTANT IMPLEMENTATION RULES

1. Do not modify unrelated pages.

2. Do not create fake backend/authentication logic.

3. Do not hardcode user credentials.

4. Do not create a frontend admin role selector.

5. Keep all authentication UI components reusable.

6. Make the UI production-quality and responsive.

7. Use the provided reference image as visual inspiration for the authentication layout.

8. Use Chatpate Routes branding throughout.

9. Keep the code clean and easy for another developer to connect to Supabase Auth.

10. Preserve the existing project's technology stack and conventions.

Build the signup page first, then the login page, then the admin login page using the same reusable authentication layout.

My manager has asked to try similar to the file attached.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9f65b866-c7d1-400c-97dd-aa4edba504de).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
