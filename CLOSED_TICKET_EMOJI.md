# 🔒 Closed Ticket Channel Emoji Feature

The **Closed Ticket Channel Emoji** feature provides better visual clarity in your Discord server by automatically prefixing a "🔒" (or any custom emoji) to the channel name when a ticket is closed. When the ticket is reopened, the emoji is removed automatically.

## 🚀 Key Features

### 🔹 Automatic Renaming
- **When Closed:** The `closedTicketEmoji` is prepended to the channel name.
- **When Reopened:** The emoji is removed, restoring the original name while preserving any pin (📌) or priority (🔴/🟠/🟢) emojis.

### 🔹 Customization
- You can change the emoji from the default `🔒` to any other emoji.
- The setting is located in `config/general.json` under the key: `"closedTicketEmoji"`.

### 🔹 Integrated Setup
- **Migration:** Existing configurations are automatically updated to v4.1.0+ with the new default emoji.
- **Quick Setup:** Included in the `npm run setup` process for new bot instances.

## 🛠️ How it was implemented

### 1. Configuration (`src/core/api/defaults/config.ts`)
- Added `closedTicketEmoji: string` to the `ODJsonConfig_DefaultSystem` interface.
- This ensures TypeScript support and configuration consistency.

### 2. Validation (`src/data/framework/checkerLoader.ts`)
- Added a validator for `closedTicketEmoji` to the configuration checker, allowing the bot to catch invalid emojis during startup.

### 3. Closing Action (`src/actions/closeTicket.ts`)
- Implemented logic at lines 42-49 to rename the channel with the emoji.
- Used `utilities.trimEmojis()` to ensure the channel name remains clean during renaming.

### 4. Reopening Action (`src/actions/reopenTicket.ts`)
- Implemented core logic to remove the emoji upon successful ticket reopening.
- Handles error reporting if the channel cannot be renamed due to rate limits or permission gaps.

### 5. Migration (`src/core/startup/migration.ts`)
- Created a version `4.1.0` migration step to ensure all users get the feature without manual configuration.

## ⚙️ How to Customize
Simply edit your `config/general.json`:
```json
{
  "system": {
    "closedTicketEmoji": "🔇"
  }
}
```
