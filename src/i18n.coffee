'use strict'

((root, factory) ->
  # CoffeeScript port of UMD template
  # https://github.com/umdjs/umd/blob/master/templates/returnExportsGlobal.js

  if typeof define is 'function' and define.amd
    # AMD. Register as an anonymous module.
    define [], ->
      root.i18n = factory()
  else if typeof module is 'object' and module.exports
    # Node. Does not work with strict CommonJS, but
    # only CommonJS-like environments that support module.exports,
    # like Node.
    module.exports = factory()
  else
    # Browser globals
    root.i18n = factory();

)((if self? then self else this), ->

  # Here starts proper lib

  # Translator Class
  class Translator

    constructor: () ->
      @data = {values:{}, contexts:[]}
      @globalContext = {}

    translate: (text, defaultNumOrFormatting, numOrFormattingOrContext, formattingOrContext, context = @globalContext) =>
      isObject = (obj) ->
        type = typeof obj
        return type is "function" or type is "object" and !!obj

      # Handle all the different cases of parameters
      if isObject(defaultNumOrFormatting)
        defaultText = null
        num = null
        formatting = defaultNumOrFormatting
        context = numOrFormattingOrContext or @globalContext
      else
        if typeof defaultNumOrFormatting is "number"
          defaultText = null
          num = defaultNumOrFormatting
          formatting = numOrFormattingOrContext
          context = formattingOrContext or @globalContext
        else
          defaultText = defaultNumOrFormatting
          if typeof numOrFormattingOrContext is "number"
            num = numOrFormattingOrContext
            formatting = formattingOrContext
            context = context
          else
            num = null
            formatting = numOrFormattingOrContext
            context = formattingOrContext or @globalContext

      # Translate either the text or the hash
      if isObject(text)
        text = text['i18n'] if isObject(text['i18n'])
        @translateHash(text, context)
      else
        @translateText(text, num, formatting, context, defaultText)

    #
    # Adds key/value pair data and contexts that are to be used when translating text.
    #
    # @param {Object} The language data:
    # {
    #   "values":{
    #     "Yes":"はい"
    #     "No":"いいえ"
    #   }
    # }
    #
    # @param {String} [optional] The language code for the data.
    # For a more complete example see: http://i18njs.com/i18n/ja.json
    add: (d) ->
      if(d.values?)
        for k, v of d.values
          @data.values[k] = v;
      if(d.contexts?)
        for c in d.contexts
          @data.contexts.push(c)

    #
    # Sets the context globally.  This context will be used when translating all strings unless a different context is provided when calling i18n()
    # @param {String} The key for the context e.g. "gender"
    # @param {Mixed} The value for the context e.g. "female"
    #
    setContext: (key, value) ->
      @globalContext[key] = value


    extend: (ext) ->
      @extension = ext

    #
    # Clears the context for the given key
    # @param {String} The key to clear
    #
    clearContext: (key) ->
      @globalContext[key] = null

    #
    # Destroys all translation and context data.
    #
    reset: () ->
      @resetData()
      @resetContext()

    #
    # Destroys all translation data.  Useful for when you change languages
    #
    resetData: () ->
      @data = {values:{}, contexts:[]}

    #
    # Destroys all context data.
    #
    resetContext: () ->
      @globalContext = {}


    #
    # Translates all the keys in a hash.  Useful for translating the i18n propety that exists for some lovely.io packages.
    # @param {Object} Hash containing the strings to be translated
    # @param {Object} Context to be used when translating the hash values
    #
    translateHash: (hash, context) ->
      hash[k] = @translateText(v, null, null, context) for k, v of hash when typeof v is "string"
      return hash

    #
    # Private
    #
    translateText: (text, num, formatting, context = @globalContext, defaultText) ->

      # If we have failed to find any language data simply use the supplied text.
      return @useOriginalText(defaultText or text, num, formatting) unless @data?
      # Try to get a result using the current context
      contextData = @getContextData(@data, context)
      result = @findTranslation(text, num, formatting, contextData.values, defaultText) if contextData?
      # If we didn't get a result with the context then use the non-contextual values
      result = @findTranslation(text, num, formatting, @data.values, defaultText) unless result?
      # If we still didn't get a result then use the original text
      return @useOriginalText(defaultText or text, num, formatting) unless result?
      # Otherwise we got a result so lets use it.
      return result

    findTranslation: (text, num, formatting, data, defaultText) ->
      value = data[text]
      return null unless value?
      if typeof value is "object" and not Array.isArray(value)
        # We are using an extension to translate.
        if @extension and typeof @extension is "function"
          value = @extension(text, num, formatting, value)
          value = @applyNumbers(value, num)
          return @applyFormatting(value, num, formatting)
        else
          return @useOriginalText(defaultText or text, num, formatting)
      
      if not num? and not Array.isArray(value)
        if typeof value is "string"
          return @applyFormatting(value, num, formatting)        
      else
        if value instanceof Array or value.length
          a = num is null
          for triple in value
            b = triple[0] is null
            c = triple[1] is null
            d = num >= triple[0]
            e = num <= triple[1]

            if a and b and c or not a and (not b and d and (c or e) or b and not c and e)
              result = @applyFormatting(triple[2].replace("-%n", String(-num)), num, formatting)
              return @applyFormatting(result.replace("%n", String(num)), num, formatting)
      return null

    applyNumbers: (str, num) ->
      str = str.replace("-%n", String(-num))
      str = str.replace("%n", String(num))
      return str


    getContextData: (data, context) ->
      return null unless data.contexts?
      for c in data.contexts
        equal = true
        for key, value of c.matches
          equal = equal and value is context[key]
        return c if equal
      return null

    useOriginalText: (text, num, formatting) ->
      return @applyFormatting(text, num, formatting) unless num?
      return @applyFormatting(text.replace("%n", String(num)), num, formatting)

    applyFormatting: (text, num, formatting) ->
      for ind of formatting
        regex = new RegExp("%{#{ ind }}", "g")
        text = text.replace(regex, formatting[ind])
      return text;

  # Ok, this is a weird pattern
  # We want to allow for creation of new Translator instances, this allows us to have multiple languages loaded simultaneously
  # However, don't return the instance because then we would have to call i18n.translate("Hello")
  # I would rather just call i18n("Hello")
  # But we still need a way to be able to simply require("i18n") and still be able to create new instances
  # To achieve this we use the "create" method

  translator = new Translator()
  i18n = translator.translate
  i18n.translator = translator

  i18n.create = (data) ->
    trans = new Translator()
    trans.add(data) if data?
    trans.translate.create = i18n.create
    trans.translate.translator = trans
    return trans.translate

  i18n
)
