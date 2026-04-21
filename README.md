# Hugo Theme Elarien

A highly customizable, fast, and modern Hugo theme created and maintained by [Lorbic Web Studio](https://studio.lorbic.com). 

This theme is designed to be used as a **Hugo Module**, allowing multiple websites to share the same core structural logic and styles while remaining completely independent in their visual identity.

## Installation

Initialize your Hugo project as a module:
```bash
hugo mod init github.com/yourusername/your-website
```

Add the theme to your website's `config.toml` or `hugo.toml`:
```toml
[module]
  [[module.imports]]
    path = "github.com/lorbic/hugo-theme-elarien"
```

## Local Development (Without Pushing)

To make changes to the theme and see them instantly on your website without committing/pushing to GitHub, use the `replacements` directive in your website's `config.toml`:

```toml
[module]
  [[module.imports]]
    path = "github.com/lorbic/hugo-theme-elarien"
  replacements = "github.com/lorbic/hugo-theme-elarien -> ../hugo-theme-elarien"
```

## Examples in the Wild

This theme powers several independent websites, each utilizing the override system to maintain a unique visual identity:

*   **[Lorbic Web Studio](https://lorbic.com)** - The primary implementation, featuring a tech-focused, dark/light toggle aesthetic.
*   **[Anjali Patel](https://anjalipatel.org)** - A biotechnology research blog utilizing a custom green color palette and scientific styling overrides.

## Customization

Elarien is built to be overridden. All SCSS variables in the theme use the `!default` flag.

To change a color or font, simply create an `assets/sass/_overrides.scss` (or similar file imported before the theme variables) in your website repository and define your custom values:

```scss
// In your website repo
$brand-primary: #e83e8c; 
$background-color: #111111;
```

## Newsletter Setup

Elarien includes built-in support for newsletters using **[Listmonk](https://listmonk.app/)**, a self-hosted newsletter and mailing list manager. It features integrated Altcha spam protection.

To configure your own Listmonk instance, add the following to your `config.toml`:

```toml
[params.newsletter]
server = "https://your-listmonk-instance.com"
list_id = "your-list-uuid"
label = "Journal // Subscription"
headline = "The Internet is Breaking."
subline = "Get in-depth technical deep dives and architectural insights delivered straight to your inbox."
button_text = "Join the Dispatch"
```
If you omit the `server` and `list_id` variables, it defaults to the Lorbic mailer instance.
