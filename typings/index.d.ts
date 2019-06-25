// Type definitions for roddeh-i18n v1.2.0
// Project: https://github.com/roddeh/i18njs
// Definitions by: Matthew Finerty <https://github.com/evilarceus>

/**
 * Translates the given text.
 * @param text Text to translate
 * @param defaultNumOrFormatting Number OR formatting to use in translation
 * @param numOrFormattingOrContext Number OR formatting OR context to use in translation
 * @param formattingOrContext Format OR context to use in translation
 * @param context Context to be used when translating
 */
declare function roddeh_i18n(text: string | number, defaultNumOrFormatting?: number | object, numOrFormattingOrContext?: number | object | roddeh_i18n.ContextOpts, formattingOrContext?: object | roddeh_i18n.ContextOpts, context?: roddeh_i18n.ContextOpts) : string;

declare namespace roddeh_i18n {
    interface ContextOpts {
        matches: Map<string, string | number>,
        values: Map<string, string | Array<any>>
    }
    
    interface DataOpts {
        values?: Map<string | number, string>,
        contexts?: Array<ContextOpts>
    }

    type ExtensionFunction = (text: string, number: number, formatting: object, data: object) => string;

    namespace translator {
        /**
         * Translates the given text.
         * @param text Text to translate
         * @param defaultNumOrFormatting Number OR formatting to use in translation
         * @param numOrFormattingOrContext Number OR formatting OR context to use in translation
         * @param formattingOrContext Format OR context to use in translation
         * @param context Context to use in translation
         */
        function translate(text: string | number, defaultNumOrFormatting?: number | object, numOrFormattingOrContext?: number | object | ContextOpts, formattingOrContext?: object | ContextOpts, context?: ContextOpts) : string;
        
        /**
         * Adds data (values and contexts) to i18n instance.
         * @param data The language data: { "values": { "Yes": "はい", "No": "いいえ" } }
         */
        function add(data: DataOpts) : void;

        /**
         * Sets the context globally. This context will be used when translating all strings unless a different context is provided when calling i18n().
         * @param key The key for the context, e.g. "gender".
         * @param value The value for the context, e.g. "female".
         */
        function setContext(key: string, value: any) : void;

        /**
         * Adds extension to i18n instance.
         * @param ext Extension to add
         */
        function extend(ext: ExtensionFunction) : void;

        /**
         * Clears the context for the given key.
         * @param key The key to clear
         */
        function clearContext(key: string) : void;

        /**
         * Destroys all translation and context data.
         */
        function reset() : void;

        /**
         * Destroys all translation data. Useful for when you change languages.
         */
        function resetData() : void;

        /**
         * Destroys all context data.
         */
        function resetContext() : void;

        /**
         * Translates all the keys in a hash. Useful for translating the i18n property that exists for some lovely.io packages.
         * @param hash Hash containing the strings to be translated.
         * @param context Context to be used when translating the hash values.
         */
        function translateHash(hash: object, context: object) : object;
    }

    /**
     * Creates a new i18n instance.
     * @param data Data to add to new i18n instance
     */
    function create(data?: DataOpts) : typeof roddeh_i18n;
}

export = roddeh_i18n;