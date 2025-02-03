# PuzzleEnglish Dictionary Exporter

<img src="menu_screenshot.png"/>

A Tampermonkey userscript that exports your Puzzle English dictionary words (and their translations) from the Puzzle English service into downloadable files. You have two export options:

- **JSON Export:** Exports the dictionary as a JSON file.
- **TXT Export:** Exports the dictionary as a plain text file in the format `word=translation`.

Visit the service at [Puzzle English](https://puzzle-english.com) to see your dictionary in action.

## Features

- **Data Extraction:** Collects dictionary words and their corresponding translations from Puzzle English dictionary pages.
- **Two Export Formats:**  
  - **JSON Format:** A JSON array where each object has a `word` and a `translation` property.
  - **TXT Format:** A plain text file where each line is in the format `word=translation`.
- **Pagination Support:** The script can detect your current page (using the URL) and even navigate to the next page if one exists.
- **User-Friendly:** Designed for users who have never used Tampermonkey before—with clear installation instructions and export options.

## Export Options

### JSON Export

When using the JSON export option, the script generates a file containing a JSON array. For example:

```json
[
  {
    "word": "apple",
    "translation": "яблоко"
  },
  {
    "word": "banana",
    "translation": "банан"
  }
]
```

### TXT Export
Alternatively, the TXT export option creates a plain text file where each line contains a word and its translation separated by an equals sign. For example:

```ini
apple=яблоко
banana=банан
```

### Installation

#### What You Need

- A modern web browser (Chrome, Firefox, etc.)
- [Tampermonkey](https://www.tampermonkey.net/) (or any compatible userscript manager)

#### Step-by-Step Installation

1. **Install Tampermonkey:**
   - For Chrome, visit: [Tampermonkey for Chrome](https://tampermonkey.net/?ext=dhdg&browser=chrome)
   - For Firefox, visit: [Tampermonkey for Firefox](https://tampermonkey.net/?ext=dhdg&browser=firefox)
   - For other browsers, please check [Tampermonkey's website](https://www.tampermonkey.net/).

2. **Install the Userscript:**
   - Open your browser and navigate to the [PuzzleEnglish Dictionary Exporter GitHub repository](https://github.com/KonH/PuzzleEnglish-Dictionary-Exporter/).
   - Click on the file named `puzzleenglish_dictionary_exporter.user.js`.
   - Click the **Raw** button to view the script.
   - Tampermonkey will prompt you to install the script. Click **Install**.

---

### How to Select an Export Option

Once you’ve installed the userscript, Tampermonkey automatically adds menu commands that let you choose your export format. Here’s how to use them:

1. **Open the Tampermonkey Menu:**  
   Click the Tampermonkey icon in your browser toolbar. In the dropdown, locate the **PuzzleEnglish Dictionary Exporter** script.

2. **Select an Export Command:**  
   Hover over or click on the script’s name to reveal its menu commands. You will see options such as:
   - **Export Current Page / All Pages as JSON**  
     This command exports your dictionary data into a JSON file.
   - **Export Current Page / All Pages as TXT**  
     This command exports your dictionary data into a plain text file, with each line in the format `word=translation`.

3. **Run the Command:**  
   Simply click on your preferred export option. The script will process the current page’s dictionary content and automatically trigger a download of the file in your chosen format.

This menu-driven approach is designed to be simple—even if you’ve never used Tampermonkey before. No additional prompts or buttons are needed; just choose the export command from the Tampermonkey menu, and the script will take care of the rest.

---

### Usage

1. **Open Your Dictionary:**
   - Log in to Puzzle English and navigate to a dictionary page in “cards” view. For example:
     ```
     https://puzzle-english.com/dictionary?noredirect=&view=cards&page=1
     ```

2. **Export the Dictionary:**
   - Use the Tampermonkey menu command you prefer (as described previously).
   - The script will collect the words and translations from the current page and automatically download a file in the selected format.

3. **Pagination (Optional):**
   - The script includes a function to detect the current page number from the URL and navigate to the next page if one exists.
   - Use the provided pagination commands or modify the code to iterate over multiple pages as needed.

---

### Development and Contribution

- **Contributing:**  
  Contributions, suggestions, and improvements are welcome! Feel free to fork the repository and submit pull requests.

- **Testing:**  
  You can test and modify the script by editing your local version and reloading it in Tampermonkey.

- **Customization:**  
  The code is written in plain JavaScript and can be easily extended to support additional export formats or features.

---
