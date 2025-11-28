class TextUtils {
    /**
     * TEXT CAPITALIZED
     * Returns the string with expected result.
     * @param text
     */
    // region CAPITALIZED TEXT
    public static capitalizedTextFormat(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}

export default TextUtils;