// TypeScript Version: 2.9

/**
 * Translates the given text.
 * @param text Text to translate
 * @param defaultNumOrFormatting Number OR formatting to use in translation
 * @param numOrFormattingOrContext Number OR formatting OR context to use in translation
 * @param formattingOrContext Format OR context to use in translation
 * @param context Context to be used when translating
 */
declare function roddeh_i18n(text: string | number,
    defaultNumOrFormatting?: number | roddeh_i18n.FormattingContext,
    numOrFormattingOrContext?: number | roddeh_i18n.FormattingContext,
    formattingOrContext?: roddeh_i18n.FormattingContext,
    context?: roddeh_i18n.FormattingContext): string;

declare namespace roddeh_i18n {
    interface Values {
        [index: string]: string | Array<string | Array<string | number | null>> | {[key: string]: string};
    }

    interface FormattingContext {
        [key: string]: string;
    }

    interface ContextOpts {
        matches: FormattingContext;
        values: Values;
    }

    interface DataOpts {
        values?: Values;
        contexts?: ContextOpts[];
    }

    namespace translator {
        namespace constructor {
            let name: string;
        }

        /**
         * Translates the given text.
         * @param text Text to translate
         * @param defaultNumOrFormatting Number OR formatting to use in translation
         * @param numOrFormattingOrContext Number OR formatting OR context to use in translation
         * @param formattingOrContext Format OR context to use in translation
         * @param context Context to use in translation
         */
        function translate(text: string | number,
            defaultNumOrFormatting?: number | FormattingContext,
            numOrFormattingOrContext?: number | FormattingContext,
            formattingOrContext?: FormattingContext,
            context?: FormattingContext): string;

        /**
         * Adds data (values and contexts) to i18n instance.
         * @param data The language data: { "values": { "Yes": "はい", "No": "いいえ" } }
         */
        function add(data: DataOpts | object): void; // object is an alternate parameter type to allow imports from JSON files

        /**
         * Sets the context globally. This context will be used when translating all strings unless a different context is provided when calling i18n().
         * @param key The key for the context, e.g. "gender".
         * @param value The value for the context, e.g. "female".
         */
        function setContext(key: string,
            value: string): void;

        /**
         * Adds extension to i18n instance.
         * @param ext Extension to add
         */
        function extend(ext: (text: string,
            number: number,
            formatting: FormattingContext,
            data: Values) => string | number): void;

        /**
         * Clears the context for the given key.
         * @param key The key to clear
         */
        function clearContext(key: string): void;

        /**
         * Destroys all translation and context data.
         */
        function reset(): void;

        /**
         * Destroys all translation data. Useful for when you change languages.
         */
        function resetData(): void;

        /**
         * Destroys all context data.
         */
        function resetContext(): void;

        /**
         * Translates all the keys in a hash. Useful for translating the i18n property that exists for some lovely.io packages.
         * @param hash Hash containing the strings to be translated.
         * @param context Context to be used when translating the hash values.
         */
        function translateHash(hash: {[key: string]: string},
            context?: FormattingContext): object;

        let data: DataOpts;
    }

    /**
     * Creates a new i18n instance.
     * @param data Data to add to new i18n instance
     */
    function create(data?: DataOpts | object): typeof roddeh_i18n;
}

export = roddeh_i18n;
